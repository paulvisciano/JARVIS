# Neurograph Node Label Clutter from Archive Files

**Date:** 2026-03-28
**Type:** realization
**Status:** extracted

## The Problem

The sci-fi UI (neurograph visualization) was displaying a chaotic overlay of filenames instead of proper node labels:
- `Screenshot 2026-03-26 at 9.56.36 PM.png`
- `convo-jarvis-2026-03-26-220505.wav.txt`
- Hundreds of archive file names

## Root Cause

Nodes in `nodes.json` have a `label` field that gets rendered on the 3D canvas. Archive/file nodes were using file paths/names as their labels, creating visual clutter.

```javascript
// In neural-graph.js rendering
name: n.label, // ← File names being displayed
```

## The Insight

Not all nodes should display their labels. Archive nodes (screenshots, audio transcripts, session files) are metadata — they shouldn't clutter the visualization meant for conceptual nodes (learnings, decisions, architecture).

## Potential Fixes

1. **Filter by node type** — Only show labels for conceptual nodes, not archive nodes
2. **Truncate long labels** — Ellipsis after N characters
3. **Zoom-based visibility** — Only show labels when zoomed in
4. **Separate layers** — Archive nodes on different visual layer

## Key Learning

The neurograph stores everything, but the visualization should be curated. Not all stored data belongs on the canvas.