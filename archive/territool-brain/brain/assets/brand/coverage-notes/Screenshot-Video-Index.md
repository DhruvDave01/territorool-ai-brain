---
area: design-library
tags: [brain/design-library]
ref: "Screenshot and video index"
---

# Screenshot and video index

**Capture set:** `/Users/rahulsingh/Downloads/Archive 2` copied to `Design-Brain/03-Assets/`.  
Device: iPhone TestFlight, screenshots 1170×2532, videos 1290×2796. Account Testim / Business Client.

Original video names:

| Stable name | Original |
| --- | --- |
| `Videos/VID1-AI-Find-Leads-to-Activity.mp4` | `ScreenRecording_09-11-2026 12-58-12_1.MP4` (~291s) |
| `Videos/VID2-Add-Company.mp4` | `ScreenRecording_09-11-2026 13-07-07_1.MP4` (~75s) |
| `Videos/VID3-Additional-Flows.mp4` | `ScreenRecording_09-11-2026 13-09-50_1.MP4` (~74s) |

No `IMG_4597` in the archive.

---

## Stills → screen → code → flow

| File | Screen / state | Route / UI | Code | Flow |
| --- | --- | --- | --- | --- |
| IMG_4563 | Dashboard empty Upcoming, Invalid Date PT, badges 15/7 | Dashboard | `dashboard/index.js` | Dashboard |
| IMG_4564 | Settings | EditStatus | `dashboard/editstatus.js` | Settings |
| IMG_4565 | AI Find Leads form, Next disabled | MultipleAIWaypoint | `findLeads/aiFindLeads.js` | Find-Leads |
| IMG_4566 | AI map pink pins | same | same | Find-Leads |
| IMG_4567 | Selected Leads + Confirm Leads | same | same | Find-Leads |
| IMG_4568 | Leads confirmed 100% | modal | same | Find-Leads |
| IMG_4569 | Add to route/list/dashboard | sheet | same | Find-Leads |
| IMG_4570–4571 | Add leads to route | modal | same | Find-Leads / Routes |
| IMG_4572 | Create Route Selected(5) | CreateRoute | `route/create.js` | Routes |
| IMG_4573 | Start/End Points | SelectStartEndPoints | `route/create/select-start-end-points.js` | Routes |
| IMG_4574 | Generating sales route | RoutePublishingLoader | `route/common/RoutePublishingLoader.js` | Routes |
| IMG_4575 | Route detail R122rtt | BasicRouteDetail | `route/basic/index.js` | Routes |
| IMG_4576 | Company on route 1/5, Mark | CompanyView + CustomCompany | `route/basic/company-view.js` | Companies |
| IMG_4577 | Active route map | ActiveRouteMap | `activeroutemap/` | Maps |
| IMG_4578 | More Info sheet | CustomCompany | `customcompany/` | Companies |
| IMG_4579 | (i) Report Company | same | same | Enrichment |
| IMG_4580 | Report radios | ReportContactModal | `common/ReportContactModal.js` | Enrichment |
| IMG_4581 | Finding contacts Apollo | FindContactsFetchModal | `customcompany/FindContactsFetchModal.js` | Enrichment |
| IMG_4582 | Fetch empty Done | same | same | Enrichment |
| IMG_4583–4585 | Find Contacts list / checking / saved | CongContact / bizContacts | `route/congContact`, `bizContact` | Enrichment |
| IMG_4586 | Scan Card Camera/Gallery | BusinessCard | `company/businessCard/` | Scan-Business-Card |
| IMG_4587–4588 | Add Company Search / Manual | CreateCompany | `company/create/` | Companies |
| IMG_4589 | Routes Library | Routes | `route/index.js` | Routes |
| IMG_4590 | Filter By (partial) | FilterModule | `filterModule/` | Lists/Routes/AB |
| IMG_4591 | Lists library | Lists | `list/index.js` | Lists |
| IMG_4592–4594 | Create List | CreateLists | `list/create.js` | Lists |
| IMG_4595–4596 | Address Book Companies / Contacts | ListCompany | `company/list.js` | Companies |
| IMG_4598 | View Contact | ContactsView | `contacts/view.js` | Companies |
| IMG_4599–4600 | Add Contact | ContactsCreate | `contacts/create.js` | Companies |
| IMG_4601 | Log out? | AppConfirmModal | `common/AppConfirmModal.js` | Authentication |
| IMG_4602 | Share the app | ReferralInviteModal | `dashboard/ReferralInviteModal.js` | Dashboard |
| IMG_4603 | AI results + contact chips | MultipleAIWaypoint | `aiFindLeads.js` | Find-Leads |
| IMG_4604 | Login | Login | `login/` | Authentication |
| IMG_4605 | Dashboard Recent populated | Dashboard | `dashboard/index.js` | Dashboard |
| IMG_4606–4607 | Scan Card preview + OCR fields | BusinessCard | `businessCard/` | Scan-Business-Card |
| IMG_4608 | Calendar Activity | CalendarActivity | `dashboard/CalendarActivityScreen.js` | Calendar |
| IMG_4609 | Scan QR code | QrCodeScanner | `dashboard/QrCodeScannerScreen.js` | Dashboard |
| IMG_4610 | List company 1/6 Mark | ListsDetail + CustomCompany | `list/basic`, `customcompany` | Lists |
| IMG_4611 | Share Route | ShareEmailField | `common/ShareEmailField.js` | Routes |

