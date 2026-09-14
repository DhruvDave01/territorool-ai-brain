# Brand usage rules (observed)

These rules are **descriptive**. They exist so a new screen matches TerriTool as it ships today.

## Do

- Use **`#124ac6`** for headers, selected footer, primary filled buttons, text links
- Use **DIN Condensed Bold** for titles/CTAs and **Regular** for body
- Use the **gradient header + curved `#F6F7FB` body (25pt)** pattern
- Put module switching in **CustomFooter** (6 icon tabs). Dashboard is a **tile hub** without that footer
- Use **AppConfirmModal** instead of a native `Alert` for confirms
- Use **Toast** (`react-native-toast-message`) at the **top** for success/error/info
- Keep maps as full-bleed content under a blue header; numbered stop pins; locate + zoom FABs
- Keep empty copy centered, gray, with a short instructional sentence
- Keep dual-action sheets as **outline Cancel + filled primary** (`Share Route`, `Create New List`, `Log out`)

## Do not (based on current app)

- Do not introduce a React Navigation tab/drawer navigator — the app is one **native stack**
- Do not introduce a dark app theme (QR camera is the only full-screen dark UI)
- Do not use Inter even though TTFs exist
- Do not use `icon_lists.png` for the Lists tab — live asset is `Supply3.png`
- Do not assume Address Book company CTAs match route-stop CTAs: **Add To** vs **Mark**
- Do not silently “fix” mixed teal/green/gold chips or mixed danger hexes — copy the nearest screen

## Voice / copy (from captures)

- Headers: “AI Find Leads”, “Routes Library”, “Lists”, “Address Book”, “Settings”, “Scan Business Card”, “Calendar Activity”
- CTAs: “Next step”, “Confirm Leads”, “Create Route”, “Save List”, “Add Company”, “Find Contacts”, “Mark Visited”
- Empty: “No contacts found.” / “No activities yet.” / “No upcoming activities yet.”
- Loaders: “LOADING.”, “Loading credits…”, “Loading lists…”, “Loading route on map…”, “Generating your sales route”, “Preparing Route…”
- Fun fact on publish: “Smart route planning saves 12% of fuel” (`ROUTE_PUBLISHING_SALES_FUN_FACT`)

## Deferred brand surfaces

Register, RevenueCat paywall, SubscriptionGate, Settings plan paywall — **not documented visually** in this pass (`../06-Coverage/Deferred-Scope.md`).
