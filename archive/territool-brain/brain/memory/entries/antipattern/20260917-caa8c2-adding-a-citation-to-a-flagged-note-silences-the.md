---
id: VAULT-20260917-caa8c2
type: antipattern
status: CURRENT
evidence: VERIFIED
source: "tools/wiki-lint.js (uncited check) · 2026-09-17 step 2"
origin: ai-loop
supersedes: []
superseded_by: []
features: []
flows: []
platforms: []
files: [tools/wiki-lint.js]
relations:
occurrences: 1
first_recorded: 2026-09-17
last_verified: 2026-09-17
verified_against: not verified
labels: [law-7]
area: memory
tags: [brain/memory]
ref: "Adding a citation to a flagged note silences the lint that flagged it"
---

# Adding a citation to a flagged note silences the lint that flagged it

## What

The NEEDS-REVALIDATION callout first contained a backticked audit path; wiki-lint counts that as a citation, so the "uncited" warning would have disappeared without any claim being verified. The path was un-backticked.

## Why it matters

Law 7: never edit knowledge so indicators turn green.

## Evidence

tools/wiki-lint.js (uncited check) · 2026-09-17 step 2

## Implication for future work

When flagging a note, write the flag without citation syntax; clear the warning only by citing real sources for its claims.

## Related

—
