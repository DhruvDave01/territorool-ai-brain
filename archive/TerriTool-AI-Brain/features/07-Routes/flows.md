---
title: "Routes — flows"
---

# Routes — flows

Part of [07-Routes](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

First published Basic Route mobile-app popup: [screen spec](flows/mobile-app-route-promo-spec.md).

## Create and publish a route

![Create and publish a route](flows/png/04-create-publish-route.png)

```mermaid
flowchart TD
  Entry{Entry} -->|From saved leads| Pre[Companies pre-selected]
  Entry -->|From list Convert/Generate| Pre
  Entry -->|+ Create Route| Empty[Pick companies]
  Pre --> Step1[Step 1: name + select]
  Empty --> Step1
  Step1 --> Opt{Action}
  Opt -->|Save as Draft| Draft[Routes Draft tab]
  Opt -->|Map / Lasso / Filter| Map1[Adjust selection]
  Map1 --> Step1
  Opt -->|Find Leads| LeadIn[AI search into this route]
  LeadIn --> Step1
  Opt -->|Next Step| Step2[Step 2: start + end]
  Step2 --> Opt2{Action}
  Opt2 -->|Save as Draft| Draft
  Opt2 -->|Generate Route| Gen[Optimize tour]
  Gen --> Success[Route Generated Successfully]
  Success --> View[View my Route]
  View --> Pub[Published tab]
  Pub --> Field[Download PDF / CSV / Send / Map / Mobile]
```

## Work a published route

![Work a published route](flows/png/05-work-published-route.png)

```mermaid
flowchart TD
  View[Route detail] --> Stats[Stops distance time contacts]
  View --> Bulk{Bulk}
  Bulk --> Del[Delete stops]
  Bulk --> ToR[Add to another route]
  Bulk --> ToL[Add to list]
  View --> Row{Per stop}
  Row --> Status[Change status]
  Row --> FC[Find Contacts]
  Row --> Note[Add note]
  Row --> List[Add to list]
  Row --> Route[Add to route]
  View --> Add[+ Add Company]
  Add --> Regen[Re-generate]
  View --> Map[Map View - driving path]
  View --> Export[PDF / CSV / Send]
```

## Mobile flow — RouteFlow (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). This archive folder also contained 19 frames that are byte-identical to the bulk **Find Contacts** flow already documented in [../08-Lists/flows.md](../08-Lists/flows.md) (same screenshots exported into both folders) — not re-described here to avoid duplicate evidence; see that file for the "tick who to add → Review → background fetch" sequence.

1. **Routes Library** index: search, **+** to create, rows (name, date, waypoint counts, miles, time). UC-RTE-14. ![Routes Library](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.12.png>)
2. **+** → name modal ("New Route") with live duplicate-name check against existing routes, then a **Filter By** sheet (City/Zip/Industry/Revenue/Employees + sort/status — same fields as Address Book/List). UC-RTE-01. (2 similar frames) ![Create Route naming + filter](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.16.png>)
3. **Add Company** (Search / Manual tabs) reached from the route builder's own **+** — same form as the dedicated Add Company flow. UC-RTE-02. ![Add Company from route builder](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.03.34.png>)
4. A background job can fail mid-flow: **crash-reporter screen** ("Something went wrong… Tap Retry to pick up where you left off", auto-reported, support-reference id) — same component as the onboarding crash screen, confirms it's a shared error boundary, not onboarding-specific. ![Crash reporter](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.04.18.png>)
5. **Lasso Selection** (world map, cluster counts, Start/Clear/End Lasso) → **Start/End Points**: search fields or tap-a-pin, small preview map, "You can remove waypoints from your route on this map," Go Back / Create Route. UC-RTE-03, UC-RTE-06. (4 similar frames) ![Lasso + Start/End Points](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.05.03.png>)
6. **Route Publish** progress: "Generating your sales route," stage chips (Plotting → Connecting → Optimizing → Wrapping up), countdown timer, **"Checking drive times to cut fuel and wasted travel,"** **"Smart route planning saves 12% of fuel"** footer, **Preparing Route…** disabled-button state. Confirms mobile create-route **always lands published**, same as [`memory/mcp-create-route-publishes.md`](../../memory/mcp-create-route-publishes.md) documents for MCP. UC-RTE-06. (2 similar frames) ![Route Publish progress](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.06.02.png>)
7. **Published route detail**: title, share icon, edit pencil, **Search stops** bar, hamburger menu (**Map / Find Contacts / Filters**), numbered stop cards with miles/time between each, bottom tab bar. UC-RTE-07. (2 similar frames) ![Published route detail](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.06.05.png>)
8. **Map** view of the published route: numbered pins connected by the driving path, blue start marker, red flag end marker, "Loading route on map…" transient state. UC-RTE-13. (2 similar frames) ![Route map view](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.06.49.png>)
9. Map's own **Filters** sheet — same City/Zip/Industry/Revenue/Employees/Sort/Status fields, scrollable. UC-RTE-13. ![Map Filters sheet](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.07.08.png>)
10. **Share Route**: email field, "If they already use TerriTool, they will get an email letting them know," inline **"This user does not exist in TerriTool, invite them to continue"** validation, Sharing… state, success + **Past recipients** list. Identical pattern to Share List. UC-RTE-08. (5 similar frames) ![Share Route](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.07.14.png>)
11. **Route stop picker** (All / Selected / Find Leads / Map View tabs) with duplicate-looking rows for the same company at different addresses (data-quality note, not a bug in the picker itself) and an **Add Company** button. UC-RTE-09. ![Stop picker](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.23.png>)
12. **Single-stop detail** (pager "2/4", swipe between stops): header + **More Info / Mark / Call / Navigate** action row, first-run **coach-mark tooltip** ("Tap Find Contacts to discover people at this company" — Got it / Skip tour), **Contacts (N)**, **Activity (N)** with Today/Upcoming/Past tabs. UC-RTE-10, UC-RTE-11, UC-RTE-12. (2 similar frames) ![Single-stop detail + tour](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.10.50.png>)
13. **More Info** popup (Company Email/Annual Revenue/Category/Employees/Industry, Quick Actions: Call/Website/LinkedIn/Instagram/Facebook, Open & Close) → **Edit** → full **Edit Company** form. UC-RTE-09. (2 similar frames) ![More Info + Edit Company](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.10.56.png>)
14. **Mark** → **Report company issue** (Wrong address/phone/website, Business closed, Duplicate company, Something else + optional details, Submit report). UC-CO-07-equivalent. (2 similar frames — options list, one selected) ![Report company issue](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.11.17.png>)
15. **Add Contact** manual form for a stop (same fields as the dedicated Add Contact flow). UC-CT-03-equivalent. ![Add Contact from stop](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.11.33.png>)
16. Single-stop **Find Contacts**: "Finding contacts — Searching Apollo.io…" → **"We looked for contacts and other things"** result (Facebook/Instagram/Business Email Not Found, Contacts 0 People, **"All contacts have already been added… Contacts fetch successfully."**). UC-RTE-11. (2 similar frames) ![Single-stop Find Contacts](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.11.45.png>)
17. **Add Activity** modal (Note, Activity Type dropdown: Meeting/Call/Visit/Message/Email/Reminder/Appointment, Date picker, optional Time) → **Schedule**/**Save** → activity appears under the matching Today/Upcoming/Past tab. UC-RTE-12. (4 similar frames — form, date picker, type list, saved) ![Add Activity](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.11.55.png>)
18. **Mark Visited** → toast **"You have successfully added the company vi…"** → a **Visit**-type activity is auto-logged with today's date/time; Activity count increments. UC-RTE-10. ![Mark Visited](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.12.29.png>)
19. Adding an activity dated in the past prompts a **"Past activity — Are you sure you want to add a past activity?"** confirm (Cancel/Continue) before saving; success toast **"Activity saved successfully."** and the entry lands under the **Past** tab. UC-RTE-12. (2 similar frames) ![Past-activity confirm](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.12.48.png>)
20. **Report contact issue**: Wrong phone/email, Wrong person/no longer at company, LinkedIn broken, No usable contact info, Something else + optional details, Submit report. UC-CT-04-equivalent. ![Report contact issue](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.13.03.png>)
21. A **second, pre-existing published route** ("123-XYZ…", 96/98 waypoints) shown in Routes Library demonstrates the row-actions sheet: **View On Map / Edit Route / Re-Route / Delete / Share Route**. Attempting **Re-Route** without a filter set → toast **"Sorry, your route needs filter to use this feat…"** — re-optimizing requires a filter/subset first, a real validation constraint worth testing. UC-RTE-15. (3 similar frames) ![Route actions + Re-Route validation](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.16.46.png>)
22. **Delete Route** confirm ("Are you sure you want to delete this route?" Cancel/Delete). UC-RTE-09. ![Delete Route confirm](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.17.31.png>)
23. **Edit route name** inline (pencil field + checkmark) → toast **"Route Updated Successfully"**, name updates in the library list immediately. UC-RTE-09. (2 similar frames) ![Edit route name](<evidence/mobile/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.17.40.png>)
