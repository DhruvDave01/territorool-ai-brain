---
title: "CRM Integrations — use cases"
---

# CRM Integrations — use cases

Part of [13-CRM-Integrations](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

See also: [14-Settings-Profile](../14-Settings-Profile/use-cases.md), [20-MCP](../20-MCP/use-cases.md)

## 10. Settings, CRM, MCP

### UC-SET-02 Connect Salesforce / HubSpot / Karma CRM

Header links on Settings. Salesforce OAuth + sync / disconnect. HubSpot API key + field mapping. Karma CRM API key. Sync companies, contacts, or both.

### UC-SET-03 Add custom MCP connector

Name + remote MCP HTTPS URL. Optional advanced Client ID / Client Secret. Only connect MCPs you trust.

Evidence: 11:09:14

### UC-SET-04 MCP Chat

Connect a saved MCP, pick Fetch (into TerriTool), Send (out), or Update (both). Chat asks before anything runs. Blocked if “not connected”.

Evidence: 11:09:24

### UC-SET-05 MCP Sync

Choose connected MCP, action (Send/Fetch/Update), records (Companies and contacts) → Start.

Evidence: 11:09:35
