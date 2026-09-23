---
title: "Engineering execution protocol"
---

# Engineering execution protocol

For every non-trivial task:

## Subagents

For a large task, do not let one session do exploration, implementation, and review. Dispatch:

| Job | Who |
|-----|-----|
| Research / codebase exploration | Subagent (read-only). Returns file paths and evidence. |
| Implementation | Main session, or a dedicated implementer after the plan is accepted |
| Review / PR polish | Codex ([pr-loop.md](pr-loop.md)) when available |

Decisions (credits, stack, one-product rules, scope) stay with the **human and the main session**. Subagents do not invent architecture. If a subagent returns a claim not in code or this Brain, treat it as `UNKNOWN — needs verification`.

## Step 1 — Understand

- What is being requested, and why?
- Which workflow and users?
- Acceptance criteria?
- Credit or one-product impact?

Read `product/overview.md` + the feature `MODULE.md`.

## Step 2 — Explore

Inspect relevant code, architecture, existing implementations, tests, UI, APIs, database.

Use [trace-feature.md](../skills/trace-feature.md), [codebase.md](../knowledge/codebase.md), [ROUTEMAP.md](../knowledge/code/ROUTEMAP.md).

Do not start coding immediately.

## Step 3 — Plan

Concise plan:

- Files likely to change
- Components/services affected
- Data changes
- Tests required
- UI changes — if new or redesigned, a filled [SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md)
- Risks (credits, MCP/web drift, wrong frontend stack)

## Step 4 — Execute

Smallest coherent implementation. No unrelated refactoring. PHP 7.2-safe. Correct stack.

## Step 5 — Test

Most relevant tests first:

```bash
vendor/bin/phpunit --filter Manager   # when Manager helpers changed, or as a sanity suite
vendor/bin/phpunit                    # full; ExampleTest needs MySQL
```

Then broader validation if the change warrants it. Do not claim Playwright Test exists.

## Step 6 — Verify

| Change | Verify |
|--------|--------|
| Backend | API / PHPUnit / helper |
| UI | Playwright MCP or real browser ([ui-loop.md](ui-loop.md)) |
| QA ask | [qa-loop.md](qa-loop.md) report |
| Database | migration + data check (live schema, not the 2021 dump) |
| Bug fix | original repro + regression |

## Step 7 — Review

```bash
git diff
git status
```

Check correctness, scope, tests, accidental files, error handling, security, performance, UX. No `.env`. No hand-edited `manager-portal.js` unless it is a Vite rebuild.

## Step 8 — Finish

Complete only when **implementation + tests + verification + diff review** are done. Then [../learnings/README.md](../learnings/README.md). One-fact traps also go in [../memory/MEMORY.md](../memory/MEMORY.md). Write only in this Brain. Wiki ingest: [../skills/wiki.md](../skills/wiki.md) — append [../log.md](../log.md) and refresh `index.md` (`python3 tools/wiki_index.py`).

If the human asked for QA of the flow, attach a [qa-loop.md](qa-loop.md) report.

If Codex is available, hand the PR packet to [pr-loop.md](pr-loop.md).
