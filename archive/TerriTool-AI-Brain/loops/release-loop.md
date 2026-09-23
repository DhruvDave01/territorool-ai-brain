---
title: "Release loop"
---

# Release loop

Documented because the prompt asked for it. **The repo has no installable release pipeline.** Treat this as a checklist for humans until deploy/CI is added.

**Change → Tests → Build → CI → Deployment → Smoke tests → Critical UI flows → Monitor → Record outcome**

| Step | Actual status |
|------|----------------|
| Tests | `vendor/bin/phpunit` locally |
| Build | `npm run build` if Manager Portal changed |
| CI | **Absent** |
| Deployment | **UNKNOWN** (no Docker/Forge/Envoyer/Actions) |
| Smoke | Manual / Playwright MCP on staging |
| Critical flows | FLOW-AUTH, FLOW-FIND-LEADS save, FLOW-ROUTE publish, FLOW-MANAGER, MCP `get_credits` |
| Monitor | Sentry `territool` / `territoolre-web`; PostHog **UNKNOWN** dashboards |
| Record | `LAST_VERIFIED.md` + [../learnings/](../learnings/gotchas.md) |

Staging evidence host: `https://staging.territool.com`.

Until a human documents the real deploy command/host, agents must not claim a release was performed from this repo alone.
