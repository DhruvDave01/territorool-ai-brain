---
id: 20-how-to-update
parent: core
sources:
  - App/config/index.js
  - routes/api.php
related:
  - schema.md
  - 05-constraints-and-drift.md
  - design/README.md
  - design-web/README.md
  - brains/README.md
---
# 20. How to update this brain

Related: [schema.md](schema.md) · [05-constraints-and-drift](05-constraints-and-drift.md)

The root `../AI_BRAIN.md` is the frontal lobe. **Do not edit it unless a human explicitly asks.** Patch the matching note in this folder instead.

When you change product behavior:

1. Patch the **source of truth** (mobile `App/config/index.js`, `routes/api.php`, `territool_app.php`, or the screen/controller).
2. Update the matching note here (commands, architecture, API table, MCP table, credits, drift).
3. If a doc disagrees with code, **code wins**; add a row to [05-constraints-and-drift.md](05-constraints-and-drift.md).
4. Never put per-rep data (names, balances, live routes) in these files.

## Session start checklist for coding agents

1. Read `../AI_BRAIN.md` (overview) then the relevant note in this folder.
2. Open the real file you will edit (mobile class screen vs Laravel controller vs MCP handler).
3. Match that file’s pattern.
4. Do not add Redux, NativeBase, nested navigators, or a second credit-calculation path.
5. If chrome/tokens changed, patch [design/](design/README.md) (mobile) or [design-web/](design-web/README.md) (web) — do not invent UI for deferred Register/paywall/Android/HQ stills (the JS is live).
6. If the change is a whole surface, also patch the matching [sub brain](brains/README.md).
7. Mobile from→to: [screens/navigation-map.md](screens/navigation-map.md). Screen APIs: [screens/how-it-works.md](screens/how-it-works.md).
8. Run `python3 evals/run.py` after retriever or note-structure changes. Rebuild the graph with `python3 scripts/build-graph.py`.
9. After a live repo scan, write an ingest log (`YYYY-MM-DD.md`) and refresh [code/MOBILE_CODEBASE_BRAIN.md](code/MOBILE_CODEBASE_BRAIN.md) / [code/WEB_CODEBASE_BRAIN.md](code/WEB_CODEBASE_BRAIN.md). Check `App/config/index.js` for the active `URL_BASE`; do not assume prod.
