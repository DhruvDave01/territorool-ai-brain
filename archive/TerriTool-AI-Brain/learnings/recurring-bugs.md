---
title: "Recurring bugs"
---

# Recurring bugs

From bible `known-issues.md`, Playwright dumps, and code comments. Not a full ticket log.

| Symptom | Likely area | Notes |
|---------|-------------|-------|
| `ReferenceError: AuthUser is not defined` on `/login` and `/register` | `public/vendor/adminlte/dist/js/custom_picwa.js` line 24 `if(!AuthUser)` vs `front.layout` defining `var AuthUser` only inside `@if(Auth::user())` | Confirmed 2026-09-16 from Playwright dumps + source. Staging login HTML still loads `custom_picwa.js` and does **not** define `AuthUser`. Guest pages always throw on document ready. |
| Insufficient credits on save/buy | Credit wallets SA vs BSA | Literal: `Insufficient credits, please subscribe to add credits.` |
| Resume AI search fails | `user_ai_search` terminal/expired | `This search has failed and cannot be resumed.` / `Strategy not found` |
| Zip validation | Find Leads | `Zipcode must be 8 characters or less.` |
| Geocode weak | add company / search | `Please enter a precise address.` |
| Bulk buy “stuck” | Queue worker | `Contact purchase started.` / `Job not found or expired.` |
| Manager blank page | Stale bundle or missing root | Rebuild; check mount ids |
| MCP draft expected | RoutesTools publish | Product rule, not a bug |
| Dead enrich providers | v2 still registered | Don’t call Apollo/Cognism for live fetch |
| Support tickets look like noise | `support_ticket` | Local/staging QA clutter (operational-notes) |

When you fix one, add date + PR and whether it was product vs environment.
