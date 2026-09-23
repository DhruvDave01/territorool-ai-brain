---
id: Permissions
parent: design
---
# Permissions

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md).

| Permission | When | iOS | Android |
| --- | --- | --- | --- |
| Location when-in-use | Find Leads, maps, routes | Info.plist + Geolocation | FINE/COARSE |
| Camera | Scan Card, QR | Camera | CAMERA |
| Photo library | Scan Card Gallery | Photo Library | storage ≤32 |
| Notifications | FCM | requestPermission | POST_NOTIFICATIONS |
| ATT | init.js | App Tracking Transparency | — |
| Microphone | Info.plist present | May be unused by current flows | — |

Captured (Archive 2026-09-16):

| Prompt | Copy |
| --- | --- |
| Notifications (on Login) | “TerriTool” Would Like to Send You Notifications · Don't Allow / Allow (`19.34.48`) |
| Location (on Dashboard) | Allow “TerriTool” to use your location? “show nearby territories and navigate to properties.” Allow Once / Allow While Using App / Don't Allow (`19.36.28`) |
| Camera (QR / photos) | “TerriTool” would like to access the Camera. “capture property photos.” Don't Allow / Allow (`19.37.00`) |

Denied-empty follow-up UI is still **Needs Manual Verification**.
