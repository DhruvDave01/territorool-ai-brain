---
id: index
parent: core
sources:
  - App/components
related:
  - schema.md
  - brains/mobile-code.md
  - brains/mobile-ui.md
  - brains/ui-ux-guardian.md
  - brains/web-code.md
  - brains/web-design.md
  - brains/api.md
  - brains/README.md
  - 2026-09-17.md
  - prompts/generate-brain.md
  - code/MOBILE_CODEBASE_BRAIN.md
  - code/WEB_CODEBASE_BRAIN.md
  - 01-project-overview.md
  - screens/navigation-map.md
  - screens/how-it-works.md
  - screens/web-how-it-works.md
---
# TerriTool AI Brain — knowledge vault

Detailed notes split from the root frontal lobe. **Do not invent** product behavior that is not in these notes or the cited source files.

| | |
|---|---|
| Frontal lobe (unchanged) | `../AI_BRAIN.md` |
| Mobile root | `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool` |
| Web root | `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool` |
| How notes are structured | [schema.md](schema.md) |

## Sub brains (task hubs)

The frontal lobe + this vault stay the **main brain**. Open one of these first when the work is clearly one surface:

1. [Mobile Code Brain](brains/mobile-code.md) — RN screens, `App.js`, Realm, FormData posts
2. [Mobile UI Brain](brains/mobile-ui.md) — tokens, `CustomHeader`, footer, copy nearest screen
3. [Web Code Brain](brains/web-code.md) — Laravel, `CompanylController`, MCP PHP
4. [Web Design Brain](brains/web-design.md) — classic AdminLTE vs manager islands
5. [Web and Mobile API Brain](brains/api.md) — JWT paths, web URLs, FormData keys
6. [UI/UX Guardian](brains/ui-ux-guardian.md) — copy existing chrome; stop and ask on major UX

Map: [brains/README.md](brains/README.md). Before any new or changed UI, read the Guardian then the matching UI brain.

## Core (always read)

1. [Project overview](01-project-overview.md)
2. [Commands](02-commands.md)
3. [Architecture and data flows](03-architecture.md)
4. [Style guide](04-style-guide.md)
5. [Constraints and known drift](05-constraints-and-drift.md)
6. [Users and roles](06-users-and-roles.md)
7. [Vocabulary](07-vocabulary.md)

## Features (atomic)

8. Product features
   - [Auth and account](features/01-auth-and-account.md)
   - [Dashboard and home](features/02-dashboard.md)
   - [Companies (Address Book)](features/03-companies.md)
   - [Notes](features/04-notes.md)
   - [Activities and meetings](features/05-activities.md)
   - [Contacts](features/06-contacts.md)
   - [AI Find Leads](features/07-ai-find-leads.md)
   - [Lists](features/08-lists.md)
   - [Routes and driving](features/09-routes.md)
   - [Credits, subscription, referrals](features/10-credits-subscription.md)
   - [CRM sync](features/11-crm-sync.md)
   - [Manager portal](features/12-manager-portal.md)
   - [Admin HQ](features/13-admin-hq.md)
   - [Support](features/14-support.md)
   - [Maps and geo](features/15-maps-and-geo.md)
   - [Notifications and analytics](features/16-notifications.md)
   - [Minor / edge](features/17-minor-edge.md)

## Deep systems

9. [Credits, packages, billing](09-credits-billing.md)
10. [Mobile app](10-mobile-app.md)
11. [Web and backend](11-web-backend.md)
12. [Mobile API catalog](12-mobile-api.md)
13. [Web URL catalog](13-web-urls.md)
14. [MCP servers and tools](14-mcp.md)
15. [Voice agent policy](15-voice-policy.md)
16. [Data models](16-data-models.md)
17. [Integrations](17-integrations.md)
18. [Cross-system flows](18-cross-system-flows.md)
19. [Testing and QA](19-testing-qa.md)
20. [How to update this brain](20-how-to-update.md)

