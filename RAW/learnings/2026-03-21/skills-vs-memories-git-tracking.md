# Skills Git-Tracked, Personal Memories Excluded

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Architecture

| Layer | Location | Git-Tracked? | Shared? |
|-------|----------|--------------|---------|
| Skills | `~/JARVIS/skills/` | ✅ Yes | ✅ Yes (Eric gets updates) |
| Learnings | `~/JARVIS/RAW/learnings/` | ✅ Yes | ✅ Yes (shared knowledge) |
| Core Memories | `~/JARVIS/RAW/memories/` | ✅ Yes | ✅ Yes (Jarvis identity) |
| Personal Memories | `~/RAW/memories/` | ❌ No | ❌ No (your life) |
| Archive | `~/RAW/archive/` | ❌ No | ❌ No (your files) |

## The Problem Solved

Previously `~/JARVIS/RAW/memories/` was tracked in git, so Eric got YOUR memories when he pulled. Now:
- Eric pulls latest skills + core memories (shared Jarvis identity)
- Eric keeps his own personal memories (his people, his life)
- No memory overwrites on git pull

## Sync Workflow for Eric

1. Publish skills: `clawhub sync` or `clawhub publish skills/...`
2. Eric pulls: `git pull` (gets skills + core, keeps personal)
3. Eric's memories stay intact in his `~/RAW/memories/`