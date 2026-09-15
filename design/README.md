---
id: README
parent: design
sources:
  - TerriTool/App/assets/fonts/
  - TerriTool/App/images/
related:
  - design/MINI-DESIGN-BRAIN.md
  - design/MASTER-DESIGN-BRAIN.md
  - screens/how-it-works.md
  - 09-credits-billing.md
  - design/06-Coverage/Needs-Manual-Verification.md
  - design/06-Coverage/Deferred-Scope.md
  - design/01-Brand-Guidelines/README.md
  - design/02-User-Interface/README.md
---
# Design pack (mobile UI as it ships)

Imported from the **Design Brain** pack (iOS TestFlight Archive 2 + `TerriTool` `theme.js`). This is **not** a redesign brief. Code still wins over captures.

**Read first:** [MINI-DESIGN-BRAIN.md](MINI-DESIGN-BRAIN.md)  
**Full index:** [MASTER-DESIGN-BRAIN.md](MASTER-DESIGN-BRAIN.md)

Product / API / credits stay in the rest of `AI_BRAIN/` and the root frontal lobe. Use this folder when the task is **how a screen looks**, tokens, chrome, or “match the nearest existing screen.”

## What is here vs what is not

| In this vault | Left on disk (too large to copy) |
|---|---|
| All 57 markdown notes (brand, UI, flows, tokens, coverage) | 48 stills + video frames + 3 MP4s (~290 MB) + TTF/logo copies |

Captures: `/Users/dhruvdave/Downloads/Design-Brain/03-Assets/`  
Live fonts/icons: `TerriTool/App/assets/fonts/` and `TerriTool/App/images/`

Screenshot filenames in these notes (`IMG_4563`, VID1, …) refer to that Assets folder. Do not invent missing pixels.

## How this differs from product notes

| Need | Use |
|------|-----|
| Publish poll, FormData, credits, MCP | [screens/how-it-works.md](../screens/how-it-works.md), [09-credits-billing.md](../09-credits-billing.md) |
| Hex, DIN, header/footer, empty copy, Mark vs Add To | This folder |
| Dead screens / visual NMV | [06-Coverage/Needs-Manual-Verification.md](06-Coverage/Needs-Manual-Verification.md) |

## Ground rules (from the pack)

- Match the **nearest existing screen**. Do not average mixed teals, the two danger reds, or gold map chips.
- Do not add nested navigators, Inter, or an app-wide dark theme.
- Register / paywall / Android pixels are **deferred** — [06-Coverage/Deferred-Scope.md](06-Coverage/Deferred-Scope.md). Do not invent that UI.

## Folder map

| Folder | Contents |
|--------|---------|
| [01-Brand-Guidelines](01-Brand-Guidelines/README.md) | Colors, DIN, spacing, radius, shadows, logos, icons |
| [02-User-Interface](02-User-Interface/README.md) | 47 screens, components, nav, states, forms, maps, iOS vs Android |
| [03-Assets](03-Assets/README.md) | Inventory only (binaries not copied) |
| [04-User-Flows](04-User-Flows/README.md) | `Start → action → screen → result` |
| [05-Design-System](05-Design-System/README.md) | Tokens, usage checklist, inconsistencies |
| [06-Coverage](06-Coverage/README.md) | Visual vs code matrix, NMV, deferred |
