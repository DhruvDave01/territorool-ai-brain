---
id: manager-mcp-how-it-works
parent: screens
sources:
  - webterritool/app/UserMcp/Services/AppMcpProtocolService.php
  - webterritool/app/UserMcp/Services/Tools/LeadsTools.php
  - webterritool/app/UserMcp/Services/Tools/ContactsTools.php
  - webterritool/app/UserMcp/Services/Tools/RoutesTools.php
  - webterritool/app/UserMcp/config/territool_app.php
related:
  - 14-mcp.md
  - features/07-ai-find-leads.md
  - features/12-manager-portal.md
  - screens/web-how-it-works.md
  - 18-cross-system-flows.md
  - ops/known-bugs.md
  - 2026-09-18.md
---
# Manager MCP how it works (assign → route → contacts)

Business Agent MCP `find_ai_leads` uses **manager portal Places circles** (`hunt_engine=manager_portal`), **not** user V2 `getAILeadsV2`. Radius 1.0–10 miles, default 1.0.

Live **Business Agent** User MCP (`{APP_URL}/ai/mcp`, `territool-app` 1.4.1). Trained 2026-09-18 from `webterritool` handlers plus a local-territool-app run. **Do not copy per-rep names, emails, balances, company ids, or route ids into this vault.**

Web cockpit (islands) is a **different assign path** (`/manager/api/create-leads*`). This note is MCP tools only. Call tools directly; never php/curl.

Portal chrome: [web-how-it-works.md](web-how-it-works.md) §2. Catalog: [14-mcp.md](../14-mcp.md).

---

## 0. Who / scope

| Rule | Do this |
|------|---------|
| Roster | `list_team`. Use `user_id` as `salesperson_id`. Skip `is_inactive`. `is_self` is the **manager** |
| Outsiders / inactive | forbidden |
| Named-rep hunt/save/route/list/contacts | pass that `salesperson_id` |
| Whole-team search/lists/routes | omit `salesperson_id` |
| Assign onto manager | only if the user said so. “My sales reps” ≠ manager seat |
| Find MCP | **not** for Business Agent |

`get_team_territories` = inferred coverage circles from saved accounts, **not** assigned polygons. Never treat it (or `view_routes` / `get_team_activity`) as the hunt city.

---

## 1. Bundled ask with no city/type

If they say assign + route + decision-makers and skip where/who:

1. `list_team` only (name **active** reps).
2. Do **not** call `find_ai_leads`, `save_ai_leads`, `create_route`, `find_contacts`, or `buy_contacts` yet.
3. Ask **only**: US city+state or ZIP, business type, which reps (or you-decide by coverage).
4. Do **not** ask start/end/route name or contact scope on that first reply.

City: `Alameda, CA` or `94501`. CA = California, never Canada. A US state alone is invalid (`LeadsTools` + `TerritoryGeocode::isStateOnly`). Misspelled city+state can still geocode (live: “Los Angelese” → Los Angeles, CA). If they already named city, type, and reps, do not re-ask.

---

## 2. Hunt (`find_ai_leads`) — free

Manager actor (`LeadsTools::findAiLeads`): **not** `getAILeadsV2`. Calls `findManagerPortalLeads` — same engine as `/manager/ai-find-leads`. Response `hunt_engine`: `manager_portal`.

| Arg | Rule |
|-----|------|
| `territories` | US city+state or 5-digit ZIP |
| `sell_description` | business type |
| `ai_search_by` | `city` or `zip` |
| `radius_miles` | 1.0–10. **Default 1.0** if they skip |
| `salesperson_id` | dest rep from `list_team` |

Returns `company_list` pins + `geojson` in **this** call. `search_id` for save. Only `resume_ai_lead_search` if `in_progress` is true.

| Field | Meaning |
|-------|---------|
| `search_owner` / hunt `owner_user_id` | **Manager** (hunt storage) |
| `assignment_target` | Who a later save will own (name, email, `salesperson_id`). **Read that aloud** |

Never `add_company` for these pins. Do not mix this `search_id` with classic web V2 `/findleads`.

If they said you-decide / by territory: `recommend_lead_distribution` (`search_id`) is a **proposal only** — show table, wait. Named one rep → do **not** auto-split.

`get_credits` before any save (manager balance pays the 1-credit-each save).

---

## 3. Save (`save_ai_leads`) — 1 credit each, no partial companies

Handler: `LeadsTools::requireSaveConfirmation`.

