---
title: "Lists — use cases"
---

# Lists — use cases

Part of [08-Lists](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 6. Lists

Lists are unordered company sets (no start/end optimization until converted to a route).

### UC-LST-01 Create list from saved leads

See UC-LEAD-08. Builder: Step 1 name, Step 2 select companies. + Company, Find Leads, View on Map, Submit.

Evidence: 11:04:35

### UC-LST-02 Create list from dashboard / Lists index

+ Create List → empty builder; pick companies from Address Book.

### UC-LST-03 Add companies to an existing list

From Find Leads, company row +List, bulk Add to List, or list builder Selected tab.

### UC-LST-04 Map / lasso on list builder

View on Map / Create Lasso / city-zip-status filter.

Evidence: 11:04:55, 11:05:52

### UC-LST-05 Submit list

Submit → Lists index + toast “List has been created successfully.” KPIs: total lists, unread, companies.

Evidence: 11:05:13 (`L123`, qty 6)

### UC-LST-06 Index actions

Send List, Export CSV, View On Map, Generate Route, Edit, View, Delete. Bulk delete.

### UC-LST-07 View list detail

Search, + Add Company, Find Leads, Find Contacts, View on Map, Filter. Per row: status, Find Contacts, Note, List, Route. Bulk: Delete, Add to Route, Add to List, **Convert to Route**.

Evidence: 11:05:33

### UC-LST-08 Convert list to route

Convert to Route / Generate Route → route builder pre-filled from list members → UC-RTE-06.
