#!/bin/bash
# Rebuild the AI Brain map page. Output: tools/brain-map/dist/territool-ai-brain-map.html
# Then ask Claude Code to "update the AI brain map" — it publishes the dist html to the existing claude.ai artifact.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
PACK="$(cd "$DIR/../.." && pwd)"
python3 "$DIR/extract_graph.py"
python3 "$DIR/build.py"
OUT="$DIR/dist/territool-ai-brain-map.html"
NEWER=$(find "$PACK" \( -name '*.md' -o -name '*.mmd' \) -not -path '*/dist/*' -newer "$OUT" | wc -l | tr -d ' ')
if [ "$NEWER" = "0" ]; then echo "up to date"; else echo "WARNING: $NEWER source files are newer than the page"; fi
