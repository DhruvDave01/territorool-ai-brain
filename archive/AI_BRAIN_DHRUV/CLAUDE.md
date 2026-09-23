# TerriTool AI Brain (Claude Code)

At session start, treat `../AI_BRAIN.md` as the product briefing and this folder as detailed notes. Do not invent leads, routes, credits, FormData keys, or MCP tools.

## What to read

| Task | Also read |
|------|----------|
| Product / credits / MCP | `../AI_BRAIN.md` plus `09-credits-billing.md` or `14-mcp.md` |
| Mobile implementation | `brains/mobile-code.md` then `code/mobile-code-details.md` + `code/MOBILE_CODEBASE_BRAIN.md` + `data/formdata-dictionary.md` |
| Any UI / UX / new screen or page chrome | `brains/ui-ux-guardian.md` first |
| Mobile UI / tokens / new screen chrome | `brains/ui-ux-guardian.md` then `brains/mobile-ui.md` then `design/MINI-DESIGN-BRAIN.md` |
| Web / Laravel | `brains/web-code.md` then `code/web-code-details.md` + `code/WEB_CODEBASE_BRAIN.md` |
| Web UI / classic vs manager | `brains/ui-ux-guardian.md` then `brains/web-design.md` then `design-web/MINI-DESIGN-BRAIN.md` |
| APIs / FormData / web URLs | `brains/api.md` then `12-mobile-api.md` + `13-web-urls.md` |
| Screen lifecycle (publish, AI V2, login) | `screens/how-it-works.md` |
| Web User / Manager / Admin journeys | `screens/web-how-it-works.md` then `13-web-urls.md` |
| Manager MCP assign → route → contacts | `screens/manager-mcp-how-it-works.md` then `14-mcp.md` |
| Env names (never values) | `ops/env-inventory.md` |
| Index of all notes | `index.md` |

## Must follow

- Class screens, FormData, no Redux, no NativeBase, no nested navigators.
- UI/UX Guardian: copy existing chrome; do not invent a new look. Minor decisions from the shipped app. Major UX (new flow, modal vs page, nav, CTA, auth/pay) → STOP and ask. Do not make UI “better” by preference.
- New mobile UI: copy nearest screen (`CustomHeader` + curved `#F6F7FB` body). Do not “fix” mixed teals or the two danger reds.
- `createroute` is not done until `simplerouteview` reports `route_status === "published"`.
- Credit spend: `get_credits` → quote → wait. AI save ≠ `add_company`. Named person ≠ `add_note`.
- User MCP `save_ai_leads`: preview first; **do not confirm in that turn**; then `confirm_all` + `confirm_token`. Find MCP `save_ai_leads` has **no** preview.
- Manager MCP hunt (BA) is Places circle (`hunt_engine=manager_portal`), not user V2. Never `add_company` for AI hunt hits.
- Code wins over Prompts. If unsure, open the cited file under `TerriTool/` or `webterritool/`.
- Live mobile `URL_BASE` may be staging (comment-swap in `App/config/index.js`). Check the file, do not assume prod.
