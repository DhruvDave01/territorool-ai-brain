# 18 — One product, every client

## Purpose

TerriTool is **one product**. Browser, iOS, Android, voice, and AI tools all read and write the same companies, contacts, routes, lists, credits, and CRM connections. Do **not** design a feature as “web only” or “app only.” If a client cannot show a screen yet, the **rules** (credits, publish, visited, duplicates) still apply when that client calls the same action.

This folder is not a second feature list. Feature lists live in modules 01–17. This folder is the contract between surfaces.

## What is the same everywhere

- Login, signup, password reset, preferences
- Address Book CRUD, notes, visits, activities, report
- Contacts CRUD, unassigned contacts, stages
- Find Leads (AI + Yelp), resume search, save at **1 credit**
- Find / buy contacts: **2** credits FullEnrich / **1** credit Claude (never free)
- Lists and generate-route
- Routes: create, update, publish, regenerate, share, mark visited, active route
- Credits, cancel, request upgrade
- HubSpot sync
- Support tickets and notifications
- Bulk create companies and import-error repair (autofill, merge, append, delete duplicate)

## Field-day extras (still the same data)

These exist because the user is driving, not because they are a different product:

- **Active route** — which published route is “today”
- **Next unvisited stop**
- **Navigate Me** (logged for manager KPIs)
- **Offline copy** of the active route
- **Bookmark** a stop
- **Select all** companies on a route
- Device token / push, app version, new-release notice
- Scan QR, invite another user

## Clients

| Surface | How it talks to TerriTool |
|---------|---------------------------|
| Browser | Session auth, same controllers/helpers |
| iOS / Android | Same business rules via the v2 JSON API (JWT). v1 is dead. |
| Voice (`accessibility-voice/`, `territool-agent/`) | Spoken commands → same actions; Bible answers from a local index |
| AI agent / MCP | Same actions; writes need confirmation; same credits |

Store listings: Android `com.picwa.territoolapp`, iOS TerriTool App.

## Provider callbacks (not a user screen)

FullEnrich (single and bulk) and RevenueCat subscription changes. They complete work the user already started (buy contacts, pay). Live contact fetch is FullEnrich + Claude only. Keep them aligned with the jobs in module 09 and 12.

## Rules for new work

- Credit math and lead-save must not diverge between clients.
- Do not add a company/contact/route field on one client and omit it on others.
- Webhooks stay unauthenticated to the user but must verify the provider.
- Changing the **active route** payload shape will break the field client; extend, don’t silently rename.

## Code

JSON API: `app/Api/V2/Controllers/*`, `routes/api.php`. Browser: `routes/web.php`. Voice/MCP contract: api-surfaces.md and example-utterances.md.

## Related

**Modules** — 01-Authentication-Onboarding, 03-Company-AddressBook, 04-Contacts, 05-Find-Leads, 07-Routes, 08-Lists, 09-Contact-Enrichment-Credits, 12-Subscription-Payments, 13-CRM-Integrations, 15-Support-Notifications, 19-Cron-Jobs-Webhooks

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for the **API (token clients)** and **MCP servers** sections), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

No screen of its own. This page says which client owns which screen; the screens are on the module pages.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
