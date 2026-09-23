---
title: "Data model reference"
---

# Data model reference

Superseded on 2026-09-15: MAMP's MySQL came up mid-session, so this is now built from a **live `SHOW TABLES` / `SHOW COLUMNS` read of the actual `territool` database**, not from models or the stale dump. 83 real tables exist. Row counts below are real, taken at read time.

## Read this first: the SQL dump in this repo is still stale — do not use it

`database/webterritool.sql` is dated **4 October 2021** and has only 37 tables. The live database has 83. Confirmed missing from the dump: `user_lists`, `user_list_companies`, `support_ticket`, `user_ai_search`, `user_credits`, `user_contacts_credits`, `businessclient_salesagent_credits`, `user_mcp_connections`, `voice_idempotency`, `user_status`, `user_contact_stage`, `user_company_categories`, and more. **Do not import or trust this dump for anything.** If you need a schema to seed a fresh environment from, dump the live database instead.

## Important: this database is not exclusively TerriTool's data

Live `SHOW TABLES` turned up tables with **no relationship to TerriTool's documented product** — and they're not empty:

| Table | Rows | What it is |
|---|---|---|
| `coffee_orders` | 3,436 | Coffee order records (type, milk, sugar, cup size, location) |
| `coffee_favourites`, `coffee_options` | — | Supporting tables for the same feature |
| `bookings` | 6,002 | Meeting/room booking records (date, time, approval status) |
| `booking_invitees`, `booking_recurring` | — | Supporting tables for the same feature |
| `stocks` | — | Unknown purpose, not investigated further |

These read like an unrelated internal tool (an office coffee-ordering / room-booking app) sharing this same MySQL database and credentials — not a TerriTool feature that's undocumented. **Flag this to whoever owns the database:** sharing one database across unrelated applications means a bug, migration, or credential leak in either app can affect the other's data, and it means any blanket "describe every table" tooling (including an AI agent doing schema discovery) will pull in a second application's data by accident. This pack treats these tables as **out of scope and untouched** — nothing here documents them further, and nothing should query or migrate them as part of TerriTool work.

## Verified live tables, TerriTool-relevant ones only

Grouped by module, with real row counts (2026-09-15) to show which parts of the product actually have production-scale usage vs. almost none:

