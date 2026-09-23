---
title: "Find Leads — use cases"
---

# Find Leads — use cases

Part of [05-Find-Leads](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 4. AI Find Leads

Credits: **search is free**; **save costs 1 credit per lead**.

### UC-LEAD-01 Search Multiple

Location (state + city) + business type (free text, AI expands “Ideal Prospects”) → Search → table of Name / Address / Website / Contacts. Optional Map View. Next Step with selection.

Evidence: 9:56:30 (Los Angeles + “Restaurant near me”, 108 leads)

### UC-LEAD-02 Search One

Switch to Search One: look up a single named business instead of a territory sweep.

### UC-LEAD-03 View results on map

Map View of current result set; return to table.

### UC-LEAD-04 Select leads

Check rows. Counter: “N Selected From M Leads Found.” Next Step disabled until ≥1 selected.

### UC-LEAD-05 Save selected leads (debit credits)

Progress modal: “Adding your leads / Saving N selected leads.” Keep tab open. Balance drops by N. Leads become companies in Address Book / Recently Added (status Unclassified).

Evidence: 9:57:34; balances 60 → 37 → 32 → 26

Exception: insufficient credits → Upgrade / buy credits add-on.

### UC-LEAD-06 Create new route from saved leads

Success modal → Create or Add to Existing Route → type new name (e.g. `R123`) → Confirm → Route builder step 1 with those companies pre-selected.

Evidence: 11:02:45, 11:02:58, 11:03:08

### UC-LEAD-07 Add saved leads to an existing route

Same modal → Add to Existing Route dropdown → Confirm → companies appended; route may re-optimize when published.

### UC-LEAD-08 Create new list from saved leads

Success modal → Create or Add to Existing List → name (e.g. `L123`) → Confirm → list builder with companies selected.

Evidence: 11:04:24, 11:04:35

### UC-LEAD-09 Add saved leads to an existing list

Dropdown “Select Existing List” → Confirm.

### UC-LEAD-10 Return to dashboard after save

Success modal → Return to Dashboard. Companies remain in Address Book.

### UC-LEAD-11 Find more leads

Find More Leads on the success / route-or-list modal returns to search without losing saved companies.

### UC-LEAD-12 Async search pipeline (system)

`POST ai-lead-finder/start` → stage1 → stage2 pages → stage3 → complete. MCP: `find_ai_leads` / `resume_ai_lead_search` (free) then `save_ai_leads` (1 credit each, confirm_all + token).
