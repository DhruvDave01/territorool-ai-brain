---
title: "MCP — use cases"
---

# MCP — use cases

Part of [20-MCP](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). No feature-specific screenshots are catalogued for this module yet; evidence times, where present, refer to captures held by the originating module or in [evidence/](../../evidence/README.md).

## 15. Sales-rep MCP (Claude / ChatGPT)

Same domain as the web app; confirm-before-write for spends. Contract: [api-surfaces.md](api-surfaces.md) (not a Bible module).

| Tool | Cost | Maps to |
|---|---|---|
| `get_credits` | Free | Header credits |
| `find_ai_leads` / `resume_ai_lead_search` | Free | UC-LEAD-01/12 |
| `save_ai_leads` | 1 credit / lead; preview then `confirm_all` | UC-LEAD-05 |
| `search_companies` / `view_company` | Free | UC-CO-04 |
| `add_company` | Free | UC-CO-08; with `route_id` publishes route |
| `set_company_status` | Free | UC-CO-06 |
| `find_contacts` | Preview (FullEnrich then Claude) | UC-CT-01 |
| `find_contacts_bulk` | Counts only | UC-CT-01 |
| `buy_contacts` | **2** FullEnrich / **1** Claude; never free | UC-CT-02 |
| `add_contact` | Free | UC-CT-03 |
| `add_note` / `get_notes` | Free | UC-ACT-01 |
| `add_activity` / `edit_activity` / `view_activities` | Free | UC-ACT-01/02 |
| `mark_visited` | Free | UC-ACT-03 |
| `create_route` / `view_routes` / `view_route` / `get_active_route` / `next_waypoint` / `create_route_from_list` | Free (publish) | UC-RTE-* |
| `create_list` / `view_lists` / `view_list` | Free | UC-LST-* |

Rules of note: never `add_company` for AI search hits (use `save_ai_leads`); ask start/end/name before `create_route` or omit for auto tour.

## UC-MCP-setup — ChatGPT public setup page

Guest-readable `/chatgpt-plugin`. Order is install the role plugin (field sales or manager) → create a ChatGPT Project → select TerriTool in that Project chat. Role cards open the tutorial from the start, not the prompt list. Spec: [flows/chatgpt-setup-index-spec.md](flows/chatgpt-setup-index-spec.md). Credit impact: none.
