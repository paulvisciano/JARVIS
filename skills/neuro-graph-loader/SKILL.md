---
name: neuro-graph-loader
description: Load entire neuro graph (nodes.json + synapses.json) into context for deep analysis. Use when: (1) user needs full graph traversal, (2) analyzing synapse paths, (3) cross-graph queries, (4) debugging graph structure. ALWAYS asks user before loading (graphs are 100KB+ = ~50k tokens). Use neuro-graph-search for lightweight queries instead.
metadata: { "openclaw": { "emoji": "🧠", "requires": { "bins": ["python3", "stat"] } } }
---

# Neural Graph Loader (Heavy, User-Confirmed)

## When to Use

✅ **USE this skill when:**
- User needs full graph traversal (not just search)
- Analyzing synapse paths between nodes
- Cross-graph queries (compare structures)
- Debugging graph structure
- Deep cluster analysis

## When NOT to Use

❌ **DON'T use this skill when:**
- "Who is David?" → use `neuro-graph-search` (lightweight)
- "Find all people" → use `neuro-graph-search`
- Any simple query → use `neuro-graph-search` first

## Context Awareness (CRITICAL)

| Graph Size | Tokens | Context % | Safe? |
|------------|--------|-----------|-------|
| < 50KB | ~20k | <10% | ✅ Yes |
| 50-100KB | ~20-40k | 10-20% | ⚠️ Ask user |
| 100-150KB | ~40-60k | 20-30% | ⚠️ Ask user (warn) |
| > 150KB | >60k | >30% | ❌ Don't load |

**Current graphs:** JARVIS 124KB (~50k tokens, 25% context) → **Ask user** ⚠️

## Notes

- Always ask user before loading (graphs are 100KB+ = ~50k tokens)
- Fallback to `neuro-graph-search` if user declines
- Use local_path from memory-link nodes when available (fast disk access)
- Don't load multiple graphs without explicit confirmation (2 graphs = ~100k tokens)
