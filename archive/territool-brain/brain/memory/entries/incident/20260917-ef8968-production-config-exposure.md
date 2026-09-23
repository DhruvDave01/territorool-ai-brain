---
id: VAULT-20260917-ef8968
type: incident
status: OPEN
evidence: VERIFIED
source: "repos/mobile/App/config/index.js:8-13 (working tree) · git show HEAD:App/config/index.js · ~/.codex/sessions/2026/09/17/rollout-2026-09-17T11-32-25-*.jsonl · adb logcat (emulator-5554) · ~/Library/Application Support/Cursor/logs · repos/web/.codex/config.toml:1-11 · repos/web/.cursor/mcp.json"
origin: audit
supersedes: []
superseded_by: []
features: [F15, F29, F30]
flows: []
platforms: [mobile, api, integration]
files: [repos/mobile/App/config/index.js, repos/mobile/App/utils/bulkContactFetch.js, repos/mobile/App/components/route/contact/people.js, repos/web/.codex/config.toml, repos/web/.cursor/mcp.json]
relations:
  - AFFECTS: S0.1
  - RELATED_TO: brain/context/tooling.md §3
occurrences: 1
first_recorded: 2026-09-17
last_verified: 2026-09-17
verified_against: "mobile 5de027f (HEAD = origin/TT_80, clean tree) · web 21d6348c (+ untracked .codex/.cursor)"
labels: [near-miss, production, S0.1, mcp, metro]
area: memory
tags: [brain/memory]
ref: "Production config near-miss: mobile API URL and production MCP servers (2026-09-17)"
---

# Production config near-miss: mobile API URL and production MCP servers (2026-09-17)

## What

Times are local (IST, UTC+5:30).

**Mobile API base URL (`repos/mobile/App/config/index.js`)**
- `HEAD` and every one of the last 60 commits touching the file have **staging** active and production commented out.
  None of the last 60 had production active.
- **Before 11:35 on 2026-09-17**, the uncommitted working tree had **production** active. When it was switched
  is not recorded; it was after the 2026-09-16 brain baseline, which lists the file as unmodified.
- **11:35:57:** Codex (session `2026-09-17T11-32-25`), preparing "the requested staging Bulk Contact test", read the
  file and patched it to staging.
- **11:53–12:44:** Codex ran its bulk-contact tests (`/tmp/bulk-resume-{open,ready,coffee}.yaml`, app
  `com.picwa.territoolapp`) on Android `emulator-5554`. The emulator log from 12:40 to 14:26 shows 148 staging API
  URLs and **0** production URLs.
- **After 12:45:** the brain audit's `git status` showed the file identical to `HEAD` (staging).
- **13:00:54:** the file was switched to **production** again (last modification time). No Codex or Claude
  tool call made this edit.
- **13:01–13:07:** the iOS build number was bumped (1 → 4), and an Android version bump
  (4.4.69/360 → 4.4.71/362) is also uncommitted. An iOS archive `TerriTool 17-09-26, 1.07 PM.xcarchive` was
  created. An earlier archive exists at 10:37, which falls inside the earlier production window. This reads as
  release preparation, but that is **INFERRED**, not confirmed.
- **Now:**
  - Production is active in the working tree.
  - Metro (pid 16544, running since 09:56, port 8081) serves this working tree.
  - `emulator-5554` is still running with the Territool debug app in the foreground.
  - No API URL has been logged on the emulator since 12:44.

**Production MCP servers in the web repo (untracked, never committed)**
- `repos/web/.codex/config.toml` (created 2026-08-25; last modified **2026-09-16 10:58:02**) lists
  `territool-admin` and `territool-app` on staging, plus `territool-admin-live` and `territool-app-live` on
  **`app.territool.com/ai/mcp-admin` and `/ai/mcp`**.
  - On 2026-09-15 the brain inventory saw only the two staging servers (`brain/audits/00-inventory.md` Codex row).
  - The two live servers appeared at 10:58:02 on 09-16, the same second four Codex sessions opened with the web
    repo as working directory. That the Codex app wrote them is **INFERRED**.
- **New:** `repos/web/.cursor/mcp.json` (modified 2026-09-03) has the **same two production MCP servers**. The brain
  had not recorded this.
  - Cursor has been running since 08:04 today.
  - Its logs show it **connecting to the live servers** on 2026-09-10, 09-11, 09-15, 09-16 and 09-17 (77
    "connected" lines, `auth=unknown`).
  - **No tool-call lines** were found for the live servers.

## Why it matters

- **S0.1 (never touch production)** depends on local configuration that nobody watches.
- One file edit turns every running debug build into a production client through Metro, with no rebuild. Metro's
  refresh can push the edit into an open app.
