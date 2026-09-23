---
title: "Find Leads — limits"
---

# Find Leads — limits

Part of [05-Find-Leads](MODULE.md). Verbatim from the former `07-Operational-Reference/limits-and-performance.md` (verified against code 2026-09-15; split 2026-09-16). Real numbers from code, not estimates. Other features' limits: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## AI Find Leads (Google Places + Gemini pipeline)

Source: `app/Http/Controllers/AILeadFinderController.php`.

| Stage | Limit / timeout | Effect |
|---|---|---|
| Stage 1 — Gemini strategy planner | `set_time_limit(60)` | Planning call must resolve inside 60s or the PHP process is killed. |
| Stage 2 — Places search kickoff | `set_time_limit(30)` | Applies to the request that starts the SSE stream, not the whole search. |
| Stage 2 — Places page fetch | `set_time_limit(300)` | Per-page-batch ceiling while paging Places results. |
| Stage 2 — full pipeline (long searches) | `set_time_limit(600)` | Outer ceiling for a single AI Find Leads run. A search that would run longer must resume (`resume_ai_lead_search`), not retry from scratch. |
| Places page size | `pageSize: 20` | Each Places API page returns up to 20 results; multiple pages are fetched per search term. |
| Gemini Stage 3 refinement chunk size | `STAGE3_REFINEMENT_CHUNK_SIZE = 42` | Qualitative refinement batches results in groups of 42 before sending to Gemini. |
| Gemini Stage 3 concurrency | `GEMINI_STAGE3_MAX_CONCURRENT = 4` | At most 4 refinement chunks run in parallel. |
| Outbound HTTP timeouts | `CURLOPT_CONNECTTIMEOUT = 15`, `CURLOPT_TIMEOUT = 120` (Stage 3 calls); `CURLOPT_TIMEOUT = 5` (lightweight lookups) | A single stalled upstream call fails fast rather than hanging the whole search. |

**Agent-facing implication:** if a search is taking a long time or was interrupted, use `resume_ai_lead_search` — do not start a second `find_ai_leads` for the same territory, and do not assume a timeout means zero results were found (partial results stream via SSE before any timeout hits).
