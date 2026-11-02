# Build prompt — AI Find Leads (chat + one map circle), mobile and web

Paste everything below the line into the coding agent. It builds the same module on both stacks and wires it into the Dashboard. Written 2026-09-23 from the six stills in this folder.

Status 2026-11-02: both chats are gone. The web chat was reverted by web commit `abe88426` on 29 September, and mobile commit `5865546a` deleted `AIFindLeadsChat` on 30 September (it is in the store build). Both apps use the older multiple-waypoint form again (`MultipleAIWaypoint` on mobile). This prompt is history, not a spec. See [05 — Find Leads](05-Find-Leads.md) and [live code, 2026-11-02](../reviews/live-code-2026-11-02.md)..

---

You are building one TerriTool module on two surfaces: the React Native app and the classic Laravel web app. The module is **AI Find Leads** as a chat flow with one map circle. Same steps, same strings, same behavior, same credit rules on both surfaces. Only the chrome differs, and that chrome is copied from the shipped screens.

## 0. Read before you write a line

In `/Users/dhruvdave/Dhurv/RMDBRAIN/B1`:

1. `AGENTS.md` (hard rules 1–11).
2. `brains/ui-ux-guardian.md`, then `brains/mobile-ui.md` and `brains/web-design.md`.
3. `brains/mobile-code.md`, `brains/web-code.md`, `brains/api.md`, `brains/api-endpoints.md` (Find Leads block).
4. `features/05-Find-Leads.md` (pipeline, rules, Screens block, the "Proposal 2026-09-22" section) and `features/02-Dashboard.md`.
5. `code/mobile-screens.md`, `code/mobile-components.md`, `code/mobile-review.md`, `code/web-review.md`.
6. `gates/design-gate.md` and `gates/code-gate.md`.

Live repos:

- Mobile: `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`
- Web: `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`

If a brain page and a live file disagree, the live file wins. If a still and a filename disagree, the still wins. Do not invent a color, a font, a string, an endpoint, or a credit cost. If something is missing from all of these, stop and ask.

## 1. The spec is the stills

Open every one of these images and copy them. They are in `features/`.

| Step | Mobile | Web (classic, map left, chat right) |
|---|---|---|
| 1 — Circle your territory | `find-leads-chat-mobile-1-circle-area.png` | `find-leads-web-map-left-1-circle-area.png` |
| 2 — Describe your ideal businesses | `find-leads-chat-mobile-2-describe.png` | `find-leads-web-map-left-2-describe.png` |
| 3 — Review your leads | `find-leads-chat-mobile-3-results.png` | `find-leads-web-map-left-3-results.png` |

Pixels win over this text. This text explains what the pixels mean.

## 2. Scope

Build a new module and make it the Dashboard entry point for finding leads on both surfaces.

**Mobile**

- New stack screen `AIFindLeadsChat`, file `App/components/findLeads/aiFindLeadsChat.js` plus `aiFindLeadsChat.styles.js`. Class component. Register it in `App/App.js`.
- The Dashboard tile labelled "AI Find Leads" (icon `ai_findleads`, tinted `#124ac6`) pushes `AIFindLeadsChat` instead of `MultipleAIWaypoint`. Footer index 2 pushes `AIFindLeadsChat` too so the two entry points agree. `MultipleAIWaypoint` stays registered and is reached from the link "Type a city or ZIP instead". Do not delete it.
- Chrome: `CustomHeader` title "AI Find Leads", back arrow left, credits right. Curved body `#F6F7FB`, radius 25 from `screenCurvedBody.js`. No `CustomFooter`. Keep the "Search Leads | Selected Leads" segmented control exactly as `aiFindLeads.js` renders it.
- Fonts: `theme.font.dinBold` for titles, chips, buttons, tab names. `theme.font.dinLight` for body, addresses, helper lines. Sizes from `theme.typography`. No `fontFamily` string literal, no Inter.
- Buttons: `AppButton`. Danger "Clear all" uses the danger background `#CF5B51` as in `theme.colors.ttRed`. Confirms use `AppConfirmModal`, never `Alert`.
- Map: copy the map setup from `findLeads/aiFindLeads.js` or `route/lassoMap.js`. Do not recolor the circle.
- HTTP: `API.post` with multipart FormData through `buildAiFormData`. Constants from `App/config/index.js`. Base URL stays staging.

**Web (classic)**

