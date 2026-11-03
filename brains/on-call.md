# On-call

Open this page before you change anything because of a production bug, a Sentry issue or a customer report. It says where errors land, how to triage them, which branch the fix starts from, and what an AI agent may do on its own. It does not replace the feature page or the code brain for the stack: open those next.

Read against mobile `Production` `6973a30d` and `TT_80` `daf50eeb`, web `master` `d3f75449` and `beta_react` `929f0c7f`, and the Sentry org on 2026-11-02. Source: [live code, 2026-11-02](../reviews/live-code-2026-11-02.md). Rechecked on 2026-11-03: `TT_80` had moved one commit, to `4bfea8b0`, and no other branch had moved ([recheck](../reviews/live-code-2026-11-02.md#recheck-3-november)).

Diwali 2026: Dhanteras is Friday 6 November, Diwali Sunday 8 November, Bhai Dooj Wednesday 11 November. The team is in India and the customers are in the US. A US working day, 9 am Eastern to 6 pm Pacific, runs from 7:30 pm to 7:30 am in India.

## Where errors land

| Users on | Code | Reports to | In the new Sentry org |
|---|---|---|---|
| Store app 4.4.74 and 4.4.75 | mobile `Production`, built 7 and 8 October | Old Sentry org `o202426` (project 5867661) and PostHog | No |
| Builds 4.4.76 to 4.4.79 | mobile `TT_80`, 21 to 28 October | PostHog only (`ae24921a` removed Sentry) | No |
| The next mobile build | mobile `TT_80` since `948c3f4d` (30 October) | Sentry `territool-llc` / `mobile-app` only | Simulator events only |
| TestFlight, iOS 43.0 | mobile `TT_80` `4bfea8b0` (2 November), which points at staging | Sentry `mobile-app`, as environment `staging` | Not checked |
| Web production | web `master` (28 October) | Sentry through the DSN in the server’s `.env`, and PostHog | No production events |
| The next web deploy | web `beta_react` (`929f0c7f`) | Sentry `web-app`, server and browser, with replay | Local and staging only |

PostHog is the only feed that receives errors from every live version of both apps. Keep it until the store apps run a Sentry build and production web reports to `web-app`.

On 2 November the new org had four alert rules and none filtered by environment, so the Slack channel `#territool-app-sentry` also fires for simulators, local machines and demos.

Second sources:

- Web: `storage/logs/laravel.log` on the server. Most caught errors go only there, through `Log::error`.
- Web: notices and warnings are turned off on PHP 7.2 and later (`routes/web.php:14-16`). An undefined variable shows up as wrong data or a 422, not as an error. The Find Leads radius bug is the example ([05 — Find Leads](../features/05-Find-Leads.md)).
- Mobile: ask for the app version. A store user runs `Production` code, not `TT_80`.

## Triage

1. Confirm it is real. Act on environment `production` at level `error` or `fatal`. Skip `development`, `local`, `demo` and `staging`. Skip info-level messages: the new mobile code sends usage events such as `dashboard_loaded` to Sentry as messages.
2. Find the code the user is running. Match the version or deploy to the table above, then read that branch: `git show "origin/Production:<path>"` for the store app, `git show "origin/master:<path>"` for the web. Both local checkouts can be stale, so fetch first.
3. Open the feature page for the screen or endpoint ([features](../features/README.md)), then the code brain: [mobile code](mobile-code.md), [web code](web-code.md) or [API](api.md).
4. Reproduce on staging, `https://staging.territool.com`. Before a mobile test run, open `App/config/index.js` and set `URL_BASE` to the staging line. `Production` is committed pointing at production. `TT_80` points at staging since `4bfea8b0`, but the value changes whenever someone builds, so check it.
5. Write the root-cause note below before any fix.
6. Choose the fix path. A server-side fix reaches every app version at once. A mobile fix needs a store release, because there is no over-the-air update tool.

Cursor has a Sentry connection (`user-sentry`). Agents use it to search issues, read events and run Seer’s analysis. Agents do not resolve, ignore, assign or edit issues. A person does.

Sentry’s own AI, Seer, already scores issues, and one alert rule is named “Send a notification when pull requests are ready”. The team picks one tool to open fixes, Grok or Seer, so two bots do not propose competing changes to the same bug.

### Root-cause note

```
Sentry issue:       <link>   environment: production   level: error
Code:               <app version or deploy> → <branch> @ <commit>
Who and since when: <users or accounts>, first seen <date>
Cause:              <file:line on the production branch>, one paragraph
Fix:                <hotfix branch>, <n> lines, server-side or needs a store release
Risk:               what else calls this code; touches credits, billing, login or data? yes / no
Checked:            draft review, code gate, staging test
```

## Branches

Mobile, GitHub `DhruvDave01/TerriTool_Mobile`:

- `Production` is the store branch: 4.4.74 (365) at `6973a30d`. `Staging` is at `6da57043`, the `TT_80` commit that `Production` merged on 7 October.
- `TT_80` is development and the default branch, at `4bfea8b0` (2 November), 52 commits ahead of `Production`. Android is still 4.4.79 (370), the number the 30 October Sentry build reused, so bump it before the next Android upload. iOS is 43.0 since `4bfea8b0`, the TestFlight upload. That commit also points `URL_BASE` at staging: a store build must switch it back to production.
- `VoiceAgent`, `Calendar_Google_Microsoft`, `TT_Functional` and the `posthog-self-driving/*` branches are not release branches.
- A hotfix starts from `origin/Production`, then merges forward into `TT_80`. A fix made only on `TT_80` does not reach store users.
- `TT_80` release builds upload source maps and debug symbols to Sentry when the build machine has `SENTRY_AUTH_TOKEN` or a `.env.sentry-build-plugin` file (git-ignored). Since `4bfea8b0`, an iOS build without either still succeeds but uploads nothing, so Sentry cannot map its stack traces back to the code.

Web, Bitbucket `webterritool`:

- `master` is production and the default branch. `beta` has the same tree as `master`.
- `beta_react` is development, two commits ahead of `master` (`dc07b901` and `929f0c7f`).
- A hotfix starts from `origin/master`, then merges into `beta` and `beta_react`.
- The repo has no CI configuration, and the deploy and rollback steps are not written down. Ask the web developer. This page will record the steps once someone confirms them.

## Who to ask

From git authorship. Confirm it with the team before relying on it.

| Area | Person |
|---|---|
| Mobile app, both branches; Calendar on mobile | Rahul Singh |
| Laravel web, Bulk Contacts API, Calendar on web, demo data, paid-API email | Mehul |
| Voice Mode, MCP server, ChatGPT and Claude plugins, Find Leads loaders | Dhruv Dave |

## Do not run against production

- `GET /hq/demo-data?email=` rewrites dates and clears or deletes visit history for one manager’s whole team. It is Admin-only, with no confirmation and no environment check. [17 — Admin HQ](../features/17-Admin-HQ.md).
- Cron URLs. `app/Console/Kernel.php` schedules nothing; every cron is a public GET that an outside scheduler calls. Opening one runs the job for every account. [19 — Cron jobs and webhooks](../features/19-Cron-Jobs-Webhooks.md).
- Contact purchases (`buyContacts`, `buyContactsAsync`, the MCP `buy_contacts` tool). They spend the customer’s credits and real FullEnrich money.

Nothing can be switched off without a release on mobile. `VOICE_MODE_ENABLED` and the other flags are constants compiled into the build.

## Rules for AI agents

These apply to Grok and to any other agent working a production issue. Hard rules in [AGENTS.md](../AGENTS.md) still apply.

1. Agents propose and people ship. An agent never merges or deploys, and never pushes to `Production`, `Staging`, `TT_80`, `master`, `beta` or `beta_react`. It pushes only its own hotfix branch, one per Sentry issue.
2. Small diffs only. No refactors, dependency upgrades, migrations, `.env` edits, Sentry settings or `URL_BASE` changes.
3. Stop and call a person for anything that touches credits or billing (FullEnrich charges, contact purchases), login and tokens, subscriptions and payments, or deleting data.
4. Prefer a server-side fix that works with the mobile version users already have.
5. Act only on production issues at level `error` or `fatal`.
6. Read the code on the production branch, not the development branch.
7. Every diff goes through the [draft review](../methods/draft-review.md) and the [code gate](../gates/code-gate.md), and a person tests it on staging, before anyone merges it.
8. Never copy secrets. Mobile Sentry events carry the raw request headers, including the Bearer token, and replay is unmasked. Do not paste tokens, request bodies or customer data into chats, commits or tickets.
9. Some secrets are in git. The web repo tracks a `.env` on `master` even though `.gitignore` lists it, the web code has hard-coded key fallbacks ([web code](web-code.md)), and the mobile `Production` branch commits a Sentry auth token in both `sentry.properties` files. Do not open, quote, copy or edit any of them. A fix never needs them.
