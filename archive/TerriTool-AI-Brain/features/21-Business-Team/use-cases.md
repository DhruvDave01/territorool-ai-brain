---
title: "Business Team — use cases"
---

# Business Team — use cases

Part of [21-Business-Team](MODULE.md). Written 2026-09-16 from MODULE.md + `BusinesssalespersonController` routes. New manager UX is [16-Manager-Portal](../16-Manager-Portal/MODULE.md). **Not Playwright-walked this session.**

### UC-TEAM-01 Invite a team member

Business Agent: `GET/POST /businesssalesperson/create` → invite email. License cap same as Manager Portal.

### UC-TEAM-02 Activate invite

Invitee: `GET/POST /businesssalesperson/activate/{userid}` (public). Sets password → Business Sales Agent under that manager.

### UC-TEAM-03 Allocate credits / team list

`/businesssalesperson` list; `/businesssalesperson/credit/{id}` allocate. Rep detail: notes, contacts, routes.

### UC-TEAM-04 Resend or remove

Resend invitation; remove member. HQ business-clients is the admin counterpart (module 17).

Do not build new manager features on this path — use module 16.
