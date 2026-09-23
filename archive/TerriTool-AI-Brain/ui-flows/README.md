---
title: "UI flow inventory"
---

# UI flow inventory

**Diagrams:** [product/FLOWS.md](../product/FLOWS.md) and each `features/*/flows.md` (index: [features/README.md](../features/README.md)).  
This page is the **executable** map: starting point, states, APIs, how an agent verifies. New or redesigned screens: fill [SCREEN-SPEC.md](SCREEN-SPEC.md) first. QA of a named flow: [../loops/qa-loop.md](../loops/qa-loop.md).

Stack reminder: flows except FLOW-MANAGER are **Blade/jQuery**. FLOW-MANAGER is **React**.

Global chrome (authenticated): Upgrade, Credits badge, store badges, Report Bug, Logout, sidebar.

Permissions: session + `subscriber` + role. MCP flows use OAuth, not this chrome.

---

## End-to-end (actual, from FLOWS.md)

```
Guest → trial/login → onboarding (field vs manager)
  → Home
    → Find Leads (search free → save 1 cr) → Address Book
    → Lists / Routes (list → convert to route)
    → Company profile → contacts / activities / visit
    → Settings (CRM / MCP connector) → billing → support
  Manager fork → Manager Portal (assign leads, team)
```

---

## FLOW-AUTH

| Step | User action | UI state | API | Result |
|------|-------------|----------|-----|--------|
| 1 | Open `/` or `/login` | Login form | — | Guest |
| 2 | Submit credentials | Loading submit | session login | Cookie set |
| 3 | Success | Redirect | — | Role home |
| Error | Bad password | Form error | — | Stay on login |
| Alt | `/trial` | Signup | register | Onboarding |

**Known noise:** Playwright logs recorded `ReferenceError: AuthUser is not defined` on `/login` — treat as a real candidate bug ([../learnings/recurring-bugs.md](../learnings/recurring-bugs.md)).

Verify: login as SA → `/dashboard`; as manager → `/manager/dashboard`.

---

## FLOW-ONB {#flow-onb}

Starting point: post-register.  
User action: “I’m in the field” vs “I lead a team”; B2B vs residential.  
Result: role + home.  
Code: `PostRegistrationOnboardingController`.

---

## FLOW-HOME

`/dashboard` → `HomeController` → `front.dashboard`.  
Paywall if SA has no plan (bible).  
Empty: dashboard with no companies — **UNKNOWN exact empty copy** (see evidence).

---

## FLOW-FIND-LEADS {#flow-find-leads}

```
/findleads
  → enter territory + sell description
  → POST startSearch / stages (runStage1, runStage2Page, runStage3, completeSearch)
  → loading: progress_message on user_ai_search
  → results list
  → select + save (1 credit each)
  → companies in Address Book
```

Resume: `resumeSearch` / MCP `resume_ai_lead_search`.  
Error states: failed search, strategy missing, zip too long.  
MCP parallel: `find_ai_leads` (no UI) then `save_ai_leads` confirm.

Verify: network tab shows stage calls; save hits `saveAILeads` or `Helper::saveAILead`; credits decrement.

---

## FLOW-AB (Address Book)

`/company` list (jqxGrid) → `/company/{id}/view` profile → notes / contacts / activities / status / map.  
Add company: Places autocomplete → create (`source=manual`).  
Empty: no companies.  
Loading: grid fetch.  
Related: `/recent-company`, `/company/viewmap`.

---

## FLOW-CONTACTS

From company profile or bulk: find (0 cr) → select → buy (2 or 1) → contact saved.  
Async bulk: progress poll (`buyContactsJobProgress`). Need queue worker.

---

## FLOW-LIST

`/lists` → create → add companies → optional generate route.  
Empty: no lists.  
List is not driving order until FLOW-ROUTE.

---

## FLOW-ROUTE {#flow-route}

```
/routes (tabs: draft / processing / published — plus extra DB statuses)
  → wizard / from list / lasso
  → processing
  → map view
  → mark visited → next waypoint
  → share / PDF / CSV
```

MCP: skip draft; land on published `route_url`.

---

## FLOW-FIELD (visit day)

Active route → navigate (mobile deep link **UNKNOWN** exact scheme) → mark visited → log activity → next waypoint.

MCP: `get_active_route` → `next_waypoint` → `mark_visited` → `add_activity`.

---

## FLOW-UPLOAD

CSV import → error repair list → success. Unfinished import shows “companies with errors” in nav (bible).

---

## FLOW-BILLING

Upgrade / credits add-on / invoices. Stripe vs PayPal vs RevenueCat. SA unpaid → checkout before dashboard/find leads.

---

## FLOW-SETTINGS

Profile, status colors, CRM connect (HubSpot/SFDC/Karma), **in-app MCP client** (`/salesperson/mcp/*`) — not UserMcp server.

---

## FLOW-SUPPORT

Report Bug / tickets. `SupportController`. Table `support_ticket` (noisy QA data locally).

---

## FLOW-MANAGER {#flow-manager}

```
/manager/dashboard (React)
  → Salespeople / AI Find Leads / Activity / Support / Settings
  → /manager/api/* JSON
```

Loading: React state. Empty team: salesperson list empty.  
Build step required after JSX edits.

---

## FLOW-HQ

`/hq` Backpack CRUD. Admin MCP is read-only subset.

---

## FLOW-MCP {#flow-mcp}

OAuth consent (`app/UserMcp` oauth views) → tools.  
No sidebar. Evidence of success = tool JSON + side effects visible in web UI.

ChatGPT: 16 tools only.

---

## FLOW-MAPS

Map views share `front.company.viewmap`. From Address Book / list / route / create wizard (lasso). UCs: [../features/11-Maps/use-cases.md](../features/11-Maps/use-cases.md).

---

## FLOW-CRON

Not a click journey. Queue + HTTP cron + provider webhooks. UCs: [../features/19-Cron-Jobs-Webhooks/use-cases.md](../features/19-Cron-Jobs-Webhooks/use-cases.md).

---

## FLOW-TEAM

Legacy `/businesssalesperson/*` (invite activation is public). New UX is FLOW-MANAGER. UCs: [../features/21-Business-Team/use-cases.md](../features/21-Business-Team/use-cases.md).

---

## Agent verification kit (all flows)

| Need | Tool |
|------|------|
| See the screen | Playwright MCP or browser |
| See API | Playwright network / browser network |
| See credits/companies | Customer MCP `get_credits` `search_companies` **or** UI |
| Manager JS | `npm run build` then hard refresh |
| Queue jobs | `npm run queue` |

Staging screenshots: each feature `evidence/` folder. Unassigned + video: [../evidence/README.md](../evidence/README.md).
