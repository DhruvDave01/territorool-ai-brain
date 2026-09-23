---
id: Brand-Usage-Rules
parent: design
---
# Brand usage rules (observed)

Parent: [01 — Brand Guidelines](README.md). Hub: [MINI](../MINI-DESIGN-BRAIN.md).

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
- Use `TerriTool_logo_NEW.jpg` (isometric TT cube) in-app; `TT_NO_BG.png` only where that screen already does

## Do not (based on current app)

- Do not introduce a React Navigation tab/drawer navigator — the app is one **native stack**
- Do not introduce a dark app theme (QR camera is the only full-screen dark UI)
- Do not use Inter even though TTFs exist
- Do not use `icon_lists.png` for the Lists tab — live asset is `Supply3.png`
- Do not assume Address Book company CTAs match route-stop CTAs: **Add To** vs **Mark**
- Do not silently “fix” mixed teal/green/gold chips or mixed danger hexes — copy the nearest screen
- Do not copy the **full-bleed blue splash poster** (`Image_splash.png`) onto authenticated screens — those stay gradient header + `#F6F7FB` sheet
- Do not restyle Register/onboarding to CustomHeader + footer — it is its own light questionnaire
- Do not ship **Test crash screen** / treat HTML replicas in `untitled folder/screenshots/mobile/` as the app
- Do not use the marketing lockup `TerriTool.png` as the Login/Dashboard mark
- Do not follow the brand-kit HTML phone mock if it puts a footer on Dashboard or labeled tabs — live footer is **icon-only**; Dashboard has **no footer**
- Do not swap Home to `icon_home_active.png` — footer imports `ICON_HOME_ACTIVE` but tints `icon_home.png`

## Voice / copy (from captures)

- Tagline (splash still only): “Win the Game of Sales & expand your territory”
- Headers: “AI Find Leads”, “Routes Library”, “Lists”, “Address Book”, “Settings”, “Scan Business Card”, “Calendar Activity”
- CTAs: “Next step”, “Confirm Leads”, “Create Route”, “Save List”, “Add Company”, “Find Contacts”, “Mark Visited”. Login capture is **Login** / **Register Here**, not all-caps
- Empty: “No contacts found.” / “No activities yet.” / “No upcoming activities yet.”
- Loaders: “LOADING.”, “Loading credits…”, “Loading lists…”, “Loading route on map…”, “Generating your sales route”, “Preparing Route…”
- Fun fact on publish: “Smart route planning saves 12% of fuel” (`ROUTE_PUBLISHING_SALES_FUN_FACT`)
- No emoji in product UI

## Deferred brand surfaces

Register steps 1–6 and RevenueCat paywall are captured (`ios/01-auth/`). Distinct `SubscriptionGate` chrome and App Store Settings IAP remain deferred ([Deferred-Scope](../06-Coverage/Deferred-Scope.md)).
