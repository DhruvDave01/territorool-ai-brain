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
5. If chrome/tokens changed, patch [design/](design/README.md) (mobile) or [design-web/](design-web/README.md) (web) — do not invent UI for deferred Register/paywall/Android/HQ.
6. If the change is a whole surface, also patch the matching [sub brain](brains/README.md).
