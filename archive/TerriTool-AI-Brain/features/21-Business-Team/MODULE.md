---
title: "21 — Business Team (older screens)"
---

# 21 — Business Team (older screens)

## Purpose

Original Business Agent team management, still live for **invite activation**, credit allocation, and some redirects. New manager UX is module 16. Do not delete this path.

## Who

Business Agent (legacy UI). Invitees use activate-account.

## Functionality

- Team list
- Create team member + invite email
- Edit, remove
- Allocate credits
- Rep detail: notes, contacts, routes
- Resend invitation
- Invitee sets password → Business Sales Agent under that manager

Same license cap and parent/role rules as the manager cockpit.

## Admin counterpart

HQ **business clients** manages the manager accounts (licenses, resend, delete).

## Rules

- Activation emails still point here.
- New manager features go in module 16.
- License counts must match in both UIs.

## Verified routes

Extracted from `routes/web.php`, controller `BusinesssalespersonController`.

| Feature | Method + path | Action |
|---|---|---|
| Invite activation (public, no auth) | `GET/POST /businesssalesperson/activate/{userid}` | `activate` / `activateStore` |
| Team list | `GET /businesssalesperson` | `index` |
| Create team member | `GET/POST /businesssalesperson/create` | `create` / `store` |
| Edit | `GET/POST /businesssalesperson/{id}/edit/` | `edit` / `update` |
| Remove | `GET /businesssalesperson/{id}/remove/` | `remove` |
| Allocate credits | `GET/POST /businesssalesperson/credit/{id}` | `creditindex` / `creditupdate` |
| Rep detail | `GET /businesssalesperson/details/{id}` | `salespersonDetails` |
| Rep detail: notes | `GET /businesssalesperson/company-notes/{id}` | `companyNotes` |
| Rep detail: contacts | `GET /businesssalesperson/company-contacts/{id}` | `companyContactsList` |
| Rep detail: routes | `GET /businesssalesperson/routes-list/{id}` | `routesList` |
| Resend invitation | `GET /businesssalesperson/resendinvitation/{id}` | `resendinvitation` |

The activation route is the only one outside auth middleware — it is how a newly invited Business Sales Agent sets a password for the first time.

## Code

`BusinesssalespersonController`, `resources/views/front/businesssalesperson/`.

## Related

**Modules** — [01-Authentication-Onboarding](../01-Authentication-Onboarding/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `BusinesssalespersonController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
