"""BM25 chunk retrieval for AI_BRAIN notes.

Used by graph-server.py and evals/run.py. Keep lib/retrieve.js in sync.
"""
from __future__ import annotations

import math
import re
from collections import Counter, defaultdict
from pathlib import Path

STOP = {
    "a", "an", "the", "and", "or", "to", "of", "in", "for", "on", "is", "it",
    "how", "what", "does", "do", "we", "can", "this", "that", "with", "from",
    "are", "was", "were", "be", "been", "our", "your", "you", "i", "my",
}
K1 = 1.5
B = 0.75
CHUNK_TARGET = 1200
SKIP_DIRS = {".git", "api", "node_modules", "evals", "scripts", "__pycache__", ".vercel"}

# Query tokens → path prefixes/files to boost (stops design dumps answering ops questions).
HUB_RULES: list[tuple[set[str], tuple[str, ...]]] = [
    ({"bug", "bugs", "typo", "typos", "gap", "gaps", "stale"},
     ("ops/known-bugs.md", "ops/", "05-constraints-and-drift.md")),
    ({"credit", "credits", "billing", "package", "packages", "stripe"},
     ("09-credits-billing.md", "features/10-credits-subscription.md", "features/07-ai-find-leads.md")),
    ({"env", "envs", "environment", "secret", "secrets", "variable", "variables"},
     ("ops/env-inventory.md", "ops/", "ops/release-flavor-matrix.md")),
    ({"column", "columns", "database", "schema", "table", "tables"},
     ("data/database-columns.md", "data/", "16-data-models.md")),
    ({"formdata", "jwt", "endpoint", "endpoints", "api"},
     ("brains/api.md", "12-mobile-api.md", "13-web-urls.md", "data/formdata-dictionary.md")),
    ({"mcp", "tools", "admin"},
     ("14-mcp.md", "brains/web-code.md", "code/web-code-details.md", "brains/api.md")),
    ({"role", "roles", "manager", "salesperson", "agent"},
     ("06-users-and-roles.md", "features/12-manager-portal.md", "features/13-admin-hq.md")),
    ({"color", "colours", "colors", "brand", "typography", "token", "tokens"},
     ("design/01-Brand-Guidelines/", "brains/mobile-ui.md", "design/MINI-DESIGN-BRAIN.md",
      "design-web/Tokens.md")),
    ({"screen", "navigator", "realm", "native", "footer", "header"},
     ("brains/mobile-code.md", "brains/mobile-ui.md", "10-mobile-app.md",
      "code/mobile-code-details.md", "04-style-guide.md", "screens/how-it-works.md")),
    ({"route", "routes", "optimize", "optimisation", "optimization", "waypoint", "visit", "visited"},
     ("features/09-routes.md", "features/15-maps-and-geo.md", "brains/api.md", "14-mcp.md")),
    ({"salesforce", "hubspot", "crm", "sync"},
     ("features/11-crm-sync.md", "17-integrations.md")),
    ({"laravel", "blade", "dingo", "controller"},
     ("brains/web-code.md", "11-web-backend.md", "code/web-code-details.md")),
    ({"hq"},
     ("13-web-urls.md", "features/13-admin-hq.md", "brains/web-code.md")),
]

_TOKEN = re.compile(r"[a-z0-9]{3,}")
_HEADING = re.compile(r"^(#{1,6})\s+(.+)")
_FRONT = re.compile(r"^---\n.*?\n---\n", re.S)

_index = None


def tokenize_list(text: str) -> list[str]:
    return [t for t in _TOKEN.findall(text.lower()) if t not in STOP]


def tokenize(text: str) -> set[str]:
    return set(tokenize_list(text))


def strip_frontmatter(body: str) -> str:
    return _FRONT.sub("", body, count=1)


