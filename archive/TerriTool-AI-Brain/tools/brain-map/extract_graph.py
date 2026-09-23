#!/usr/bin/env python3
"""Walk the TerriTool AI Brain, emit dist/graph.json: every .md as a node, every relative .md link as an edge, every .mmd as a flow."""
import json, os, re, sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = str(HERE.parents[1])
OUT = sys.argv[1] if len(sys.argv) > 1 else str(HERE / "dist" / "graph.json")
LINK = re.compile(r"\[([^\]]*)\]\((?:<([^>]+)>|([^)\s]+))")

# Folders that are verbatim copies of files that live under features/ (audit 2026-09-16).
DUPLICATE_TREES = ("use-cases", "ui-flows", "mcp", "learnings/known-issues", "learnings/limits")

def group_of(rel):
    parts = rel.split("/")
    if len(parts) == 1: return "root"
    if parts[0] == "features" and len(parts) >= 3: return parts[1]
    return parts[0]

def kind_of(rel):
    base = os.path.basename(rel).lower()
    g = group_of(rel)
    if g == "root": return "index"
    if g in ("knowledge", "tools", "decisions", "validation"): return "engineering"
    if g in ("loops", "skills", "operating"): return "workflow"
    if g == "learnings": return "ops" if rel.startswith(("learnings/known-issues", "learnings/limits")) else "learnings"
    if g == "evidence": return "evidence"
    if g == "product": return "flows" if base == "flows.md" else "product"
    if g == "use-cases": return "use-cases"
    if g == "ui-flows": return "flows"
    if g == "mcp": return "contract"
    if base == "module.md": return "module"
    if base == "use-cases.md": return "use-cases"
    if base == "flows.md": return "flows"
    if base == "evidence.md": return "evidence"
    if base in ("limits.md", "known-issues.md"): return "ops"
    if g == "20-MCP": return "contract"
    return "module"

def status_for(rel):
    g, k = group_of(rel), kind_of(rel)
    if g == "root": return "index"
    if rel.startswith(tuple(t + "/" for t in DUPLICATE_TREES)): return "derived"
    if k in ("engineering", "learnings", "workflow"): return "code"
    if g == "evidence": return "evidence"
    if g == "product": return "carried"
    m = re.match(r"(\d\d)-", g)
    n = int(m.group(1)) if m else -1
    if k == "ops": return "code"
    if k == "flows": return "carried"
    if k in ("use-cases", "evidence"): return "evidence"
    if k == "contract": return "code"
    if 0 <= n <= 15: return "evidence"
    if n in (16, 17, 20, 21, 22): return "code"
    return "carried"

nodes, edges, mds = [], [], {}
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if not d.startswith(".") and d != "dist"]
    for f in fn:
        if f.endswith(".md"):
            rel = os.path.relpath(os.path.join(dp, f), ROOT)
            mds[rel] = open(os.path.join(dp, f), encoding="utf-8", errors="replace").read()

lower = {k.lower(): k for k in mds}  # case-insensitive fallback (macOS resolves OVERVIEW.md -> overview.md)

for rel, text in sorted(mds.items()):
    h1 = re.search(r"^#\s+(.+)$", text, re.M)
    title = h1.group(1).strip() if h1 else os.path.basename(rel)
    body = re.sub(r"^#.*$", "", text, flags=re.M)
    body = re.sub(r"```.*?```", "", body, flags=re.S)
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip() and not p.strip().startswith(("|", "-", "!", "<", ">"))]
    excerpt = re.sub(r"\s+", " ", paras[0])[:260] if paras else ""
    excerpt = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", excerpt).replace("**", "").replace("`", "")
    nodes.append({
        "id": rel, "title": title, "group": group_of(rel), "kind": kind_of(rel), "bytes": len(text.encode()),
        "words": len(text.split()), "status": status_for(rel), "excerpt": excerpt,
        "h2": [h.strip() for h in re.findall(r"^##\s+(.+)$", text, re.M)][:12],
    })
    seen = set()
    for _, a, b in LINK.findall(text):
        target = a or b
        if target.startswith(("http", "mailto", "#", "/")): continue
        target = target.split("#")[0]
        if not target.endswith(".md"): continue
        resolved = os.path.normpath(os.path.join(os.path.dirname(rel), target))
        if resolved not in mds: resolved = lower.get(resolved.lower(), resolved)
        if resolved in mds and resolved != rel and resolved not in seen:
            seen.add(resolved)
            edges.append({"source": rel, "target": resolved})

flows = []
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if not d.startswith(".") and d != "dist"]
    for f in sorted(fn):
        if not f.endswith(".mmd"): continue
        rel = os.path.relpath(os.path.join(dp, f), ROOT)
        src = open(os.path.join(dp, f), encoding="utf-8").read()
        t = re.search(r"^title:\s*(.+)$", src, re.M)
        body = re.sub(r"^---\n.*?\n---\n", "", src, flags=re.S).strip()
        flows.append({"file": rel, "group": group_of(rel), "title": t.group(1).strip() if t else f[:-4], "src": body})
flows.sort(key=lambda x: (not x["file"].startswith(("product/", "ui-flows/source/product")), x["file"]))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump({"nodes": nodes, "edges": edges, "flows": flows}, open(OUT, "w"), indent=0)
print(f"{len(nodes)} docs, {len(edges)} links, {len(flows)} flows")
linked = {e["source"] for e in edges} | {e["target"] for e in edges}
orphans = [n["id"] for n in nodes if n["id"] not in linked]
mods = [n["id"] for n in nodes if n["kind"] == "module"]
sib = Counter(e["source"] for e in edges if e["source"] in mods and e["target"] in mods and group_of(e["source"]) != group_of(e["target"]))
dups = sum(1 for n in nodes if n["status"] == "derived")
print(f"orphans: {orphans or 0} | modules with sibling links: {len(sib)}/{len(mods)} | module->module links: {sum(sib.values())} | duplicate-tree docs: {dups}")
