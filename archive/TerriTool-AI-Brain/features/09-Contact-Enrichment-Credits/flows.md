---
title: "Contact Enrichment Credits — flows"
---

# Contact Enrichment Credits — flows

Part of [09-Contact-Enrichment-Credits](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Credit spend vs free use cases

![Credit spend vs free use cases](flows/png/uc-credit-spend.png)

```mermaid
flowchart TB
  subgraph Free["Free"]
    S[UC-LEAD-01/02 Search leads]
    V[UC-CO-04 View company]
    R[UC-RTE-06 Generate route]
    L[UC-LST-01 Create list]
    N[UC-ACT-01 Add note/activity]
  end
  subgraph Paid["Costs credits"]
    Save[UC-LEAD-05 Save AI leads<br/>1 credit per lead]
    BuyFE[UC-CT-02 FullEnrich fetch<br/>2 credits per contact]
    BuyCL[UC-CT-02 Claude fetch<br/>1 credit per contact]
    Up[UC-BIL-02 Upgrade plan]
    Ad[UC-BIL-03 Credits add-on]
  end
  S --> Save
  Save --> R
  Save --> L
  V --> BuyFE
  V --> BuyCL
  Save -->|not enough| Ad
  BuyFE -->|not enough| Ad
  BuyCL -->|not enough| Ad
  Ad --> Up
```
