---
title: "Bug loop"
---

# Bug loop

**Bug report → Expected behavior → Reproduce → Gather evidence → Trace code → Root cause → Fix → Regression test → Playwright verification → Review → PR → CI → Document learning**

| Step | Skill / doc |
|------|-------------|
| Expected | Feature `MODULE.md` + UC + `known-issues.md` |
| Reproduce / evidence | [../skills/debug.md](../skills/debug.md), Sentry MCP, Playwright |
| Trace | [../skills/trace-feature.md](../skills/trace-feature.md) |
| Fix | Minimal, correct stack |
| Regression | PHPUnit if applicable; otherwise the same UI path |
| Review / PR | [pr-loop.md](pr-loop.md) |
| Learn | [../learnings/recurring-bugs.md](../learnings/recurring-bugs.md) + wiki ingest [../skills/wiki.md](../skills/wiki.md) |

If you cannot reproduce, return evidence of what you tried (URL, user role, MySQL up, queue up, console). Do not ship a speculative fix.

After the fix, re-walk the original path ([qa-loop.md](qa-loop.md) if the human asked for a QA report).

Existing runbook: `knowledge/code/bug-repro-runbook.md`.
