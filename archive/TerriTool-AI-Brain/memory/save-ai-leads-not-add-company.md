---
title: "Save AI Leads Not Add Company"
name: save-ai-leads-not-add-company
description: save_ai_leads is not add_company; find_ai_leads is not search_companies
type: project
---

`save_ai_leads` saves Find Leads / AI hunt hits (**1 credit each**, preview then confirm). `add_company` saves a named account the user wants in the book (free). `find_ai_leads` hunts new leads. `search_companies` searches already-saved companies.

Why: MCP tool collisions documented in `features/20-MCP/api-surfaces.md`.

How to apply: never `add_company` for AI search hits. Never `save_ai_leads` for a company the user named and wants stored. Preview `save_ai_leads` even for one company; wait; then `confirm_all` + `confirm_token`.
