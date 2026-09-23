---
title: "Company AddressBook — flows"
---

# Company AddressBook — flows

Part of [03-Company-AddressBook](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Company profile

![Company profile](flows/png/07-company-profile.png)

```mermaid
flowchart TD
  Open[Open company] --> See[Phone website hours status]
  See --> Act{Action}
  Act --> Route[Add to Route]
  Act --> List[Add to List]
  Act --> Edit[Edit fields / status]
  Act --> Report[Report issue]
  Report --> Reason{Wrong address / phone / site / closed / duplicate / other}
  Reason --> Submit[Submit report]
  Act --> FC[Find Contacts]
  FC --> Prov{FullEnrich or Claude}
  Prov -->|FullEnrich| FE[Buy: 2 credits each]
  Prov -->|Claude| CL[Buy: 1 credit each]
  FE --> Debit[Confirm then debit]
  CL --> Debit
  Debit -->|No credits| Pay[Buy credits]
  Act --> Manual[Create Contact]
  Act --> Activity[+ Add Activity]
  Activity --> Tabs[Today / Upcoming / Past]
```

## Address Book filter

![Address Book filter](flows/png/08-address-book-filter.png)

```mermaid
flowchart TD
  AB[Address Book or Recently Added] --> Filter[Filter By]
  Filter --> Emp[Employee]
  Filter --> Rev[Annual Revenue]
  Filter --> Ind[Industry]
  Filter --> Sort[A-Z or Z-A]
  Filter --> Hours[Open / Close / N/A]
  Filter --> Status[Gold Active High Priority Idle Potential Reject Unclassified]
  Emp --> Apply[Confirm]
  Rev --> Apply
  Ind --> Apply
  Sort --> Apply
  Hours --> Apply
  Status --> Apply
  Apply --> Grid[Filtered grid]
```

## Mobile flow — AddCompany (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). UC-CO-08 (Add company manually) plus a Search tab web doesn't split out the same way.

1. **Add Company** — **Search** tab (default): Search Company Name (autocomplete), Company Address, Company Website, Company Phone No., collapsible **Add more details** (Industry, Annual Revenue, LinkedIn URL), **Add Company** button. Status pill defaults to "Unclassified". UC-CO-08. ![Add Company search tab](<evidence/mobile/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.04.png>)
2. **Add Company** — **Manual** tab: same fields but Company Name is free text instead of autocomplete. UC-CO-08. ![Add Company manual tab](<evidence/mobile/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.06.png>) (2 similar frames — collapsed/expanded "Add more details")
3. Search tab autocomplete in use: typing "Woodland" returns place matches (Woodland / Woodland Hills / Woodland Park) with city/state; empty state is literally **"There's nothing to show!"** when no match. UC-CO-08. ![Autocomplete results](<evidence/mobile/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.26.png>)
4. Selecting a place fills Company Address; Industry/Annual Revenue/LinkedIn can still be hand-filled. (2 similar frames) UC-CO-08. ![Place selected, details filled](<evidence/mobile/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.30.png>)
5. Header has a **business-card icon** → **Scan Business Card** intro screen ("Snap a card. Save the lead.") with Camera / Gallery capture buttons. This is the entry point into the dedicated Scan Card flow — full capture/review steps: [../04-Contacts/flows.md](../04-Contacts/flows.md) (`ScanCardFlow`), not duplicated here. UC-CO-08 (business-card path). ![Scan Business Card entry](<evidence/mobile/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.52.07.png>)
6. On submit: toast **"Company has been created and added succe…"** (truncated, real copy), then lands on the new company's profile with **Contacts (0)** / **Activity (10)** panels showing "Loading contacts…" / "Loading activities…" — note the Activity count shows 10 before any activity has loaded for a brand-new company, worth a QA check. UC-CO-08. ![Company created, profile loading](<evidence/mobile/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.52.11.png>)

## Mobile flow — AddressBookFlow (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). Covers browsing, contact detail, company detail, filter, and bulk delete — a wider slice than the web evidence set covers in one screenshot pass.

1. **Address Book — Companies tab**: search, filter icon, delete icon, cards (name, address, industry, contact count, colored left-edge status stripe). UC-CO-01. ![Companies tab](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>)
2. **Address Book — Contacts tab**: same search pattern, cards show name, company, phone (or "Phone number is not entered"). UC-CT-06. ![Contacts tab](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.30.png>)
3. Header **+** → menu: **Add Company** / **Find Leads**. UC-CO-08. ![Add menu](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.35.png>)
4. Add Company — Search tab (same screen as the dedicated AddCompany flow, reached here via the + menu instead). UC-CO-08. ![Add Company](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.41.png>)
5. **Add Contact** manual form: First/Last Name, Position, Phone (optional), Mobile (optional), LinkedIn URL (optional), Company Name (optional, autocomplete), City (optional). Cross-reference [../04-Contacts/flows.md](../04-Contacts/flows.md) — not duplicated there since reached from here. UC-CT-03. ![Add Contact](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.50.png>)
6. Tapping a contact card → **View Contact**: avatar initials, name, status pill, position, LinkedIn / Call / Email / Add To / Delete action row, **Notes** ("No notes yet." + Add Notes). UC-CT-06. ![View Contact](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.58.png>)
7. **Add note** modal → toast **"Contact notes has been saved successfully."** → note renders with an Edit Notes button. (3 similar frames — modal, toast, saved state) UC-CT-06. ![Add note](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.20.01.png>)
8. Contact's **Add To** → **"Add to route"** sheet: lists the user's existing draft/in-progress routes with Route ID and Waypoints count, tap one to add this contact's company as a stop. Mobile-only surface for this action — no direct UC yet, related to UC-RTE. ![Add to route sheet](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.20.12.png>)
9. Selecting a route → **"Updating your sales route"** progress screen (Plotting → Connecting → Optimizing → Wrapping up stages, ETA countdown, "Smart route planning saves 12% of fuel" — same optimizer used by the dedicated Route flow). ![Route update](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.20.27.png>)
10. Tapping a **company** card → **company detail**, with a **pager** at top ("1 / 6150" — swipe through every company in the book without going back to the list). Same header/action-row/Contacts/Activity layout as web's company popup. UC-CO-04. ![Company detail with pager](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.26.37.png>)
11. **Add Activity** modal: Note, Activity Type (select), Date (defaults today), Time (optional). UC-ACT-01. ![Add Activity](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.26.44.png>)
12. Toast **"Activity saved successfully."** → Activity (1) with Today/Upcoming/Past tabs, saved row shows date, note text, **Type: Meeting** pill, edit icon. UC-ACT-01. ![Activity saved](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.26.52.png>)
13. **Filter By** sheet: City Name, Zip Code, Industry Type, Company Revenue, Company Employees, Sort By Order, Sort By Availability (N/A / Open / Close), Filter By Status (Idle / Gold / Active / Reject / Potential / Unclassified / High Priority) — matches web's Filter By exactly. (2 similar frames, scrolled) UC-CO-03. ![Filter By](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.27.08.png>)
14. Companies tab **trash icon** → checkboxes appear on every card for multi-select. Mobile-only bulk-select UI, no direct web equivalent found. ![Multi-select mode](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.27.17.png>)
15. **Delete companies** confirm dialog: "Remove 2 companies from your address book? This cannot be undone." Cancel / Delete. UC-CO-09. ![Delete confirm](<evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.27.23.png>)

