#!/usr/bin/env python3
"""
Põe foto nas matérias do Attlas: busca a og:image de cada linkOriginal e grava
`imagem`/`orientacaoImagem` na edição.

Foto era um passo à parte, que a rotina semanal esquecia: as edições de 12/10 e
19/10 saíram com zero fotos, embora as fontes tivessem imagem para todas. Agora
este script é a etapa 2 de scripts/pipeline-edicao.sh, que a publicação roda.

Regras (memória editorial):
- só entra a imagem que a própria publicação declara (og:image / twitter:image),
  baixada e aberta de verdade, com pelo menos 600x300 px; a orientação vem dos pixels;
- dentro de uma edição a imagem não se repete: quando várias matérias citam a mesma
  página (changelog), só a primeira leva a arte e as demais ficam como linha. Entre
  edições, só repete quando é a mesma publicação acompanhada de novo;
- imagem padrão do site não é foto da matéria e fica de fora: as listadas em
  imagens-genericas.txt, as que páginas DIFERENTES devolvem (o logotipo da Anthropic)
  e os cartões de raiz de site (/images/OpenGraph.png, /static/og-image.png).

Com --aplicar, também tira das edições as imagens gravadas que quebram essas regras.

Uso:
    python scripts/enriquecer_imagens.py                       # simulação, todas as edições
    python scripts/enriquecer_imagens.py --aplicar
    python scripts/enriquecer_imagens.py --edicao edicao-2026-10-19.ts --aplicar
    python scripts/enriquecer_imagens.py --verificar           # trava: sai com 1 se houver problema

--verificar falha quando sobrou foto disponível sem aplicar, ou quando uma imagem
gravada não abre, se repete na edição ou é padrão de site.
"""
from __future__ import annotations

import argparse
import io
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlsplit

sys.path.insert(0, str(Path(__file__).parent))
from coletar_fontes import sessao, buscar, TIMEOUT  # noqa: E402

from bs4 import BeautifulSoup  # noqa: E402
from PIL import Image  # noqa: E402

DIR = Path("src/data")
GENERICAS = Path(__file__).with_name("imagens-genericas.txt")
LARGURA_MIN, ALTURA_MIN = 600, 300
LIMITE_BYTES = 15_000_000

RE_BLOCO = re.compile(r"^(?= {4}\{\n {6}id: ')", re.MULTILINE)
RE_LINK = re.compile(r"^( {6})linkOriginal:\s*'([^']+)',$", re.MULTILINE)
RE_IMAGEM = re.compile(r"^ {6}imagem:\s*'[^']*',\n(?: {6}orientacaoImagem:\s*'[^']*',\n)?", re.MULTILINE)
# Cartão que o site usa para qualquer página: nome genérico e caminho sem nada do artigo.
RE_CARTAO_DO_SITE = re.compile(r"^/(?:[^/]+/)?(?:og|open-?graph|social|share|twitter)[-_]?(?:image|card|default)?\.(?:png|jpe?g|webp)$", re.IGNORECASE)


def campo(bloco: str, nome: str) -> str | None:
    m = re.search(rf"^ {{6}}{nome}:\s*'([^']*)',", bloco, re.MULTILINE)
    return m.group(1) if m else None


def normalizar(link: str) -> str:
    partes = urlsplit(link)
    return f"{partes.netloc}{partes.path.rstrip('/')}"


def eh_documentacao(link: str) -> bool:
    return any(t in link for t in ("changelog", "release-notes", "/docs/"))


def padrao_do_site(url: str, genericas: set[str]) -> bool:
    return url in genericas or bool(RE_CARTAO_DO_SITE.match(urlsplit(url).path))


def ler_edicao(arquivo: Path) -> tuple[str, list[str]]:
    partes = RE_BLOCO.split(arquivo.read_text(encoding="utf-8"))
    return partes[0], partes[1:]


def og_image(s, link: str) -> str | None:
    try:
        sopa = BeautifulSoup(buscar(s, link), "html.parser")
    except Exception:
        return None
    for nome in ("og:image", "twitter:image"):
        no = sopa.find("meta", property=nome) or sopa.find("meta", attrs={"name": nome})
        if no and no.get("content"):
            return urljoin(link, no["content"].strip())
    return None


