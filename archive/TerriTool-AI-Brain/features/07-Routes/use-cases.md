---
title: "Routes — use cases"
---

# Routes — use cases

Part of [07-Routes](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 5. Routes

Two-step builder: (1) name + select companies (2) start/end + Generate. Draft vs Published tabs.

### UC-RTE-01 Create route (from leads, list, or empty)

Entry: Find Leads success, Lists → Generate Route / Convert to Route, Home → Routes Create, Routes → + Create Route.

### UC-RTE-02 Select companies (step 1)

Name route. All / Selected tabs. Check companies. Save as Draft, Map View, Find Leads, Next Step.

Evidence: 11:03:08

### UC-RTE-03 Map, filter, lasso (step 1)

City, zip, status → Apply Filter. Create Lasso to draw a territory. List View toggles back.

Evidence: 11:03:25

### UC-RTE-04 Find more leads from route builder

Find Leads from step 1 runs AI search and can add results into this route.

### UC-RTE-05 Save as draft

Save as Draft on step 1 or 2. Appears under Routes → Draft (Edit / Delete only). Not field-ready until generated.

Evidence: 11:06:49 (`R123` and `Your first route`)

### UC-RTE-06 Choose start/end and generate

Step 2: Select Start Point, Select End Point (dropdowns of selected companies), map of pins. Generate Route → success (“Route Generated Successfully!”) + View my Route + mobile store badges. URL: `/simpleroute/step3/{id}`.

Evidence: 10:04:14, 11:03:37, 11:03:47, 11:03:51

Alternate: omit start/end (MCP auto-picks a short tour).

### UC-RTE-07 View published route

Stats: stops, distance, time, contacts found. Search. Per-stop: status, Find Contacts, Note, List, Route. Bulk: Delete, Add to Route, Add to List.

Evidence: 11:03:56 (`R123`, 5 stops, 11.26 mi, 12 min, 0 contacts)

### UC-RTE-08 Export / share

Download PDF, Export CSV, Send (email/share). Also from Published list: Send Route, Export CSV, Download PDF, View On Map.

Evidence: 11:08:30

### UC-RTE-09 Edit / delete / add company

Edit Route re-opens builder. Delete removes route. + Add Company appends a stop (re-optimize on publish).

### UC-RTE-10 Change stop status

Dropdown on stop (Gold, Active, High Priority, Idle, Potential, Reject, Unclassified — labels configurable in Settings).

### UC-RTE-11 Find contacts from a stop

Find Contacts on a row or bulk on the route. Preview, then buy: FullEnrich **2** credits / Claude **1** credit (`buy_contacts` is never free).

### UC-RTE-12 Add note / activity from a stop

+ Note on a stop → activity/note on that company.

### UC-RTE-13 Switch list vs map of a published route

Map View shows optimized driving path; List View is the stop table.

Evidence: 11:06:34 (“Your first route”, 13 stops, 36.82 mi, 54 min)

### UC-RTE-14 Manage Published vs Draft lists

Published: send, csv, pdf, view, edit, delete, map. Draft: edit, delete. KPIs: published count, draft count, total routes.

### UC-RTE-15 Re-generate route

`routes/re_generate/{id}` after companies added/removed.
