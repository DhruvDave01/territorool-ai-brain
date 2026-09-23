---
id: Platform-Differences
parent: design
---
# Platform differences

Archive 2 is **iOS TestFlight only**. Android UI is code-inferred.

| Area | iOS (captured / code) | Android (code) |
| --- | --- | --- |
| Status / Dynamic Island | Captured | N/A |
| Header gradient | Same tokens | Same |
| Filter control height | 48 | 42 |
| CustomCompany address lines | 3 / icon 16 | 2 / icon 14 |
| Call | System action sheet (VID2) | Dialer intent |
| Location | When In Use config | ACCESS_FINE_LOCATION |
| Photos | Photo library | Camera + storage ≤ API 32 |
| Push | `messaging().requestPermission` | POST_NOTIFICATIONS |
| Settings Cancel/Upgrade/credits | Visible in captures | `HIDE_SUBSCRIPTION_ACTIONS_ON_ANDROID` is currently **`false`** — actions show on both |
| Splash Lottie | JS overlay | Same JS; native window `#124ac6` |
| DIN PostScript | `DINCondensed-Bold` / `DIN-Regular` | File-name families |
| `androidTextFix` | — | Applied in typography helpers |
| Business card camera options | iOS-specific flags in code | Image picker |

Do not claim Android pixel-match without captures.
