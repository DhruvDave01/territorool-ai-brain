# 15 — Support and Notifications

## Purpose

Help tickets (including Report Bug), an inbox for route and system messages, email, and push.

## Who

All app users. Admins answer tickets in HQ. Managers have the same ticket types from the cockpit.

## Tickets

- List own tickets
- Create (optional screenshot)
- View thread and reply
- Update fields
- Unread count

Report Bug uses the same create path.

## Notifications

- Inbox of route-ready and system messages
- Mark read / remove
- New-release notice and app version details
- Push via FCM when a device is registered
- Route-ready cron also writes these messages

Polling unread items marks them read so toasts do not repeat.

## Email

Invite/activation, appointment, welcome/onboarding, trial nudge, support replies.

## Rules

- Tickets only for the owner (or admin).
- Screenshot is optional.

## Code

`SupportController`, Admin support, `MailController`, `SupportTicket`, FCM / `userdevices`.

## Related

**Modules** — 07-Routes, 16-Manager-Portal, 17-Admin-HQ, 19-Cron-Jobs-Webhooks

**This feature** — Use cases, Flows, Evidence

**Code** — ROUTEMAP.md (look for `SupportController`, `MailController`, `Admin\SupportController`), CODEMAP.md, engineering/README.md

**Terms / roles** — roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `Notifications` | `dashboard/NotificationsScreen.js` | Open, mark read | `screen.notifications.loading` | List renders empty (no copy) | "Could not load notifications." (toast) |
| Mobile | Support | No support screen. Error copy points to "Please try again or contact support@territool.com". | — | — | — | — |
| Classic web | Support create | [web_02_support-create](../screenshots/web/sales-agent/web_02_support-create_w1440.png) | Submit ticket | `#cover-spin` | — | Laravel validation |
| Manager | `/manager/support` | [Support tickets](../screenshots/web-owner/Manager/Support-Tickets-TerriTool-09-15-2026_01_30_PM.png), [Add ticket](../screenshots/web-owner/Manager/Add-Support-Tickets-TerriTool-09-15-2026_01_30_PM.png) | Open, reply | "Loading…" | Empty table row | "Failed to load activity." (activity); toast elsewhere |

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [Screenshot 2026-09-15 at 11.12.05 AM.png](<../screenshots/feature-evidence/15-Support-Notifications/evidence/Screenshot 2026-09-15 at 11.12.05 AM.png>)
- [11-support.png](<../screenshots/feature-evidence/15-Support-Notifications/flows/png/11-support.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
