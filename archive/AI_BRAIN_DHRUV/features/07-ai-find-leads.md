---
id: 07-ai-find-leads
parent: features
sources:
  - webterritool/docs/MCP-Manager-Portal-Feature-Gap.md
  - findLeads/index.js
related:
  - 03-architecture.md
  - 09-credits-billing.md
  - 14-mcp.md
  - screens/manager-mcp-how-it-works.md
  - screens/web-how-it-works.md
  - screens/navigation-map.md
---
# Feature: AI Find Leads

Related: [03-architecture](../03-architecture.md) · [09-credits-billing](../09-credits-billing.md) · [14-mcp](../14-mcp.md) · [navigation-map](../screens/navigation-map.md) · **manager MCP:** [screens/manager-mcp-how-it-works.md](../screens/manager-mcp-how-it-works.md)

## What it does

Find unsaved businesses by city or ZIP and who the rep sells to. **Search is free.** Saving into the Address Book costs **1 credit each**.

## Two engines (do not mix)

| Engine | Who | How |
|-------|--------|-----|
| User V2 | Sales Agent / BSA / classic web `/findleads` | Gemini planner → Places Text Search → optional Gemini refine. `getAILeadsV2` |
| Manager portal **and** manager User MCP | Business Agent `/manager/ai-find-leads` **and** MCP `find_ai_leads` as BA | Places **circle** (`hunt_engine = manager_portal`, `radius_miles` 1.0–10, default 1.0). `LeadsTools::findManagerPortalLeads` — **not** `getAILeadsV2` |

Gap doc: `webterritool/docs/MCP-Manager-Portal-Feature-Gap.md`.

## Pipeline (user V2)

```
Stage 1  Gemini strategy planner   territory + sell description → search_terms, filters
Stage 2  Google Places Text Search  parallel terms, paging, dedupe, hard filters
Stage 3  Gemini refinement          optional qualitative filter
Persist  user_ai_search
Save     Helper::saveAILead → companies + used_credit
```

Web SSE: `POST ai-lead-finder/start|stage1|stage2|stage3|complete`, `GET status`.  
Keys: `GEMINI_API_KEY`, `GOOGLE_KEY`.

Mobile: `MultipleAIWaypoint` / `aiFindLeads.js` — `getAILeadsV2` → `resumeAILeadSearch` / `getAiLeadData` → `saveAILeads`. Save needs **≥ 2** leads (`confirmLeadsMinModalVisible`). Post-save modal: add to a route, add to a list, or Dashboard (Address Book only). Onboarding skips that modal and goes to `CreateRoute`.

Lists/Routes **Find Leads** buttons open classic `MultipleWaypoint` (Places), **not** AI V2. Do not mix the two engines.

Realm cache `AIFindLeads`: website, city, territoryMode (`city`\|`zip`), sellDetails, aiResponse, aiLeads.

Nav: [screens/navigation-map.md](../screens/navigation-map.md). Steps: [screens/how-it-works.md](../screens/how-it-works.md).

## Other lead surfaces

| Feature | Path |
|--------|------|
| Classic map / lasso | `MultipleWaypoint` / `findLeads/index.js` (app UI; Places) |
| Legacy | `getAILeads`, `aiLeadGoogleSearch` |
| Top 50 | `getTop50AILeads` |
| AI place contact counts | `AILeadsContactFinder` |
| Yelp | Web `getYelpLeads` / `saveYelpLeads`; HQ `users.yelp_leads`. **Not** in mobile config |

Trial package id **1** caps select at **60**. Never save more than **100** in one action.

## MCP

**Field SA/BSA:** `find_ai_leads` → `getAILeadsV2`. Speak the **count**, do not dump names. `save_ai_leads` preview first; **stop this turn**; later `confirm_all` + `confirm_token`. Never `add_company`.

**Business Agent:** `find_ai_leads` → Places circle (`hunt_engine=manager_portal`, radius 1–10, default 1.0). Returns `company_list` this call. `assignment_target` is dest; hunt `owner_user_id` is manager. Then preview save → stop → confirm. Full order: [screens/manager-mcp-how-it-works.md](../screens/manager-mcp-how-it-works.md).
