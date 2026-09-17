#!/usr/bin/env python3
"""
Coleta as fontes autorizadas do Attlas e grava a matéria-prima em src/data/coleta/.

Roda no GitHub Actions, que tem internet aberta. O sandbox onde a edição é escrita
não alcança as fontes primárias (o portão de saída bloqueia), então a coleta e a
curadoria vivem em máquinas diferentes: aqui se colhe, lá se decide.

Estratégia por fonte, na ordem:
  1. feed RSS/Atom, quando existe — título, link e data vêm estruturados e confiáveis;
  2. varredura do HTML da listagem, como alternativa.
Depois abre cada matéria para pegar og:image, og:description e data de publicação,
e só registra a imagem se ela realmente responder como imagem.

Uso:
    python scripts/coletar_fontes.py --dias 10
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, asdict, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
from xml.etree import ElementTree

import requests
from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
TIMEOUT = 30
SAIDA = Path("src/data/coleta")


@dataclass
class Fonte:
    nome: str
    pagina: str
    feed: str | None = None
    # Só links que batem com este padrão contam como matéria na varredura de HTML.
    padrao: str | None = None
    nivel: int = 1  # hierarquia de confiança do Attlas: 1 = canônica
    # Página cujas entradas datadas moram nela mesma, sem uma URL por matéria.
    changelog: bool = False


FONTES = [
    Fonte("Claude Platform", "https://platform.claude.com/docs/en/release-notes/overview", changelog=True),
    Fonte("Anthropic", "https://www.anthropic.com/news", feed="https://www.anthropic.com/rss.xml", padrao=r"/news/"),
    Fonte("Claude", "https://claude.com/blog", padrao=r"/blog/"),
    Fonte("OpenAI", "https://openai.com/news/", feed="https://openai.com/news/rss.xml", padrao=r"/index/"),
    Fonte("OpenAI Developers", "https://developers.openai.com/changelog/", changelog=True, padrao=r"/changelog/"),
    Fonte("Google AI", "https://blog.google/technology/ai/", feed="https://blog.google/technology/ai/rss/", padrao=r"/technology/ai/"),
    Fonte("Google DeepMind", "https://deepmind.google/blog/", padrao=r"/blog/"),
    Fonte("Gemini API", "https://ai.google.dev/gemini-api/docs/changelog", changelog=True),
    Fonte("a16z", "https://a16z.com/news-content/", feed="https://a16z.com/feed/", nivel=4),
    Fonte("Y Combinator", "https://www.ycombinator.com/blog", feed="https://www.ycombinator.com/blog/rss", nivel=4),
    Fonte("Sequoia", "https://www.sequoiacap.com/", nivel=4),
    Fonte("Hacker News", "https://news.ycombinator.com/", feed="https://news.ycombinator.com/rss", nivel=5),
]


@dataclass
class Item:
    fonte: str
    nivel: int
    titulo: str
    link: str
    data: str | None = None
    resumo: str | None = None
    imagem: str | None = None
    imagemVerificada: bool = False
    orientacaoImagem: str | None = None
    # Entrada de changelog: não tem imagem própria, e a da página é a mesma para todas.
    semImagemPropria: bool = False


@dataclass
class Relatorio:
    geradoEm: str
    janelaDias: int
    itens: list = field(default_factory=list)
    fontesComFalha: list = field(default_factory=list)
    resumoPorFonte: dict = field(default_factory=dict)


def sessao() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    return s


def parse_data(texto: str | None) -> str | None:
    """Normaliza datas de feed para AAAA-MM-DD. Formato desconhecido vira None, nunca um palpite."""
    if not texto:
        return None
    texto = texto.strip()
    for formato in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%dT%H:%M:%S%z",
                    "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(texto.replace("GMT", "+0000"), formato).strftime("%Y-%m-%d")
        except ValueError:
            continue
    achado = re.search(r"(\d{4})-(\d{2})-(\d{2})", texto)
    return achado.group(0) if achado else None


def do_feed(s: requests.Session, fonte: Fonte) -> list[Item]:
    if not fonte.feed:
        return []
    resposta = s.get(fonte.feed, timeout=TIMEOUT)
    resposta.raise_for_status()
    raiz = ElementTree.fromstring(resposta.content)
    itens: list[Item] = []

    # RSS 2.0
    for no in raiz.iter("item"):
        titulo = (no.findtext("title") or "").strip()
        link = (no.findtext("link") or "").strip()
        if titulo and link:
            itens.append(Item(fonte.nome, fonte.nivel, titulo, link,
                              parse_data(no.findtext("pubDate")),
                              (no.findtext("description") or "").strip()[:400] or None))
    # Atom
    if not itens:
        ns = "{http://www.w3.org/2005/Atom}"
        for no in raiz.iter(f"{ns}entry"):
            titulo = (no.findtext(f"{ns}title") or "").strip()
            elo = no.find(f"{ns}link")
            link = elo.get("href", "") if elo is not None else ""
            if titulo and link:
                itens.append(Item(fonte.nome, fonte.nivel, titulo, link,
                                  parse_data(no.findtext(f"{ns}updated") or no.findtext(f"{ns}published")),
                                  (no.findtext(f"{ns}summary") or "").strip()[:400] or None))
    return itens


def do_html(s: requests.Session, fonte: Fonte) -> list[Item]:
    resposta = s.get(fonte.pagina, timeout=TIMEOUT)
    resposta.raise_for_status()
    sopa = BeautifulSoup(resposta.text, "html.parser")
    base = f"{urlparse(fonte.pagina).scheme}://{urlparse(fonte.pagina).netloc}"
    vistos: set[str] = set()
    itens: list[Item] = []
    for a in sopa.find_all("a", href=True):
        href = urljoin(base, a["href"].split("#")[0])
        titulo = " ".join(a.get_text(" ", strip=True).split())
        if len(titulo) < 25 or href in vistos:
            continue
        if fonte.padrao and not re.search(fonte.padrao, href):
            continue
        if urlparse(href).netloc != urlparse(fonte.pagina).netloc:
            continue
        vistos.add(href)
        itens.append(Item(fonte.nome, fonte.nivel, titulo, href))
    return itens


MESES_EN = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
            "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}
RE_DATA_EN = re.compile(r"(" + "|".join(MESES_EN) + r")\s+(\d{1,2}),\s+(20\d{2})")


def do_changelog(s: requests.Session, fonte: Fonte) -> list[Item]:
    """
    Changelog não tem uma página por matéria: as entradas datadas moram na própria
    página, como títulos seguidos do texto. Cada entrada vira um item, com âncora
    própria quando existe, para o link levar direto ao trecho certo.
    """
    resposta = s.get(fonte.pagina, timeout=TIMEOUT)
    resposta.raise_for_status()
    sopa = BeautifulSoup(resposta.text, "html.parser")
    itens: list[Item] = []

    for titulo_no in sopa.find_all(["h2", "h3"]):
        texto = titulo_no.get_text(" ", strip=True)
        achado = RE_DATA_EN.search(texto)
        if not achado:
            continue
        mes, dia, ano = achado.group(1), int(achado.group(2)), int(achado.group(3))
        data = f"{ano}-{MESES_EN[mes]:02d}-{dia:02d}"

        corpo: list[str] = []
        for irmao in titulo_no.find_next_siblings():
            if irmao.name in ("h2", "h3"):
                break
            trecho = irmao.get_text(" ", strip=True)
            if trecho:
                corpo.append(trecho)
            if sum(len(c) for c in corpo) > 1500:
                break

        ancora = titulo_no.get("id") or (titulo_no.find("a", href=True) or {}).get("href", "")
        link = fonte.pagina + (ancora if str(ancora).startswith("#") else f"#{ancora}" if ancora else "")
        resumo = " ".join(corpo)[:900] or None
        if resumo:
            itens.append(Item(fonte.nome, fonte.nivel, f"{fonte.nome} — {mes} {dia}, {ano}",
                              link, data, resumo, semImagemPropria=True))
    return itens


def enriquecer(s: requests.Session, item: Item) -> None:
    """Abre a matéria para pegar og:image, resumo e data. Falha aqui não descarta o item."""
    try:
        resposta = s.get(item.link, timeout=TIMEOUT)
        resposta.raise_for_status()
    except Exception:
        return
    sopa = BeautifulSoup(resposta.text, "html.parser")

    def meta(*nomes: str) -> str | None:
        for nome in nomes:
            no = sopa.find("meta", property=nome) or sopa.find("meta", attrs={"name": nome})
            if no and no.get("content"):
                return no["content"].strip()
        return None

    item.resumo = item.resumo or (meta("og:description", "description") or None)
    item.data = item.data or parse_data(meta("article:published_time", "datePublished", "date"))

    # A og:image de uma página de changelog ilustra a página inteira. Usá-la por entrada
    # encheria a edição com a mesma figura repetida — melhor nenhuma imagem que essa.
    if item.semImagemPropria:
        return

    imagem = meta("og:image", "twitter:image")
    if not imagem:
        return
    imagem = urljoin(item.link, imagem)
    # Só entra imagem que responde como imagem de verdade. Sem isso, o portal quebra em produção.
    try:
        cabeca = s.head(imagem, timeout=TIMEOUT, allow_redirects=True)
        if cabeca.status_code >= 400 or not cabeca.headers.get("content-type", "").startswith("image/"):
            cabeca = s.get(imagem, timeout=TIMEOUT, stream=True)
            if cabeca.status_code >= 400 or not cabeca.headers.get("content-type", "").startswith("image/"):
                return
        item.imagem = imagem
        item.imagemVerificada = True
        largura, altura = meta("og:image:width"), meta("og:image:height")
        if largura and altura and largura.isdigit() and altura.isdigit():
            proporcao = int(largura) / int(altura)
            item.orientacaoImagem = "horizontal" if proporcao > 1.15 else "vertical" if proporcao < 0.85 else "quadrada"
        else:
            item.orientacaoImagem = "horizontal"
    except Exception:
        return


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dias", type=int, default=10, help="janela de recência em dias")
    ap.add_argument("--por-fonte", type=int, default=12, help="teto de matérias enriquecidas por fonte")
    args = ap.parse_args()

    s = sessao()
    corte = (datetime.now(timezone.utc) - timedelta(days=args.dias)).strftime("%Y-%m-%d")
    relatorio = Relatorio(geradoEm=datetime.now(timezone.utc).isoformat(timespec="seconds"), janelaDias=args.dias)

    for fonte in FONTES:
        itens: list[Item] = []
        erros: list[str] = []
        estrategias = [("changelog", do_changelog)] if fonte.changelog else []
        estrategias += [("feed", do_feed), ("html", do_html)]
        for estrategia, funcao in estrategias:
            try:
                itens = funcao(s, fonte)
                if itens:
                    break
            except Exception as e:
                erros.append(f"{estrategia}: {type(e).__name__}: {str(e)[:120]}")

        if not itens:
            relatorio.fontesComFalha.append({"fonte": fonte.nome, "pagina": fonte.pagina, "erros": erros})
            relatorio.resumoPorFonte[fonte.nome] = 0
            print(f"  FALHA   {fonte.nome}: {'; '.join(erros) or 'nenhum item encontrado'}", file=sys.stderr)
            continue

        # Sem data, mantém: muita listagem não datada é justamente o changelog mais novo.
        recentes = [i for i in itens if i.data is None or i.data >= corte][: args.por_fonte]
        for item in recentes:
            enriquecer(s, item)
        recentes = [i for i in recentes if i.data is None or i.data >= corte]

        relatorio.itens.extend(recentes)
        relatorio.resumoPorFonte[fonte.nome] = len(recentes)
        com_foto = sum(1 for i in recentes if i.imagemVerificada)
        print(f"  ok      {fonte.nome}: {len(recentes)} itens, {com_foto} com imagem verificada")

    relatorio.itens.sort(key=lambda i: (i.data or "0000-00-00"), reverse=True)
    dados = asdict(relatorio)
    dados["itens"] = [asdict(i) if not isinstance(i, dict) else i for i in relatorio.itens]

    SAIDA.mkdir(parents=True, exist_ok=True)
    hoje = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for destino in (SAIDA / f"coleta-{hoje}.json", SAIDA / "coleta-recente.json"):
        destino.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    total = len(relatorio.itens)
    com_foto = sum(1 for i in relatorio.itens if i.imagemVerificada)
    print(f"\nColetados {total} itens de {len(FONTES) - len(relatorio.fontesComFalha)} fontes "
          f"({com_foto} com imagem verificada). Falharam {len(relatorio.fontesComFalha)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
