---
id: Error-and-Recovery
parent: design
---
# Error and recovery

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/10-other/`).

| Path | UI | Capture |
| --- | --- | --- |
| API 401/403 | Session Expired modal → Login | No |
| HubSpot bad companies | stack `Error` | `ios/10-other/02-error.png` — title **Error companies correction**, empty, teal **Fix selected** / pink **Delete selected** |
| JS crash | AppCrashFallback | Archive `19.28.39` + `ios/10-other/04-crash-fallback.png` (dev **Test crash screen**) |
| Cluster route open | navigate ClusterList missing | No (crash risk) |
| Offline | Footer toast | No dedicated still |
| Validation / API | Top toast, orange left bar | Archive login/register: “Please enter password”; “The email has already been taken.” Live quirks: “Please enter Enter Valid Password” / “Please enter Enter Valid Email Address” — document, do not “fix” in notes |

Crash fallback (captured): centered card, pink ! circle, **Something went wrong**, “Don't worry — your work is safe. Tap Retry to pick up where you left off.”, green **Report sent automatically**, optional “What were you doing?”, **Send** / **Retry**, SUPPORT REFERENCE hex + copy. Do not confuse stack `Error` (HubSpot) with this crash UI. Dev **Test crash screen** on Register is how the still was produced — not product chrome.
