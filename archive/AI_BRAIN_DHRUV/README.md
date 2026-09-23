---
id: README
parent: core
related:
  - index.md
---
# TerriTool AI Brain

Product knowledge vault plus an [Obsidian-style graph](https://territorool-ai-brain.vercel.app) you can search and chat with.

Start at [index.md](index.md). Graph: `graph.html` (site `/` redirects there).

## Local

```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
python3 graph-server.py
```

Open http://127.0.0.1:8765/graph.html

## Vercel

Project env: `ANTHROPIC_API_KEY` (sensitive). Optional: `ANTHROPIC_MODEL`.

Gmail Allow page: [https://tt-gmail-allow.vercel.app/gmail.html](https://tt-gmail-allow.vercel.app/gmail.html). Needs `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_TOKEN_SECRET`, `BRAIN_PUBLIC_URL`. Redirect URI: `https://tt-gmail-allow.vercel.app/api/gmail/callback`.

```bash
vercel --prod
```

Never commit `.env` or API keys.
