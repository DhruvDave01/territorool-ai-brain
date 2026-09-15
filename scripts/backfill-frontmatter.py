#!/usr/bin/env python3
"""Insert schema frontmatter on notes that do not already have it."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", "api", "node_modules", "evals", "scripts", "__pycache__", ".vercel"}
LINK = re.compile(r"\[[^\]]+\]\(([^)]+\.md)(?:#[^)]*)?\)")
TICK = re.compile(r"`([^`]{6,220})`")
FRONT = re.compile(r"^---\n.*?\n---\n", re.S)


def parent_for(rel: str) -> str:
    if "/" not in rel:
        return "core"
    return rel.split("/", 1)[0]


def related_of(src: Path, body: str) -> list[str]:
    out = []
    seen = set()
    for href in LINK.findall(body):
        href = href.split("#", 1)[0]
        try:
            dest = (src.parent / href).resolve().relative_to(ROOT).as_posix()
        except ValueError:
            continue
        if dest.endswith(".md") and dest not in seen and dest != src.relative_to(ROOT).as_posix():
            seen.add(dest)
            out.append(dest)
        if len(out) >= 8:
            break
    return out


def sources_of(body: str) -> list[str]:
    out = []
    seen = set()
    for raw in TICK.findall(body):
        raw = raw.strip()
        ok = raw.startswith(("TerriTool/", "webterritool/", "App/", "app/"))
        ok = ok or (("/" in raw) and raw.endswith((".js", ".php", ".tsx", ".ts", ".jsx")))
        if not ok or raw in seen:
            continue
        seen.add(raw)
        out.append(raw)
        if len(out) >= 8:
            break
    return out


def yaml_quote(value: str) -> str:
    if any(ch in value for ch in ":#{}[],&*!|>'\"%@`"):
        return json.dumps(value)
    return value


def yaml_block(rel: str, related: list[str], sources: list[str]) -> str:
    nid = Path(rel).stem
    lines = ["---", f"id: {nid}", f"parent: {parent_for(rel)}"]
    if sources:
        lines.append("sources:")
        for s in sources:
            lines.append(f"  - {yaml_quote(s)}")
    if related:
        lines.append("related:")
        for r in related:
            lines.append(f"  - {yaml_quote(r)}")
    lines.append("---")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.md")):
        if any(p in SKIP for p in path.parts):
            continue
        rel = path.relative_to(ROOT).as_posix()
        original = path.read_text(encoding="utf-8")
        body = FRONT.sub("", original, count=1) if original.lstrip().startswith("---") else original
        block = yaml_block(rel, related_of(path, body), sources_of(body))
        path.write_text(block + body.lstrip("\n"), encoding="utf-8")
        n += 1
    print(f"frontmatter added to {n} notes")


if __name__ == "__main__":
    main()
