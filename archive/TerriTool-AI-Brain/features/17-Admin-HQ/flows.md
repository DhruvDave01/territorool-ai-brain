---
title: "Admin HQ — flows"
---

# Admin HQ — flows

Part of [17-Admin-HQ](MODULE.md). Evidence screenshots exist in [evidence.md](evidence.md) but are not fully UC-mapped. Admin MCP is read-only.

```mermaid
flowchart TD
  Staff[TerriTool Admin] --> HQ[/hq Backpack]
  HQ --> Users[Users / plans / promo / credits]
  HQ --> Biz[Business clients]
  Lookups[Admin MCP] --> Read[Read-only lookups]
  Read -.->|no writes| HQ
```
