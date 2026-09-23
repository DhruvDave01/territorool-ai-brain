---
area: root
tags: [brain/root]
ref: "Claude Code Bootstrap Prompt"
---

# Claude Code Bootstrap Prompt

Run `claude` from inside the `territool-brain/` folder, then paste everything
below the line. Paste it as ONE message.

---

You are building a persistent, reusable "brain" for a product called **Territool**,
which has two codebases that must stay in sync: a **React Native mobile app** and a
**Laravel web app**. The brain is a set of skills + context files that will be used
for every future coding, design, testing, and QA task on this product.

Your working root is the current directory. It contains:

- `shoebox/` — raw material I have provided (screenshots, videos, configs, notes)
- `repos/mobile`, `repos/web` — the real codebases, **READ-ONLY** for now
- `brain/` — your output
- `workspace/` — day-to-day output later

## Hard rules for this entire build

1. **Do not modify anything in `repos/`.** Read only. No edits, no installs, no commits.
2. **Do not invent facts about the project.** If the shoebox doesn't tell you and the
   code doesn't tell you, add it to an OPEN QUESTIONS list and ask me. A wrong
   assumption baked into the brain poisons every future task.
3. **Do not skip ahead.** Finish each phase, write its report, show me the summary,
   and wait for my go-ahead before the next phase.
4. **Every claim you write into `brain/context/` must cite its source** — a file path,
   a screenshot filename, or "USER SAID" if I told you directly.
5. **Write as you go.** Don't hold findings in your head; persist them to disk after
   each phase so the work survives a context reset.

## The core architectural requirement

This is ONE brain serving TWO platforms. Structure it as:

```
SHARED SPINE  (platform-agnostic, the actual intelligence)
  - product vocabulary and domain model
  - flow definitions and criticality
  - design principles and tokens
  - quality gates and definition-of-done
  - the code/design/test/QA loop itself

PLATFORM ADAPTERS  (concrete, platform-specific)
  - mobile: RN idioms, navigation, styling, device concerns
  - web:    Laravel idioms, request lifecycle, Blade/Inertia/Vue, responsive rules

PARITY MAP
  - which flows exist on both platforms
  - which must behave identically, which are allowed to differ, and why
```

Any rule that could be shared MUST live in the shared spine, not duplicated in both
adapters. When you find the same concept expressed differently on each platform,
that's a finding — record it in the parity map, don't silently pick one.

---

## PHASE 0 — Inventory and gap report

1. Read `shoebox/00-INDEX.md` and every `README.md` under `shoebox/`.
2. Walk the entire shoebox. List exactly what I actually provided vs what each
   README asked for.
3. Walk `repos/mobile` and `repos/web` at a structural level only — directory tree,
   package.json / composer.json, config files, rough file counts by type, git log
   summary of the last ~50 commits. Do not read every source file yet.
4. If there are videos in `shoebox/*/videos/`, extract frames:
   `ffmpeg -i <video> -vf fps=1 shoebox/<platform>/frames/<flowname>_%03d.png`
   (1 fps; drop to 0.5 if a flow is long). Report how many frames per flow.
5. Write `brain/audits/00-inventory.md` containing:
   - What exists
   - **MISSING — BLOCKING**: things you cannot proceed without
   - **MISSING — DEGRADING**: things whose absence makes the brain weaker but not stuck
   - Your first OPEN QUESTIONS list

Then STOP and show me the blocking gaps and the questions. Do not start Phase 1.

---

## PHASE 1 — Mobile codebase audit

Deep-read `repos/mobile`. Produce `brain/audits/01-mobile.md` covering:

- Stack: RN version, CLI vs Expo, TS vs JS, strictness, navigation lib, state
  management, styling approach, HTTP layer, form handling, storage, auth mechanism
- Architecture: how a feature is structured end to end. Trace ONE real feature
  from screen → hook → service → API → type, and write it up as the canonical example
