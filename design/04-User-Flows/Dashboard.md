---
id: Dashboard
parent: design
---
# Dashboard

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/02-home/`).

Captures: `IMG_4563`, `IMG_4605`, `ios/02-home/01-dashboard.png`, VID1 start, VID2 start, VID3 loading, Archive `Dashboard/` (42.32).

```
Dashboard
  → AI Find Leads → MultipleAIWaypoint
  → Scan Card → BusinessCard
  → Add Company → CreateCompany
  → Routes → Routes (badge)
  → Lists → Lists (badge)
  → Address Book → ListCompany
  → QR → QrCodeScanner (`06`)
  → gear → EditStatus
  → referral banner → ReferralInviteModal
  → Calendar → CalendarActivity (`04`)
  → View All / Recent row → RecentActivity (`03`) or ViewCompany
  → Notifications (`05`) — reachable empty **No notifications yet.** + toast **405 Method Not Allowed**. No production bell routing (NMV)
```

`02-dashboard-add-menu.png` is **Address Book** HeaderAddMenu, not Dashboard. Real Address Book + is `ios/04-companies/04`.

Loading: dim tiles + spinner “LOADING.” / “Loading credits…” (VID3).

Activity date: stills may show **Invalid Date PT**; videos show `Fri, Sep 11 - 7:28 AM PT` (timezone PT). Document both.

Empty Upcoming: “No upcoming activities yet.”

42.32 stills: location permission on first Dashboard (`19.36.28`); QR header → camera “capture property photos” then **Scan QR code / Point at a route code** (`19.37.13`); referral **Share the app with others** Email/Phone (`19.38.39`). **Invalid Date PT** still appears under Activity.
