---
id: how-it-works
parent: screens
sources:
  - login/index.js
  - findLeads/aiFindLeads.js
  - customcompany/index.js
  - list/create/select-start-end-points.js
related:
  - screens/navigation-map.md
  - code/mobile-code-details.md
  - data/formdata-dictionary.md
  - 18-cross-system-flows.md
  - design/04-User-Flows/README.md
---
# Per-screen how it works

Related: [navigation-map](navigation-map.md) · [code/mobile-code-details](../code/mobile-code-details.md) · [data/formdata-dictionary.md](../data/formdata-dictionary.md) · [18-cross-system-flows](../18-cross-system-flows.md) · visual flows in [design/04-User-Flows](../design/04-User-Flows/README.md)

Lifecycle details agents still guess. Source: live JS, not Prompts. Screen-to-screen map: [navigation-map.md](navigation-map.md).

## Rep happy path (AI → route → company → contacts)

| Step | Screen | User | API / result |
|------|--------|------|----------------|
| 1 | Dashboard or footer Find Leads | Open hunt | Expired sub may gate; dashboard region US/IN/NZ/AU |
| 2 | `MultipleAIWaypoint` (`aiFindLeads.js`) | City/ZIP + ideal customer → Search | `getusercredit`; `getAILeadsV2` → poll `resumeAILeadSearch` |
| 3 | Same | Select **≥ 2** leads → Next → Confirm Leads | `saveAILeads` — **1 credit each**. Min 2 (`confirmLeadsMinModalVisible`) |
| 4a | Post-save modal | Add to a **route** (create or existing) | `CreateRoute` / edit path |
| 4b | Post-save modal | Add to a **list** | `CreateLists` / Lists |
| 4c | Post-save modal | Return to Dashboard | Address Book only |
| 5 | `CreateRoute` → `SelectStartEndPoints` | Name, ≥2 waypoints, start ≠ end | `checkroutename` optional |
| 6 | `PublishRoute` | Auto on mount | `createroute` → poll `simplerouteview` until `route_status === "published"` |
| 7 | `BasicRouteDetail` | Tap company or Map | `simplerouteview`; map → `ActiveRouteMap` → `WaypointDetail` |
| 8 | `CompanyView` / `ViewCompany` / `WaypointDetail` | Shared `CustomCompany` | `companydetail` / `getactiveroutecompany`, `companycontactlist`, `getcompanyactivities` |
| 9 | Find Contacts | Primary then Claude/biz | `fetchAllContacts` free; empty → `fetchClaudeContact` → `bizContacts`. Buy: **2** paid / **1** Claude. Manual: `ContactsCreate` / `addcontact` free |
| 10 | Activity / Mark | Log or visit | `addcompanyactivity`; visit `companymarkedvisited` + `addcompanyvisittime`; unmark `companyvisitremove` |

**Onboarding:** Register/Login skips the post-save modal; AI screen goes straight to `CreateRoute` with `firstSignUpOnboarding`. Completes in `PublishRoute` via `setFirstSignUpOnboardingComplete()`.

**Not AI:** Lists/Routes **Find Leads** open `MultipleWaypoint` (`findLeads/index.js`) — Places, not `getAILeadsV2`.

```
Dashboard → MultipleAIWaypoint → save ≥2
  → CreateRoute → SelectStartEndPoints → PublishRoute → BasicRouteDetail
  → CompanyView (CustomCompany) → CongContact / bizContacts
  → activity / mark visited → next stop or ActiveRouteMap
```

List-first branch: post-save → list → `SelectStartEndPointsList` → `PublishRoute` (`generateroute` or `createroute`).

## Login (`login/index.js`)

1. User submits email/password.
2. FormData: `email`, `password`, `device_token`, `device_type` → `POST login`.
3. On success: `createJWTToken("1", …)` in Realm; seed `createTour("1")` and `createAIFindLeads("1")`.
4. RevenueCat `identifyUser` `{userId}_{email}`.
5. `getusercredit` / free-trial → `SubscriptionGate` **or** first-signup onboarding **or** `Dashboard`.
6. Forgot: modal `forgotPassword` with `email`; web link `{URL_BASE.split("index")[0]}password/reset`.
7. 401/403 anywhere → `API.js` session expired → logout modal.

