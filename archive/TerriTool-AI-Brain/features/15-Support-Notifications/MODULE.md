---
title: "15 — Support and Notifications"
---

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

**Modules** — [07-Routes](../07-Routes/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md), [19-Cron-Jobs-Webhooks](../19-Cron-Jobs-Webhooks/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `SupportController`, `MailController`, `Admin\SupportController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
