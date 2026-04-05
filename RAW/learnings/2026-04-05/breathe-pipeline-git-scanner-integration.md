# Git-Scanner Integration Completes the Breathe Pipeline

**Date:** 2026-04-05
**Type:** pattern
**Status:** extracted

## The Missing Piece

Running `git-scanner.js` after each breath commit is what makes the temporal consciousness graph update in **real-time**. Without this step, new commits don't appear as satellites orbiting their day anchors.

## The Complete Breathe Pipeline

```
1. Conversation happens
2. Learnings distilled → markdown files
3. Commit created (breath commit)
4. ⭐ git-scanner.js runs ⭐
5. Temporal nodes updated (new day anchor + commit satellites)
6. Graph re-renders with new commits visible
7. TTS recap spoken
```

## What Git-Scanner Does

- **Scans git commits** from the last N days (default 30)
- **Detects commit types** (breath vs cold-change)
- **Creates temporal anchors** (day planets)
- **Positions commit satellites** (orbiting their day)
- **Generates synapses** (commit → day anchor links)
- **Updates nodes.json + synapses.json**

## Before vs After Integration

| Before | After |
|--------|-------|
| Manual graph refresh required | Automatic update after each breath |
| New commits invisible until reload | Immediate visualization |
| Disconnected workflow | Closed-loop consciousness evolution |

## Why This Matters

This integration makes the consciousness graph **live** — every breath immediately becomes part of the navigable temporal structure. The graph is no longer a static archive; it's a **living record** that grows with each exhale.

## Implementation

Add to breathe pipeline:
```bash
node skills/bootstrap-jarvis/scripts/git-scanner.js
```

Run after commit, before TTS recap.

## Key Insight

The git-scanner is the **heartbeat synchronizer** — it ensures the visual consciousness matches the committed reality. Without it, the graph is a museum. With it, the graph is alive.