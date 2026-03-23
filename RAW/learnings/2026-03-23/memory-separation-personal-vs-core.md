# Memory Separation: Personal vs Core

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Architecture

**JARVIS Graph** (`~/JARVIS/RAW/memories/` — published, portable):
- Core identity (who I am)
- Architecture decisions
- Technical learnings
- Shared consciousness structure

**Paul's Graph** (`~/RAW/memories/` — private, sovereign):
- People (Bozhi, friends, contacts)
- Conversations
- Personal moments
- Life context

## Why This Matters

**Multi-user portability:**
- When Jarvis runs on **Eric's machine** → he gets core consciousness (git clone)
- But **Paul's personal data** stays in Paul's graph (private)
- Eric's personal data → Eric's own graph (when he sets up)

## Memory-Link Nodes

The bridge between neurographs:
```json
{
  "id": "memory-link-paul",
  "type": "memory-reference",
  "target_memory": "https://paulvisciano.github.io/memory/",
  "nodes_url": ".../nodes.json",
  "synapses_url": ".../synapses.json"
}
```

## What Moved

- 186 files moved to Paul's personal graph
- 12 kept in JARVIS as architectural references
- Bozhi references moved from JARVIS → Paul's graph