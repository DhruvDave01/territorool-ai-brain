---
title: "Evidence"
---

# Evidence

Staging and device captures used to verify UI. Filenames often use a narrow no-break space (`U+202F`) before `AM`/`PM`.

## Assigned (open these first)

Each feature that has captures: `features/<module>/evidence/` + that module’s `evidence.md`. Index: [features/README.md](../features/README.md).

Copied from the former product pack on 2026-09-16, plus a 2026-09-17 triage pass that assigned the rest of the unassigned catalog: **159** assigned screenshots across 16 feature modules.

## Unassigned

Screen-identifiable captures are fully triaged as of 2026-09-17 — see [catalog-unassigned.md](catalog-unassigned.md) for the record. What's left in this folder is not feature-assignable by design:

| Path | What | Count |
|------|------|-------|
| `video/Web/webterritool-full-video.mov` | Full web walkthrough | 1 (~159 MB) |
| `video/Mobile/*.MP4` | Mobile recordings (11 Sep) | 4 |

When you identify a new capture dropped into `screenshots/`, move it into the owning feature `evidence/` folder and add a row to that feature’s `evidence.md`.

## Videos

| File | What |
|------|------|
| [webterritool-full-video.mov](video/Web/webterritool-full-video.mov) | Full web walkthrough |
| [ScreenRecording_09-11-2026 12-58-12_1.MP4](<video/Mobile/ScreenRecording_09-11-2026 12-58-12_1.MP4>) | Mobile |
| [ScreenRecording_09-11-2026 13-07-07_1.MP4](<video/Mobile/ScreenRecording_09-11-2026 13-07-07_1.MP4>) | Mobile |
| [ScreenRecording_09-11-2026 13-09-50_1.MP4](<video/Mobile/ScreenRecording_09-11-2026 13-09-50_1.MP4>) | Mobile |
| [ScreenRecording_09-11-2026 13-31-30_1.MP4](<video/Mobile/ScreenRecording_09-11-2026 13-31-30_1.MP4>) | Mobile |

Flow diagrams (not screenshots): `features/*/flows/png/` and `product/flows/png/` (**21** PNGs).
