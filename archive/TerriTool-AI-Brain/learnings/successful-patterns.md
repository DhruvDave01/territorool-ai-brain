---
title: "Successful patterns"
---

# Successful patterns

Approaches that worked on this repo. Add a row when a loop actually succeeded.

| Pattern | Evidence | Use when |
|---------|----------|----------|
| Brain → `Helper::saveAILead` in `app/Helpers/helpers.php` | Validation task A, 2026-09-16 | Locating the 1-credit save-lead charge |
| Staging GET `/login` when local servers are down | curl 200 on `https://staging.territool.com/login` | Proving the guest login page exists without MAMP |
| `vendor/bin/phpunit --filter Manager` | 17 tests, 51 assertions, OK (2026-09-16) while MySQL refused | Checking the real PHPUnit suite without a database |
| Root-cause `AuthUser` from `.playwright-mcp` console + `front.layout` | `custom_picwa.js` line 24; guest layout omits `var AuthUser` | Guest JS errors on login/register |
| Feature folder `MODULE.md` then CODEMAP/ROUTEMAP | Agent contract | Any product change |
| Short `CLAUDE.md` + `memory/` + `.claude/skills/` | ADR-007, 2026-09-16 | Agent amnesia / Claude Code without Cursor |
| Single Brain for feature / UI spec / bug / QA | ADR-008, 2026-09-16 | Where to write specs, QA reports, and learnings |
| LLM Wiki = this Brain (`index.md` + `log.md` + ingest) | ADR-009, [operating/llm-wiki.md](../operating/llm-wiki.md) | Connecting MODULE / UC / FLOW / evidence / code without a second vault |
| Full-flow QA via Customer MCP when Playwright is locked | [validation/qa-full-2026-09-16.md](../validation/qa-full-2026-09-16.md) | Credits, lists, routes, companies without a browser |
| ChatGPT setup landing as a numbered path (install MCP → Project → chat) | `/chatgpt-plugin` verified 2026-09-18; [chatgpt-setup-index-spec.md](../features/20-MCP/flows/chatgpt-setup-index-spec.md) | Public ChatGPT onboarding copy or layout |
