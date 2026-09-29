# 09 — Contact Enrichment and Credits

## Purpose

Look up people at a company and **buy/fetch** them with credits. Buy contacts is **not free**. The same credit wallet is used to save AI leads.

**Live fetch services (only these two):**

| Service | Credits per contact |
|---------|---------------------|
| **FullEnrich** | **2** |
| **Claude** | **1** |

No other contact-fetch provider is running (not Apollo, Cognism, OpenCorporates, or Bizpedia).

## Who

Sales Agent (own credits). Business Sales Agent (credits allocated by the manager).

## Credit economics (identical on every client)

| Action | Credits |
|--------|---------|
| Save AI lead | 1 per company |
| Fetch/buy contact via **FullEnrich** | **2** per person |
| Fetch/buy contact via **Claude** | **1** per person |
| Search leads, list companies, bulk **counts** | 0 |

There is **no free redeem** on a contact buy. Claude at 1 credit is still a paid buy.

Review rewards sit outside this table. G2 grants 30 and Product Hunt grants 20 after verification. Opening the review does not deduct credits and does not add them. Mobile sheet and web page: [02 — Dashboard](02-Dashboard.md).

If `used + cost > total` → Sales Agent: upgrade / add-on. Business Sales Agent: contact manager. Remaining credits = total − used.

## Where Find Contacts starts

- Company detail (website required; user is asked to add one if missing)
- Address Book bulk selection
- A route stop
- A Find Leads result
- MCP / voice (`find_contacts` then `buy_contacts`; see api-surfaces.md)

## Providers (live)

| Provider | Role | Credits |
|----------|------|---------|
| **FullEnrich** | Primary lookup by domain/address; can complete later via webhook | **2** per contact bought |
| **Claude** | Secondary when FullEnrich returns nobody | **1** per contact bought |

## Single company

1. Find Contacts
2. Need website → save it → retry
3. Preview people (name, title, email, phone, location) from FullEnrich, or Claude if FullEnrich is empty
4. Load More pages as needed
5. Select → confirm credits (**2** FullEnrich / **1** Claude) → buy
6. Contacts saved (default Unclassified), credits deducted

Redeem can run in the background; the user waits on progress until the provider webhook finishes.

## Bulk Contacts

1. Select companies
2. See available contact **counts** (counts are not a buy)
3. Optional Claude counts
4. Pick companies/people
5. Buy as a batch with progress (**2** FullEnrich / **1** Claude)
6. Primary vs secondary contact marking is supported

### How the buy runs today (read 2026-09-28)

- **Web: the modal.** The Bulk Contacts modal (`#bulkContactsModal` in `front/company/modal.blade.php`, script `public/js/modalScript.js`) opens from Address Book, list detail and route detail.
  - **Counts:** from `company/getBulkContactsCompanies`, 10 companies a page, with one FullEnrich search per company. Companies with none get `company/getClaudeContactCount`, one Claude lookup per row.
  - **First open:** on each page load, the modal first waits for 47 source logos, about 18 MB when they are not cached.
- **Web: the buy.** Buy posts `company/buyContactsAsync`, which queues `BuyContactsBulkJob`. The job enriches **one contact at a time** (`Helper::redeemFullEnrichContact`): it sends a one-person request to FullEnrich’s bulk endpoint, then checks every 7 seconds, up to 45 checks.
  - **Progress:** the saved count comes from `company/buyContactsProgress`, polled every 3 s by `public/js/bulk-buy-source-progress.js`.
  - **Visibility:** that panel is hidden while the modal is open. The modal shows a timer bar that stops at 90% after 120 s.
- **Mobile.** `BulkContactReview` calls `buyQueuedBulkContacts` (`App/utils/bulkContactProgress.js`). That sends one `buyContacts` request per contact, in sequence. Each request runs the same per-contact loop before it answers. The row updates as each one returns.
- **Unused path.** `company/buyContactsV2` → `RedeemFullEnrichBulkJob` sends every contact in one FullEnrich request and saves them from the `contact_finished` webhook. No screen calls it. As written it has three problems:
  - It does not charge the 1 credit for Claude contacts.
  - Its credit helper, `applyCreditsForBulkRedeem`, has no Business Sales Agent branch.
  - A retried webhook saves the contact and charges again.

Fix before switching any screen to it.

## Wallet

- `total_credit` / `used_credit` on a billing window (`date`)
- Paid plans refresh on the subscription anniversary day-of-month
- Extra packs: credits add-on
- Admin or manager can grant credits

