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
import time
import urllib.error
import urllib.request
from collections import defaultdict
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from retrieve import retrieve, source_paths

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("GRAPH_CHAT_PORT", "8765"))
RATE_WINDOW = 600
RATE_MAX = 20
_hits: dict[str, list[float]] = defaultdict(list)


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
CHAT_SECRET = os.environ.get("GRAPH_CHAT_SECRET", "").strip()

SYSTEM = """You answer questions about TerriTool using the attached AI_BRAIN notes.
Code wins over notes. Do not invent MCP tools, FormData keys, or credit costs.
If notes are missing, say so. Prefer the cited note path. Keep answers short.
Never print API keys or secret values."""


def client_ip(handler: SimpleHTTPRequestHandler) -> str:
    forwarded = handler.headers.get("x-forwarded-for") or ""
    if forwarded:
        return forwarded.split(",", 1)[0].strip()
    return handler.client_address[0]


def rate_ok(ip: str) -> bool:
    now = time.time()
    recent = [t for t in _hits[ip] if now - t < RATE_WINDOW]
    if len(recent) >= RATE_MAX:
        _hits[ip] = recent
        return False
    recent.append(now)
    _hits[ip] = recent
    return True


def provided_secret(handler: SimpleHTTPRequestHandler, body: dict) -> str:
    header = (handler.headers.get("x-brain-secret") or "").strip()
    if header:
        return header
    auth = (handler.headers.get("authorization") or "").strip()
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return str(body.get("secret") or "").strip()


def pack_notes(hits: list[tuple[str, str]]) -> str:
    return "\n\n".join(f"### {name}\n{body}" for name, body in hits) or "(no matching notes)"


def build_messages(user_text: str, history: list[dict], selected: str | None, hits: list[tuple[str, str]]) -> list[dict]:
    focus = f"Selected graph node: {selected}\n\n" if selected else ""
    messages = []
    for item in history[-8:]:
        role = item.get("role")
        text = (item.get("content") or "").strip()
        if role in {"user", "assistant"} and text:
            messages.append({"role": role, "content": text})
    messages.append({
        "role": "user",
        "content": f"{focus}Question:\n{user_text}\n\nNotes:\n{pack_notes(hits)}",
    })
    return messages


def anthropic_chat(user_text: str, history: list[dict], selected: str | None) -> tuple[str, list[str]]:
    if not API_KEY:
        return (
            "Chat server has no ANTHROPIC_API_KEY. Copy AI_BRAIN/.env.example to "
            "AI_BRAIN/.env, add the key, then restart graph-server.py.",
            [],
        )
    hits = retrieve(user_text, selected, root=ROOT)
    sources = source_paths(hits)
    payload = json.dumps({
        "model": MODEL,
        "max_tokens": 1200,
        "system": SYSTEM,
        "messages": build_messages(user_text, history, selected, hits),
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
        return f"Anthropic returned {err.code}. Check ANTHROPIC_MODEL in .env. {body}", sources
    except urllib.error.URLError as err:
        return f"Could not reach Anthropic: {err.reason}", sources
    parts = data.get("content") or []
    reply = "".join(p.get("text", "") for p in parts if p.get("type") == "text") or "(empty reply)"
    return reply, sources


def anthropic_stream(user_text: str, history: list[dict], selected: str | None):
    hits = retrieve(user_text, selected, root=ROOT)
    sources = source_paths(hits)
    if not API_KEY:
        yield "error", (
            "Chat server has no ANTHROPIC_API_KEY. Copy AI_BRAIN/.env.example to "
            "AI_BRAIN/.env, add the key, then restart graph-server.py."
        )
        yield "done", sources
        return
    payload = json.dumps({
        "model": MODEL,
        "max_tokens": 1200,
        "stream": True,
        "system": SYSTEM,
        "messages": build_messages(user_text, history, selected, hits),
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
            event = "message"
            buf = b""
            while True:
                chunk = resp.read(256)
                if not chunk:
                    break
                buf += chunk
                while b"\n" in buf:
                    line, buf = buf.split(b"\n", 1)
                    raw = line.decode("utf-8", errors="replace").strip()
                    if raw.startswith("event:"):
                        event = raw[6:].strip()
                    elif raw.startswith("data:"):
                        data_s = raw[5:].strip()
                        if data_s == "[DONE]":
                            break
                        try:
                            data = json.loads(data_s)
                        except json.JSONDecodeError:
                            continue
                        delta = data.get("delta") or {}
                        text = delta.get("text") or ""
                        if text:
                            yield "delta", text
                        if data.get("type") == "error" or event == "error":
                            yield "error", data_s[:400]
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8", errors="replace")[:500]
        yield "error", f"Anthropic returned {err.code}. {body}"
    except urllib.error.URLError as err:
        yield "error", f"Could not reach Anthropic: {err.reason}"
    yield "done", sources


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
            self._json(200, {
                "ok": True,
                "has_key": bool(API_KEY),
                "model": MODEL,
                "auth_required": bool(CHAT_SECRET),
            })
            return
        super().do_GET()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-headers", "content-type, x-brain-secret, authorization")
        self.send_header("access-control-allow-methods", "POST, GET, OPTIONS")
        self.end_headers()

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
        if CHAT_SECRET and provided_secret(self, body) != CHAT_SECRET:
            self._json(401, {"error": "Ask is locked. Set the shared secret."})
            return
        if not rate_ok(client_ip(self)):
            self._json(429, {"error": "Too many questions. Wait a few minutes."})
            return
        message = (body.get("message") or "").strip()
        if not message:
            self._json(400, {"error": "Type a question first."})
            return
        selected = (body.get("selected") or "").strip() or None
        history = body.get("history") if isinstance(body.get("history"), list) else []
        if body.get("stream"):
            self._sse(message, history, selected)
            return
        reply, sources = anthropic_chat(message, history, selected)
        self._json(200, {"reply": reply, "sources": sources})

    def _sse(self, message: str, history: list, selected: str | None) -> None:
        self.send_response(200)
        self.send_header("content-type", "text/event-stream; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.send_header("x-accel-buffering", "no")
        self.end_headers()
        for kind, payload in anthropic_stream(message, history, selected):
            blob = json.dumps({"type": kind, "data": payload})
            self.wfile.write(f"data: {blob}\n\n".encode("utf-8"))
            self.wfile.flush()

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
    if CHAT_SECRET:
        print("Ask is locked (GRAPH_CHAT_SECRET).")
    server.serve_forever()


if __name__ == "__main__":
    main()
