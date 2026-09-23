---
id: README
parent: brains
sources:
  - TerriTool/
  - webterritool/
related:
  - brains/mobile-code.md
  - code/mobile-code-details.md
  - 10-mobile-app.md
  - brains/mobile-ui.md
  - brains/ui-ux-guardian.md
  - design/MINI-DESIGN-BRAIN.md
  - brains/web-code.md
  - code/web-code-details.md
  - 11-web-backend.md
---
# Sub brains

The **main brain** is this vault plus the frontal lobe `../AI_BRAIN.md`. These hubs do not replace it. They are the first stop when the task is clearly one surface. For any new or changed UI, read [UI/UX Guardian](ui-ux-guardian.md) **before** the Mobile UI or Web Design brain.

**Do not invent** endpoints, FormData keys, credits, or MCP tools. `TerriTool/` and `webterritool/` win.

| Sub brain | Use when | Deep notes |
|-----------|----------|------------|
| [1. Mobile Code Brain](mobile-code.md) | RN screen, navigator, Realm, `API.post` | [code/mobile-code-details.md](../code/mobile-code-details.md) · [code/MOBILE_CODEBASE_BRAIN.md](../code/MOBILE_CODEBASE_BRAIN.md) · [10-mobile-app.md](../10-mobile-app.md) · [screens/navigation-map.md](../screens/navigation-map.md) |
| [2. Mobile UI Brain](mobile-ui.md) | Chrome, tokens, footer | [design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md) |
| [3. Web Code Brain](web-code.md) | Laravel, `CompanylController`, MCP PHP, islands | [code/web-code-details.md](../code/web-code-details.md) · [code/WEB_CODEBASE_BRAIN.md](../code/WEB_CODEBASE_BRAIN.md) · [11-web-backend.md](../11-web-backend.md) |
| [4. Web Design Brain](web-design.md) | Classic AdminLTE vs manager pixels | [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md) |
| [5. Web and Mobile API Brain](api.md) | JWT paths, web URLs, FormData, publish | [12-mobile-api.md](../12-mobile-api.md) · [13-web-urls.md](../13-web-urls.md) · [data/formdata-dictionary.md](../data/formdata-dictionary.md) |
| [6. UI/UX Guardian](ui-ux-guardian.md) | Any new or changed UI | Copy existing chrome. Minor from shipped app. Major UX → stop and ask. |

Live code checks (2026-09-17): **46** stack screens; buy-contact **2 / 2 / 1**; `URL_BASE` **staging**; User MCP **1.4.1** (33 tools). Drift log: [05-constraints-and-drift.md](../05-constraints-and-drift.md). Ingest: [2026-09-17.md](../2026-09-17.md).

```mermaid
flowchart LR
  main["Main brain"]
  g[UI/UX Guardian]
  mc[Mobile Code]
  mui[Mobile UI]
  wc[Web Code]
  wd[Web Design]
  api[API]
  main --- mc
  main --- mui
  main --- wc
  main --- wd
  main --- api
  main --- g
  g --- mui
  g --- wd
  mc --- mui
  mc --- api
  wc --- wd
  wc --- api
```
