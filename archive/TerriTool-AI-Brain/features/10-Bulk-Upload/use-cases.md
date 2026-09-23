---
title: "Bulk Upload — use cases"
---

# Bulk Upload — use cases

Part of [10-Bulk-Upload](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence: [evidence.md](evidence.md).

## 13. Upload Excel / CSV

### UC-UPL-01 Upload companies

Dashboard “Upload Excel/CSV” → `uploadcompany/step1` … `step4`. Sample download. Error list: autofill address, duplicates, merge contacts, append.

### UC-UPL-02 Upload contacts

`uploadcontact/step1` … `step4` (including Salesforce step4sfdc).

### UC-UPL-03 Salesforce dataloader import

`dataloaderCompanyImport` / `dataloaderContactImport`.
