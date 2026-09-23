---
id: 02-dashboard
parent: features
sources:
  - App/components/dashboard/index.js
related:
  - appendix-c-footer-tabs.md
  - features/16-notifications.md
  - features/05-activities.md
---
# Feature: Dashboard and home

Related: [appendix-c-footer-tabs](../appendix-c-footer-tabs.md) · [features/16-notifications.md](16-notifications.md) · [features/05-activities.md](05-activities.md)

## What it does

Central landing after login. Tile grid (no footer on Dashboard itself). Quick actions, credits, activity, HubSpot sheet, QR, business-card scan.

## Mobile

| Piece | Path |
|-------|--------|
| Screen | `App/components/dashboard/index.js` class `Dashboard` |
| Recent | `RecentActivityScreen` — `getUserActivity` scope `Recent` \| `Week` |
| Calendar | `CalendarActivityScreen` |
| Notifications | `NotificationsScreen` |
| Settings | `editstatus.js` (`EditStatus`) |
| QR | `QrCodeScannerScreen` |
| Referral | `ReferralInviteModal` |

Tiles include: AI Find Leads, routes/lists, scan card, QR, HubSpot, activity Upcoming/Recent, credits.

Version check `getversiondetails` can flag expired subscription on the footer.

Region gate for AI (docs): US / IN / NZ / AU.

## Web

`GET /` and `/dashboard` via `HomeController`.