**First call never saves** (`needs_confirmation: true`). Pass `search_id` + same `salesperson_id`. Omit `limit` for the full hunt. Response: `table`, `lead_count`, `credits_required`, `confirm_token`, `assignment_target`.

Server message: **do not call `save_ai_leads` again in this turn.** Show the list + dest name + credit total. Stop.

After they say yes (a **later** turn): `confirm_all=true`, `confirm_token` copied from preview, **same** `salesperson_id`. Token mismatch / missing token → preview again, still not saved.

Success: `insertedIds`, `assigned_leads` (show that list), `saved_count`, `credits_used`. Then `search_companies` with that `salesperson_id` (and city) to confirm the book.

---

## 4. Route (`create_route`) — publishes

**After** `insertedIds` only. Ask start company, end company, route name. If they skip, omit start/end (MCP picks) and generate a name. If they already named them, do not re-ask.

| Arg | Rule |
|-----|------|
| `company_ids` | comma-separated **saved** ids from `insertedIds` / `search_companies` |
| `start_company_id` / `end_company_id` | must be in that id set (`RoutesTools::pinEndpoints`) |
| `name` | route name |
| `salesperson_id` | same dest rep. Ids must belong to that book or `forbidden` |

Always **basic** (not cluster — jsprit can stick Draft). `finishPublishedRoute` → `route_status` **published** + `route_url`. Give the user that URL. Host follows the MCP request host (local `{APP_URL}` can be `http://localhost:8888/route/view/{id}`).

Do **not** poll `simplerouteview` for MCP `create_route` (unlike mobile `createroute`).

Then ask contacts (next section). Do not hunt contacts before this ask.

---

## 5. Decision-makers (`find_contacts` → `buy_contacts`)

Ask: these new stops, a **named subset**, or skip. Default a few **named new** stops, not the whole hunt. Discovery is free.

`find_contacts` **one company at a time** (`company_id` + `salesperson_id`). `find_contacts_bulk` is counts only.

Waterfall (show whatever returned): FullEnrich (if website) → OpenCorporates officers → Claude if OC empty.

| Observation (live local 2026-09-18) | Do this |
|-------------------------------------|---------|
| OC `gemini_no_match` / wrong LLC at the same address | Show names anyway; warn the match is weak. Skip registered-agent LLCs unless they ask |
| `error_type: provider` “Claude contact finder is not configured.” | No Claude fallback; say none found |
| FullEnrich people | Paid **2** credits each; often have email/phone **after** redeem |
| OC / Claude `is_free` | **1** credit each (`ttfree=…` payload, `=` and **no** `~`) |

`get_credits` (`salesperson_id` = dest book) **before** `buy_contacts`. Quote names + total. Wait.

### `buy_contacts` (`ContactsTools::buyContacts`)

- Required: `company_id` (must be in dest book).
- Paid: `companyContact` array. Free/Claude/OC: `companyFreeContact`.
- Paid `redeem_payload` contains `~`. Free payload contains `=` and not `~` (those get moved to free).
- **Reliable paid shape (live):** one object `{ "redeem_payload": "<tilde string>" }` in `companyContact`. Do **not** dump three full FullEnrich records in one call on local — Laravel **Whoops / 500**.
- More than **25** contacts needs `confirm_all=true` (`BUY_WITHOUT_CONFIRM_MAX`).
- Success can still report `used_credit: 0` while names/emails appear in `data` / `free_contacts`. Re-read `get_credits`; if remaining did not move, say so — do not invent a charge.

Named person the user already knows → `add_contact` (free), not `buy_contacts`, not `add_note`.

---

## 6. End-to-end order (do not reorder)

```
list_team (if city/type/reps missing → ask, stop)
  → get_credits (manager)
  → find_ai_leads (salesperson_id = dest)
  → [recommend_lead_distribution only if you-decide]
  → save_ai_leads preview → STOP this turn
  → save_ai_leads confirm_all + confirm_token + same salesperson_id
  → search_companies (dest) → show assigned_leads
  → ASK start / end / route name
  → create_route (published + route_url)
  → ASK contact scope
  → find_contacts (each chosen company)
  → get_credits (dest) → quote → wait
  → buy_contacts (one paid redeem_payload at a time if local 500s)
```

---

## Do not

- Infer hunt city from coverage circles or last visits.
- Confirm `save_ai_leads` in the **same turn** as preview.
- Save AI pins with `add_company`.
- Mix manager `hunt_engine=manager_portal` with classic `/findleads` V2.
- Treat `/manager/api/territory` as `get_team_territories`.
- Create the route before `insertedIds`.
- Buy contacts before quoting `get_credits`.