- Reusability audit: find duplicated components/utils. List concrete duplicates with
  file paths. This becomes the "search before you create" rule
- Type discipline: where types are strong, where `any` leaks in, where props are
  untyped, whether API responses are typed
- Consistency: naming, folder conventions, import ordering, error handling patterns,
  loading/empty/error state handling. Note where the codebase contradicts itself
- Compare against `shoebox/05-standards/mobile-good/` and `mobile-bad/` — do the
  good files actually represent the codebase, or are they aspirational?

End with: **the 12–20 rules a new developer would need to write code that looks
like it belongs here.** Be specific and testable, not "write clean code".

STOP. Show me the rule list for approval before Phase 2.

---

## PHASE 2 — Web codebase audit

Same depth on `repos/web`. Produce `brain/audits/02-web.md`:

- Laravel version, PHP version, frontend layer (Blade / Inertia / Livewire / Vue / React)
- Architecture: controllers vs actions vs services, form requests, resources,
  policies, jobs, events. Trace ONE real feature end to end as the canonical example
- Database: migrations, model relationships, query patterns, N+1 risk areas
- API layer: how the mobile app talks to this. Route structure, auth, response shape,
  error shape, validation error format, pagination
- Reusability, type discipline (docblocks/typed properties/phpstan level), consistency
- Compare against `shoebox/05-standards/web-good/` and `web-bad/`

End with the same deliverable: **12–20 concrete rules.**

STOP for approval.

---

## PHASE 3 — Cross-platform parity audit

This is the phase that makes it ONE brain. Produce `brain/audits/03-parity.md`:

- Map every flow in `shoebox/07-flows/flows.md` to its mobile screens and web pages
- For each shared flow: do the two platforms implement the same business rules?
  Find the divergences by reading both codebases. List them with file paths
- Where does the mobile app duplicate logic that the API should own, or vice versa?
- Vocabulary drift: does the same concept have different names on each side
  (in code, in UI copy, in the API)? Build `brain/context/glossary.md` with the
  canonical term for each concept and the aliases to stop using
- Validation drift: are the same fields validated differently on mobile vs web vs API?
  This is where real bugs live — dig hard
- Produce `brain/context/parity-map.md`: a table of flow × platform × status
  (identical / intentionally different / accidentally different / missing)

STOP for approval.

---

## PHASE 4 — Design audit

Use `shoebox/02-mobile/screenshots` + `frames`, `shoebox/03-web/screenshots` + `frames`,
and `shoebox/04-design/`. Produce `brain/audits/04-design.md`:

- **Extract the real design system from the screenshots, not from what I claimed it is.**
  Actual colours used, actual type sizes, actual spacing. Then diff that against
  `shoebox/04-design/tokens/`. Every mismatch is a finding
- Inconsistency inventory: same element styled differently across screens, with the
  specific screenshot filenames as evidence
- Mobile vs web visual parity: do they look like the same product? Where don't they?
- Per-screen critique: for each screen, note hierarchy problems, spacing problems,
  contrast/accessibility problems, unclear affordances, missing states
- Cross-reference with the code: are these styles hardcoded or tokenised? Find every
  hardcoded colour and magic-number spacing value in both repos
- Propose a **unified token set** that works for both platforms, with the mobile and
  web implementation of each token

STOP. Show me the proposed unified token set for approval — this is a decision I
need to make, not you.

---

## PHASE 5 — Testing and QA audit

Read `shoebox/06-testing/` and both repos. Produce `brain/audits/05-testing.md`:

- What test infra exists today, what's actually run, what coverage looks like
- The Codex setup I described — confirm you understand exactly how test execution
  will work, and ask if anything is unclear
- Map every BLOCKER and HIGH flow from `flows.md` to: does a test exist? what kind?
- Read `shoebox/09-known-issues/fragile.md` and build a **regression risk map**:
  file/module → which flows break when it changes. Derive this from actual imports
  and call graphs where you can, not just from my notes
