# 2. Mobile UI Brain

Hub for **as-shipped** mobile chrome and tokens. Sibling: [Mobile Code Brain](mobile-code.md). Parent: [sub brains](README.md).

**Repo:** `TerriTool/` (pixels + `App/styles/theme.js`). Stills/videos stay on disk under `Downloads/Design-Brain/03-Assets/`, not in this vault.

## Read first

1. This file (rules).
2. [design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md) — one-file distillation.
3. Then only what you need: [design/README.md](../design/README.md), [Screen inventory](../design/02-User-Interface/Screen-Inventory.md), [Usage rules](../design/05-Design-System/Usage-Rules.md).

This pack is **not** a license to redesign or to change APIs. APIs stay in the [API Brain](api.md).

## Must follow

| Rule | Do this |
|------|---------|
| New screen | Copy the **nearest existing screen**: `CustomHeader` (7-stop `#124ac6` gradient) + curved body `#F6F7FB` (top radius **25**). |
| Primary | `#124ac6` — headers, selected footer, filled CTAs. |
| Teals | Several live hexes (`#00A99D`, `#12AA9D`, `#3E918B`, `#12A090`). **Do not consolidate.** |
| Danger | Two live reds: modal `#E94A5D`, button `#CF5B51`. Do not pick one. |
| Type | **DIN Condensed** (`dinBold` / `dinLight`). Inter files in Assets are unused. |
| Confirm | `AppConfirmModal`, not native `Alert`. |
| Footer | Six icon-only tabs. Lists icon is **`Supply3.png`**, not `icon_lists.png`. |
| Deferred | Register, paywall, and Android pixels are **code-only** until captured. [Deferred-Scope](../design/06-Coverage/Deferred-Scope.md). |
| Dark mode | None app-wide. |

## New screen chrome

Match [design/05-Design-System/Usage-Rules.md](../design/05-Design-System/Usage-Rules.md). Token inconsistencies: [Token-Inconsistencies.md](../design/05-Design-System/Token-Inconsistencies.md) — do not “fix.”

**47 screens**, one stack, module switching via `CustomFooter`. Dashboard has **no** footer.

## Related

- [04-style-guide.md](../04-style-guide.md) §4.1
- [appendix-c-footer-tabs.md](../appendix-c-footer-tabs.md)
- [screens/how-it-works.md](../screens/how-it-works.md)
