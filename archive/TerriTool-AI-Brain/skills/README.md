---
title: "Skills"
---

# Skills

Base skills are **single capabilities**. Loops compose them ([../loops/README.md](../loops/README.md)). These markdown files are the detailed procedures (YAML `name` + `description` for auto-pick). Cursor loads `.cursor/skills/territool-*`. Claude Code loads `.claude/skills/territool-*` (thin copies that point here).

| Skill | Use when |
|-------|----------|
| [understand-repo.md](understand-repo.md) | New task, unknown area |
| [trace-feature.md](trace-feature.md) | Need the execution path |
| [investigate.md](investigate.md) | Problem without a known root cause |
| [debug.md](debug.md) | Reproducing and fixing a defect |
| [design-ui.md](design-ui.md) | New or redesigned screen — spec from this Brain’s evidence |
| [implement.md](implement.md) | Building a change |
| [test.md](test.md) | Automated checks |
| [verify-ui.md](verify-ui.md) | Real user-visible behavior |
| [wiki.md](wiki.md) | Ingest / query / lint this Brain as an LLM Wiki |

Always: cite files, distinguish fact vs `UNKNOWN`, prefer running product over prose. After the task: [../learnings/README.md](../learnings/README.md). QA of a named flow: [../loops/qa-loop.md](../loops/qa-loop.md).
