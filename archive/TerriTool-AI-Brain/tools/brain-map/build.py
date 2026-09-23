#!/usr/bin/env python3
"""Inject dist/graph.json + every flow diagram into template.html -> dist/territool-ai-brain-map.html."""
import json, html, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
DIST = HERE / "dist"
data = json.loads((DIST / "graph.json").read_text(encoding="utf-8"))
tpl = (HERE / "template.html").read_text(encoding="utf-8")

def slug(f): return "flow-" + re.sub(r"[^a-z0-9]+", "-", f[:-4].lower()).strip("-")
def glabel(g): return "Product" if g in ("product", "ui-flows") else re.sub(r"^(\d\d)-", r"\1 ", g).replace("-", " ")

nav = "".join(f'<li><a href="#{slug(f["file"])}">{html.escape(glabel(f["group"]))} · {html.escape(f["title"])}</a></li>' for f in data["flows"])
flows = "".join(
    f'<article class="flow" id="{slug(f["file"])}"><div class="head"><h3>{html.escape(f["title"])}</h3>'
    f'<span class="path">{html.escape(f["file"])}</span></div>'
    f'<div class="diagram"><pre class="mermaid">{html.escape(f["src"], quote=False)}</pre></div></article>'
    for f in data["flows"])

payload = json.dumps({"nodes": data["nodes"], "edges": data["edges"], "flows": [{"file": f["file"]} for f in data["flows"]]}, ensure_ascii=False)
payload = payload.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")

out = tpl.replace("__FLOWNAV__", nav).replace("__FLOWS__", flows).replace("__DATA__", payload)
target = DIST / "territool-ai-brain-map.html"
target.write_text(out, encoding="utf-8")
print(f"wrote {target.relative_to(HERE.parents[1])} ({len(out.encode()) // 1024} KB)")
