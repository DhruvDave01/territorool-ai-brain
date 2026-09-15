---
id: mobile-ui
parent: brains
sources:
  - TerriTool/
  - App/styles/theme.js
  - App/components/customheader/index.js
  - App/styles/screenCurvedBody.js
  - App/components/common/AppConfirmModal.js
  - App/components/customfooter/index.js
  - App/styles/common.js
  - App/components/splash/AnimatedSplashScreen.js
related:
  - brains/mobile-code.md
  - brains/README.md
  - brains/api.md
  - design/MINI-DESIGN-BRAIN.md
  - design/05-Design-System/Usage-Rules.md
  - design/02-User-Interface/Screen-Inventory.md
  - design/05-Design-System/Token-Inconsistencies.md
  - design/06-Coverage/Deferred-Scope.md
  - screens/navigation-map.md
---
# 2. Mobile UI Brain

Hub for **as-shipped** mobile chrome. Sibling: [Mobile Code Brain](mobile-code.md). Parent: [sub brains](README.md).

**Repo:** `TerriTool/` pixels + `App/styles/theme.js`. Stills/videos: `Downloads/Design-Brain/03-Assets/` (not in this vault). Not a redesign. APIs: [API Brain](api.md).

## Read first

1. This file.
2. [design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md).
3. Then: [Usage-Rules](../design/05-Design-System/Usage-Rules.md), [Screen-Inventory](../design/02-User-Interface/Screen-Inventory.md), [Token-Inconsistencies](../design/05-Design-System/Token-Inconsistencies.md).

## Must follow

| Rule | Do this |
|------|---------|
| New screen | Copy **nearest existing screen**. `CustomHeader` + curved body. |
| Header | `App/components/customheader/index.js` — `LinearGradient` `theme.colors.linearGradient` (7-stop starting `#124ac6`). |
| Body | `App/styles/screenCurvedBody.js`: `SCREEN_BODY_TOP_RADIUS = 25`, fill `theme.colors.ccSurface` (`#F6F7FB`). **Radius is not in `theme.js`.** |
| Confirm | `App/components/common/AppConfirmModal.js`, not native `Alert`. |
| Buttons | `App/components/common/AppButton.js`. Danger variant bg **`#CF5B51`**. |
| Type | DIN Condensed: `dinBold` / `dinLight`. Inter ttf in Assets is **unused**. |
| Dark mode | None app-wide (QR scanner / some map polylines may go dark — NMV). |
| Footer | Six icon-only tabs. Lists = `Supply3.png`. Dashboard **has no footer**. Settings on Dashboard is a header pill `testID="footer.tab.settings"`. |
| Deferred pixels | Register, paywall, Android: [Deferred-Scope](../design/06-Coverage/Deferred-Scope.md). JS is live. |

## Tokens (`App/styles/theme.js`) — do not average

| Role | Token | Hex |
|------|--------|-----|
| Primary | `primary` | `#124ac6` |
| Surface | `ccSurface` | `#F6F7FB` |
| Danger (modal) | `danger` | `#E94A5D` |
| Danger (button) / `ttRed` | `ttRed` | `#CF5B51` |
| Teal / green family | `primaryDark` `#00A99D`, `ttGreen` `#12AA9D`, `ttTab` `#3E918B`, `boldActive` `#12A090`, `lightGreen` `#40B793`, `moreLightGreen` `#1DCF00` | **all live** |
| Extra red | `darkRed` | `#C16C69` |

Prompts that say primary teal `#12A090` are stale — that hex is `boldActive` only.

## Chrome paths

| Piece | Path |
|------|------|
| Header | `App/components/customheader/index.js` |
| Footer | `App/components/customfooter/index.js` + `customfooter.styles.js` |
| Curved body | `App/styles/screenCurvedBody.js` |
| Theme | `App/styles/theme.js` |
| Common layout helpers | `App/styles/common.js` (`fontS*`, `flx1`, `padT20`, …) |
| Splash | `App/components/splash/AnimatedSplashScreen.js` |

## Footer (visual)

Active tint `#124ac6` on `#eeeeee`; inactive `#9B9B9B`. Icons 28×28. Mapping: [Mobile Code Brain](mobile-code.md) table. [appendix-c-footer-tabs.md](../appendix-c-footer-tabs.md).

## Copy-nearest (typical)

| New thing | Copy |
|-----------|------|
| Logged-in list/settings chrome | Settings / Address Book (`EditStatus`, `company/list.js`) |
| Modal confirm | Any `AppConfirmModal` caller |
| CTA | `AppButton` variants already on that screen |
| Map | `activeroutemap` / `findLeads` — do not restyle map circles to a single teal |

## Trained if you can

- Build a new list screen with gradient header + 25pt `#F6F7FB` body.
- Leave both danger reds and the teal family untouched.
- Not put CustomFooter on Dashboard or AI Find Leads V2.
