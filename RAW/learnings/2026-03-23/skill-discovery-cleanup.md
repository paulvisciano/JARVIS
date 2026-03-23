# Skill Discovery Cleanup

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## The Change

Now that Jarvis is a separate agent with its own workspace (`/Users/paulvisciano/JARVIS`), skills in `~/JARVIS/skills/` should auto-detect without needing the `extraDirs` pointer.

## What Was Removed

- `skills.load.extraDirs` from OpenClaw config
- Symlinks from `~/.openclaw/workspace/skills/`
- Broken `metadata:` lines from 13 SKILL.md files (invalid YAML/JSON syntax)

## Result

Cleaner separation — Jarvis skills auto-detect from the agent workspace without needing explicit pointer. Skills stay in Jarvis folder only.

## Commit

c64d6f5 breath-2026-03-23: Remove broken metadata lines from SKILL.md files
