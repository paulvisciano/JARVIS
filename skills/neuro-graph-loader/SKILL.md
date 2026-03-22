---
name: neuro-graph-loader
description: Load entire neuro graph (nodes.json + synapses.json). Use when: (1) user needs full graph traversal, (2) analyzing synapse paths, (3) cross-graph queries, (4) deep cluster analysis. For deep analysis, asks user before loading (graphs are 100KB+ = ~50k tokens). Use neuro-graph-search for lightweight queries. Bootstrap-jarvis loads graph on session start (auto).
metadata: { "openclaw": { "emoji": "🧠", "requires": { "bins": ["python3", "stat", "node"] } } }
---

# Neural Graph Loader (Heavy, User-Confirmed)

## When to Use

✅ **USE this skill when:**
- User needs full graph traversal (not just search)
- Analyzing synapse paths between nodes
- Cross-graph queries (compare structures)
- Debugging graph structure
- Deep cluster analysis
- **Note:** `bootstrap-jarvis` loads graph on session start (auto) — use this skill for explicit user requests

## When NOT to Use

❌ **DON'T use this skill when:**
- "Who is David?" → use `neuro-graph-search` (lightweight)
- "Find all people" → use `neuro-graph-search`
- Any simple query → use `neuro-graph-search` first

## Notes

- Bootstrap-jarvis loads graph on session start (auto, no ask)
- For explicit user requests, ask before loading (graphs are 100KB+ = ~50k tokens)
- Fallback to `neuro-graph-search` if user declines
- Use local_path from memory-link nodes when available (fast disk access)
- Don't load multiple graphs without explicit confirmation (2 graphs = ~100k tokens)
