---
id: Needs-Manual-Verification
parent: design
---
# Needs Manual Verification

Do not guess. Items below are uncertain even after code + Archives 1–4.

| Item | Why |
| --- | --- |
| JS splash Lottie overlay vs native blue | Maestro `19-splash.png` is solid `#124ac6` only; asset still exists |
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
| Android launcher vs iOS 1024 crop | Archive catalog has both; not compared on device |
| In-app forgot modal | Dead path vs web reset |
| `COLOR_PRIMARY` import in bizContact styles | Config no longer exports it — runtime? |
| Version 42.30 vs 42.31 vs package 7.1.49 | TestFlight vs marketing version |
| Invalid Date PT | Bug vs empty timestamp |
| Android visual parity | No Android archive |

Deferred payment/register UI is **out of scope**, not NMV of copy.
