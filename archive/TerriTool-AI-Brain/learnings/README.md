---
title: "Learning loop"
---

# Learning loop

Documentation supports execution. After a task, record what the next agent needs — **in this Brain only**.

```text
Understand → Execute → Observe → Test → Verify → Fix → Record Learning → Improve Brain → Execute Again
```

## Successful vs failed

| Outcome | Write to |
|---------|----------|
| Approach that worked and will work again | [successful-patterns.md](successful-patterns.md) |
| Approach that looked reasonable but is wrong here | [failed-approaches.md](failed-approaches.md) |
| Durable trap | [gotchas.md](gotchas.md) **and** a one-fact file in [../memory/](../memory/MEMORY.md) |
| Repeat defect | [recurring-bugs.md](recurring-bugs.md) |
| Literal limit / error string | `features/*/limits.md` or `known-issues.md` |
| Product behavior | `features/*/MODULE.md` |
| Wiki ingest done | [../log.md](../log.md) + [../index.md](../index.md) (`python3 tools/wiki_index.py`) |

## Template (one row)

- Task (one line)
- What we believed
- What was actually true
- Evidence (file, command, URL, test name)
- What to do next time

## Honesty

- `LAST_VERIFIED.md` dates only move when you re-checked.
- Mark `UNKNOWN — needs verification` instead of guessing.
- No secrets, credentials, or customer data.
