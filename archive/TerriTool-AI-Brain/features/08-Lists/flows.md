---
title: "Lists — flows"
---

# Lists — flows

Part of [08-Lists](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Lists

![Lists](flows/png/06-lists.png)

```mermaid
flowchart TD
  In{Entry} -->|Saved leads modal| Named[Name new or pick existing]
  In -->|Lists + Create| Named
  Named --> Build[Select companies]
  Build --> Map[Map / lasso / filter]
  Map --> Build
  Build --> Submit[Submit]
  Submit --> Index[Lists index]
  Index --> View[View detail]
  Index --> Send[Send List]
  Index --> CSV[Export CSV]
  Index --> OnMap[View On Map]
  Index --> Gen[Generate Route]
  Index --> Edit[Edit]
  Index --> Del[Delete]
  View --> Convert[Convert to Route]
  Convert --> RStep1[Route builder]
  Gen --> RStep1
```

## Mobile flow — List (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). This capture set actually opens on the multi-stop **bulk Find Contacts** flow (shared UI between Routes and Lists — one capture literally shows it under a screen titled "Route"), then moves into the dedicated Lists screens proper.

1. **Bulk Find Contacts, per-stop**: "Tick who to add. The price sits on each person." — stop N of 4, people list with **Owner · added before** rows pre-checked, others unchecked. UC-CT-01-adjacent (bulk). ![Bulk find contacts, per-stop](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>)
2. Mid-search overlay: **"Finding contacts — Searching Apollo.io for emails, phones, and company data… We start with partner databases running in parallel. If we need more contacts, additional public directories are searched next."** (2 similar frames — different stops) ![Finding contacts overlay](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.36.png>)
3. Selecting people updates a running **"N selected · N credits"** bar and unlocks **Review**. ![Selection running total](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.53.png>)
4. **Find Contacts** (multi-stop) index: "Tap View on a stop, tick the people you want, then Review. **Nothing is charged until you confirm.**" Per-stop cards show N added-before / N found and a **View** or **"N selected"** button. ![Find Contacts multi-stop index](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.59.png>)
5. **Review**: per-stop grouped list, red **–** to drop anyone, cost breakdown (Phone or email = 2 credits, Name and position = 1 credit), **Total N credits · you have N** balance, footer note **"Phones and emails take about a minute to arrive. Anyone that comes back empty is not charged."** — confirms the "not charged if empty" credit-safety rule mentioned in the web glossary is enforced here too. UC-CT-01. ![Review and confirm](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.09.05.png>)
6. After confirming, the fetch continues **in the background** — a persistent progress sheet ("Getting details for N contacts… 0 ready · keep driving") stays visible even after navigating to the route/list detail screen underneath, then updates to **"All N contacts ready."** UC-CT-01/UC-CT-02 (async background fetch, no dedicated UC id for the "keep driving" persistence). (2 similar frames) ![Background fetch progress](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.10.05.png>)
7. **Single-company Find Contacts** (opened from a company profile's Contacts panel): Contacts (N) list already on file, **Add Contact** / **Find Contacts** buttons. UC-CT-01. ![Company Contacts panel](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.14.55.png>)
8. Single-company **Find Contacts** search screen: company website field, Name/Position/City filters, **Search / Reset / All Done**, result rows with per-contact **Add**, and a **Search secondary database** button that runs Better Business Bureau / other public-directory lookups when the primary source comes up short — same FullEnrich→secondary-source waterfall concept as web, phrased differently. (4 similar frames — idle, searching, taking-longer, secondary-source) UC-CT-01. ![Single-company Find Contacts](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.15.04.png>)
9. Result of a secondary-database pass: **"We looked for contacts and other things"** — Facebook/Instagram/Business Email lookup results, plus **"All contacts have already been added"** / **"Contacts fetch successfully"** confirmations. Not previously documented anywhere in this Brain. ![Secondary-source result](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.15.17.png>)
10. **Lists index**: search, **+** to create, rows (name, date, company count), collapsible "show more". UC-LST-06. ![Lists index](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.31.14.png>)
11. Row actions sheet: **View On Map / Edit List / Generate Route / Delete / Share List**. Edit List reveals an inline rename field. UC-LST-06, UC-LST-08. (2 similar frames — actions sheet, rename field) ![List row actions](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.31.17.png>)
12. **Share List**: email field, **"If they already use TerriTool, they will get an email letting them know,"** inline validation (**"This user does not exist in TerriTool, invite them to continue"**), success state with a **Past recipients** list. Mobile-only richer version of web's list sharing. (3 similar frames) ![Share List](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.32.05.png>)
13. **Create List** (from + on the index): All / Selected / Find Leads / Map View tabs, company rows with checkboxes, **Select All** (fetches the entire Address Book — "Selecting All Companies… Fetching all companies from server," landed on 6,150 selected), **Next Step** → name modal → **Save List**. UC-LST-02, UC-LST-05. (4 similar frames) ![Create List builder](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.32.13.png>)
14. Builder's **Add Company** menu (**Add Company** / **Find Leads**) — same entry points as the Route and Address-Book builders. UC-LST-03. ![Add Company / Find Leads menu](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.32.58.png>)
15. **Lasso Selection** map (Clear/Start Lasso, world-map cluster counts) — same lasso tool reused from Routes/Find Leads, here for picking existing Address Book companies into a list. UC-LST-04. (2 similar frames) ![Lasso Selection map](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.33.08.png>)
16. New list lands on its **List detail**: per-company rows with **Contacts: N** or **Visited …**, header **Find Contacts** / map icon, edit pencil. UC-LST-07. (2 similar frames) ![List detail](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.33.18.png>)
17. Detail-screen hamburger menu: **Map / Find Contacts / Filters**. **Filters** sheet: City Name, Zip Code, Industry Type, Company Revenue, Company Employees, Sort By Availability (N/A/Open/Close), Sort By Visit (N/A/Visited/Non-Visited), Filter By Status (Idle/Gold/Active/Reject/Potential/Unclassified/High Priority) — same field set as Address Book's Filter By. UC-LST-07. (3 similar frames) ![Detail menu and Filters](<evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.34.39.png>)

