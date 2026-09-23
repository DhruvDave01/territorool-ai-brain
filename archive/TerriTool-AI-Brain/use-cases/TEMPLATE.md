---
title: "Use case template"
---

# Use case template

Existing IDs are canonical (`UC-LEAD-01`, …). **Do not invent `UC-001`.** New paths get the next ID in that family.

Copy this into a new `UC-….md` only for high-value traces (credits, routes, MCP). Everyday paths stay in `features/*/use-cases.md`.

Worked examples: [UC-LEAD-save.md](UC-LEAD-save.md), [UC-RTE-create.md](UC-RTE-create.md), [UC-CT-buy.md](UC-CT-buy.md).

```text
Use Case
├── Goal
├── User
├── Preconditions
├── Entry Point
├── Main Flow
├── Alternative Flows
├── UI
├── API
├── Database
├── Expected Result
├── Failure Cases
└── Tests
```

| Field | What to put |
|-------|-------------|
| Goal | One sentence |
| User | Sales Agent / BSA / Business Agent / Admin / Guest |
| Preconditions | Subscription, credits, data |
| Entry Point | URL or MCP tool |
| Main Flow | Numbered user + system steps |
| Alternative Flows | Resume, skip, convert |
| UI | Blade/React route + important controls |
| API | web method and/or v2 / MCP name |
| Database | Tables touched |
| Expected Result | Observable success (credits, row, redirect) |
| Failure Cases | Literal errors from `known-issues.md` if they exist |
| Tests | PHPUnit name or “none — verify with Playwright/MCP” |
