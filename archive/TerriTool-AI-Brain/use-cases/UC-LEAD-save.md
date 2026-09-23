---
title: "UC-LEAD — Save AI leads (engineering trace)"
---

# UC-LEAD — Save AI leads (engineering trace)

**Product IDs:** UC-LEAD-* (save path). Full prose: `features/05-Find-Leads/use-cases.md`.  
**UI flow:** [FLOW-FIND-LEADS](../ui-flows/README.md#flow-find-leads).

## User Goal

The sales rep wants to keep prospects that match a target profile in the Address Book so they can route, list, and visit them later.

## Preconditions

- Authenticated Sales Agent or BSA, typically with active subscription
- Enough credits (1 per company saved)
- An AI search has returned candidates (search itself is free)

## Happy Path

1. Rep opens Find Leads and describes territory + what they sell (or MCP `find_ai_leads`).
2. System runs staged search (Gemini planner → Places → refine). Progress in `user_ai_search`.
3. Rep selects companies and saves (web `saveAILeads` / MCP `save_ai_leads` with preview then confirm).
4. Each saved company costs **1** credit and appears in Address Book with `source` aileads (or equivalent).

## Alternative Paths

- Resume in-progress search (`resume_ai_lead_search` / `resumeSearch`)
- Yelp save path if enabled (separate from Gemini)
- Manager assigns leads to a salesperson (`ManagerFindLeadsService`) — still credit-bearing

## Failure Modes

| Message / symptom | Source |
|-------------------|--------|
| `Insufficient credits, please subscribe to add credits.` | SA save when `used + count > total` or no `user_credits` row (`Helper::saveAILead`) |
| `Insufficient credits, please contact to manager.` | BSA wallet check (same helper) — **not** the SA string |
| Trial package id **1** selecting **>60** leads | `You have selected more than 60 leads...` |
| SA with **no** enabled `user_packages` row | helper `return;` with **no JSON** (bare return) — likely a blank/500-ish client failure; UNKNOWN exact UI |
| `This search has failed and cannot be resumed.` | resume on terminal failure |
| `Strategy not found` | expired stage 1 |
| Empty Places / geocode | `Please enter a precise address.` |

`Helper::saveAILead` accepts `$options['skipCreditBilling']` for callers that already billed — do not use it to make a user-facing save free.

## Expected Result

- Credit used += number saved
- Rows in `companies` owned by the user
- Same companies visible on web, mobile, MCP `search_companies`
- Search remaining free

## UI

- `/findleads` legacy Blade (large template)
- Manager: `AIFindLeads.jsx` / `AIFindLeadsPage.jsx` (assign flow)

## API

- Web: `POST saveAILeads` → `CompanylController@saveAILeads`; stages under `/ai-lead-finder/*`
- `AILeadFinderController@saveLeads` → `Helper::saveAILead`
- v2: `POST getAILeadsV2`, `POST saveAILeads`
- MCP: `find_ai_leads` → `getAILeadsV2`; `save_ai_leads` → preview + `saveAILeads`

## Code

- `app/Http/Controllers/AILeadFinderController.php`
- `app/Helpers/helpers.php` — `Helper::saveAILead`
- `app/Api/V2/Controllers/CompanyController.php` — `saveAILeads`, `getAILeadsV2`
- `app/UserMcp/Services/Tools/LeadsTools.php`
- `app/Services/Manager/ManagerFindLeadsService.php`

## Tests

- `tests/ManagerFindLeadsServiceTest.php` (manager helpers only)
- No PHPUnit for `Helper::saveAILead` / v2 save

## Verification

1. Note credit balance (`get_credits` or UI badge).
2. Run a small search (or MCP find).
3. Save 1 company; confirm balance −1; Address Book shows it.
4. Console/network: save endpoint 200; no silent 0-credit save.

Limits: `../features/05-Find-Leads/limits.md`.
