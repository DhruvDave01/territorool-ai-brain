---
id: Error-and-Recovery
parent: design
---
# Error and recovery

| Path | UI | Capture |
| --- | --- | --- |
| API 401/403 | Session Expired modal → Login | No |
| JS crash | AppCrashFallback | No |
| HubSpot bad companies | stack `Error` | No |
| Cluster route open | navigate ClusterList missing | No (crash risk) |
| Offline | Footer toast | No dedicated still |
| Validation / API | Toasts | VID1/VID2 |

Do not confuse `Error` with crash UI.
