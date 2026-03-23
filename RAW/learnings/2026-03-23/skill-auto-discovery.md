# Skill Auto-Discovery From Agent Workspace

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## The Cleanup

Now that Jarvis is a separate agent with its own workspace (`/Users/paulvisciano/JARVIS`), skills in `~/JARVIS/skills/` auto-detect without needing symlinks or `extraDirs` pointer.

## What Changed

- Removed `skills.load.extraDirs` from OpenClaw config
- Removed symlinks from `~/.openclaw/workspace/skills/`
- Skills now live only in `~/JARVIS/skills/`

## Before

```
~/.openclaw/workspace/skills/ → symlinks → ~/JARVIS/skills/
```

## After

```
~/.openclaw/agents/jarvis/ → workspace: ~/JARVIS → auto-discovers skills/
```

## Skill Metadata Fix

Removed broken `metadata:` lines from 13 SKILL.md files that had invalid YAML/JSON syntax (extra closing braces `}}`). The metadata was being parsed incorrectly, causing skills to be filtered out during discovery.

## Commit

`c64d6f5` — breath-2026-03-23: Remove broken metadata lines from SKILL.md files