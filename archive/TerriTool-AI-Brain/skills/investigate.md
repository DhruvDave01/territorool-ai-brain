---
title: "Skill: Investigate"
name: territorool-investigate
description: >-
  Investigate a TerriTool problem without modifying code first. Use when the
  root cause is unknown.
---

# Skill: Investigate

Given a problem, **do not start by modifying code**.

## Steps

1. **Expected behavior** — bible `MODULE.md` + UC. If the ticket contradicts the bible, flag it.
2. **Locate use case** — [../use-cases/README.md](../use-cases/README.md).
3. **Locate UI flow** — [../ui-flows/README.md](../ui-flows/README.md).
4. **Trace implementation** — [trace-feature.md](trace-feature.md).
5. **Inspect evidence** — Sentry MCP, `storage/logs`, `.playwright-mcp/` console dumps, feature `known-issues.md`, tests.
6. **Hypotheses** — ranked, each falsifiable.
7. **Test hypotheses** — reproduce; change one variable; for UI use Playwright MCP.
8. **Root cause** — file + why, not just “it throws”.
9. **Record evidence** — URLs, payloads, credit before/after, screenshots.

If you cannot reproduce, say so. Do not “fix” an unreproduced issue.

Related: [debug.md](debug.md) once you are ready to change code.