- New Blade page on a new classic route in `routes/web.php` inside the authenticated `/` group: GET `/ai-find-leads` → `AILeadFinderController@chatIndex`, view `front/ai_find_leads_chat.blade.php`. It extends `front.layout` and uses the sections `after_styles`, `header`, `content`, `after_scripts`. jQuery 2.2.0, Bootstrap 3.3.5, AdminLTE, Google Maps JS (already loaded on `/findleads`). No React, no manager-portal CSS, no Tailwind.
- Page title "AI Find Leads", "Current Balance: <credits>" pill, crumb "AI Find Leads › Create Leads". The tab strip "Search Multiple | Search One | Yelp Find Leads" stays; the new flow lives under "Search Multiple". "Search One" and "Yelp Find Leads" keep their current markup and handlers from `/findleads`.
- Layout: map card on the left, chat panel on the right, at every step. Step 3 adds the lead grid under the map (same jqxGrid or DataTables the sibling `/findleads` uses: Name, Address, Website URL, Contacts, checkbox column, "N Leads Found", "Next Step" button top-right and bottom-right).
- Dashboard: add the "AI Find Leads" shortcut on `/dashboard` and the sidebar link in `resources/views/front/inc/sidebar.blade.php` pointing at `/ai-find-leads`. The sidebar has duplicate icon and text links; add both, leave the existing duplicates alone. Keep `/findleads` reachable.
- Fonts and colors from `public/css/custom.css`: Source Sans Pro + DIN 2014, primary `#124ac6`. Loading overlay `#cover-spin`. CSRF header `X-CSRF-TOKEN`. PHP 7.2, Laravel 5.3.31 syntax only.
- Must still work at 390 px wide: map on top, chat under it, grid under that.

**Not in scope**

- No second AI pipeline. Extend the existing stages (`AILeadFinderController`, `CompanyController@getAILeadsV2`, `resumeAILeadSearch`, `getAiLeadData`, `saveAILeads`).
- No change to the manager `/manager/ai-find-leads` island.
- No change to how results are saved, routed, listed, or enriched. Step 3 is the results screen that exists today.

## 3. Behavior, identical on both surfaces

### Step 1 — Circle your territory

- Opening line in the TerriTool AI bubble: "Hi <first name>, where do you want to find leads today? Drag the circle over your territory. One area per search."
- Web adds a second helper bubble: "Tip: pull the circle's edge to cover 1 to 10 miles. I'll ask about business types next."
- One circle only. Default radius 1.0 mi. Range 1–10 mi, clamped. Drag anywhere inside to move. Drag the border handle to resize. Badge above the circle: "Search area · 1.0 mi" (one decimal). Legend at the bottom of the map: "Circle — drag anywhere inside to move" and "Border — drag to resize (1.0 mi–10 mi)". Mobile compresses this to "Drag inside to move · Pull the edge to resize (1–10 mi)".
- Map controls: "Use my location" (device or browser geolocation, recenters the circle), "Clear" (web) / "Clear all" (mobile, red) resets the circle to default at the map center and clears the chat, zoom + and −.
- Fallback: web input "Or type a city or ZIP…" with a send arrow. Mobile link "Type a city or ZIP instead". Both keep the old city/ZIP path: on mobile push `MultipleAIWaypoint`; on web use the existing `/findleads` city/ZIP form on the same page. ZIP max 8 characters.
- Web card "How it works": 1. Drag the circle over the area you sell in. One area per search. 2. Describe your ideal businesses in the chat. 3. Review the leads and save the ones you want (1 credit each). The current step is bold and blue, finished steps get a check mark.
- Primary button: "Confirm area". On tap, reverse geocode the circle center to "City, ST", lock the circle, and go to step 2. If reverse geocoding returns nothing, show "No matching location found" (existing string) and stay on step 1.

### Step 2 — Describe your ideal businesses

- Area pill: web "San Francisco, CA · 1.0 mi" with an "Edit area" button beside the map and "Area set: San Francisco, CA · 1.0 mi radius. Edit" in the first AI bubble. Mobile: a card with a small map thumbnail, "Manhattan Beach, CA", "1.0 mi radius · one area per search", and "Edit". Edit unlocks the circle and returns to step 1 with the circle where it was.
- Subtitle under the web step title: "Your search area is locked while you chat. Click Edit area to move it."
- AI bubble: "Got it. What kinds of businesses should I find there? You can also tell me what to skip." (web drops "Got it.").
- Suggestion chips, outlined `#124ac6`: Restaurants, Bars & lounges, Auto repair, Gyms. Web also shows Dental offices. Tapping a chip inserts its text into the input; it does not send.
- User message renders as a right-aligned filled `#124ac6` bubble.
- After each user message call the existing Stage 1 strategy (the same call `aiFindLeads.js` / `/findleads` make today, 0 credits) and render its output as the card "Ideal prospects (AI)" with 3–5 bullets. Web title: "Ideal Prospects (AI Driven):". The bullets come from the strategy response. Do not write them yourself.
- Follow-up bubble: "Looks right? Tap Search. Search is free; saving a lead costs 1 credit." (web: "Click Search").
- Input placeholder before the first message: "Describe your ideal businesses…". After the first message: "Refine: add or exclude something…". A refine message re-runs the strategy and replaces the "Ideal prospects" card. The last user message is the sell description sent to the search.
- Buttons: mobile "Clear all" (red) and "Search" (blue). Web "Search" full width under the chat. Empty description → existing error "Please provide a value for searching industries."

