#!/usr/bin/env python3
"""Regenerate TerriTool AI Brain/index.md from markdown H1 + first excerpt."""
from __future__ import print_function

import os
import re
from collections import OrderedDict
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "index.md")

SKIP_DIRS = {".obsidian", "dist", "__pycache__"}
SKIP_FILES = {"index.md", "log.md"}

GROUPS = OrderedDict(
    [
        ("root", "Start here"),
        ("product", "Product"),
        ("features", "Features"),
        ("use-cases", "Use-case traces"),
        ("ui-flows", "UI flows"),
        ("knowledge", "How it is built"),
        ("skills", "Skills"),
        ("loops", "Loops"),
        ("memory", "Memory"),
        ("learnings", "Learnings"),
        ("mcp", "MCP contract"),
        ("validation", "Validation / QA"),
        ("operating", "Operating"),
        ("decisions", "Decisions"),
        ("tools", "Tools"),
        ("evidence", "Unassigned evidence catalogs"),
    ]
)


def group_of(rel):
    top = rel.split("/")[0] if "/" in rel else "root"
    return top if top in GROUPS else "root"


def excerpt(text):
    body = re.sub(r"^#.*$", "", text, flags=re.M)
    body = re.sub(r"```.*?```", "", body, flags=re.S)
    for para in re.split(r"\n\s*\n", body):
        p = para.strip()
        if not p or p.startswith(("#", "|", "-", "!", "<", ">")):
            continue
        p = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", p)
        p = p.replace("**", "").replace("`", "")
        p = re.sub(r"\s+", " ", p).strip()
        if len(p) > 40:
            return p[:180].rstrip() + ("…" if len(p) > 180 else "")
    return ""


def iter_md():
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in SKIP_DIRS and not d.startswith(".")]
        for fn in fns:
            if not fn.endswith(".md") or fn in SKIP_FILES:
                continue
            path = os.path.join(dp, fn)
            rel = os.path.relpath(path, ROOT).replace("\\", "/")
            yield rel, path


def main():
    buckets = OrderedDict((g, []) for g in GROUPS)
    for rel, path in sorted(iter_md()):
        text = open(path, encoding="utf-8", errors="replace").read()
        h1 = re.search(r"^#\s+(.+)$", text, re.M)
        title = h1.group(1).strip() if h1 else os.path.basename(rel)
        buckets.setdefault(group_of(rel), []).append((rel, title, excerpt(text)))

    lines = [
        "# Wiki index",
        "",
        "Content catalog for this Brain (Karpathy LLM Wiki pattern). **Read this to find pages; do not treat it as higher rank than MODULE.md or source code.**",
        "",
        "Schema: [operating/llm-wiki.md](operating/llm-wiki.md). Timeline: [log.md](log.md). Rebuild: `python3 tools/wiki_index.py` from `TerriTool AI Brain/`.",
        "",
        "Local QA: `http://127.0.0.1:8000/login`.",
        "",
    ]
    for g, label in GROUPS.items():
        rows = buckets.get(g) or []
        if not rows:
            continue
        lines.append("## " + label)
        lines.append("")
        lines.append("| Page | Summary |")
        lines.append("|------|---------|")
        for rel, title, ex in rows:
            summary = ex.replace("|", "\\|") if ex else "—"
            lines.append("| [%s](%s) | %s |" % (title.replace("|", "\\|"), rel, summary))
        lines.append("")

    open(OUT, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print("wrote", OUT)
    if "--lint" in sys.argv:
        notes = lint_features()
        for n in notes:
            print("lint:", n)
        print("%d lint notes" % len(notes))


def lint_features():
    feat_root = os.path.join(ROOT, "features")
    notes = []
    if not os.path.isdir(feat_root):
        return ["missing features/"]
    for name in sorted(os.listdir(feat_root)):
        d = os.path.join(feat_root, name)
        if not os.path.isdir(d) or name.startswith("."):
            continue
        for req in ("MODULE.md", "use-cases.md", "flows.md"):
            if not os.path.isfile(os.path.join(d, req)):
                notes.append("missing %s/%s" % (name, req))
        if not os.path.isfile(os.path.join(d, "evidence.md")):
            notes.append("no evidence.md %s" % name)
    return notes


if __name__ == "__main__":
    main()
