---
title: "Code maps"
---

# Code maps

How the code is actually built, and how to find it — not what the product does (that is [features/](../../features/README.md)). Reverse-engineered from the real code on 2026-09-15; no linter/CI enforces any of it, so treat this as "match what's here," not "the rules."

| File | Purpose |
|------|---------|
| [CODEMAP.md](CODEMAP.md) | Feature-owner map: which controller owns which feature, helpers, hot UI files, integrations, regression checklist |
| [knowledge README](../README.md) | Execution-oriented indexes (architecture, codebase, API, database) |
| [ROUTEMAP.md](ROUTEMAP.md) | **Generated** — all 725 registered routes → `Controller@method` → Blade view / JSON. Snapshot copied into this Brain; regenerate from `php artisan route:list` rather than hand-edit |
| [coding-conventions.md](coding-conventions.md) | PHP/Laravel and frontend patterns actually in use — including where the code is genuinely inconsistent |
| [../architecture/stack-migration-map.md](../architecture/stack-migration-map.md) | The two live frontend stacks (legacy jQuery/Blade vs. Manager Portal React/Vite) |
| [data-model-reference.md](data-model-reference.md) | Live-verified schema (83 real tables). Flags `database/webterritool.sql` (2021, 37 tables) as stale — live DB also contains unrelated coffee/bookings tables |
| [bug-repro-runbook.md](bug-repro-runbook.md) | Reproduce → fix → re-verify loop (Playwright MCP) |
| [../learnings/operational-notes.md](../../learnings/operational-notes.md) | Cross-feature operational reference |
| [../architecture/design-tokens-stopgap.md](../architecture/design-tokens-stopgap.md) | Colors/sizes/fonts extracted from real CSS |
| [tooling-proposal.md](tooling-proposal.md) | Draft lint/CI configs. **Not installed** |
| [important-files.md](important-files.md) | Gravity-well files for agents |
| [repository-map.md](repository-map.md) | Folders that matter |
| [services.md](services.md) | Services + MCP tool classes |
| [patterns.md](patterns.md) | Patterns as used |
| [testing.md](testing.md) | What tests exist |