### Step 3 — Review your leads

- Summary line: "<City> · <radius> mi · <description> · N leads found" with "Edit search" (web) / "Edit" (mobile). Edit returns to step 2 with the chat intact.
- Web subtitle: "Every lead is on the map and in the list below. Search is free. Saving costs 1 credit per lead." Chat panel title "Your leads are ready." AI bubble: "Found N leads in <City> · <radius> mi. They are pinned on the map and listed below." Helper bubbles: "Tick the ones you want, then click Next Step to save them. 1 credit each. Green pins are the ones you have ticked." and "Want different results? Tell me what to add or exclude and I'll search again for free." Input "Refine: add or exclude something…", outline button "Search again".
- Mobile: the "Ideal prospects (AI)" card stays above the results, then a "Map" toggle, then the existing lead cards (name, address, "N contacts" pill, checkbox). Footer row "Total: N" and "Selected: N", buttons "Select all" and "Next step". This is the current results UI from `aiFindLeads.js`. Do not restyle it.
- Pins on the map: blue for every lead, green for ticked leads. Ticking in the list and on the map stay in sync.
- Partial results appear as they arrive, exactly as the existing pipeline streams them. Progress text uses the existing strings ("Searching...", "Loading...").
- "Next step" / "Next Step" goes to the existing save flow: `saveAILeads`, 1 credit per company, duplicates skipped, existing insufficient-credit handling (Sales Agent → upgrade or manage plan; Business Sales Agent → "contact your manager").
- Empty: "No matching results found...". Error: "Oops! Something went wrong. Please check your internet connection or try again." as a toast, with a retry.

### Search state and resume

- One search at a time per user. Starting a new search replaces the previous one. Leaving and coming back resumes through `resumeAILeadSearch` / `getAiLeadData`, restoring the circle, the chat, and the results.
- Remember the last circle and description for the next visit, the way the last query is remembered today.

## 4. Backend contract

- Search: `getAILeadsV2` (0 credits). Resume: `resumeAILeadSearch`, `getAiLeadData` (0). Save: `saveAILeads` (1 per company). Contacts: `AILeadsContactFinder`. Look every key up in the live controller and in `aiFindLeads.js` before sending it. Do not guess FormData keys.
- The circle replaces the typed territory. Send the center `lat`, `lng`, and `radius_miles` alongside the reverse-geocoded city string that the pipeline already accepts. If the v2 handler does not read these keys yet, add them inside the `routes/api.php` v2 JWT group and in `CompanyController@getAILeadsV2`, and pass them into Stage 1 as the Places center and bias. 10 mi is 16.1 km, so the bias stays under the 50 km cap. Keep the existing city/ZIP inputs working for the old path.
- The "Ideal prospects" bullets must come from the Stage 1 strategy response. If no endpoint returns the strategy to the client today, expose it on the existing response (same handler, no new pipeline) and document the key.
- Address Book de-dupe, hard filters, and the optional Stage 3 refine stay as they are.

## 5. Order of work and handoff

1. Write the consistency report from the Guardian (KNOWN / INFERRED / UNKNOWN / CONFLICTING) for both surfaces. Cover every token, font, string, component, endpoint, and credit cost above. Resolve every INFERRED and UNKNOWN line before coding.
2. Mobile screen, then Dashboard tile and footer wiring, then `App.js` registration.
3. Web route, controller method, Blade page, sidebar and dashboard links.
4. Backend keys, if step 4 showed they are missing.
5. Run the checks the code gate names: `yarn lint` on touched files, `npx jest` if a test covers `findLeads`, `vendor/bin/phpunit` on the Find Leads tests, and open the built screens once on the iOS simulator and in the browser at 1440 and 390 wide.
6. Hand back: the consistency report, the list of files changed, simulator and browser captures of steps 1–3 on both surfaces compared against the six stills, and a named list of anything you could not run and why.

Do not call the work done while any gate row fails or any INFERRED line is unconfirmed.
