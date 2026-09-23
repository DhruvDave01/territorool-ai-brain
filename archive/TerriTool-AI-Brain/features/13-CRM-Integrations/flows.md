---
title: "CRM Integrations — flows"
---

# CRM Integrations — flows

Part of [13-CRM-Integrations](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Settings / MCP / CRM

![Settings / MCP / CRM](flows/png/09-settings-mcp-crm.png)

```mermaid
flowchart TD
  Set[Settings] --> Profile[Edit profile + status colors]
  Set --> CRM{Connect CRM}
  CRM --> SF[Salesforce OAuth sync]
  CRM --> HS[HubSpot API key + mapping]
  CRM --> Karma[Karma CRM API key]
  Set --> MCPConn[Add custom MCP: name + HTTPS URL]
  MCPConn --> List[Connected MCPs]
  Set --> Chat[MCP Chat]
  Chat --> Conn{Connected?}
  Conn -->|No| Block[not connected]
  Conn -->|Yes| Verb{Fetch / Send / Update}
  Verb --> Ask[Ask before run]
  Set --> Sync[MCP Sync form]
  Sync --> Start[Start with record type]
  Set --> Sub[View Invoice / Upgrade]
```
