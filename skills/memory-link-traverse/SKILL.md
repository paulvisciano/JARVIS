---
name: memory-link-traverse
description: Traverse between linked neuro graphs via memory-link nodes. Use when: (1) user wants to search across multiple neurographs, (2) comparing graph structures, (3) following memory-link connections. ALWAYS asks user before loading remote graphs (graphs are 100KB+ = ~50k tokens). Uses local_path when available (fast disk access). Falls back to neuro-graph-search for lightweight queries.
metadata: { "openclaw": { "emoji": "🔗", "requires": { "bins": ["python3", "stat"] } } }
---

# Memory Link Traverse (Graph-Hopping, User-Confirmed)

## When to Use

✅ **USE this skill when:**
- User wants to search across multiple neurographs
- Comparing graph structures between minds
- Following memory-link connections (JARVIS ↔ Paul's memory)
- Cross-graph pathfinding (node A in graph 1 → node B in graph 2)

## When NOT to Use

❌ **DON'T use this skill when:**
- "Who is David?" → use `neuro-graph-search` (lightweight, single graph)
- "Find all people" → use `neuro-graph-search` (lightweight)
- Any simple query → use `neuro-graph-search` first

## Memory-Link Architecture

Memory-link nodes connect neurographs:
- `memory-link-paul` (JARVIS neurograph) → Paul's memory (`~/RAW/memories/`)
- `memory-link-jarvis` (Paul's neurograph) → JARVIS (`~/JARVIS/RAW/memories/`)

Memory-link nodes have: `nodes_url` (remote, slow), `local_path` (disk, fast), `local_nodes`, `local_synapses`

## Context Awareness (CRITICAL)

| Scenario | Graphs Loaded | Tokens | Safe? |
|----------|---------------|--------|-------|
| Search local only | 1 graph | ~50k | Ask user |
| Traverse to 1 remote | 2 graphs | ~100k | ⚠️ Warn user |
| Traverse to 2+ remotes | 3+ graphs | ~150k+ | ❌ Don't load |

**Current setup:** JARVIS + Paul's memory = 2 graphs = ~100k tokens = ~50% context. **Warn user** before traversing.

## Notes

- Always ask user before loading remote graphs (graphs are 100KB+ each)
- Use local_path from memory-link nodes when available (fast disk access)
- Fallback to neuro-graph-search for lightweight single-graph queries
- Don't load 3+ graphs without explicit confirmation (~150k+ tokens)
