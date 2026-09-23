---
id: Needs-Manual-Verification
parent: design
---
# Needs Manual Verification

Do not guess. Items below are uncertain even after code + Archives 1–4 + numbered iOS pack ([Mobile-Screenshot-Flow](Mobile-Screenshot-Flow.md)).

| Item | Why |
| --- | --- |
| JS splash Lottie overlay vs native blue | `ios/00-splash/00-splash.png` is solid `#124ac6` + status bar; repo Lottie exists |
| Who sees “Rate the app” | Test-account gating in Settings vs Testim capture |
| Dynamic Links after install | Share URL exists; no JS router |
| FCM tap destination | Notifications **is** reachable (`ios/02-home/05`) empty + toast **405 Method Not Allowed**. Bell routing still NMV |
| Cluster route tap | Navigates to unregistered `ClusterList` |
| Lasso **finger-draw** | Map chrome captured; no draw video |
| Map polyline in OS dark mode | Code reacts to Appearance |
| Scan Card **after** Save Company & Contact | Form CTA captured; destination still NMV |
| Calendar row tap target | Screen captured; navigation not |
| Android launcher vs iOS 1024 crop | Archive catalog has both; not compared on device |
| `COLOR_PRIMARY` import in bizContact styles | Config no longer exports it — runtime? |
| Version 42.30 / 42.31 / **42.32** vs package 7.1.49 | TestFlight vs marketing version |
| Invalid Date PT | Still on Dashboard 42.32 — likely empty timestamp, not a one-off |
| Android visual parity | No Android archive |
| Distinct `SubscriptionGate` chrome | `08-subscription-gate.png` is the same paywall as `09-subscription-screen.png` |
| Settings Upgrade when **App Store** billed | This pack’s account is web-billed |
| Publish **success** loader | Numbered pack only captured fail cards (`11`/`12`) |

Cold-start gate and store IAP remain deferred, not NMV of copy.
