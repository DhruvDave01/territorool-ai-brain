---
title: "Bulk Upload — flows"
---

# Bulk Upload — flows

Part of [10-Bulk-Upload](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Upload Excel / CSV

![Upload Excel / CSV](flows/png/12-upload-excel-csv.png)

```mermaid
flowchart TD
  Dash[Home: Upload Excel/CSV] --> Kind{Companies or contacts}
  Kind --> S1[Step 1 upload file]
  S1 --> S2[Step 2 map columns / preview]
  S2 --> S3[Step 3 validate]
  S3 --> Err{Errors?}
  Err -->|Yes| Fix[Autofill address / merge / drop duplicates]
  Fix --> S3
  Err -->|No| S4[Step 4 commit]
  S4 --> SF{Push to Salesforce?}
  SF -->|Yes| Sfdc[step4sfdc]
  SF -->|No| Done[Companies/contacts in Address Book]
```