- Opening Cursor in the web repo contacts production MCP endpoints automatically.
- The bulk-contact screen calls `fetchAllContacts` and `fetchClaudeContact`:
  - They read the user's real company and contact records.
  - They trigger paid provider lookups on the server (FullEnrich / DataAxle; the Claude contact finder).
  - `routesfetchAllContacts` refuses users with fewer than 2 credits
    (`repos/web/app/Http/Controllers/RoutesController.php:1864-1997`).
  - No credit deduction or database write appears in either handler body (helpers not fully traced).
  - The uncommitted change adds a **reload on every app resume** (`people.js`), so each foreground event repeats both calls.

## Evidence

| Question | Answer | Tier |
|---|---|---|
| What does the mobile config point at now? | production (`index.js:12-13` active; staging commented at `:8-9`) | VERIFIED |
| Since when? | last write 13:00:54 today. Also production before 11:35 today; that window's start is unknown (after the 09-16 baseline) | VERIFIED (times) / UNKNOWN (start) |
| Do the uncommitted tests hit the network? | No: `API` and `config` are mocked (`__tests__/bulkContactFetch.test.js:6-7`, `__tests__/bulkContactPeople.test.js:11`) | VERIFIED |
| Does the uncommitted app code make network calls? | Yes, when the screen is used: `fetchAllContacts`, `fetchClaudeContact`, now also on every app resume | VERIFIED |
| Codex Maestro runs today | 11:53–12:41, all after Codex switched to staging; emulator log shows only staging URLs | VERIFIED |
| Brain API / web suites | staging-only guard; last runs 2026-09-16 against `staging.territool.com` (`last-run.json`) | VERIFIED |
| Claude Code MCP calls to TerriTool | none in any of the 6 transcripts | VERIFIED |
| Claude Code contact with production | one status-only `curl` of `app.territool.com/login` on 2026-09-15 (bootstrap), recorded in `00-inventory.md` | VERIFIED |
| Codex MCP calls to TerriTool | none in 35 sessions | VERIFIED |
| Cursor and the production MCP | connected (handshake) on 5 days; no tool calls in its logs | VERIFIED (connect) / NOT VERIFIED (absence of calls: logs may not record every call) |
| App sessions between "production set" and 11:35 today | not verifiable: the emulator log starts at 12:40, no iOS simulator is booted now, physical devices unknown | UNKNOWN |
| claude.ai connector "Territool User Live" | exists on the account; failed to connect in this session (404); its target can't be read from here | UNKNOWN |
| Revalidated after commit `5de027f` (16:38 today) | The production `URL_BASE` is now **active in committed code** on `TT_80` and the commit is on `origin/TT_80`. In the parent commit, staging was active and production was commented out. The working tree is clean. Values not reproduced. | VERIFIED |

## Implication for future work

1. **Before any mobile run**, read `repos/mobile/App/config/index.js` and stop if production is active.
   - The test skill already says so for installed builds.
   - It must also cover **Metro**: a debug build follows the working tree live.
   - The loop's INTAKE station should run this check.
2. **Never open Codex or Cursor with `repos/web` as the working directory** while its untracked
   `.codex/config.toml` or `.cursor/mcp.json` lists `*-live` servers.
   - Cursor connects automatically, so "don't call the tools" is not enough.
3. **A changed environment pointer is an event to record.**
   - `/memory-sync` reconciliation must diff the config URL lines and the MCP config URL lists against the last
     baseline, and raise a `NEEDS-VERIFICATION` entry on any change. This entry would have been raised at 11:35.
4. Uncommitted work by the owner is not changed by the brain (Law 6). The response is to **report and wait**.

## Status history

- 2026-09-17: OPEN → NEEDS-REVALIDATION (App/config/index.js changed in 1 commit(s) after f20c5aa)
- 2026-09-17: NEEDS-REVALIDATION → OPEN (revalidated by Claude Code: commit 5de027f, 16:38, committed the production URL_BASE as active and it is on origin/TT_80; the sync rule that moved this entry now keeps OPEN entries open)

## Related

- `brain/context/tooling.md` §3 (canonical home of the production-MCP warning)
- `brain/context/conventions-shared.md` S0.1
- `workspace/qa-reports/2026-09-17-knowledge-memory-audit.md`

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (15)

**Documents (7):** [[brain/audits/00-inventory|Audit 0 – what exists]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[log|Log]] · [[brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement|Placement: a filter on the Lists library (mobile LS-20)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]]

**Product features (3):** [[_id/F30|Admin MCP]] · [[_id/F29|Customer MCP connectors]] · [[_id/F15|Find & buy contacts]]

**Coding rule (1):** [[_id/S0.1|Never touch the live app]]

**Screenshot (1):** [[_capture/LS-20|Lists library]]

**Code files (3):** [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/route/contact/people.js|people.js]] · [[_code/web/app/Http/Controllers/RoutesController.php|RoutesController]]

%% brain-links:end %%
