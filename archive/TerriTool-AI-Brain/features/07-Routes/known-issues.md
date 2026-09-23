---
title: "Routes — known issues and error messages"
---

# Routes — known issues and error messages

Part of [07-Routes](MODULE.md). Verbatim from the former `07-Operational-Reference/known-issues-and-error-messages.md` (literal strings from the controllers, verified 2026-09-15; split 2026-09-16). Use these when you need the exact string the backend returns. Cross-feature and system-level entries: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## Route generation

| Situation | What actually happens | What to tell the user |
|---|---|---|
| Route create attempted with 1 company | Rejected — route requires **at least 2** companies (see [limits-and-performance.md](limits.md)) | Ask for at least one more stop, or suggest adding it as a company/list item instead of a route. |
| Route is `Processing` | UI/API blocks edits while the optimizer runs | Tell the user to wait for Published before editing stops. |
| No active route when asking "what's next" | `next_waypoint` has nothing to return | They need to set a **Published** route as active first (see [api-surfaces.md](../20-MCP/api-surfaces.md) §4). |
| Published route list and detail disagree | Local browser QA 2026-09-16: route `Top 25` was listed with 25 companies but its detail view remained at **0 total stops** after settling, despite non-zero distance/time | Treat route stops as unreliable until the grid endpoint and `view_basic_route` data hydration are investigated. See [authenticated smoke QA](../../validation/qa-authenticated-smoke-2026-09-16.md). |
