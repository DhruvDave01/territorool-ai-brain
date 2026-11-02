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

Review rewards sit outside this table. G2 grants 30 and Product Hunt grants 20 after verification. Opening the review does not deduct credits and does not add them. Mobile sheet and web page: [02 — Dashboard](02-Dashboard.md). On the store build (Production) the Dashboard banner "Unlock 50 Credits." opens the mobile sheet (`dashboard/index.js:1347-1369`). TT_80 removed that banner in `fe2e3254`, and nothing else on TT_80 opens the sheet.

If `used + cost > total` → Sales Agent: upgrade / add-on. Business Sales Agent: contact manager. Remaining credits = total − used.

## Where Find Contacts starts

- Company detail (the search runs without a website; buying a FullEnrich contact needs one)
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
2. No website prompt before the search (the check in `customcompany/index.js` is commented out on Production and TT_80). A blank website, or one that reads "Not entered", skips the FullEnrich search on the server (`app/Globals/Helper.php:983-1001` on master, `0c969fd2`, `a651dba4`). TT_80 also sends an empty `domain` for "Not entered" (`customcompany/index.js:1478`, `ed2edffd`). Buying a FullEnrich contact still needs a website: "Please enter website URL in company details for us to fetch contact data." (`route/congContact/index.js:1698`).
3. Preview people (name, title, email, phone, location) from FullEnrich, or Claude if FullEnrich is empty
4. Load More pages as needed
5. Select → confirm credits (**2** FullEnrich / **1** Claude) → buy
6. Contacts saved (default Unclassified), credits deducted

The `buyContacts` request stays open while the server polls FullEnrich every 7 s, up to 45 checks (`Helper::redeemFullEnrichContact`). No webhook is involved.

## Bulk Contacts

1. Select companies
2. See available contact **counts** (counts are not a buy)
3. Optional Claude counts
4. Pick companies/people
5. Buy as a batch with progress (**2** FullEnrich / **1** Claude)
6. Primary vs secondary contact marking is supported

### How the buy runs today (read 2026-11-02)

Read against mobile TT_80 `daf50eeb` and Production `6973a30d`, and web master `d3f75449`. Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

- **Web: the modal.** The Bulk Contacts modal (`#bulkContactsModal` in `front/company/modal.blade.php`, script `public/js/modalScript.js`) opens from Address Book, list detail and route detail.
  - **Counts:** from `company/getBulkContactsCompanies`, 10 companies a page, with one FullEnrich search per company. Companies with none go together in one `company/getClaudeContactCounts` call per page (`modalScript.js:3784`, `c79dfec4`). The server runs the uncached Claude lookups in parallel (`Helper::prefetchClaudeLookupsForBulkCounts`).
  - **First open:** on each page load, the modal first waits for 47 source logos, about 18 MB when they are not cached.
