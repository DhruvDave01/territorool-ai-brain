---
title: "Skill: Debug"
name: territorool-debug
description: >-
  Reproduce and fix a TerriTool defect with evidence, credits, and the correct
  frontend stack.
---

# Skill: Debug

Workflow:

**Reproduce → Observe → Gather evidence → Hypothesize → Test hypothesis → Locate root cause → Fix → Regression test → UI verification → Document learning**

## TerriTool specifics

- Reproduce on the **correct stack** (Blade vs React).
- Credits: record `total_credit` / `used_credit` before and after.
- Async: is `queue:listen` running?
- DB: is MySQL up (often MAMP port 8889)? Connection refused is not an app bug. Browser QA is still `http://127.0.0.1:8000/login`.
- MCP: reproduce with the tool, then confirm in web UI (one database).
- Do not “fix” insufficient credits by skipping the decrement.

After fix: [test.md](test.md) + [verify-ui.md](verify-ui.md).  
If the root cause is durable, add a line to [../learnings/gotchas.md](../learnings/gotchas.md) or `recurring-bugs.md`, and a one-fact file under [../memory/](../memory/MEMORY.md) when it will still trap the next agent.

Runbook with local URL notes: `knowledge/code/bug-repro-runbook.md`.
