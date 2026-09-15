---
id: Needs-Manual-Verification
parent: design
---
# Needs Manual Verification

Do not guess. Items below are uncertain even after code + Archive 2.

| Item | Why |
| --- | --- |
| Login logo cube vs `TerriTool_logo_NEW.jpg` 300×110 | Capture ≠ current style numbers |
| Who sees “Rate the app” | Test-account gating in Settings vs Testim capture |
| Dynamic Links after install | Share URL exists; no JS router |
| FCM tap destination | Logs only; Notifications unused |
| Cluster route tap | Navigates to unregistered `ClusterList` |
| Lasso drawing UX | No video |
| Map polyline in OS dark mode | Code reacts to Appearance |
| Scan Card **save** destination | Preview/OCR captured; post-save not |
| Calendar row tap target | Screen captured; navigation not |
| Filter By Status checkboxes | Below “Scroll for more”; not fully shown |
| Sort By Visit | Hidden on some parents; not captured |
| HeaderAddMenu open | Code-only |
| MapChooserPopup | Navigate not recorded |
| App icon / splash pixels | Native catalogs incomplete in search |
| In-app forgot modal | Dead path vs web reset |
| `COLOR_PRIMARY` import in bizContact styles | Config no longer exports it — runtime? |
| Version 42.30 vs 42.31 vs package 7.1.49 | TestFlight vs marketing version |
| Invalid Date PT | Bug vs empty timestamp |
| Android visual parity | No Android archive |

Deferred payment/register UI is **out of scope**, not NMV of copy.
