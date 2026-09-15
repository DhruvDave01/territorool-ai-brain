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
---
# Feature: AI Find Leads

Related: [03-architecture](../03-architecture.md) · [09-credits-billing](../09-credits-billing.md) · [14-mcp](../14-mcp.md)

## What it does

Find unsaved businesses by city or ZIP and who the rep sells to. **Search is free.** Saving into the Address Book costs **1 credit each**.

## Two engines (do not mix)

| Engine | Who | How |
|-------|--------|-----|
| User V2 | Sales Agent / BSA / web findleads | Gemini planner → Places Text Search → optional Gemini refine. Territory city/ZIP |
| Manager portal | Business Agent `/manager/ai-find-leads` | Places **circle** hunt (`ai_search_by = manager_portal`) |

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

Mobile: `MultipleAIWaypoint` / `aiFindLeads.js` — `getAILeadsV2` → `resumeAILeadSearch` / `getAiLeadData` → `saveAILeads`.

Realm cache `AIFindLeads`: website, city, territoryMode (`city`\|`zip`), sellDetails, aiResponse, aiLeads.

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

1. `find_ai_leads` (free). In progress → `resume_ai_lead_search` **once**.
2. Speak the **count**, do not dump names.
3. `save_ai_leads`: **always preview first** (even for 1 company). Stop and wait.
4. After yes: `confirm_all=true` + `confirm_token`.
5. Never `add_company` for these hits.
