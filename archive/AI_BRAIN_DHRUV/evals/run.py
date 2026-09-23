#!/usr/bin/env python3
"""Retrieval eval. No API key needed.

  python3 evals/run.py
Exit 1 if top-1 or recall@6 fall below the floors.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from retrieve import retrieve, reset_index  # noqa: E402

CASES = Path(__file__).with_name("cases.jsonl")
TOP1_FLOOR = 0.70
RECALL_FLOOR = 0.95


def load_cases() -> list[dict]:
    out = []
    for raw in CASES.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        out.append(json.loads(line))
    return out


def main() -> int:
    reset_index()
    cases = load_cases()
    top1 = 0
    recall = 0
    misses = []
    for case in cases:
        hits = retrieve(case["question"], root=ROOT)
        got = [rel for rel, _ in hits]
        expected = case["expected_notes"]
        primary = expected[0]
        hit1 = got[0] == primary if got else False
        if not hit1 and got and got[0] in expected:
            hit1 = True
        in6 = any(n in got for n in expected)
        all_expected = all(n in got for n in expected) if len(expected) <= 3 else in6
        if hit1:
            top1 += 1
        if in6:
            recall += 1
        if not hit1 or not in6:
            misses.append({
                "id": case.get("id", case["question"][:40]),
                "top1": got[0] if got else None,
                "expected": primary,
                "in6": in6,
                "got": got,
                "all_expected": all_expected,
            })
    n = len(cases)
    t1 = top1 / n
    rec = recall / n
    print(f"cases {n}  top-1 {top1}/{n} ({t1:.0%})  recall@6 {recall}/{n} ({rec:.0%})")
    for m in misses:
        print(f"  miss {m['id']}: expected {m['expected']!r} got {m['top1']!r} in6={m['in6']} {m['got']}")
    if t1 < TOP1_FLOOR or rec < RECALL_FLOOR:
        print(f"FAIL floors top-1>={TOP1_FLOOR:.0%} recall@6>={RECALL_FLOOR:.0%}")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
