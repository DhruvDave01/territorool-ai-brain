---
title: "Database"
---

# Database

**Live schema (2026-09-15):** [data-model-reference.md](../code/data-model-reference.md)

Do **not** use `database/webterritool.sql` (2021, 37 tables vs ~83 live).

## Connections

| Connection | Use |
|------------|-----|
| `mysql` (default) | Product |
| `sales_desk` | Admin MCP / Sales Desk |
| `mongodb` | Moloquent geo (`app/Models/MongoDB/*`) — production use **UNKNOWN** |
| `redis` | Configured — driver actually used **UNKNOWN** |

## Core tables (engineering)

| Concept | Table | Notes |
|---------|-------|-------|
| Company | `companies` | `source` enum; soft deletes |
| Contact | `contacts` | `source` enum includes dead providers historically |
| Route | `user_routes` | status: `draft/processing/published/failed/publish_pending/continue_edit` |
| Route stops | `user_route_companies` | |
| List | `user_lists`, `user_list_companies` | |
| Credits (SA) | `user_credits` | remaining = total − used |
| Credits (BSA) | `businessclient_salesagent_credits` | `alloted_credits` |
| Plan | `user_packages` | Subscription model |
| AI search | `user_ai_search` | stage columns for resume |
| Notes | `company_notes` | |
| Visits | `user_visited_companies` | |
| Activities | `activities`, `log_meetings` | both exist |
| MCP OAuth | `mcp_oauth_*` | Distinct from Passport `oauth_*` |
| Labels | `user_status`, `user_contact_stage`, `user_company_categories` | per-user |

## Out of scope

`coffee_*`, `bookings`, `booking_*`, `stocks` — unrelated app sharing this MySQL. Do not query, migrate, or document as TerriTool.

## Eloquent relationships

Core models generally **do not** define `hasMany`/`belongsTo`. Expect manual joins in controllers and Helper (`data-model-reference.md`).

## Migrations

`database/migrations/` is **sparse** (legacy + some MCP tables). Schema truth is live MySQL + models, not the migrations folder.
