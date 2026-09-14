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

```bash
vercel --prod
```

Never commit `.env` or API keys.
