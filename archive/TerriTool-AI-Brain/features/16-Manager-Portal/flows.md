---
title: "Manager Portal — flows"
---

# Manager Portal — flows

Part of [16-Manager-Portal](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Manager portal

![Manager portal](flows/png/13-manager-portal.png)

```mermaid
flowchart TD
  Onb[Onboarding: I lead a team] --> Dash[Manager dashboard]
  Dash --> Team[Salespeople CRUD]
  Team --> Invite[Create / resend invitation]
  Team --> Detail[Rep details / routes / companies]
  Dash --> AFL[Manager AI Find Leads]
  AFL --> Assign[Assign or clear assigned leads]
  Dash --> Act[Team activity]
  Dash --> Rep[Reports / territory]
  Dash --> Sup[Support]
  Dash --> Set[Settings]
```
