#!/usr/bin/env python3
"""Serve the AI_BRAIN graph and proxy typed chat to Anthropic.

Keys come from environment or AI_BRAIN/.env — never from the HTML page.
  python3 graph-server.py
Then open http://127.0.0.1:8765/graph.html
"""
from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("GRAPH_CHAT_PORT", "8765"))
STOP = {
    "a", "an", "the", "and", "or", "to", "of", "in", "for", "on", "is", "it",
    "how", "what", "does", "do", "we", "can", "this", "that", "with", "from",
}


def load_env(path: Path) -> None:
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = val


load_env(ROOT / ".env")

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip()
MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5").strip()
ANTHROPIC_VERSION = os.environ.get("ANTHROPIC_VERSION", "2023-06-01")

SYSTEM = """You answer questions about TerriTool using the attached AI_BRAIN notes.
Code wins over notes. Do not invent MCP tools, FormData keys, or credit costs.
If notes are missing, say so. Prefer the cited note path. Keep answers short.
Never print API keys or secret values."""


def tokenize(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]{3,}", text.lower()) if t not in STOP}


def retrieve(question: str, selected: str | None, limit: int = 6) -> list[tuple[str, str]]:
    terms = tokenize(question)
    if selected:
        terms |= tokenize(Path(selected).stem.replace("-", " "))
    scored: list[tuple[int, Path]] = []
    for path in ROOT.rglob("*.md"):
        if path.name in {".env.example"}:
            continue
        rel = path.relative_to(ROOT).as_posix()
        try:
            body = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        blob = (rel + " " + body).lower()
        score = sum(blob.count(t) for t in terms)
        if selected and rel == selected:
            score += 80
        if score:
            scored.append((score, path))
    scored.sort(key=lambda item: -item[0])
    out: list[tuple[str, str]] = []
    for _, path in scored[:limit]:
        rel = path.relative_to(ROOT).as_posix()
        body = path.read_text(encoding="utf-8", errors="replace")[:4500]
        out.append((rel, body))
    return out


def anthropic_chat(user_text: str, history: list[dict], selected: str | None) -> str:
    if not API_KEY:
        return (
            "Chat server has no ANTHROPIC_API_KEY. Copy AI_BRAIN/.env.example to "
            "AI_BRAIN/.env, add the key, then restart graph-server.py."
        )
    notes = retrieve(user_text, selected)
    packed = "\n\n".join(f"### {name}\n{body}" for name, body in notes) or "(no matching notes)"
    focus = f"Selected graph node: {selected}\n\n" if selected else ""
    messages = []
    for item in history[-8:]:
        role = item.get("role")
        text = (item.get("content") or "").strip()
        if role in {"user", "assistant"} and text:
            messages.append({"role": role, "content": text})
    messages.append({
        "role": "user",
        "content": f"{focus}Question:\n{user_text}\n\nNotes:\n{packed}",
    })
    payload = json.dumps({
        "model": MODEL,
        "max_tokens": 1200,
        "system": SYSTEM,
        "messages": messages,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        method="POST",
        headers={
            "content-type": "application/json",
            "x-api-key": API_KEY,
            "anthropic-version": ANTHROPIC_VERSION,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8", errors="replace")[:500]
        return f"Anthropic returned {err.code}. Check ANTHROPIC_MODEL in .env. {body}"
    except urllib.error.URLError as err:
        return f"Could not reach Anthropic: {err.reason}"
    parts = data.get("content") or []
    return "".join(p.get("text", "") for p in parts if p.get("type") == "text") or "(empty reply)"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format: str, *args) -> None:
        msg = format % args
        if "api/chat" in msg or "Authorization" in msg:
            msg = re.sub(r"sk-[A-Za-z0-9_-]+", "[redacted]", msg)
        super().log_message("%s", msg)

    def do_GET(self) -> None:
        if self.path.split("?", 1)[0] == "/api/health":
            self._json(200, {"ok": True, "has_key": bool(API_KEY), "model": MODEL})
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path.split("?", 1)[0] != "/api/chat":
            self.send_error(404)
            return
        length = int(self.headers.get("content-length") or "0")
        raw = self.rfile.read(min(length, 200_000))
        try:
            body = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self._json(400, {"error": "Send JSON with a message field."})
            return
        message = (body.get("message") or "").strip()
        if not message:
            self._json(400, {"error": "Type a question first."})
            return
        selected = (body.get("selected") or "").strip() or None
        history = body.get("history") if isinstance(body.get("history"), list) else []
        reply = anthropic_chat(message, history, selected)
        self._json(200, {"reply": reply})

    def _json(self, code: int, obj: dict) -> None:
        blob = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.end_headers()
        self.wfile.write(blob)


def main() -> None:
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Graph + chat: http://127.0.0.1:{PORT}/graph.html")
    if not API_KEY:
        print("Missing ANTHROPIC_API_KEY — copy .env.example to .env")
    server.serve_forever()


if __name__ == "__main__":
    main()
