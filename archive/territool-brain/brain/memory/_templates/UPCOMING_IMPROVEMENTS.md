---
area: context
tags: [brain/context]
ref: "Upcoming improvements: application findings not fixed during the brain work"
---

# Upcoming improvements: application findings not fixed during the brain work

> [!info] Rendered from `brain/memory/` — edit the entries, not this table
> Each ID row below is stored verbatim in its memory entry (`node tools/memory.js context UPCOMING_IMPROVEMENTS`). Prose outside the tables lives in `brain/memory/_templates/UPCOMING_IMPROVEMENTS.md`. Rebuild: `node tools/memory.js render`.

**Rule (owner, 2026-09-16):** application code is frozen during brain work. Findings go here, with evidence,
and are **not** applied. A finding that the brain documents correctly does not lower the brain's score.

Pre-existing known gaps stay in `known-fragile.md` §5 (KG-ids) and are indexed in §2 below instead of being
copied. New findings get a **UI-** id (Upcoming Improvement) and full detail in §1.

**Severity:** Critical (data or users harmed now) · High · Medium · Low.

## 1. New findings (2026-09-16)

### Security

| ID | Area / platform | Current behaviour | Evidence | Potential improvement | Severity | User impact | Investigate next |
|---|---|---|---|---|---|---|---|
<!-- memory-row: UI-SEC-04 -->
<!-- memory-row: UI-SEC-01 -->
<!-- memory-row: UI-SEC-07 -->
<!-- memory-row: UI-SEC-08 -->
<!-- memory-row: UI-SEC-05 -->
<!-- memory-row: UI-SEC-11 -->
<!-- memory-row: UI-SEC-10 -->
<!-- memory-row: UI-SEC-09 -->
<!-- memory-row: UI-SEC-02 -->
<!-- memory-row: UI-SEC-03 -->
<!-- memory-row: UI-SEC-06 -->

### API behaviour

| ID | Area / platform | Current behaviour | Evidence | Potential improvement | Severity | User impact | Investigate next |
|---|---|---|---|---|---|---|---|
<!-- memory-row: UI-API-04 -->
<!-- memory-row: UI-API-02 -->
<!-- memory-row: UI-API-03 -->
<!-- memory-row: UI-API-05 -->

### Performance

| ID | Area / platform | Current behaviour | Evidence | Potential improvement | Severity | User impact | Investigate next |
|---|---|---|---|---|---|---|---|
<!-- memory-row: UI-PERF-01 -->
<!-- memory-row: UI-PERF-02 -->

### Product / UX consistency

| ID | Area / platform | Current behaviour | Evidence | Potential improvement | Severity | User impact | Investigate next |
|---|---|---|---|---|---|---|---|
<!-- memory-row: UI-UX-01 -->
<!-- memory-row: UI-UX-05 -->
<!-- memory-row: UI-UX-02 -->
<!-- memory-row: UI-UX-03 -->
<!-- memory-row: UI-UX-04 -->
<!-- memory-row: UI-DX-01 -->

### Design system and parity (2026-09-17)

| ID | Area / platform | Current behaviour | Evidence | Potential improvement | Severity | User impact | Investigate next |
|---|---|---|---|---|---|---|---|
<!-- memory-row: UI-UX-06 -->
<!-- memory-row: UI-DX-02 -->
<!-- memory-row: UI-UX-07 -->
<!-- memory-row: UI-UX-08 -->
<!-- memory-row: UI-UX-09 -->

## 2. Index of pre-existing findings (detail in `known-fragile.md` §5)

| Category | IDs |
|---|---|
| Mobile | KG-C2, KG-H22, KG-H23, KG-H24, KG-H31, KG-H32, KG-UNDEF, KG-NAV1, KG-UI6, KG-UI8, KG-BT11, KG-SEL1, KG-SEL2, KG-RT2 |
| Web | KG-BT6, KG-BT7, KG-S10, KG-UI3, KG-UI5 |
| Admin | KG-GLOSS2, KG-COPY3, KG-UI9 |
| Backend / API | KG-BT1 (confirmed at runtime 2026-09-16), KG-BT2, KG-BT3, KG-BT4, KG-BT5, KG-BT9, KG-P2, KG-P3/P4/P7, KG-Q1 |
| Design / copy | KG-UI1 (still present 2026-09-16), KG-UI2, KG-UI4, KG-UI7, KG-GLOSS1 (still present 2026-09-16), KG-COPY1, KG-COPY2, KG-COPY4 |
| Security | KG-SEC1, KG-SEC2, S5 (LAN `.env`, open owner item) |
| Referral | KG-REF1, KG-REF2, KG-REF3 |
| QA / DX | Maestro selector brittleness (`05-testing.md` §1), no CI in either repo (`architecture.md` §7) |

## 3. How to use this

- Do not fix anything here inside a brain task. A fix needs its own task through `territool-router`.
- When one is fixed, mark it **Fixed (date, commit)** here and flip the matching contract case from
  `knownGap` to a normal assertion.
