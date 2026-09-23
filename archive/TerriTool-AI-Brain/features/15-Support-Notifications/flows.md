---
title: "Support Notifications — flows"
---

# Support Notifications — flows

Part of [15-Support-Notifications](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Support

![Support](flows/png/11-support.png)

```mermaid
flowchart TD
  Bug[Report Bug] --> Form[Title + description + optional image]
  Form --> Valid{Title and description filled?}
  Valid -->|No| Form
  Valid -->|Yes| Add[Add ticket]
  Add --> Inbox[Support list]
  Inbox --> View[View / reply]
```
