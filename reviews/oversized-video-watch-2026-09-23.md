# Oversized videos, watched 2026-09-23

Four files were too large for GitHub. Two of them are the same recording. Frames were taken from the originals, which sit outside this repo at `/Users/dhruvdave/Dhurv/video-originals-over-100mb`. Playable halves under 100 MB are the `part1` and `part2` files next to where those videos used to live.

| Recording | Length | What it is |
|---|---|---|
| `webterritool-full-video.mov` | 7:33 | Classic web on `staging.territool.com`, 15 Sep 2026. Trial, onboarding, Find Leads, a route, Address Book, a list, Settings. |
| `VID1-AI-Find-Leads-to-Activity.mp4` | 4:51 | TestFlight, 11 Sep 2026. Same bytes as `ScreenRecording_09-11-2026 12-58-12_1.MP4`. |
| `Find Leads Search and Import.mov` | 1:31 | App 42.32 (1), Development (S), 16 Sep 2026. Address Book Find Leads, ZIP 94043, Coffee. |

## Web, 15 Sep 2026

Account `devtest`, phone `(234) 244-42342`. Sidebar order: Home, Address Book, AI Find Leads, Recently Added, Routes, Lists, Settings. Header has Upgrade, a credits pill, store badges, Report Bug, Logout.

| When | What the frames show |
|---|---|
| `/trial` | “Create your account.” Name, phone, email, password, “I’m not a robot,” Start. Left panel: “The AI Sales App For Field Reps,” 7-day trial, 60 lead credits. |
| `/onboarding` | Step 2 of 2. “Which one’s you?” I’m in the field / I lead a team. “And who do you sell to?” Businesses (B2B) / Homeowners (Residential). Finish setup. Pill shows 60 Credits. |
| `/findleads` | Oakland search. Ideal prospects include taverns, drinking establishments, nightlife venues. “Please wait.” “Searching for companies in Oakland (CA)… This usually takes about 60 seconds.” Partial rows appear while the bar runs. |
| Save | “Adding your leads. Saving 5 selected leads — hang tight.” “This usually takes about 10 seconds. Please keep this tab open.” |
| `/route/step2/3896` | “Step 2 of 2: Your Sales Route.” Start D’Monaghans On The Hill, end Laurel Lounge. Save as Draft. Generate Route. Credits pill 56. |
| `/company/viewmapallcompany` | “View All Companies (Map).” City, ZIP, status, Apply Filter, Create Lasso. Credits pill 51. |
| Company modal | Bar 355, Unclassified, hours, Add to Route, Add to List, Edit, Report Company. Contacts Travis Dutton and Patrick Lynch, both Co-Owner. |
| Contacts toast | “Contacts Added Successfully. 2 contacts saved under Bar 355.” Pill moves from 51 to 49. |
| Activity | Edit Activity. Note “This is test entry,” type Call, date 15/09/2026, time optional. Toast “Note Added. Note added Successfully.” |
| Status toast | “Company Status Update. Company status has been updated successfully.” |
| `/recent-company` | Red toast “List Updated. Company is already exist.” Create or Add Route: existing route “Your first route,” or a new name. Cancel is red, Confirm is blue. |
| `/list/step1` | New list named L10. All / Selected. View on Map, Company, Find Leads, Filter, Next Step. |
| `/route/step1` | Route named T0. Step 1 of 2 selects companies. Save as Draft, Map View, Find Leads, Filter, Next Step. |
| `/routes` | Published 2, Draft 0, Total 2. T0 has 9 companies, 13.03 miles, 36 mins. Your first route has 5 companies, 13.15 miles, 22 mins. Row actions: Send Route, Export CSV, Download PDF, View, Edit, Delete, View On Map. |
| `/salesperson/edit` | MCP Chat, badge “not connected.” Connect new MCP. Fetch, Send, Update. Prompt “Ask about your records, or describe a sync.” Free Package, Subscription Status Active, Lead Credits 49, View Invoice. Connect Salesforce, Connect HubSpot, Connect Karma CRM. |

## TestFlight, 11 Sep 2026

Header says TestFlight. Account name Testim. This is older than app 42.32.

1. AI Find Leads. City field, ideal businesses “Manufacturing companies that need plastic pack,” then “Car companies.” Search shows “Searching for companies in Los Angeles (CA)… This usually takes about 60 seconds,” 53% complete, Ideal prospects for car businesses, Total 173, Selected 0. Credits stay 2947 through the search.
2. Company selection. Toast “Some companies were not added as their dat…” LA City Cars, 817 N La Brea Ave, Inglewood, industry Car Dealer, “Not visited yet.” Tabs All / Selected (1) / Find Leads / Map View. Create Route.
3. Add Contact. Status Unclassified. First name, last name, position, phone optional.
4. Find Contacts for LA City Cars, website `https://www.lacitycars.com/`. Filters Name, Position, Company Name. “Contacts 10 found.” One row says “Taking longer.” Dialog “Still working. Working in the background. You may do other things.” Button “Search secondary database.” A later sheet says “Searching more sources,” then “Searching SBA (Small Business Administration)… Government - Federal,” then “Searching LoopNet… Business Directory,” and “Contacts 3 found.” Credits move 2947 → 2946 → 2944.
5. Dashboard. “Want 20 more credits?” Routes badge 15, Lists badge 7. Activity “Fri, Sep 11 · 7:33 AM PT.” Upcoming empty: “No upcoming activities yet.” Credits pill 2943.

The live contact-provider table in [09](../features/09-Contact-Enrichment-Credits.md) still wins. This recording is an older TestFlight Find Contacts screen. Do not add SBA or LoopNet as a current provider because they appear here.

## App 42.32, 16 Sep 2026

Address Book, Companies tab, footer present. Then Find Leads opened from that book.

- Title is “Find Leads,” not “AI Find Leads.” Tabs Map View and Selected Leads.
- “Find Leads by Zip Code,” field “Enter Zip Code,” black button “Search Zip Code.”
- Search By Zip, ZIP 94043, industry Coffee. Map with red pins. Banner “All data found for Coffee in this location.”
- Select all and Add Leads. Selected Leads (41) includes White Tiger Coffee Copmany, Cafe L-ART-TE, Arwa Yemeni Coffee, Cowboy Coffee, Kona Island Coffee, Cloud9 Coffee.
- Credits stay 8361 on the Find Leads screen. The dashboard after return shows Ann, 8321 Credits, Routes 37, Lists 30, and the date bug “Invalid Date PT,” plus an Upcoming row “1 Auto Repair,” Meeting, 09/16/2026, 8:12 PM.

Search on that screen does not move the 8361 pill. The later 8321 pill is a different screen, so this watch does not change the 1-credit save rule.