| Table | Rows | Bible module |
|---|---|---|
| `companies` | 47,121 | 03-Company-AddressBook |
| `contacts` | 26,615 | 04-Contacts |
| `user_routes` | 536 | 07-Routes |
| `user_route_companies`, `user_route_clusters` | — | 07-Routes |
| `user_lists` | 94 | 08-Lists |
| `user_list_companies` | 1,351 | 08-Lists |
| `user_list_route` | — | 08-Lists (list → route conversion) |
| `user_credits` | 2,629 | 09-Contact-Enrichment-Credits (Sales Agent wallet) |
| `businessclient_salesagent_credits` | 269 | 09 / 16 (BSA wallet, manager-allocated) |
| `user_contacts_credits`, `user_contacts_credit_charge` | — | 09 (per-contact ledger) |
| `claude_contact_lookups` | — | 09 (Claude contact-fetch cache/log) |
| `user_packages` | 692 | 12-Subscription-Payments (this is the `Subscription` model's real table — **not** a `subscriptions` table) |
| `packages`, `packages_addons`, `user_package_addons` | — | 12-Subscription-Payments |
| `user_credit_card`, `user_credit_charge` | — | 12-Subscription-Payments |
| `special_discount`, `user_promocode` | — | 17-Admin-HQ |
| `hubspot_mappings`, `hubspot_sync_details`, `google_sheet_sync_failures`, `sfdc` | — | 13-CRM-Integrations |
| `support_ticket` | 155 | 15-Support-Notifications (see the real-data note below) |
| `user_ai_search` | 138 | 05-Find-Leads |
| `user_mcp_connections` | 2 | 14-Settings-Profile (in-app custom MCP connector — bearer token / OAuth fields stored here, treat as sensitive) |
| `voice_idempotency` | 2 | Voice assistant idempotency keys (very new/low usage) |
| `user_status`, `user_contact_stage`, `user_company_categories` | 4,620 / 5,458 / 1,976 | Per-user configurable labels (Settings) — confirms these are genuinely per-user rows, not a fixed enum |
| `activities`, `log_meetings`, `company_notes`, `company_notes_session` | — | Activities/notes (note: real table is `company_notes`, not `notes`) |
| `user_visited_companies` | — | Mark-visited history |
| `user_navigate_me` | — | Navigate Me tracking (manager KPI input) |
| `leads_user` | 48 | Unclear purpose from schema alone — name suggests a lead-capture/waitlist table, not investigated further |
| `mcp_oauth_*` (4 tables), `oauth_*` (4 tables) | — | MCP OAuth (customer MCP) and Passport OAuth (mobile JWT), separate token stores — don't conflate them |
| `user_cities`, `cities`, `countries` | — | Territory assignment / geo reference |
| `user_devices` | — | Push notification tokens |
| `user_companies_old`, `companies_session`, `contacts_session`, `user_companies_session` | — | Legacy/in-progress import state — `user_companies_old` name implies a deprecated table still present, not dropped |

## Key column schemas (live, verified — not guessed)

**`companies`** — `id, user_id, sf_id, hs_object_id, karmacrm_object_id, title, address, city_id, postal_code, latitude, longitude, place_id, website, company_email, phone_number, linkedin_url, instagram_url, facebook_url, employees, company_status, is_visited, visited_at, note, type, source (enum: manual/findleads/aileads/yelpleads), created_at, updated_at, deleted_at, company_status_id, annual_revenue, uc_category_id, is_temp_company, rating, review_count, report_flag`. `source` is the authoritative field for "how did this company get created" — matches [glossary.md](../../product/glossary.md)'s Find Leads vs manual-add distinction exactly.

**`contacts`** — `id, user_id, company_id, cognism_id, sfdc_id, hs_object_id, hs_associated_company_id, contact_name, first_name, last_name, company, position, city_id, email, phone_no, mobile_no, linkedin_url, status, notes, source (enum: manual/cognism/bizapedia/opencorporates/apollo/dataaxle/fullenrich/claude), city, state, created_at, updated_at, deleted_at, contact_status_id, uc_stage_id, report_flag`. The `source` enum still lists `cognism/bizapedia/opencorporates/apollo/dataaxle` as valid values even though [api-surfaces.md](../../features/20-MCP/api-surfaces.md) §5 says those providers are dead — the column accepts them for historical rows; live writes only ever use `fullenrich` or `claude` per the Bible. Don't treat the enum definition as "these are still live providers."

**`user_routes`** — `id, user_id, title, route_type (enum: basic/advanced/basiccluster/regularcluster/smartcluster), file_name, status (enum: draft/processing/published/failed/publish_pending/continue_edit), meta_data, total_distance, total_time, filter_with, resume_page, comp_add_change, is_route_open, created_at, updated_at, is_active, uid`. Note `status` has **two** failure/in-between states (`failed`, `publish_pending`, `continue_edit`) beyond the three the Bible documents (Draft/Processing/Published) — worth a follow-up to confirm what triggers each before an agent relies on route status for logic.

**`user_ai_search`** — `id, user_id, website, city, sell_description, ai_search_by, status, progress, progress_message, error_message, geo_lat, geo_lng, stage2_page_tokens, stage2_raw_places, stage2_geo_points, ideal_prospects, search_result, assigned_leads, created_at, updated_at`. Confirms the multi-stage pipeline persists intermediate state (`stage2_raw_places`, `stage2_geo_points`) — that's how `resume_ai_lead_search` actually resumes.

**`support_ticket`** — `id, support_ticket_id, user_id, title, description, ref_link, image, status (enum: Open/Processing/Completed/''), read_by_admin, read_by_user, created_at, updated_at`. See [operational-notes.md](../../learnings/operational-notes.md) for what the real data in this table actually looks like (short version: mostly QA test noise on this environment, not a usable customer-voice corpus).

**`user_credits`** — `id, user_id, date, total_credit, used_credit, created_at, updated_at, package_credits_applied` — confirms `total_credit`/`used_credit` are real column names, exactly as named in [glossary.md](../../product/glossary.md).

**`businessclient_salesagent_credits`** — same shape as `user_credits` plus `alloted_credits` — this is the field a manager's allocation actually writes to.

## Relationships: mostly manual, not Eloquent

None of the core models (`Company`, `Contacts`, `UserRoute`, `UserList`, `Subscription`, `SupportTicket`, `UserCredit`) define `hasMany`/`belongsTo`/`belongsToMany` methods. Related-record fetches are written as manual queries/joins in controllers and `Helper`, not via `$model->relation()`. Don't assume a relation method exists — check the specific model file, and expect to write the join yourself if it doesn't.

## Conceptual shape (now backed by live row counts)

```
User (Sales Agent / BSA / Business Agent / Admin)
 ├─ companies (47,121 rows) ──┬─ contacts (26,615)
 │                             ├─ company_notes / company_notes_session
 │                             ├─ activities / log_meetings
 │                             └─ user_visited_companies
 ├─ user_lists (94) ── user_list_companies (1,351) ── companies
 ├─ user_routes (536) ── user_route_clusters / user_route_companies ── companies (stops)
 ├─ user_credits (2,629), user_contacts_credits, businessclient_salesagent_credits (269)
 ├─ user_packages (692, = Subscription model), packages, packages_addons
 ├─ user_ai_search (138, one active per user, resumable via stage2_* columns)
 ├─ user_mcp_connections (2), mcp_oauth_* (customer MCP OAuth)
 ├─ hubspot_mappings / hubspot_sync_details / sfdc (CRM sync state)
 └─ support_ticket (155)
```

`app/Models/MongoDB/` exists as a separate subfolder — confirms [TerriTool_OverView.md](../../product/TerriTool_OverView.md)'s claim that MongoDB is used for geographic data alongside MySQL; not covered by this table list.

## What's still not verified

Foreign key constraints, indexes, and full `mcp_oauth_*`/`oauth_*` column detail weren't pulled this pass — this file covers the tables an agent is most likely to touch for product features. Re-run `SHOW CREATE TABLE` on a specific table before writing a migration against it.
