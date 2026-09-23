---
id: known-bugs
parent: ops
sources:
  - config/app.php
related:
  - 05-constraints-and-drift.md
  - 19-testing-qa.md
  - ops/release-flavor-matrix.md
  - screens/navigation-map.md
---
# Known bugs / gaps / recurring issues

Related: [05-constraints-and-drift](../05-constraints-and-drift.md) · [19-testing-qa](../19-testing-qa.md) · [screens/navigation-map](../screens/navigation-map.md)

Code and QA docs — not a live ticket dump. App UI is the oracle vs MCP.

## MCP / agent (from `docs/MCP-Agent-QA-Playbook.md`)

| ID / theme | Symptom | Current code note |
|------------|---------|-------------------|
| Playbook T1 | No create-company in older session | **Stale.** User MCP has `add_company` now |
| Playbook T2 | No create-contact; agent offered `add_note` | **Stale capability.** Use `add_contact`. Offering a note for a person is still a **behavior bug** |
| T3 paging | `search_companies` `limit: 200` then a second call returned fewer rows | Non-deterministic paging / cap 200. Do not invent a reason |
| T4 bulk vs UI | `find_contacts_bulk` 0 vs UI showing contacts | Bulk is **counts only** and can disagree with saved contacts. Treat UI as oracle |
| Confabulation | Model invented why a tool was empty | Reportable defect — say you don’t know |
| Staging vs live | Same charter, different results | Flag env, not product, until reproduced on both |

## Manager portal vs MCP (`docs/MCP-Manager-Portal-Feature-Gap.md`)

Even with `get_team_dashboard` / `get_team_activity` in config, remaining gaps vs the **portal UI** include: hire/edit/remove salespeople, licenses, invite, support tickets, territory GeoJSON map. Portal assign is `/manager/api/create-leads*`. Manager MCP assign is `save_ai_leads` after `find_ai_leads` — **same** Places-circle engine (`hunt_engine=manager_portal`). ChatGPT drops `view_routes` / `view_lists`.

## Manager MCP contacts (live local 2026-09-18)

| Issue | Evidence |
|--------|----------|
| Bulk FullEnrich `buy_contacts` | Three full FE objects in one `companyContact` array → Laravel Whoops / HTTP 500. One `{redeem_payload}` with `~` succeeded |
| Same shape later 500 | A later paid redeem with the same one-object shape can still Whoops — stop; do not invent a cause |
| `used_credit: 0` | Buy responses can show `used_credit: 0` while contacts land. `get_credits` remaining may not move on local. Report remaining; do not invent a charge |
| Claude secondary | `find_contacts` can return `error_type: provider` “Claude contact finder is not configured.” after empty OC |
| OC weak match | `gemini_no_match` / filing-agent LLC at same address — show names, warn, skip agent LLCs unless asked |

## Mobile / product

| Issue | Evidence |
|--------|----------|
| `search_companies` 200 cap | User MCP config |
| `createOFFLINERoute` unused | No call sites; list still reads blob |
| No mobile route PDF | Email share only |
| Yelp not in mobile config | Web/API only |
| TikTokHelper missing | README/Prompts vs no file |
| HubSpot kind typo | `"Compines"` in `hubspotSyncFlight.js` |
| `stausdetails` typo | `updateuserstatus` FormData key |
| `getIndutriesType` typo | Endpoint path |
| `CompanylController` typo | Extra l |
| `HUBSPOT_CLIENT_SECERET` | Env name typo in `config/app.php` |
| `fetchClaudeContact` aliased as OpenCorporates fetch | `URL_FETCH_OPENCORPORATES_COMPANY = 'fetchClaudeContact'` |
| AI save min 2 leads | `confirmLeadsMinModalVisible` if `< 2` |
| Hermes IANA timezone | `companyActivityPayload.js` catches Invalid time value |
| Version drift | See [release-flavor-matrix.md](release-flavor-matrix.md) |
| Keys in source | Google/Gemini/Mapbox/RevenueCat/Facebook tokens live in JS/plist — rotate if leaked; never paste into this vault |
| `ClusterList` | `navigate("ClusterList")` from `route/index.js` / `navigateToRouteDetail.js` — **no** `Stack.Screen` |
| `Notifications`, `RouteSwipe`, `FilterList`, `FilterRoute` | Registered; no stack `navigate` to those names |
| `CustomCompany` as stack | Embedded only |

## Agent anti-patterns that look like bugs

- Using `add_note` for a person or Gold status.
- `add_company` for AI search hits.
- Treating `createroute` return as published (must poll `route_status`).
- Mixing manager Places-circle results with user V2 `search_id`.
- Confirming User MCP `save_ai_leads` in the same turn as preview.
- Inferring hunt city from `get_team_territories`.