---

## Video 1 (~4:51) — AI Find Leads → route → contacts → activity

Frames under `Screenshots/Video-Frames/VID1/` (if present) plus analysis from `/tmp` extract.

```
Dashboard → AI Find Leads (keyboard)
  → search loading (logos, %)
  → results + Confirming N leads
  → add to route → Create Route (partial toast)
  → publish loader (Preparing Route + fuel copy)
  → company on route
  → Add Contact validation toast
  → Find Contacts (Still working / Taking longer)
  → secondary sources → Show Contacts
  → Add Activity → Mark Visited
  → (i) info → Dashboard
```

States **not in stills**: search-in-progress, Confirming N, partial toast, keyboard, validation toast, Still working, Taking longer, secondary carousel, Call sheet, Add Activity, Mark Visited toast.

---

## Video 2 (~1:15) — Add Company

```
Dashboard → Add Company Search → autocomplete
  → pick Google NYC / Amazon - Doppler
  → save toast → Address Book company (Add To, 1/3352)
  → More Info hours → iOS Call → Edit Company → Dashboard
```

---

## Video 3 (~1:14) — hub + libraries + share/filter

Frames: `Screenshots/Video-Frames/VID3/`

| Time | State |
| --- | --- |
| 0s | Dashboard loading overlay |
| 6s | Route company pager spinner, empty activity |
| 8s | Route detail numbered stops + native transition |
| 12–16s | Active map loading + search |
| 24s | Routes Library list |
| 28s | Push animation Dashboard → Lists loading |
| 32s | Share List |
| 34s | Create New List name modal (teal Find Leads, gold Map View) |
| 40–48s | Address Book Filter By (A-Z, scroll) |
| 52s | Contacts tab loading |
| 56s | View Contact Email disabled |
| 64s | Calendar selected other day + Today chip |
| 72s | Settings v42.31 |

---

## Code vs capture (do not pick one)

See [Needs-Manual-Verification.md](Needs-Manual-Verification.md) and [Token-Inconsistencies.md](../05-Design-System/Token-Inconsistencies.md).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (36)

**Documents (15):** [[brain/assets/brand/asset-notes/README|03 — Assets]] · [[shoebox/02-mobile/Assets/README|03 — Assets]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/assets/brand/coverage-notes/README|Coverage]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/assets/brand/coverage-notes/Needs-Manual-Verification|Needs Manual Verification]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/assets/brand/design-brain-root/MASTER-DESIGN-BRAIN|TerriTool Mobile — Master Design Brain]] · [[brain/assets/brand/design-system-notes/Token-Inconsistencies|Token inconsistencies (do not normalize)]]

**Code files (21):** [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/components/common/AppConfirmModal.js|AppConfirmModal.js]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/dashboard/CalendarActivityScreen.js|CalendarActivityScreen.js]] · [[_code/mobile/App/components/route/basic/company-view.js|company-view.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/list/create.js|create.js]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/customcompany/FindContactsFetchModal.js|FindContactsFetchModal.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/components/list/index.js|list/index.js]] · [[_code/mobile/App/components/dashboard/QrCodeScannerScreen.js|QrCodeScannerScreen.js]] · [[_code/mobile/App/components/dashboard/ReferralInviteModal.js|ReferralInviteModal.js]] · [[_code/mobile/App/components/common/ReportContactModal.js|ReportContactModal.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/components/route/common/RoutePublishingLoader.js|RoutePublishingLoader.js]] · [[_code/mobile/App/components/route/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/common/ShareEmailField.js|ShareEmailField.js]] · [[_code/mobile/App/components/contacts/view.js|view.js]]

%% brain-links:end %%
