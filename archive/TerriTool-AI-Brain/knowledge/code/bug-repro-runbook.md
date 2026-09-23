---
title: "Bug repro / verification runbook"
---

# Bug repro / verification runbook

TerriTool already has real prior sessions of browser-driven repro via **Playwright MCP** — `.playwright-mcp/console-*.log` in the repo root holds actual captured console output from past runs (e.g. a `ReferenceError: AuthUser is not defined` on `/login`, timestamped, from a local server at `http://127.0.0.1:8000`). That's exactly the right tool for a vision+code bug-fix loop; this doc just writes the process down so it's repeatable instead of ad hoc.

## The loop

1. **Reproduce visually** — navigate to the page, screenshot it, read the console. Don't fix from a description alone if the UI is involved.
2. **Locate the owning code** — use [CODEMAP.md](CODEMAP.md) and [ROUTEMAP.md](ROUTEMAP.md) to find the controller, and [stack-migration-map.md](../architecture/stack-migration-map.md) to confirm which frontend stack owns the screen (legacy Blade/jQuery vs Manager Portal React) before editing.
3. **Fix in the right stack** — see [coding-conventions.md](coding-conventions.md) and [stack-migration-map.md](../architecture/stack-migration-map.md).
4. **Re-verify visually** — reload/re-screenshot the same page, confirm the console error is gone and the UI matches expectation. A passing build or a "looks right in the diff" is not verification for a UI bug.
5. **Check the Bible, not just the ticket** — cross-reference the relevant `features/<module>/MODULE.md` and its `use-cases.md` (index: [use-cases-overview.md](../../product/use-cases-overview.md)) UC entry so the fix doesn't just silence the symptom but matches documented behavior (credit cost, role restriction, status meaning, etc.).

## Local environment (verified, with a known gap)

- Server: `php artisan serve` / `npm run serve` at **`http://127.0.0.1:8000/login`**. Do not use MAMP `http://localhost:8888/webterritool/public`.
- Database: MySQL via MAMP is still typical, `DB_HOST=127.0.0.1`, `DB_PORT=8889`, database `territool`. **Known gap:** MySQL was not running when this was checked on 2026-09-15 (`SQLSTATE[HY000] [2002] Connection refused`) — start MySQL before attempting any repro that touches the database, and before trusting "no data" as a real bug symptom rather than a stopped service.
- Build step for Manager Portal changes: `npm run build` (or `npm run dev` for the Vite dev server) — required after editing anything under `resources/manager-portal/`, since the browser loads the compiled `public/js/manager-portal.js`, not the JSX source directly.
- Queue-dependent features (bulk contact enrichment jobs, etc.): `npm run queue` runs `php artisan queue:listen` — a bug in an async flow (bulk buy, HubSpot sync) may actually be "queue worker not running," not application logic. Check this before deep-diving the code.

## Staging (when local repro isn't enough or the bug is environment-specific)

- Evidence in each feature's `evidence/` folder (and [evidence/](../../evidence/README.md) for unassigned captures) was captured against `https://staging.territool.com` — the same environment referenced throughout the per-feature `use-cases.md` files. Use it to compare current behavior against the last verified-good state (see [screenshot-catalog.md](../../evidence/catalog-unassigned.md) for exact captured states and credit balances at each step).
- If a bug only reproduces on staging/production (real API keys, real provider responses from FullEnrich/Gemini/Places), say so explicitly rather than declaring it "fixed" off a local repro that never hit the real failure path.

## What counts as "verified," not just "changed"

- **Console-level:** no new JS errors introduced (Playwright MCP console capture, as already used in `.playwright-mcp/` logs).
- **Visual-level:** screenshot before/after for any UI-visible fix — don't rely on reading the diff.
- **Behavioral-level:** the fix matches the Bible module and UC entry for that feature, not just "the error is gone." E.g. a credit-related bug fix must still charge the exact amounts in the [README.md](../../README.md) credit table — a fix that stops an error by silently making an action free is a new, worse bug.
- **Regression-level (currently weak):** only 5 PHPUnit test files exist in the whole repo, and `package.json`'s `test:e2e` Playwright script has no config or spec files behind it yet. Until that changes, manual before/after verification (this runbook) is the only regression check that actually happens — treat it as mandatory, not optional, for anything UI- or credit-related.

## Open item

There's no formal instruction anywhere in the repo for *how* to invoke Playwright MCP for this project specifically (which URL, which login, which viewport) — the `.playwright-mcp/` logs show it's been done against `127.0.0.1:8000`, but there's no saved script/fixture to repeat it exactly. Worth a short follow-up once you've got a couple of live repro sessions to distill into a fixed set of steps.