- Define the test case output format by matching `shoebox/06-testing/formats/`

STOP for approval.

---

## PHASE 6 — Build the brain

Only now write to `brain/`. Build:

### `brain/context/` — the derived truth
`stack.md`, `conventions-shared.md`, `conventions-mobile.md`, `conventions-web.md`,
`design-system.md`, `flows.md`, `parity-map.md`, `known-fragile.md`, `glossary.md`

Every file sourced from the audits. No new claims.

### `brain/skills/territool-router/`
Decides which specialist handles a request, and in what order. Detects platform from
the task (file paths, keywords, or by asking). For anything touching a shared flow,
it must force a parity check.

### `brain/skills/territool-code/`
Pre-flight: search for existing component/util/service before creating anything new;
identify the canonical example file for this kind of work; check the parity map.
Standards check: types declared, no `any`, props typed, naming, folder placement,
error handling, loading/empty/error states, no hardcoded design values, no duplicated
logic, i18n-safe strings. Post-flight: self-review against `code-gate.md` and report
which rules were checked and the result.

### `brain/skills/territool-design/`
Mode A (audit): review existing screens in a flow against the design system, report
problems with severity. Mode B (new screen): audit the surrounding flow first, then
propose direction, then produce a full screen spec. Mode C (full flow): every screen
in the flow, plus the flow notes — how it works, states, transitions, edge cases,
error paths, and the mobile/web variants of each screen. Output goes to
`workspace/design-proposals/`. Specs must be implementable without further questions:
exact tokens, exact spacing, every state enumerated.

### `brain/skills/territool-test/`
Generates both: (1) functional test cases in my format, and (2) E2E specs/scripts for
Codex to execute. Scope selector: full flow vs partial/impacted-only. Pulls impacted
flows from the regression risk map. Covers happy path, validation, permissions per
role, offline/network failure, edge data. Must produce the exact commands I run in Codex.

### `brain/skills/territool-qa/`
The final gate. Builds the impact map for a change, verifies new functionality,
re-verifies every impacted existing flow, checks design against the spec at the
token level, checks mobile/web parity, and issues a PASS / PASS-WITH-NOTES / FAIL
verdict with evidence. Output to `workspace/qa-reports/`.

### `brain/gates/`
`code-gate.md`, `design-gate.md`, `test-gate.md`, `qa-gate.md` — explicit pass/fail
checklists the skills must run against. Every item must be objectively checkable.

### The loop
Wire the router so a FAIL from QA feeds back into the responsible specialist with the
specific defect, which fixes it, and QA re-runs. Cap at 3 iterations, then escalate to
me with what's blocking. Document this loop in `brain/skills/territool-router/`.

### `CLAUDE.md` at the workspace root
The entry point: what Territool is, where everything lives, how to invoke the brain,
and the non-negotiable rules.

---

## PHASE 7 — Validate the brain

Don't declare done. Prove it:

1. Pick a real past change from git history that touched both repos. Run it through
   the brain retrospectively. Did the brain's rules catch what the real change got
   wrong? Write the result to `brain/audits/07-validation.md`
2. Pick a real bug from `fragile.md`. Would the QA gate have caught it? If not, fix
   the gate
3. Take one existing screen and run the design skill's audit mode on it. Is the output
   specific and actionable, or generic? If generic, the design context is too thin —
   say so and tell me what's missing
4. Report honestly on where the brain is still weak and what shoebox material would
   fix it

---

## Start now with PHASE 0 only.

Before you read anything, tell me your plan for Phase 0 in 5 lines. Then execute it.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (29)

**Documents (29):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/gates/code-gate|Checklist – code]] · [[brain/gates/design-gate|Checklist – design]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[brain/gates/test-gate|Checklist – tests]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[shoebox/00-INDEX|Inputs checklist]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[brain/context/parity-map|Mobile vs web differences]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/stack|Tech setup & environments]] · [[brain/context/conventions-web|Web app coding rules]]

%% brain-links:end %%
