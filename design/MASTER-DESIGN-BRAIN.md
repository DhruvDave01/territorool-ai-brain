---
id: MASTER-DESIGN-BRAIN
parent: design
sources:
  - App/App.js
  - App/styles/theme.js
related:
  - design/03-Assets/README.md
  - design/06-Coverage/Deferred-Scope.md
  - design/03-Assets/Fonts/README.md
  - design/01-Brand-Guidelines/README.md
  - design/05-Design-System/Design-Tokens.md
  - design/05-Design-System/Token-Inconsistencies.md
  - design/02-User-Interface/Navigation.md
  - design/02-User-Interface/Screen-Inventory.md
---
# TerriTool Mobile — Master Design Brain

Entry point for designers, developers, and other agents. Describes the **existing** app. Do not redesign from this document.

- **App:** TerriTool (field sales: routes, lists, companies, contacts, AI leads, maps)
- **Stack:** React Native 0.84.1, React 19.2.3, New Architecture
- **Repo:** `TerriTool_Mobile` · entry `index.js` → `init.js` → `App/App.js`
- **API in this tree:** staging `https://staging.territool.com/index.php/api/`
- **Visual pack:** Archive 2 iOS TestFlight (48 stills + 3 videos) under [`03-Assets`](03-Assets/README.md)
- **Deferred:** Register, payment/paywall, Android pixels — [`06-Coverage/Deferred-Scope.md`](06-Coverage/Deferred-Scope.md)

---

## 1. Application overview

TerriTool is a **single native stack**. Module switching is a custom **six-icon footer**, not React Navigation tabs. Dashboard is a **tile hub without the footer**. State is class-component local + Realm JWT + AsyncStorage. Styling tokens live in `App/styles/theme.js` with many leftover hexes.

## 2. Brand summary

- Primary **`#124ac6`**
- Body surface **`#F6F7FB`**, cards white, text `#111827` / `#6B7280`
- Custom font **DIN Condensed** Regular + Bold — files in [`03-Assets/Fonts/`](03-Assets/Fonts/README.md) (Inter TTFs copied there too but unused)
- Logo: code uses `TerriTool_logo_NEW.jpg`; TestFlight login/header show a **TT cube** — **Needs Manual Verification**
- No app-wide dark theme (QR scanner is dark)

Details: [`01-Brand-Guidelines`](01-Brand-Guidelines/README.md)

## 3. Design principles (observed)

1. Blue gradient header + 25pt curved sheet
2. White rounded cards, 12px inputs
3. Footer icon-only navigation
4. Outline Cancel + filled primary on dialogs
5. Top toasts for async; AppConfirmModal for destructive
6. Empty states are short gray instructions
7. Context-specific company CTAs (Mark vs Add To)

## 4. Token summary

See [`05-Design-System/Design-Tokens.md`](05-Design-System/Design-Tokens.md) and [`Token-Inconsistencies.md`](05-Design-System/Token-Inconsistencies.md). **Do not average inconsistencies.**

## 5. UI architecture

`CustomHeader` (LinearGradient) → `primaryBleed` → `curvedBody` → optional `CustomFooter`. Maps and QR break the pattern (full map / dark camera).

## 6. Navigation architecture

Flat stack, 47 screens. Footer map and mermaid: [`02-User-Interface/Navigation.md`](02-User-Interface/Navigation.md). Dead: Notifications, RouteSwipe, stack filters. Broken: `ClusterList`.

## 7. Screen inventory

[`02-User-Interface/Screen-Inventory.md`](02-User-Interface/Screen-Inventory.md)

## 8. Component inventory

[`02-User-Interface/Components.md`](02-User-Interface/Components.md) · [`05-Design-System/Components.md`](05-Design-System/Components.md)

## 9. Asset inventory

[`03-Assets/Asset-Inventory.md`](03-Assets/Asset-Inventory.md)

## 10. User flow index

[`04-User-Flows/README.md`](04-User-Flows/README.md)

## 11. Screenshot / video index

[`06-Coverage/Screenshot-Video-Index.md`](06-Coverage/Screenshot-Video-Index.md)

## 12. UI states

[`02-User-Interface/States.md`](02-User-Interface/States.md)

## 13. Platform-specific behavior

[`02-User-Interface/Platform-Differences.md`](02-User-Interface/Platform-Differences.md)

## 14. Known inconsistencies

[`05-Design-System/Token-Inconsistencies.md`](05-Design-System/Token-Inconsistencies.md)

## 15. Needs Manual Verification

[`06-Coverage/Needs-Manual-Verification.md`](06-Coverage/Needs-Manual-Verification.md)

## 16. Coverage

[`06-Coverage/Functionality-Coverage-Matrix.md`](06-Coverage/Functionality-Coverage-Matrix.md)

---

## How to design a new screen so it matches

Follow [`05-Design-System/Usage-Rules.md`](05-Design-System/Usage-Rules.md). Copy the **nearest existing screen** (for example a new library list should look like Routes Library / Lists, not Dashboard tiles).

## What this Design Brain is not

- Not a redesign
- Not a license to change production code
- Not complete visual coverage of Register, paywalls, Android, splash, lasso, HubSpot, crash, or coaching
