---
id: Find-Leads
parent: design
---
# Find Leads (AI)

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/03-find-leads/`).

Primary capture: VID1 + `IMG_4565`–`4571`, `IMG_4603`, Archive `AIFindLeadsFlow/` (42.32).

```
Dashboard or Footer Find Leads
  → MultipleAIWaypoint form (City/ZIP, Ideal businesses, Ideal prospects)
  → Next step disabled until selection
  → open: cube spinner overlay “Loading your saved AI leads…” (`19.42.05`)
  → Search
      → “Searching for companies in {city}…” · “This usually takes about 60 seconds.” · % + “Connecting to data sources” + source logos (`19.42.33`)
      → results: Ideal prospects (AI) bullets, Map chip, per-row **Fetching…**, Total / Selected (`19.43.42`)
      → map: pink pins, Clear/Start/List
  → select rows → Next step enabled
  → Selected Leads (N) → **Confirm Leads** (primary blue in 42.32; older stills near-black — both live)
      → Confirming N leads… then Leads confirmed 100%
  → Add to route / Add to list / Return to Dashboard
  → Start/End Points then Create Route (`19.46.59`) or list detail (`19.48.10`)
  → Add leads to route (type name) → Create Route
      → optional toast: some companies not added
```

Places Find Leads (`MultipleWaypoint`, `ios/03-find-leads/08`) is the Create Route **Find Leads** dropdown: Map View / Selected Leads, Select Location, Search Industry, Select all / **Add Leads**. Lasso chrome: `03`. `07-ai-save-to-list.png` is Selected Leads + Confirm Leads, not a list sheet.
