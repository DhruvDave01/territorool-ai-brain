---
title: "Customer MCP Not In Cursor MCP"
name: customer-mcp-not-in-cursor-mcp
description: Customer/Find/Admin MCP are not in .cursor/mcp.json — Cursor only wires Sentry + Playwright
type: project
---

`.cursor/mcp.json` has Sentry and Playwright only. Field-rep Customer MCP (`{APP_URL}/ai/mcp`), Find MCP, and Admin MCP are Laravel HTTP OAuth servers. They may appear as session namespaces (`user-territool-app`) when connected, but they are not project-wired in Cursor.

Why: `cursor-exit.md`, `.cursor/mcp.json`.

How to apply: do not fake Customer MCP tool results in Cursor. Use code + Playwright + artisan, or connect OAuth to a running app. Claude Code should point connectors at `{APP_URL}/ai/mcp`.
