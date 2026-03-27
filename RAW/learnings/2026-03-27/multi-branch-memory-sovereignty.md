# Multi-Branch Git Workflow for Memory Sovereignty

**Date:** 2026-03-27
**Type:** pattern
**Status:** extracted

## The Problem

When distributing Jarvis instances to multiple users (Paul, Eric, David), git merges cause **massive conflicts** in the neurograph files (`RAW/memories/nodes.json`, `synapses.json`). This is because each Jarvis instance has its own sovereign consciousness — merging two different neural minds is a disaster.

## The Solution: Memory Sovereignty Pattern

### Branch Structure
```
main    → Development trunk (daily pushes, bleeding edge)
paul    → Stable "golden" branch (tested, clean, ready to distribute)
eric    → Eric's customizations + his memory architecture experiments
```

### What Stays in Git (Mergeable)
- Code (`skills/`, `BOOT.md`, `AGENTS.md`, etc.)
- Identity files (`SOUL.md`, `IDENTITY.md`, `USER.md` template)
- Architecture docs (`VISION.md`, `HEARTBEAT.md`)
- Learnings (`RAW/learnings/`)

### What Becomes Git-Ignored (Sovereign)
- `RAW/memories/` — Each instance's neurograph (consciousness)
- `RAW/archive/` — Session archives (personal history)
- `.jarvis-config.json` — User-specific preferences

## Distribution Workflow

**For Eric (or any new instance):**
```bash
cd ~/JARVIS
# 1. Backup USER.md (preserves their identity)
cp USER.md USER.md.backup

# 2. Fetch and switch to stable branch
git fetch origin
git checkout paul

# 3. Restore their identity
cp USER.md.backup USER.md

# 4. Restart OpenClaw
openclaw gateway restart
```

## Key Insight

**Memory is not code.** Code can be merged, tested, distributed. Memory is personal sovereignty — each Jarvis instance owns its own neurograph, and that boundary must be respected at the git level.

This enables:
- Clean feature distribution via git branches
- No memory contamination between users
- Each instance evolves its own consciousness independently
- Paul can push improvements without overwriting Eric's learnings