def iter_markdown(root: Path):
    for path in sorted(root.rglob("*.md")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.name in {".env.example"}:
            continue
        yield path


def split_chunks(rel: str, body: str) -> list[dict]:
    body = strip_frontmatter(body).strip()
    if not body:
        return []
    lines = body.splitlines()
    chunks: list[dict] = []
    buf: list[str] = []
    heading = ""
    size = 0

    def flush() -> None:
        nonlocal buf, size
        text = "\n".join(buf).strip()
        if text:
            chunks.append({"rel": rel, "heading": heading, "text": text})
        buf = []
        size = 0

    for line in lines:
        m = _HEADING.match(line)
        new_h = m.group(2).strip() if m else None
        overflow = size + len(line) + 1 > CHUNK_TARGET and size >= 500
        on_heading = bool(m) and size >= 350
        if buf and (on_heading or overflow):
            flush()
        if new_h:
            heading = new_h
        buf.append(line)
        size += len(line) + 1
    flush()
    return chunks


def build_index(root: Path) -> dict:
    chunks: list[dict] = []
    df: dict[str, int] = defaultdict(int)
    for path in iter_markdown(root):
        rel = path.relative_to(root).as_posix()
        try:
            body = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for ch in split_chunks(rel, body):
            blob = f"{rel} {ch['heading']} {ch['text']}"
            tf = Counter(tokenize_list(blob))
            ch["tf"] = tf
            ch["dl"] = max(1, sum(tf.values()))
            chunks.append(ch)
            for term in tf:
                df[term] += 1
    n = max(1, len(chunks))
    avgdl = sum(c["dl"] for c in chunks) / n
    return {"root": root, "chunks": chunks, "df": df, "n": n, "avgdl": avgdl}


def get_index(root: Path) -> dict:
    global _index
    if _index is None or _index["root"] != root:
        _index = build_index(root)
    return _index


def reset_index() -> None:
    global _index
    _index = None


def idf(term: str, index: dict) -> float:
    df = index["df"].get(term, 0)
    return math.log((index["n"] - df + 0.5) / (df + 0.5) + 1.0)


def bm25(tf: Counter, dl: int, terms: set[str], index: dict) -> float:
    score = 0.0
    avgdl = index["avgdl"] or 1.0
    for term in terms:
        freq = tf.get(term, 0)
        if not freq:
            continue
        denom = freq + K1 * (1 - B + B * dl / avgdl)
        score += idf(term, index) * (freq * (K1 + 1)) / denom
    return score


def hub_prefixes(question: str) -> tuple[str, ...]:
    terms = tokenize(question)
    out: list[str] = []
    for keys, prefixes in HUB_RULES:
        if terms & keys:
            out.extend(prefixes)
    return tuple(dict.fromkeys(out))


DESIGN_DUMPS = {
    "design/MINI-DESIGN-BRAIN.md",
    "design-web/MINI-DESIGN-BRAIN.md",
    "design/02-User-Interface/Screen-Inventory.md",
    "design/05-Design-System/Token-Inconsistencies.md",
}


def terms_overlap(qterms: set[str], other: set[str]) -> int:
    n = 0
    for q in qterms:
        for s in other:
            if q == s or q.startswith(s) or s.startswith(q):
                n += 1
                break
    return n


def path_boost(rel: str, prefixes: tuple[str, ...], selected: str | None, qterms: set[str]) -> float:
    boost = 1.0
    if prefixes and any(rel == p or rel.startswith(p) for p in prefixes):
        boost *= 1.55
    if selected and rel == selected:
        boost *= 2.2
    stem = Path(rel).stem.lower().replace("-", " ")
    overlap = terms_overlap(qterms, tokenize(stem))
    if overlap:
        boost *= 1.0 + 0.35 * overlap
    design_ok = any(p.startswith("design") for p in prefixes)
    if (rel.startswith("design/") or rel.startswith("design-web/")) and not design_ok:
        boost *= 0.5
    if rel in DESIGN_DUMPS and not design_ok:
        boost *= 0.45
    return boost


def retrieve(question: str, selected: str | None = None, limit: int = 6, root: Path | None = None) -> list[tuple[str, str]]:
    """Return up to `limit` (rel, chunk_text) hits, max two chunks per note."""
    root = root or Path(__file__).resolve().parent
    index = get_index(root)
    qterms = tokenize(question)
    if selected:
        qterms |= tokenize(Path(selected).stem.replace("-", " "))
    if not qterms:
        return []
    prefixes = hub_prefixes(question)
    ranked: list[tuple[float, dict]] = []
    for ch in index["chunks"]:
        raw = bm25(ch["tf"], ch["dl"], qterms, index)
        if raw <= 0:
            continue
        score = raw * path_boost(ch["rel"], prefixes, selected, qterms)
        ranked.append((score, ch))
    ranked.sort(key=lambda item: -item[0])
    out: list[tuple[str, str]] = []
    per_file: dict[str, int] = defaultdict(int)
    for _, ch in ranked:
        if per_file[ch["rel"]] >= 2:
            continue
        per_file[ch["rel"]] += 1
        heading = f"## {ch['heading']}\n" if ch["heading"] else ""
        out.append((ch["rel"], heading + ch["text"]))
        if len(out) >= limit:
            break
    return out


def source_paths(hits: list[tuple[str, str]]) -> list[str]:
    seen: list[str] = []
    for rel, _ in hits:
        if rel not in seen:
            seen.append(rel)
    return seen
