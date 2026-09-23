---
title: "Clients (one product) — use cases"
---

# Clients (one product) — use cases

Part of [18-Clients](MODULE.md). This module is a **contract**, not a screen. UCs are cross-surface checks. Written 2026-09-16 from MODULE.md + Customer MCP QA (user 1822).

### UC-CLIENT-01 Same companies on web and MCP

A company in Address Book is the same `companies.id` MCP `search_companies` / `view_list` / `view_route` return. QA 2026-09-16: MCP listed 19 saved companies; list `L123` (id 558) and route `R123` (id 3850) returned named stops.

### UC-CLIENT-02 Same credit table

Search **0**; save AI lead **1**; FullEnrich **2**; Claude buy **1**. MCP `get_credits` 2026-09-16: `total_credit` 100, `used_credit` 18, subscription not expired. Do not implement a second wallet in Blade.

### UC-CLIENT-03 MCP create_route publishes

Web may Draft. MCP `create_route` lands Published + `route_url`. See [UC-MCP-route.md](../../use-cases/UC-MCP-route.md).

### UC-CLIENT-04 Mobile / voice extras still same data

Active route, next unvisited stop, Navigate Me, offline copy — same `user_routes` / `user_route_companies`. iOS/Android source is **not** in this repo.
