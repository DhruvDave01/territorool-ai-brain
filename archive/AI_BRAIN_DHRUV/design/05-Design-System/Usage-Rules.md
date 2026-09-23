---
id: Usage-Rules
parent: design
sources:
  - App/App.js
---
# Usage rules for a new screen

Agent policy: [brains/ui-ux-guardian.md](../../brains/ui-ux-guardian.md) — copy existing; major UX → ask.

To look like TerriTool **today**:

1. Register a `Stack.Screen` in `App/App.js` (flat stack).
2. Wrap with `CustomHeader` (gradient) and `screenCurvedBodyStyles` (25pt `#F6F7FB`).
3. Add `CustomFooter` with the correct `selectedIndex` if it belongs to a module.
4. White cards, radius ~12, border `#E5E7EB`.
5. Primary actions `#124ac6` radius 12 DIN Bold; secondary outline 2px primary.
6. Confirms via `AppConfirmModal`; async via top Toast.
7. Empty/loading/error states required (see States.md).
8. Copy DIN Condensed; do not introduce Inter.
9. Match **Mark vs Add To** to `parent_screen`.
10. Do not “fix” teal/gold chips or mixed reds — copy the sibling screen.
11. Do not reuse the splash poster (`Image_splash.png`) as an authenticated screen background.
12. Register/onboarding copies `PostSignupPaywallFlow`, not `CustomHeader`.

Deferred: do not restyle Register/paywall until that pack is in scope.
