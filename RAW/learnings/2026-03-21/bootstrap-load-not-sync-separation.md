# Bootstrap Should Load Graph Not Sync It

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## Separation of Concerns:

| Skill | Purpose | When |
|-------|---------|------|
| **bootstrap-jarvis** | Load existing graph + context | Every session start (read-only) |
| **neuro-graph-sync** | Create new nodes + synapses | When new learnings exist (write) |
| **neural-graph-loader** | Load nodes.json + synapses.json | Part of bootstrap |

## Why This Matters:

Bootstrap is for **loading** what's already in the graph. Syncing is a separate operation that happens when learnings are created, not on every session start. This prevents unnecessary writes and keeps bootstrap fast.

## Implementation:
Bootstrap reads `nodes.json` and `synapses.json` from `~/JARVIS/RAW/memories/` without modifying them.