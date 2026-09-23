---
title: "ChatGPT setup index — screen spec"
---

# ChatGPT setup index — screen spec

Filled before the `/chatgpt-plugin` landing-page restructure. Design procedure: [../../../skills/design-ui.md](../../../skills/design-ui.md).

```text
Screen spec
├── Goal
├── User / role
├── UC ID
├── FLOW ID
├── URL
├── Stack
├── Copy-from
├── Chrome
├── Layout / components
├── States
├── Actions
├── API / web methods
├── Credit impact
├── One-product
└── QA
```

| Field | Value |
|-------|-------|
| Goal | A new ChatGPT user can follow one path: install MCP, then create a Project, then use it in a chat. |
| User / role | Sales Agent (field sales) and Business Agent / manager. Guest-readable setup page. |
| UC ID | UC-MCP-setup (next MCP family ID after UC-MCP-route) |
| FLOW ID | FLOW-MCP |
| URL | `/chatgpt-plugin` |
| Stack | Static HTML in `public/chatgpt-plugin/index.html` + `styles.css` + `main.js`. Not Blade, not Manager React. |
| Copy-from | Live `/chatgpt-plugin` before this change: heading, two role cards that jumped to `#step-7`, then “Create your Project first”, then “Use MCP in a Project chat”. After restructure (verified 2026-09-18): ![Desktop ChatGPT setup index](../evidence/chatgpt-setup-index-desktop.png) ![Mobile ChatGPT setup index](../evidence/chatgpt-setup-index-mobile.png). Tokens already on this page: `#124ac6`, `#14213c`, `#647089`, `#e1e6ef`, `#f5f7fb`. |
| Chrome | None (public setup). Logo + “ChatGPT setup” header only. |
| Layout | Numbered path (01 install MCP → 02 create Project → 03 use MCP). Role cards live inside step 01 and open the role tutorial from the start, not the prompt list. Steps 02 and 03 keep the existing screenshot walkthroughs and IDs `#create-project` / `#use-mcp-in-project`. |
| States | Success = user can see the three-step order and open a role tutorial. Empty/error/permission = none (static). Copy buttons toast via `#status`. Image enlarge dialog when JS is available. |
| Actions | Jump to a step. Open field-sales or manager tutorial. Copy connection-check prompt. Enlarge screenshots. |
| API | `GET /chatgpt-plugin` (static or `ChatGptPluginController@index`). Copy uses clipboard only. |
| Credit impact | none |
| One-product | none (docs only; MCP writes stay in Helper / v2) |
| QA | Happy: landing shows 01 → 02 → 03; role cards go to `/chatgpt-plugin/field-sales` and `/manager`, not `#step-7`. Empty: n/a. Error: copy still works if a prompt panel is present. Role pages still link back to `#create-project`. |

## Current layout (before)

1. H1 “ChatGPT setup tutorials” + “Choose your role. Copy one prompt…”
2. Jump links to Create a Project / Use MCP
3. Role cards → `#step-7` (prompts)
4. Section titled “Create your Project first”
5. Section “Use MCP in a Project chat”

That order contradicts the role tutorials (`01` ready → `02` install plugin → `03` connect → `04` Project).

## Proposed layout

1. H1 “ChatGPT setup” + “Install the TerriTool plugin first. Then create a Project and start a chat.”
2. Path: 01 Install MCP · 02 Create a Project · 03 Use MCP in a chat
3. **01 Install MCP** — role cards to `/chatgpt-plugin/field-sales` and `/chatgpt-plugin/manager`
4. **02 Create your Project** — existing screenshots (`#create-project`)
5. **03 Use MCP in a Project chat** — existing steps (`#use-mcp-in-project`)
