---
title: "02 — Dashboard"
---

# 02 — Dashboard

## Purpose

Home after login for reps. Shows what they did recently, what is coming up, and credit/upgrade status. Business Agents are sent to the **Manager Portal** instead of this screen.

## Who

Sales Agent, Business Sales Agent. Business Agent only if returning from HubSpot connect.

## Functionality

- Personalized welcome.
- **Recent activity**: notes, visits, status changes, routes for this user.
- **Upcoming notes**: reminders and appointments with date and type.
- **Credit balance** in the header (Sales Agent). Low credits → upgrade or, if billed through RevenueCat, manage-plan (not a second Stripe checkout).
- Shortcuts into Address Book, Find Leads, Routes, Lists.
- In-app tutorial and PDF tutorial.
- After a RevenueCat purchase, a success screen.
- Review-credit eligible UI at authenticated `/reviews/credits`. It opens the G2 and Product Hunt review pages but does not record a submission, verify a review, or grant credits yet.

### HubSpot connect return

If the user is coming back from HubSpot OAuth:

1. Store the refresh token on the user.
2. If fields are not mapped yet → field mapping.
3. Otherwise stay on home.

### When a Business Agent still hits this home

Team widgets can still show: visits, note updates, routes, status updates, navigate-me counts for a date range; licenses used vs remaining; team list with credit totals; plan/credit summary. The normal path is the manager cockpit (module 16).

## Rules

- Keep Business Agents on the manager cockpit except OAuth return.
- Activity is always scoped to the signed-in user (or that manager’s team on manager screens).

## Code

`HomeController`, dashboard view, sidebar, header menu (credits / upgrade).

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [08-Lists](../08-Lists/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [15-Support-Notifications](../15-Support-Notifications/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Evidence](evidence.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `HomeController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
