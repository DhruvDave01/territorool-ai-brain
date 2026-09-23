---
title: "Business Team — flows"
---

# Business Team — flows

Part of [21-Business-Team](MODULE.md). Newer cockpit: [16-Manager-Portal](../16-Manager-Portal/flows.md).

```mermaid
flowchart TD
  BA[Business Agent] --> List[/businesssalesperson]
  List --> Invite[Create + email]
  Invite --> Mail[Activation link]
  Mail --> Act[/businesssalesperson/activate/id]
  Act --> BSA[Business Sales Agent]
  List --> Credit[Allocate credits]
  List --> Detail[Rep notes / contacts / routes]
  NewUX[New work] --> M16[/manager React]
```
