---
title: "Company AddressBook — use cases"
---

# Company AddressBook — use cases

Part of [03-Company-AddressBook](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

See also: [06-Recently-Added](../06-Recently-Added/use-cases.md), [04-Contacts](../04-Contacts/use-cases.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/use-cases.md)

## 7. Address Book & companies

### UC-CO-01 Browse Address Book

All saved companies. + Add Company, Find Leads, Find Contacts, bulk Delete / Add to Route / View on Map / Add to List. Row: status, Find Contacts, Note, List, Route.

Evidence: 11:10:43

### UC-CO-03 Filter companies

Filter By: Employee, Annual Revenue, Industry, Sort A-Z/Z-A, Open & Close, Status (Gold, Active, High Priority, Idle, Potential, Reject, Unclassified).

Evidence: 11:10:56

### UC-CO-04 View company profile

Click name. Header: status, phone, website, hours. Actions: Add to Route, Add to List, Edit, Report Company. Contacts block + Activity (Today / Upcoming / Past).

Evidence: 11:07:12 (SORA Craft Kitchen — closed Mon–Wed)

### UC-CO-05 Edit company

Inline edit name, status, address, phone, website, hours → save. Toast: “Company status has been updated successfully.”

Evidence: 11:07:26

### UC-CO-06 Set company status (High Priority / Gold / etc.)

Status dropdown on row or profile. MCP: `set_company_status` (not a note).

### UC-CO-07 Report company issue

Reasons: wrong address/location, wrong phone, wrong website, business closed, duplicate, something else + optional details → Submit report.

Evidence: 11:07:36

### UC-CO-08 Add company manually

+ Add Company: name + address or city (MCP: same). Optional attach to route_id (re-optimizes + publishes).

### UC-CO-09 Delete companies

Row or bulk. Cannot undo from UI.

### UC-CO-10 View all companies on map

View on Map from Address Book / Recently Added / lasso create.

## 9. Activities / notes

### UC-ACT-01 Add activity on a company

+ Add Activity: note, activity type, date, optional time → Save. Tabs: Today / Upcoming / Past.

Evidence: 11:08:09

### UC-ACT-02 Edit / delete activity

From company activity list or dashboard. MCP: `add_activity`, `edit_activity`, `view_activities`.

### UC-ACT-03 Mark visited / log meeting

`company/mark-as-visited/{id}`, log meeting create/edit/delete. MCP: `mark_visited`.
