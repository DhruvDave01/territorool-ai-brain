---
id: schema
parent: core
sources:
  - TerriTool/
  - webterritool/
related:
  - 05-constraints-and-drift.md
  - brains/README.md
---
# Schema — how this vault is structured

Companion to the root `AI_BRAIN.md` (frontal lobe). That file stays as-is. This folder is the **atomic knowledge vault**.

## Rules

| Do | Do not |
|----|--------|
| One file = one concept | Giant dump files |
| Link related notes with relative markdown links | Duplicate credit math in every file |
| Cite real paths under `TerriTool/` or `webterritool/` | Invent tools, endpoints, or credit costs |
| Prefer tables | Per-rep data (names, balances, live routes) |
| Code wins over old Prompts/docs | Mention workspaces that are not mobile or web source |

## Frontmatter convention

Used by `scripts/backfill-frontmatter.py` and stripped before BM25 scoring. Keep `id`, `parent`, `sources` (real code paths), and `related`.

```yaml
---
id: 07-ai-find-leads
parent: features
sources:
  - TerriTool/App/components/findLeads/aiFindLeads.js
  - webterritool/app/Http/Controllers/AILeadFinderController.php
related:
  - 09-credits-billing.md
  - 14-mcp.md
---
```

## Update protocol

1. Change the source of truth in mobile or web code.
2. Patch the matching note in this folder.
3. If a doc disagrees with code, add a row to [05-constraints-and-drift.md](05-constraints-and-drift.md).
4. Leave `../AI_BRAIN.md` unchanged unless a human explicitly asks to edit it.

## Naming

- `01`–`20` match the frontal-lobe TOC numbers.
- Feature atoms live under `features/` as `01-…` through `17-…`.
- File maps live under `code/` (`mobile-code-details.md`, `web-code-details.md`).
- **Sub brains** (task hubs that link the maps): `brains/` — mobile-code, mobile-ui, web-code, web-design, api. Start at [brains/README.md](brains/README.md).
- Lifecycles: `screens/how-it-works.md`. FormData + columns: `data/`. Env, decisions, bugs, flavors: `ops/`.
- Mobile visual pack: `design/` (MINI first). Pixels live in the original Design-Brain Assets folder, not in this vault.
- Web visual pack: `design-web/` (MINI first). Two stacks (classic AdminLTE vs manager React islands). Short stills in `design-web/03-Assets/stills/`.
- Appendices are `appendix-a|b|c-*.md`.
