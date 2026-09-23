---
title: "Product-level flows"
---

# Product-level flows

End-to-end map, role split and the use-case overview diagrams. Feature-level flows live beside each module in `features/<module>/flows.md`; the index is in [features/README.md](../features/README.md) and [../ui-flows/README.md](../ui-flows/README.md).

Mermaid source copies: `../ui-flows/source/product/`. Rendered PNGs: [flows/png/](flows/png/).

## End-to-end product map

![End-to-end product map](flows/png/00-end-to-end-product-map.png)

```mermaid
flowchart TD
  Guest[Guest] --> Auth{Has account?}
  Auth -->|No| Trial[Create account / 7-day trial]
  Auth -->|Yes| Login[Login]
  Trial --> Onb[Onboarding]
  Login --> OnbCheck{Onboarding done?}
  OnbCheck -->|No| Onb
  OnbCheck -->|Yes| Role
  Onb --> Role{Role}
  Role -->|Field rep| Home[Home dashboard]
  Role -->|Manager| Mgr[Manager portal]
  Home --> Leads[AI Find Leads]
  Home --> AB[Address Book]
  Home --> Routes[Routes]
  Home --> Lists[Lists]
  Home --> Upload[Upload Excel/CSV]
  Home --> Settings[Settings / CRM / MCP]
  Home --> Bill[Upgrade / Credits]
  Home --> Support[Support ticket]
  Leads -->|1 credit per save| Companies[Saved companies]
  Companies --> Routes
  Companies --> Lists
  Lists -->|Convert / Generate| Routes
  Routes -->|Publish| Field[Mobile app in the field]
```

## Role split after onboarding

![Role split after onboarding](flows/png/15-role-split.png)

```mermaid
flowchart LR
  Onb[Which one's you?] --> Field[I'm in the field]
  Onb --> Lead[I lead a team]
  Field --> FApp[Home / Find Leads / Routes / Lists]
  Lead --> MApp[Manager dashboard / team / assign leads]
  Onb --> B2B[Businesses B2B]
  Onb --> Res[Homeowners Residential]
  B2B --> FApp
  Res --> FApp
```

## TerriTool actors

![TerriTool actors](flows/png/uc-actors.png)

```mermaid
flowchart LR
  Guest[Guest<br/>login / trial / forgot password]
  Field[Field Rep<br/>Home, Find Leads, Routes, Lists]
  Mgr[Manager<br/>team dashboard, assign leads]
  Admin[Admin<br/>promocodes, subscriptions]
  Mcp[MCP Agent<br/>Claude / ChatGPT tools]
  Guest -->|creates account| Field
  Guest -->|I lead a team| Mgr
  Field -->|MCP connector| Mcp
  Mgr -->|invites| Field
  Admin -->|credits / trial| Field
```

## Field-rep use case catalog

![Field-rep use case catalog](flows/png/uc-field-rep-catalog.png)

```mermaid
flowchart TB
  subgraph Auth["Auth"]
    A1[UC-AUTH-01 Sign in]
    A2[UC-AUTH-02 Trial]
    A3[UC-AUTH-03 Forgot password]
  end
  subgraph Onb["Onboarding"]
    O1[UC-ONB-01 Goals]
    O2[UC-ONB-02 Role]
    O3[UC-ONB-03 B2B vs homeowners]
  end
  subgraph Leads["AI Find Leads"]
    L1[UC-LEAD-01 Search Multiple]
    L5[UC-LEAD-05 Save 1 cr each]
    L6[UC-LEAD-06 New/existing route]
    L8[UC-LEAD-08 New/existing list]
  end
  subgraph Routes["Routes"]
    R2[UC-RTE-02 Select companies]
    R5[UC-RTE-05 Save draft]
    R6[UC-RTE-06 Generate]
    R7[UC-RTE-07 Work published]
  end
  subgraph Lists["Lists"]
    S1[UC-LST-01 Create]
    S6[UC-LST-06 Send / CSV / map]
    S8[UC-LST-08 Convert to route]
  end
  subgraph Co["Companies and contacts"]
    C1[UC-CO-01 Address Book]
    C4[UC-CO-04 Profile]
    T1[UC-CT-01/02 Fetch contacts<br/>FE 2cr / Claude 1cr]
    T3[UC-CT-03 Create contact]
    N1[UC-ACT-01 Add activity]
  end
  Auth --> Onb --> Leads
  Leads --> Routes
  Leads --> Lists
  Lists --> Routes
  Leads --> Co
```

## Field-rep happy path use cases (captured 15 Sep 2026)

![Field-rep happy path use cases (captured 15 Sep 2026)](flows/png/uc-happy-path.png)

```mermaid
flowchart TD
  A[UC-AUTH-02 Create 7-day trial<br/>60 credits, no card] --> B[UC-ONB-01 Goals]
  B --> C[UC-ONB-02 I'm in the field]
  C --> D[UC-ONB-03 Sell to Businesses B2B]
  D --> E[UC-LEAD-01 Search Multiple<br/>Los Angeles + restaurants]
  E --> F[UC-LEAD-05 Save leads<br/>1 credit each]
  F --> G[UC-LEAD-06 Create route R123]
  G --> H[UC-RTE-06 Generate start/end]
  H --> I[UC-RTE-07 View published route]
  F --> J[UC-LEAD-08 Create list L123]
  J --> K[UC-LST-07 View list / convert to route]
  F --> L[UC-CO-04 Company profile]
  L --> M[UC-CT-03 Create contact]
  L --> N[UC-ACT-01 Add activity]
  L --> O[UC-SET-03 Add MCP connector]
  O --> P[UC-BIL-01 Subscription history]
  P --> Q[UC-SUP-01 Support ticket]
```

## Rules these diagrams encode

1. Search AI leads is free; **save costs 1 credit per lead**.
2. After save, next action is new/existing **route**, new/existing **list**, dashboard, or find more.
3. Routes have **Draft** vs **Published**. Generate requires start/end (or MCP auto-tour).
4. Lists are unordered until **Convert / Generate Route**.
5. Buy/fetch contacts is **not free**: FullEnrich **2** credits, Claude **1** credit. Never `add_company` for AI search hits — use `save_ai_leads`.
6. MCP Chat/Sync asks before Fetch/Send/Update. Blocked if not connected.
