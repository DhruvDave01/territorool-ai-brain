---
area: context
tags: [brain/context]
ref: "Contradiction register: where two sources disagreed, and which won"
---

# Contradiction register: where two sources disagreed, and which won

> [!info] Rendered from `brain/memory/` — edit the entries, not this table
> Each ID row below is stored verbatim in its memory entry (`node tools/memory.js context contradiction-register`). Prose outside the tables lives in `brain/memory/_templates/contradiction-register.md`. Rebuild: `node tools/memory.js render`.

Every disagreement found between the brain and the code, the running apps, screenshots, or another brain
note. **Stronger source** follows the evidence priority set by the owner (2026-09-16):

- current UX: running app > current screenshots/video > design docs;
- implementation: current code > docs;
- API: observed behaviour + code > old docs;
- intended behaviour: approved owner decisions > current implementation.

Audit files in `brain/audits/` are **dated records** of how a rule was set. They are not rewritten when code
drifts. The living notes in `brain/context/` are corrected instead, and the drift is logged here.

**Status:** Resolved (brain corrected) · Open (needs the owner or more evidence) · No action (both true).

| ID | Claim A | Claim B | Evidence | Stronger | Resolution | Files corrected | Status |
|---|---|---|---|---|---|---|---|
<!-- memory-row: CR-01 -->
<!-- memory-row: CR-02 -->
<!-- memory-row: CR-03 -->
<!-- memory-row: CR-04 -->
<!-- memory-row: CR-05 -->
<!-- memory-row: CR-06 -->
<!-- memory-row: CR-07 -->
<!-- memory-row: CR-08 -->
<!-- memory-row: CR-09 -->
<!-- memory-row: CR-10 -->
<!-- memory-row: CR-11 -->
<!-- memory-row: CR-12 -->
<!-- memory-row: CR-13 -->
<!-- memory-row: CR-14 -->
<!-- memory-row: CR-15 -->
<!-- memory-row: CR-16 -->
<!-- memory-row: CR-17 -->
<!-- memory-row: CR-18 -->
<!-- memory-row: CR-19 -->
<!-- memory-row: CR-20 -->
<!-- memory-row: CR-21 -->
<!-- memory-row: CR-22 -->
<!-- memory-row: CR-23 -->
<!-- memory-row: CR-24 -->
<!-- memory-row: CR-25 -->
<!-- memory-row: CR-26 -->
<!-- memory-row: CR-27 -->
<!-- memory-row: CR-28 -->
<!-- memory-row: CR-29 -->

## How to add one

1. Record both claims with their exact sources.
2. Decide the stronger source by the priority above. If it is a product decision, mark it **Open** and add
   the question to `open-questions.md` or `UNKNOWN_REGISTER.md`.
3. Correct the living note(s), cite the evidence id, and log it:
   `node tools/log.js fix "<CR-id> <short>"`.
