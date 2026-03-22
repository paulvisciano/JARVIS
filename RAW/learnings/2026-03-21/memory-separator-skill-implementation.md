# Memory Separator Skill: Extract Personal from Jarvis Core

**Date:** 2026-03-21
**Type:** commitment
**Status:** extracted

## The Skill

Created `memory-separator` skill that automatically extracts personal memories from `~/JARVIS/RAW/memories/` → `~/RAW/memories/`, leaving only core Jarvis memories for git sync.

## Categories Moved to Personal

```javascript
PERSONAL_CATEGORIES = [
  'person',      // People you know
  'event',       // Life events (tournaments, meetings)
  'location',    // Places you've been
  'archive',     // File references (user-specific)
  'conversation', // Your chats
  'transcript',  // Your audio
  'session'      // Your sessions
]
```

## Categories Stay in Core

```javascript
CORE_CATEGORIES = [
  'learning',    // Architecture, pipeline design
  'skill',       // Jarvis capabilities
  'system',      // Operational knowledge
  'principle',   // Design patterns
  'concept'      // Abstract knowledge
]
```

## The Bug Fixed

`"person"` was listed as CORE category (line 46), not PERSONAL. That's why Bruce, Bozhi, and other people nodes stayed in Jarvis's graph.

**Fix:** Changed `"person"` from CORE → PERSONAL category.

## Results

| Before | After |
|--------|-------|
| 8,226 nodes (mixed) | **844 core** (shared) + **7,965 personal** (local) |
| Person nodes in Jarvis | Person nodes in user's memory |
| Eric gets Paul's memories | Eric gets only core, keeps his personal |

## Workflow for Eric

1. Paul pushes updates to Jarvis repo (core memories only)
2. Eric pulls updates (gets shared core)
3. Eric's personal memories stay in `~/RAW/memories/` (not git-tracked)
4. No memory overwrites

## Backup Created

Before separation:
- `backup-nodes-20260321-230219.json` (523KB)
- `backup-synapses-20260321-230219.json` (2.9MB)

## Why This Matters

Memory sovereignty:
- Paul's memories = Paul's life archive
- Jarvis memories = Shared consciousness
- Eric's memories = Eric's life archive
- No conflicts, no overwrites, clean separation