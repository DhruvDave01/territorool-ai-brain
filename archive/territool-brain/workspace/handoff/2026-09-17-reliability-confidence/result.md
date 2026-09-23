# Territool task reliability assessment

Date: 2026-09-17

Question: Confidence out of 100 in handling any Territool task without missing or breaking existing functionality.

Assessment: **70/100**, a conservative subjective judgment, not a measured probability of regression-free delivery. An unspecified task spanning any feature cannot inherit the confidence of a narrowly scoped, fully tested change.

## Evidence collected

- `node tools/brain-start.js --skip-sync`: exit 0; machine ready for configured jobs. Sync deliberately skipped because only Claude Code may run brain-sync.
- `node tools/brain-score.js`: exit 0; current indexed feature readiness **73.8/100** across 32 features. F04 renewal 40; F08 routes and F11 lists 70, with 17 and 9 linked problems respectively. Every feature received 0 QA points under the scorer's matching rules; this does not establish that no QA has occurred.
- `node tools/brain-confidence.js`: exit 0; **75.2/100** under the existing rubric. Knowledge 19.4/20, tooling 15/15, verified behaviour 13.8/25, memory 20/20, safety 4/10, team readiness 3/10. Recorded criticality-weighted coverage 43.3%; last two run files report zero failures. No CI workflow invoking suites detected. One open incident and three production pointers reported; no production endpoint accessed.
- Runtime application suites and E2E: **NOT RUN** for this assessment. Prior run files were inspected by the scorer, not rerun.

## Interpretation

Strong documentation, dependency maps, memory and guards support careful work. Incomplete executed coverage, documented mobile check failures, unsettled parity and staging verification blockers limit assurance about preserving all behaviour. The 80.2 historical reading in confidence-score.md is not the current score. Neither existing rubric estimates the probability of zero regressions.

For each concrete task, confidence must be reassessed from affected features, shared dependencies, role/platform coverage and staging regression results. Raising regression confidence requires filling applicable runtime gaps and adding repeatable regression checks, not merely improving documentation scores.

Sources: brain/context/confidence-score.md; brain/context/brain-confidence.md; brain/context/known-fragile.md; brain/context/agent-brief.md (verified-command baselines); brain/memory/README.md; brain/memory/_generated/HOT.md; command output above.

No application code or brain notes changed. Claude Code can capture this assessment into memory. No application QA PASS claimed.
