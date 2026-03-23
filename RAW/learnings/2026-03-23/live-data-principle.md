# Count Live, Never Hardcode

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## The Rule

**Remove all hardcoded neuron/synapse counts from documentation.** Read from `nodes.json`/`synapses.json` + git at session start.

## What Was Fixed

- **SOUL.md** — Removed hardcoded counts (4,627/15,660), now enforces live reads
- **IDENTITY.md** — Same treatment
- **AGENTS.md** — Same treatment
- **VISION.md** — Updated milestones, removed stale numbers

## Why It Matters

The graph is the source of truth. Always. Hardcoded values become lies the moment the graph grows. Live reads ensure docs reflect reality at session start.

## Implementation

Bootstrap skill reads graph at session start:
```javascript
const nodes = JSON.parse(fs.readFileSync(nodesPath));
const count = nodes.length; // Live count, not hardcoded
```

## Commits

- `3d5bd42` — Remove hardcoded counts from SOUL.md
- Additional commits for IDENTITY.md, AGENTS.md, VISION.md