---
title: "MCP — limits"
---

# MCP — limits

Part of [20-MCP](MODULE.md). Verbatim from the former `07-Operational-Reference/limits-and-performance.md` (verified against code 2026-09-15; split 2026-09-16). Real numbers from code, not estimates. Other features' limits: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## MCP / catalog

| Rule | Value | Source |
|---|---|---|
| ChatGPT tool budget | ChatGPT keeps roughly **16 tools**; Claude/Cursor get the full catalog | [api-surfaces.md](api-surfaces.md) §1 |
| `save_ai_leads` confirm | Always two calls: preview (no `confirm_all`), then `confirm_all=true` + `confirm_token` copied from the preview response | `app/UserMcp/config/territool_app.php` |
| MCP status codes | `status: 1` = ok, `status: 0` or `2` = fail (some legacy note/activity endpoints return `status: 0` with a success message — MCP normalizes this before it reaches the agent) | [api-surfaces.md](api-surfaces.md) §4 |
