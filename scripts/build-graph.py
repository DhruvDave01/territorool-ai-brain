#!/usr/bin/env python3
"""Rebuild the graph DATA block in graph.html from notes on disk.

Also writes graph-search.json (lowercase note text) so graph.html search
matches bodies, not just filenames.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAPH = ROOT / "graph.html"
SEARCH = ROOT / "graph-search.json"
SKIP = {".git", "api", "node_modules", "evals", "scripts", "__pycache__", ".vercel"}
LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
HEADING = re.compile(r"^#\s+(.+)", re.M)
WS = re.compile(r"\s+")


def group_for(rel: str) -> str:
    if rel == "AI_BRAIN.md":
        return "frontal"
    if rel.startswith("brains/"):
        return "brains"
    if rel.startswith("features/"):
        return "features"
    if rel.startswith("design-web/"):
        return "design-web"
    if rel.startswith("design/"):
        return "design"
    if rel.startswith("code/"):
        return "code"
    if rel.startswith("data/"):
        return "data"
    if rel.startswith("ops/"):
        return "ops"
    if rel.startswith("screens/"):
        return "screens"
    if rel.startswith("appendix"):
        return "appendix"
    return "core"


def label_for(rel: str, body: str) -> str:
    m = HEADING.search(body)
    if m:
        raw = re.sub(r"^[\d.]+\s+", "", m.group(1)).strip()
        raw = raw.replace("TerriTool AI Brain — ", "")
        if len(raw) < 60:
            return raw
    stem = Path(rel).stem.replace("-", " ")
    return stem


def search_blob(rel: str, label: str, body: str) -> str:
    stem = Path(rel).stem.replace("-", " ")
    text = f"{rel} {stem} {label} {body}"
    return WS.sub(" ", text.lower()).strip()


def resolve(src: Path, href: str) -> str | None:
    href = href.split("#", 1)[0].split("?", 1)[0].strip()
    if not href or href.startswith(("http://", "https://", "mailto:")):
        return None
    if href.endswith((".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js", ".ttf", ".otf", ".woff")):
        return None
    target = (src.parent / href).resolve()
    try:
        rel = target.relative_to(ROOT).as_posix()
    except ValueError:
        return None
    if not rel.endswith(".md"):
        if (ROOT / (rel + ".md")).is_file():
            rel = rel + ".md"
        else:
            return None
    if (ROOT / rel).is_file():
        return rel
    return None


def main() -> None:
    nodes = []
    ids = []
    bodies = {}
    search = {}
    for path in sorted(ROOT.rglob("*.md")):
        if any(p in SKIP for p in path.parts):
            continue
        rel = path.relative_to(ROOT).as_posix()
        body = path.read_text(encoding="utf-8", errors="replace")
        ids.append(rel)
        bodies[rel] = body
        label = label_for(rel, body)
        nodes.append({"id": rel, "label": label, "g": group_for(rel), "deg": 0})
        search[rel] = search_blob(rel, label, body)
    adj = {i: set() for i in ids}
    links = []
    seen = set()
    for rel, body in bodies.items():
        src = ROOT / rel
        for href in LINK.findall(body):
            dest = resolve(src, href)
            if not dest or dest not in adj or dest == rel:
                continue
            key = (rel, dest)
            if key in seen:
                continue
            seen.add(key)
            links.append({"s": rel, "t": dest})
            adj[rel].add(dest)
            adj[dest].add(rel)
    for n in nodes:
        n["deg"] = len(adj[n["id"]])
    html = GRAPH.read_text(encoding="utf-8")
    m = re.search(r"const DATA = (\{.*?\});", html, re.S)
    if not m:
        raise SystemExit("Could not find const DATA in graph.html")
    old = json.loads(m.group(1))
    for n in old.get("nodes", []):
        if n["id"] == "AI_BRAIN.md" and n["id"] not in adj:
            nodes.append(n)
            frontal = ROOT.parent / "AI_BRAIN.md"
            if frontal.is_file():
                search["AI_BRAIN.md"] = search_blob(
                    "AI_BRAIN.md", n.get("label") or "frontal lobe",
                    frontal.read_text(encoding="utf-8", errors="replace"),
                )
    data = {"nodes": nodes, "links": links}
    blob = json.dumps(data, separators=(",", ":"))
    html = html[: m.start(1)] + blob + html[m.end(1):]
    GRAPH.write_text(html, encoding="utf-8")
    SEARCH.write_text(json.dumps(search, separators=(",", ":")), encoding="utf-8")
    hits = sum(1 for text in search.values() if "clusterlist" in text)
    print(f"graph.html DATA: {len(nodes)} nodes, {len(links)} links")
    print(f"graph-search.json: {len(search)} notes, ClusterList in {hits}")


if __name__ == "__main__":
    main()
