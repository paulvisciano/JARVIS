# Bootstrap Should Load Graph Not Sync It - Separation of Concerns

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## Key Decision

**bootstrap-jarvis** should LOAD the existing neurograph, not SYNC it.

## Separation of Concerns

| Skill | Purpose | When |
|-------|---------|------|
| bootstrap-jarvis | Load existing graph + context | Every session start (read-only) |
| neuro-graph-sync | Create new nodes + synapses | When new learnings exist (write) |
| neuro-graph-digest | Process learnings into graph | After breathe exhale step |

## Why This Matters

1. **Performance** - Loading is fast, syncing is expensive
2. **Idempotency** - Bootstrap can run anytime without side effects
3. **Clarity** - Read vs write operations are separated
4. **Correct Flow** - Sync happens when learnings are created, not on every boot

## Implementation

bootstrap-jarvis.js now:
- Reads nodes.json + synapses.json
- Reports counts (neurons, synapses, graph size)
- Does NOT modify the graph
- Shows continuity proof (last message timestamp/topic)