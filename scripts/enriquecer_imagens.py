#!/usr/bin/env python3
"""
Busca a og:image de cada matéria já publicada e injeta `imagem`/`orientacaoImagem`
no arquivo da edição.

As edições de agosto e setembro foram apuradas quando a rede do ambiente bloqueava
as fontes, então saíram sem foto. Com a rede aberta, dá para voltar em cada
linkOriginal e pegar a imagem que a própria publicação declara.

Só entra imagem que responde como imagem de verdade — nada de URL chutada.

Uso:
    python scripts/enriquecer_imagens.py            # simulação
    python scripts/enriquecer_imagens.py --aplicar
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import urljoin

sys.path.insert(0, str(Path(__file__).parent))
from coletar_fontes import sessao, buscar, TIMEOUT  # noqa: E402

from bs4 import BeautifulSoup  # noqa: E402

RE_MATERIA = re.compile(r"^(\s+)linkOriginal: '([^']+)',$", re.MULTILINE)


def og_image(s, link: str) -> tuple[str, str] | None:
    """Devolve (url, orientacao) só se a imagem existir e responder como imagem."""
    try:
        sopa = BeautifulSoup(buscar(s, link), "html.parser")
    except Exception:
        return None

    def meta(*nomes: str) -> str | None:
        for nome in nomes:
            no = sopa.find("meta", property=nome) or sopa.find("meta", attrs={"name": nome})
            if no and no.get("content"):
                return no["content"].strip()
        return None

    bruta = meta("og:image", "twitter:image")
    if not bruta:
        return None
    url = urljoin(link, bruta)
    try:
        r = s.head(url, timeout=TIMEOUT, allow_redirects=True)
        if r.status_code >= 400 or not r.headers.get("content-type", "").startswith("image/"):
            r = s.get(url, timeout=TIMEOUT, stream=True)
            if r.status_code >= 400 or not r.headers.get("content-type", "").startswith("image/"):
                return None
    except Exception:
        return None

    largura, altura = meta("og:image:width"), meta("og:image:height")
    orientacao = "horizontal"
    if largura and altura and largura.isdigit() and altura.isdigit() and int(altura):
        proporcao = int(largura) / int(altura)
        orientacao = "horizontal" if proporcao > 1.15 else "vertical" if proporcao < 0.85 else "quadrada"
    return url, orientacao


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--edicao", help="processa só este arquivo, ex: edicao-2026-09-14.ts")
    args = ap.parse_args()

    arquivos = sorted(Path("src/data").glob(args.edicao or "edicao-*.ts"))
    s = sessao()
    total_novas = 0

    for arquivo in arquivos:
        fonte = arquivo.read_text(encoding="utf-8")
        # Guarda a POSIÇÃO do fim da linha, não o texto dela: duas matérias podem
        # apontar para a mesma URL, e substituir por texto insere no lugar errado.
        achadas: list[tuple[int, str, tuple[str, str]]] = []

        for m in RE_MATERIA.finditer(fonte):
            indent, link = m.group(1), m.group(2)
            # Já tem imagem? Olha o objeto inteiro da matéria, porque `imagem` tanto
            # pode vir antes quanto depois de `linkOriginal` — checar só para frente
            # duplicava o campo nas matérias que já tinham foto.
            inicio = fonte.rfind("\n    {", 0, m.start())
            fim = fonte.find("\n    },", m.start())
            if "imagem:" in fonte[inicio:fim]:
                continue
            # Link com âncora de changelog compartilha a imagem da página inteira.
            if "#" in link and "release-notes" in link:
                continue
            achado = og_image(s, link)
            if achado:
                achadas.append((m.end(), indent, achado))

        if not achadas:
            print(f"  {arquivo.name}: nenhuma imagem nova")
            continue

        # De trás para frente, para as posições anteriores seguirem válidas.
        novo = fonte
        for fim_da_linha, indent, (url, orientacao) in sorted(achadas, reverse=True):
            insercao = f"\n{indent}imagem: '{url}',\n{indent}orientacaoImagem: '{orientacao}',"
            novo = novo[:fim_da_linha] + insercao + novo[fim_da_linha:]
        print(f"  {arquivo.name}: {len(achadas)} imagens encontradas")
        total_novas += len(achadas)
        if args.aplicar:
            arquivo.write_text(novo, encoding="utf-8")

    print(f"\nTotal: {total_novas} imagens." + ("" if args.aplicar else " Simulação — use --aplicar."))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
