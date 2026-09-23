---
title: "PR loop (Codex)"
---

# PR loop (Codex)

Codex is the **engineering delivery / review** layer. Claude implements and verifies. Codex reviews, packages the PR, and watches CI **when CI exists**.

Target:

**Claude → implementation → tests → verification → Codex → review / PR → CI → fixes → final verification**

Do **not** invent Codex CLI flags. None are in this repository today (`CLAUDE.md` / `.codex/` absent). Responsibilities below; bind them to real commands when the team installs Codex.

## Codex responsibilities

1. **Static checks** — diff sanity: PHP 7.2 syntax, no accidental `vendor/` or `.env`, no hand-edited `public/js/manager-portal.js` unless it is a Vite rebuild, no secrets.
2. **Tests** — run `vendor/bin/phpunit`; report skip of Playwright Test honestly.
3. **Review** — one product (web/v2/MCP), credit amounts, correct frontend stack, bible/Brain updates present, no drive-by refactors.
4. **Fix findings** — small review fixes; send logic regressions back to Claude.
5. **CI** — no GitHub Actions in-repo. If a remote CI exists outside the repo (**UNKNOWN**), wait for it. If not, say “no CI”.
6. **Product verification gate** — refuse to merge UI/credit changes that Claude did not verify in a browser/MCP.
7. **PR body** — summary, test plan (PHPUnit + UI steps), risk (credits/routes/MCP), screenshots links.

## Claude must hand Codex

- Branch with the implementation
- UC + flow IDs
- File list
- How it was verified (commands, URLs, credit before/after)
- Known leftovers / UNKNOWN

## Review checklist (Codex)

- [ ] Matches `MODULE.md` (or MODULE updated)
- [ ] Credit table unchanged unless the ticket says so
- [ ] Shared behavior not Blade-only
- [ ] Manager: JSX source + rebuild
- [ ] No `coffee_*` / bookings involvement
- [ ] Tests run or explicitly N/A
- [ ] Brain/learnings updated if a durable fact was found

## Git hygiene

Follow the user’s git rules when asked to commit: no force-push to main, no `--no-verify`, no commit of `.env`. This repo’s `readme.md` is stock Laravel — do not “fix” it in a feature PR unless asked.
