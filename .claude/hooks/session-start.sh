#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

GSTACK_DIR="$HOME/.claude/skills/gstack"

if [ ! -d "$GSTACK_DIR/bin" ]; then
  echo "Installing gstack..." >&2
  mkdir -p "$HOME/.claude/skills"
  git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR"
  cd "$GSTACK_DIR" && ./setup
  echo "gstack installed." >&2
else
  echo "gstack already installed, skipping." >&2
fi