## Rules

- Never treat buy/fetch contacts as free.
- FullEnrich buy = **2** credits; Claude buy = **1** credit; apply on **every** redeem path.
- FullEnrich enrichment is async. The live web and mobile buys poll it per contact, every 7 s. The webhook path (`buyContactsV2`) is not wired to any screen.
- BSA empty wallet → manager message, not Stripe.

## Code

`CompanylController` buy/bulk/Claude (`buyContacts`, `buyContactsAsync`, `buyContactsJobProgress`, `getBulkContactsCompanies`, `getClaudeContactCount`; `buyContactsV2` is unused), `RoutesController` fetch-on-map, `ClaudeContactFinderService`, `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`, FullEnrich webhooks, `UserCredit`, `UserContactsCredit`. The web modal is `public/js/modalScript.js` and `public/js/bulk-buy-source-progress.js`. Mobile is `App/utils/bulkContactProgress.js` and `bulkContactSelect.js`.

## Related

**Modules** — 03-Company-AddressBook, 04-Contacts, 05-Find-Leads, 07-Routes, 12-Subscription-Payments, 16-Manager-Portal, 17-Admin-HQ, 19-Cron-Jobs-Webhooks, 18-Clients

**This feature** — Use cases, Flows, Limits, Known issues

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `CompanylController`, `RoutesController`, `WebhookController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | Buy on `ContactsView` | `contacts/view.js` | Buy details (2 credits, 1 on the Claude/biz path) | `screen.contactsView.loadingB`; provider marks from `assets/images/mobile/fetchSources` | "No contacts found for this company." | "Failed to load contacts."; "We are trying to find a mobile number for you. Please try again." |
| Mobile | Credits pill and Settings card | `customheader/index.js`, `dashboard/editstatus.js` · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) | Buy extra credits (opens web) | header fetch on mount | — | — |
| Classic web | `/subscription` credits add-ons | feature-evidence 09 flows | Buy add-on | `#cover-spin` | — | Stripe error text |
| Classic web | Bulk Contacts modal on `/company`, `/list/{id}`, `/route/view/{id}` | `front/company/modal.blade.php`, `public/js/modalScript.js`, `public/js/bulk-buy-source-progress.js` | Select Contacts, then buy | “Loading companies...”; row loader “Searching {source}…”; buy overlay “Aggregating contact data from multiple sources” and “You may exit this screen and contacts will load in the background”; sticky panel “Adding contacts”, “{n} of {total} saved” | “No companies found”; “No contacts found”; “No selected contacts yet. Select companies on the left and add contacts to cart.” | “Error loading companies. Please try again.”; “Error loading contact results. Please try again.”; “Please select at least one contact to purchase.”; “Insufficient credits, please subscribe to add credits.” |
| Manager | Credit allocation on `/manager/salespeople/{id}` | [Edit salesperson](../screenshots/web-owner/Manager/Edit-Salesperson-TerriTool-09-15-2026_01_27_PM.png) | Allocate credits | "Loading…" | — | Toast on `#manager-toast-root` |

Costs are the constants in `App/utils/contactBuyCredits.js`. Confirm with `AppConfirmModal` before any spend.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4581.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4581.PNG>)
- [IMG_4582.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4582.PNG>)
- [IMG_4583.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4583.PNG>)
- [IMG_4584.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4584.PNG>)
- [IMG_4585.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4585.PNG>)
- [Screenshot 2026-09-14 at 9.27.38 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.27.38 AM.png>)
- [Screenshot 2026-09-14 at 9.28.42 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.28.42 AM.png>)
- [Screenshot 2026-09-14 at 9.28.56 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.28.56 AM.png>)
- [Screenshot 2026-09-14 at 9.29.04 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.29.04 AM.png>)
- [Screenshot 2026-09-14 at 9.29.19 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.29.19 AM.png>)
- [Screenshot 2026-09-15 at 1.04.44 PM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-15 at 1.04.44 PM.png>)
- [Screenshot 2026-09-15 at 1.53.47 PM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-15 at 1.53.47 PM.png>)
- 12 more stills are in `../screenshots/feature-evidence/09-Contact-Enrichment-Credits/`.

## Watched 2026-09-23

A TestFlight recording from 11 Sep 2026 shows an older Find Contacts screen: website search, “Search secondary database,” and source names SBA and LoopNet. That recording does not change the live provider table above. Detail: [oversized-video watch](../reviews/oversized-video-watch-2026-09-23.md).

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
