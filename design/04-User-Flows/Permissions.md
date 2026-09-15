---
id: Permissions
parent: design
---
# Permissions

| Permission | When | iOS | Android |
| --- | --- | --- | --- |
| Location when-in-use | Find Leads, maps, routes | Info.plist + Geolocation | FINE/COARSE |
| Camera | Scan Card, QR | Camera | CAMERA |
| Photo library | Scan Card Gallery | Photo Library | storage ≤32 |
| Notifications | FCM | requestPermission | POST_NOTIFICATIONS |
| ATT | init.js | App Tracking Transparency | — |
| Microphone | Info.plist present | May be unused by current flows | — |

Denied/empty permission UI is **not captured**. **Needs Manual Verification**.
