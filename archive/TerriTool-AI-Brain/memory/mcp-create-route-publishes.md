---
title: "MCP Create Route Publishes"
name: mcp-create-route-publishes
description: MCP create_route publishes; web can save Draft — do not mix those behaviors
type: project
---

MCP `create_route` **publishes** (Published tab, not Draft) and returns `route_url`. The web UI can save a Draft. Do not make MCP save Draft, and do not make web always publish, unless product changes the contract.

Why: `features/20-MCP/api-surfaces.md`, ADR-005 (MCP is a client of v2).

How to apply: before `create_route`, ask for start/end/name when the user is in a sales-rep MCP conversation. After it runs, give them `route_url`.
