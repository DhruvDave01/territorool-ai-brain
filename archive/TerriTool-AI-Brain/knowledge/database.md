---
title: "Database"
---

# Database

Live schema (~83 tables, 2026-09-15): [../code/data-model-reference.md](code/data-model-reference.md).

**Do not** use `database/webterritool.sql` (2021, 37 tables). Migrations are sparse — truth is live MySQL + models.

| Concept | Table |
|---------|--------|
| Company | `companies` (`source`: manual / findleads / aileads / yelpleads) |
| Contact | `contacts` |
| Route | `user_routes` (draft / processing / published / failed / publish_pending / continue_edit) |
| List | `user_lists`, `user_list_companies` |
| SA credits | `user_credits` (remaining = total − used) |
| BSA credits | `businessclient_salesagent_credits` |
| Plan | `user_packages` |
| AI search | `user_ai_search` |
| Notes | `company_notes` |
| Visits | `user_visited_companies` |
| Activities | `activities`, `log_meetings` |
| MCP OAuth | `mcp_oauth_*` (not Passport `oauth_*`) |

Connections: default MySQL `territool`; `sales_desk` for Admin MCP; Mongo via Moloquent (prod use UNKNOWN); Redis configured (driver UNKNOWN).

**Out of scope:** `coffee_*`, `bookings`, `booking_*`, `stocks` — unrelated app in the same MySQL. Do not query or migrate.

Local MySQL is often MAMP on port **8889**. That is the **database**, not the app URL. Browser QA is `http://127.0.0.1:8000/login`. Connection refused looks like empty product and makes `ExampleTest` 500 on `/login`.

Deep: [architecture/database.md](architecture/database.md).
