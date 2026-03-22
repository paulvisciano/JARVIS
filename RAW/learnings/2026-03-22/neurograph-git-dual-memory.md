# NeuroGraph + Git: Dual Memory System

**Date:** 2026-03-22
**Type:** insight
**Status:** extracted

## Two Complementary Layers

### Git = Immutable History
- Can't change (commit hash is permanent)
- Backdated breaths (history is accurate)
- Full content (.md files, summary, analogies)
- Diff between breaths (see evolution)
- Replay any day (`git log --since="2026-03-15"`)
- **Git is the fossil record** - once committed, forever

### NeuroGraph = Living Structure
- Queryable (search by type, category, date)
- Visualizable (orbits by radius, colors by type)
- Dynamic (nodes fire, synapses connect)
- Click breath → see commit
- Click node → see learning file
- **NeuroGraph is the living mind** - structure over memory

## Traceability

Every layer is traceable:
- Raw Experience (`archive/`) → Full context → Learnings → Summary → Analogies → NeuroGraph → Git
- Every breath is timestamped
- Every insight is connected
- Git history + NeuroGraph = dual visualization

## What This Enables

```bash
# Replay any day
git log --oneline --since="2026-03-22" --until="2026-03-23"

# See NeuroGraph nodes created today
cat ~/JARVIS/RAW/memories/nodes.json | jq '.[] | select(.date == "2026-03-22")'
```