def abrir_imagem(s, url: str) -> tuple[str | None, str]:
    """Baixa e abre a imagem. Devolve (orientação, '') ou (None, motivo)."""
    try:
        r = s.get(url, timeout=TIMEOUT, stream=True)
        if r.status_code >= 400:
            return None, f"HTTP {r.status_code}"
        if not r.headers.get("content-type", "").startswith("image/"):
            return None, f"content-type {r.headers.get('content-type', '?')}"
        dados = r.raw.read(LIMITE_BYTES + 1, decode_content=True)
        if len(dados) > LIMITE_BYTES:
            return None, "maior que 15 MB"
        largura, altura = Image.open(io.BytesIO(dados)).size
    except Exception as e:
        return None, f"não abre ({type(e).__name__})"
    if largura < LARGURA_MIN or altura < ALTURA_MIN:
        return None, f"pequena demais ({largura}x{altura})"
    proporcao = largura / altura
    return ("horizontal" if proporcao > 1.15 else "vertical" if proporcao < 0.85 else "quadrada"), ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--verificar", action="store_true")
    ap.add_argument("--edicao", action="append", help="arquivo da edição; repita para mais de uma")
    args = ap.parse_args()

    todas = sorted(DIR.glob("edicao-*.ts"), reverse=True)
    alvos = [DIR / nome for nome in args.edicao] if args.edicao else todas
    genericas = {l.strip() for l in GENERICAS.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")} if GENERICAS.exists() else set()
    s = sessao()

    # Imagens já no portal: url -> [(arquivo, id, link)]
    usadas: dict[str, list[tuple[str, str, str]]] = defaultdict(list)
    for arquivo in todas:
        for bloco in ler_edicao(arquivo)[1]:
            if url := campo(bloco, "imagem"):
                usadas[url].append((arquivo.name, campo(bloco, "id"), campo(bloco, "linkOriginal")))

    problemas: list[str] = []
    remover: set[tuple[str, str]] = set()  # (arquivo, id) cuja imagem gravada sai

    # 1. Imagens já gravadas nas edições-alvo: abrem, não são padrão de site e não se
    #    repetem dentro da edição (a primeira matéria fica com ela).
    for arquivo in alvos:
        vistas: dict[str, str] = {}
        for bloco in ler_edicao(arquivo)[1]:
            url, id_ = campo(bloco, "imagem"), campo(bloco, "id")
            if not url:
                continue
            if padrao_do_site(url, genericas):
                problemas.append(f"{arquivo.name} {id_}: imagem padrão do site ({url})")
                remover.add((arquivo.name, id_))
            elif url in vistas:
                problemas.append(f"{arquivo.name} {id_}: mesma imagem de {vistas[url]} na edição")
                remover.add((arquivo.name, id_))
            else:
                vistas[url] = id_
                if args.verificar:
                    ok, motivo = abrir_imagem(s, url)
                    if not ok:
                        problemas.append(f"{arquivo.name} {id_}: imagem gravada {motivo} ({url})")

    # 2. Matérias sem imagem: procura a og:image de cada link.
    pendentes: list[tuple[Path, str, str]] = []  # (arquivo, id, link)
    for arquivo in alvos:
        for bloco in ler_edicao(arquivo)[1]:
            if (not campo(bloco, "imagem") or (arquivo.name, campo(bloco, "id")) in remover) and (m := RE_LINK.search(bloco)):
                pendentes.append((arquivo, campo(bloco, "id"), m.group(2)))

    og_por_link = {link: og_image(s, link) for link in {link for _, _, link in pendentes}}

    # Imagem que páginas diferentes devolvem (nesta rodada ou já no portal) é padrão do
    # site. Documentação fica de fora da conta: changelogs têm várias URLs para a mesma página.
    paginas_por_imagem: dict[str, set[str]] = defaultdict(set)
    for link, url in og_por_link.items():
        if url and not eh_documentacao(link):
            paginas_por_imagem[url].add(normalizar(link))
    for url, ocorrencias in usadas.items():
        paginas_por_imagem[url].update(normalizar(l) for _, _, l in ocorrencias if l and not eh_documentacao(l))
    novas_genericas = {u for u, paginas in paginas_por_imagem.items() if len(paginas) > 1 and u in og_por_link.values()} - genericas
    genericas |= novas_genericas

    abertura: dict[str, tuple[str | None, str]] = {}
    escolhidas: dict[tuple[str, str], tuple[str, str]] = {}  # (arquivo, id) -> (url, orientação)
    na_edicao: dict[str, set[str]] = defaultdict(set)  # imagens e páginas que cada edição já ilustra
    paginas_da_imagem: dict[str, set[str]] = defaultdict(set)  # imagem -> páginas que a usam no portal
    for arquivo in todas:
        for bloco in ler_edicao(arquivo)[1]:
            url, link = campo(bloco, "imagem"), campo(bloco, "linkOriginal")
            if url and (arquivo.name, campo(bloco, "id")) not in remover:
                na_edicao[arquivo.name] |= {url, normalizar(link or "")}
                paginas_da_imagem[url].add(normalizar(link or ""))
    print("Matérias sem imagem:")
    for arquivo, id_, link in pendentes:
        url = og_por_link[link]
        if not url:
            motivo = "fonte sem og:image"
        elif padrao_do_site(url, genericas):
            motivo = "imagem padrão do site, não da matéria"
        elif url in na_edicao[arquivo.name] or normalizar(link) in na_edicao[arquivo.name]:
            motivo = "página ou arte já ilustra outra matéria da edição"
        elif paginas_da_imagem[url] - {normalizar(link)}:
            motivo = "arte já usada por outra publicação"
        else:
            if url not in abertura:
                abertura[url] = abrir_imagem(s, url)
            orientacao, motivo = abertura[url]
            if orientacao:
                escolhidas[(arquivo.name, id_)] = (url, orientacao)
                na_edicao[arquivo.name] |= {url, normalizar(link)}
                paginas_da_imagem[url].add(normalizar(link))
                print(f"  ✔ {arquivo.name} {id_}: {orientacao}  {url}")
                continue
        print(f"  · {arquivo.name} {id_}: fica sem foto — {motivo}")

    if novas_genericas:
        print("\nImagens padrão de site detectadas:", *sorted(novas_genericas), sep="\n  ")

    if args.aplicar:
        for arquivo in alvos:
            cabeca, blocos = ler_edicao(arquivo)
            mudou = False
            for i, bloco in enumerate(blocos):
                chave = (arquivo.name, campo(bloco, "id"))
                if chave in remover:
                    bloco = blocos[i] = RE_IMAGEM.sub("", bloco, count=1)
                    mudou = True
                if (escolha := escolhidas.get(chave)):
                    m = RE_LINK.search(bloco)
                    insercao = f"\n{m.group(1)}imagem: '{escolha[0]}',\n{m.group(1)}orientacaoImagem: '{escolha[1]}',"
                    blocos[i] = bloco[: m.end()] + insercao + bloco[m.end():]
                    mudou = True
            if mudou:
                arquivo.write_text(cabeca + "".join(blocos), encoding="utf-8")
        if novas_genericas:
            with GENERICAS.open("a", encoding="utf-8") as f:
                f.writelines(f"{url}\n" for url in sorted(novas_genericas))
        problemas = [p for p in problemas if "imagem gravada" in p]  # as demais foram corrigidas
    elif args.verificar and escolhidas:
        problemas += [f"{a} {i}: foto disponível e não aplicada ({u})" for (a, i), (u, _) in escolhidas.items()]

    total = sum(1 for a in alvos for b in ler_edicao(a)[1])
    com_foto = sum(1 for a in alvos for b in ler_edicao(a)[1] if campo(b, "imagem"))
    acao = "aplicadas" if args.aplicar else "a aplicar"
    print(f"\n{len(escolhidas)} fotos {acao}. Com foto agora: {com_foto + (0 if args.aplicar else len(escolhidas))}/{total}.")

    if problemas:
        print(f"\nProblemas de imagem ({len(problemas)}):", *problemas, sep="\n  - ")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
