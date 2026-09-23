---
title: "Find Leads — known issues and error messages"
---

# Find Leads — known issues and error messages

Part of [05-Find-Leads](MODULE.md). Verbatim from the former `07-Operational-Reference/known-issues-and-error-messages.md` (literal strings from the controllers, verified 2026-09-15; split 2026-09-16). Use these when you need the exact string the backend returns. Cross-feature and system-level entries: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## Find Leads / AI search

| Literal message | When it fires | What to tell the user |
|---|---|---|
| `This search has failed and cannot be resumed.` | `resume_ai_lead_search` called on a search that terminally failed | Start a new `find_ai_leads`, don't keep retrying resume. |
| `Strategy not found` | Stage 2/3 tried to run against a Stage 1 strategy record that's missing/expired | Equivalent to a failed search — start over. |
| `Job not found or expired.` | Referencing an async job id (e.g. bulk enrich) past its lifetime | The batch is gone; re-run the action rather than polling further. |
| `Zipcode must be 8 characters or less.` | Free-text zip/postal input exceeds 8 chars | Ask for a shorter/valid postal code — this also covers non-US formats that are naturally longer; truncation is not silent. |
| `Please enter a precise address.` | Geocoding a manually entered address failed to resolve confidently | Ask for a more specific address (street number, city) rather than retrying the same string. |
