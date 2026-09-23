---
title: "Playwright Test Unavailable"
name: playwright-test-unavailable
description: The package script is not an executable Playwright coverage suite in this checkout.
type: project
---

`package.json` contains `test:e2e: playwright test`, but the repository has no Playwright configuration or spec files. On 2026-09-16, it failed before test discovery because the installed Node version was 14.19.3 while Playwright requires Node 20 or newer.

Why: `npm run test:e2e` output, `rg --files` for Playwright config/specs, 2026-09-16.

How to apply: use Playwright MCP or a real browser for UI QA. Do not call this command a passing E2E suite until a supported Node runtime and intentional configuration/specs are present.
