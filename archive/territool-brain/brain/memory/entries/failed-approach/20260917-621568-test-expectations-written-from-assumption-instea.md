---
id: VAULT-20260917-621568
type: failed-approach
status: CURRENT
evidence: VERIFIED
source: workspace/test-suites/api-contract/last-run.json and workspace/test-suites/web/last-run.json (runs 2026-09-17)
origin: ai-loop
supersedes: []
superseded_by: []
features: []
flows: []
platforms: []
files: [workspace/test-suites/api-contract/lib/common-cases.js]
relations:
occurrences: 1
first_recorded: 2026-09-17
last_verified: 2026-09-17
verified_against: "mobile f20c5aa · web 21d6348c"
labels: [testing]
area: memory
tags: [brain/memory]
ref: "Test expectations written from assumption instead of the code failed three times"
---

# Test expectations written from assumption instead of the code failed three times

## What

Three new cases failed for test reasons, not product reasons: getUserActivity treats an unknown scope as "all" by design (V2/AuthController.php:853-859), companylist returns all ids in `company_list_ids` even past the last page, and the web runner's AJAX headers make Laravel answer 401 instead of a redirect; the first HQ redirect hop for a Business Agent is /dashboard. A permission check that accepted "no data" also passed vacuously for an Admin with no rows.

## Why it matters

A test built on an invented expectation either fails for the wrong reason or passes for the wrong reason.

## Evidence

workspace/test-suites/api-contract/last-run.json and workspace/test-suites/web/last-run.json (runs 2026-09-17)

## Implication for future work

Read the controller (and the runner's request headers) before writing an expectation; name the page-rows field for edge cases; permission cases must assert the refusal itself, never "no data".

## Related

—