- **Web: the buy.** Buy posts `company/buyContactsAsync`, which queues `BuyContactsBulkJob`. The job enriches **one contact at a time** (`Helper::redeemFullEnrichContact`): it sends a one-person request to FullEnrich’s bulk endpoint, then checks every 7 seconds, up to 45 checks (`Helper.php:2956-2991`). Credits are charged after the loop: 2 per saved FullEnrich contact and 1 per Claude contact (`BuyContactsBulkJob.php:280-338`).
  - **Progress:** the saved count comes from `company/buyContactsProgress`, polled every 3 s by `public/js/bulk-buy-source-progress.js`. Since `e1c48937` the finished job reports the real saved and pending counts, not the total (`BuyContactsBulkJob.php:415-426`).
  - **Failure:** a new `failed()` handler (`2d0f4d55`) writes "Background purchase failed: " plus the exception class to the progress cache. When it runs: [19 — Background jobs](19-Cron-Jobs-Webhooks.md#where-errors-go-read-2026-11-02).
  - **Visibility:** that panel is hidden while the modal is open. The modal shows a timer bar that stops at 90% after 120 s.
- **Mobile** (Production and TT_80 unless marked). `Contact` (`route/contact/index.js`) → `BulkContactPeople` (`people.js`) → `BulkContactReview` (`review.js`), with a header cart button (`cartButton.js`). Provider logos are in `App/images/fetchSources/`.
  - **Counts:** `getBulkContactsCompanies` with `route_id` or `list_id`, `page` and `per_page` 10 (`contact/index.js:393-403`), then `getClaudeContactCounts` with `company_ids[]` for that page's companies that need a Claude count (`:330-344`). Both are v2 routes (`routes/api.php:218-219`) on the same helpers as the web modal. More than 10 IDs returns 422 "Provide up to 10 company IDs." (`Helper.php:2148-2156`).
  - **Buy:** the confirm reads "Adding {n} contacts will deduct {c} credits from your current balance of {b} credits." (`contactBuyCredits.js:58-79`). `buyQueuedBulkContacts` then sends one `buyContacts` request per contact, in sequence, and stops at the first failure (`bulkContactProgress.js:252-271`). Keys: `companyContact[0]` (FullEnrich) or `companyFreeContact[0]` (Claude), plus `id`, `cognism_id` and `source`; the Claude call also sends `opencorporates_id` and any `linkedin_url`, `email`, `mobile_no` and `phone_no` (`bulkContactSelect.js:166-213`).
  - **Background:** the app goes back to the route or list at once and the buy runs there (`review.js:154-168`). The bar is simulated: it creeps to 60% at random, then fills the last 40% as contacts finish (`bulkContactProgress.js:176-213`). Sheet copy: "Getting details for {n} contacts", "Checking {source}... This keeps going in the background. You can keep using the app.", "{ready} of {total} done", then "All {n} contacts ready" (`progressSheet.js:47-69`, `:98`, `:185`). {source} rotates every 2 s through eight names, including Apollo and ZoomInfo (`progressSheet.js:22-31`); the server still calls only FullEnrich and Claude.
  - **Done:** one second after the last contact the sheet closes and the toast "All contacts saved" shows (`review.js:170-180`). Production also posts one device notification, "All contacts saved". TT_80 (`7e8984dd`) posts one per company, "{n} contacts downloaded" titled with the company name, and shows a "+{n} New Contact" badge on that row (`route/basic/index.js:1109`, `list/basic/index.js:681`) until the row is opened.
  - **Failure:** the sheet closes and the toast shows the server message or "Could not add contacts." (`review.js:207-215`). Contacts bought before the failure stay bought and charged.
  - **States that never show:** "Came back empty" and "{n} credits returned" (`progressSheet.js:124-125`, `:220-223`). No code sets a contact's status to `empty` or `creditReturned` above 0; every contact whose `buyContacts` call returns status 1 is marked ready, including one the server did not save.
- **Charging mismatch.** Review says "Phones and emails take about a minute to arrive. Anyone that comes back empty is not charged." (`review.js:375-378`). The server does not do that. Once FullEnrich finishes, `Helper::redeemFullEnrichContact` saves the contact unless first name, last name, email and title are all empty. Name and title fall back to the values the app sent, so a contact with no phone and no email is still saved and charged 2 credits (`Helper.php:3013-3053`, `CompanylController.php:2712-2758`). Only a contact that FullEnrich rejects or never finishes within the 45 checks is free.
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
- Copy that promises "not charged" must match the server. Today it does not: see **Charging mismatch** under Bulk Contacts.
- BSA empty wallet → manager message, not Stripe.

## Code

`CompanylController` buy/bulk/Claude (`buyContacts`, `buyContactsAsync`, `buyContactsJobProgress`, `getBulkContactsCompanies`, `getClaudeContactCount`, `getClaudeContactCounts`; `buyContactsV2` is unused), `Helper::bulkContactsCompaniesResponse` and `Helper::claudeContactCountsResponse` (shared by web and v2 `CompanyController`), `RoutesController` fetch-on-map, `ClaudeContactFinderService`, `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`, FullEnrich webhooks, `UserCredit`, `UserContactsCredit`. The web modal is `public/js/modalScript.js` and `public/js/bulk-buy-source-progress.js`. Mobile is `App/components/route/contact/` and `App/utils/bulkContactProgress.js`, `bulkContactSelect.js`, `bulkContactFetch.js`, `bulkContactSession.js` and (TT_80) `newContactBadge.js`.

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
| Mobile | Buy from company detail (checked 2026-11-02) | `customcompany/index.js` opens `CongContact` (`route/congContact/index.js`, FullEnrich) or `bizContacts` (`route/bizContact/index.js`, Claude) | Buy details (2 credits, 1 on the Claude/biz path) | `customcompany/FindContactsFetchModal.js` with logos from `App/images/fetchSources/` (vault copy: `assets/images/mobile/fetchSources`); `screen.bizContacts.loading` while saving | "No contacts found" | "Please enter website URL in company details for us to fetch contact data."; "Could not save this contact. Please try again." |
| Mobile | Bulk Contacts on a route or list (checked 2026-11-02) | `route/contact/index.js`, `people.js`, `review.js`, `progressSheet.js` | Go to cart, then Confirm | "Finding contacts · {n} of {total} stops"; row "Searching..." and "Searching secondary database..."; sheet strings in [How the buy runs today](#how-the-buy-runs-today-read-2026-11-02) | "No companies found on this route."; "No companies found on this list."; "No people found at this stop."; "Nothing in cart yet" | "Could not load contacts. Please try again."; "Could not add contacts."; "Could not add contacts. Please try again." |
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