## Code maps (file-level)

- [Mobile code details](code/mobile-code-details.md) — every `App/components` folder, utils, Realm, styles
- [Mobile codebase brain](code/MOBILE_CODEBASE_BRAIN.md) — live 2026-09-17 dump of `TerriTool/`
- [Web code details](code/web-code-details.md) — controllers, API V2, helpers, Blade, MCP modules
- [Web codebase brain](code/WEB_CODEBASE_BRAIN.md) — live 2026-09-17 dump of `webterritool/`

## Design (mobile UI as shipped)

Imported from the Design Brain pack. **Read [brains/ui-ux-guardian.md](brains/ui-ux-guardian.md) then [design/MINI-DESIGN-BRAIN.md](design/MINI-DESIGN-BRAIN.md) first.** Do not redesign; match the nearest existing screen. Stills/videos stay on disk under `Downloads/Design-Brain/03-Assets/`.

- [Design pack index](design/README.md)
- [Screen inventory (46 stack screens)](design/02-User-Interface/Screen-Inventory.md)
- [User flows](design/04-User-Flows/README.md)
- [Usage rules for a new screen](design/05-Design-System/Usage-Rules.md)
- [Token inconsistencies (do not normalize)](design/05-Design-System/Token-Inconsistencies.md)
- [Deferred visual scope](design/06-Coverage/Deferred-Scope.md)
- [Mobile screenshot flow (00–10 folders; pixels win)](design/06-Coverage/Mobile-Screenshot-Flow.md)
- [Ingest log 2026-09-15](2026-09-15.md)
- [Ingest log 2026-09-16](2026-09-16.md)
- [Ingest log 2026-09-17](2026-09-17.md) — live mobile + web scan; staging `URL_BASE`; User MCP 1.4.1
- [Ingest log 2026-09-18](2026-09-18.md) — web User / Manager / Admin flows

## Design (web UI as shipped)

Two stacks — do not mix. **Read [design-web/MINI-DESIGN-BRAIN.md](design-web/MINI-DESIGN-BRAIN.md) first.** Extracted from live Blade/CSS/islands (same method as FormData). Short Archive stills in `design-web/03-Assets/stills/`.

- [Web design pack index](design-web/README.md)
- [Tokens (classic vs manager — do not average)](design-web/Tokens.md)
- [Page inventory (Blade ↔ views + `#manager-*-root`)](design-web/Page-Inventory.md)
- [Role-split nav (duplicate sidebar links are live)](design-web/Navigation.md)
- [Usage rules for a new page](design-web/Usage-Rules.md)
- [Token inconsistencies](design-web/Token-Inconsistencies.md)
- [Deferred visual scope (Register / paywall / HQ)](design-web/Deferred-Scope.md)

## Screens / data / ops

- [Per-screen how it works](screens/how-it-works.md) — **mobile**
- [Web how it works (User / Manager / Admin)](screens/web-how-it-works.md)
- [Manager MCP how it works (assign → route → contacts)](screens/manager-mcp-how-it-works.md)
- [Mobile navigation map](screens/navigation-map.md)
- [FormData dictionary](data/formdata-dictionary.md)
- [Database columns](data/database-columns.md)
- [Env inventory (names only)](ops/env-inventory.md)
- [Workspace owner emails](ops/workspace-owner.md) — Gmail Allow: `/gmail.html` on the Vercel graph
- [Decision log](ops/decision-log.md)
- [Known bugs](ops/known-bugs.md)
- [Release / flavor matrix](ops/release-flavor-matrix.md)

## Appendices

- [A — Google AI Mode source](appendix-a-google-source.md)
- [B — Reading order](appendix-b-reading-order.md)
- [C — Mobile footer tabs](appendix-c-footer-tabs.md)
- [Generator prompt for another project (vault + mobile scan in one file)](prompts/generate-brain.md)