## Publish route (`route/create/publish-route.js`)

`createroute` is **async**. The UI polls until published.

1. Build ordered company IDs (start, middles, end). GPS start only if start company id is `0`.
2. `POST createroute` with `route_name`, `company_id_csv`, `resume_page=simpleroute/step1`, `routetype`, optional `latitude`/`longitude`, `filter_with`.
3. If `status == 1`, keep loader; store `route_id`.
4. After **2s**, `checkingStatus`: `POST simplerouteview` with `page=0`, `route_id`, empty lat/lng.
5. If `data.data.route_status === "published"` → auto-navigate to route detail (unless user already left).
6. Else `setTimeout` **2s** and poll again.
7. `callMakeRouteActive` can `POST updaterouteactive` with `route_id`, then poll again.

Failure copy: “Generating Route Failed!!” / network. Do not treat `createroute` success as “ready to drive.”

## AI Find Leads V2 (`findLeads/aiFindLeads.js`)

1. Require territory (city or ZIP) + `sell_description`.
2. `POST getAILeadsV2` via `buildAiFormData({ ai_search_by, territories, sell_description, top50? })`. Booleans become `"true"`/`"false"` strings.
3. Read `search_id` and `strategy.needs_refinement` (drives a 60s countdown UI).
4. If `search_id`: `POST resumeAILeadSearch` with `{ search_id }`. Company list is `response.data.company_list` (deduped by Map).
5. Cache in Realm `AIFindLeads`.
6. Save: each selected lead as `companies_data[]` JSON → `POST saveAILeads`. Needs **≥ 2** selected (`confirmLeadsMinModalVisible`).
7. `status == 1` with empty `insertedCompanyData` → toast that data could not be verified.

## Find contacts (`customcompany` + `FindContactsFetchModal`)

1. Free discovery: `fetchAllContacts` with `company_id`, `domain`, `address`, `name`, `position`, `location`, `fullenrich_page`, `dataaxle_page`.
2. Pagination: `lastReturnedKey` + `contact_count=true` + `domain` for Apollo-style paging.
3. Rows vs total: `fetchFirstContactApi.js` supports both `{ data: [] }` and nested `{ data: { data: [] } }`.
4. Buy: `buyContacts` / redeem endpoints — **2** paid / **1** Claude. Confirm credits first.

## Mark visited / bookmark (`customcompany/index.js`)

- Visit time: `company_id`, `visit_time`, `route_id`, `flag`.
- Remove visit: `id` (visit id), `company_id`, plus `list_id` **or** `route_id`.
- Bookmark: `user_company_id`, `add` boolean, optional `list_id`/`route_id`.

## List → route (`list/create/select-start-end-points.js`)

`generateroute`: `list_id`, `start_point`, `end_point`, optional GPS if start is `0`.

## HubSpot sync (`hubspotSyncFlight.js`)

Only **one** companies/contacts/both sync at a time (`inflightPromise`). Kind labels: `"Compines"` (typo in code), `"Contact"`, `"Both"`. Network error → wait for reachability and retry once. Overlap shows toast “HubSpot sync already in progress”.

## Subscription gate (`subscriptionGate.js`)

`GET getusercredit`. `free_trial_status` classified active/inactive/unknown from several payload shapes. Only **explicit inactive** should gate. Also reads `is_subscription_expired`.

## Web AI SSE (`AILeadFinderController`)

`POST /ai-lead-finder/start` then `stage1` (Gemini) → `stage2` (Places pages) → `stage3` (optional refine) → `complete`. Browser `GET status`. Persist `user_ai_search`. Manager portal uses a **different** Places-circle engine.

## MCP `save_ai_leads`

First call is always **preview** (no write). After user yes: `confirm_all=true` + `confirm_token`. Never `add_company` for these hits.
