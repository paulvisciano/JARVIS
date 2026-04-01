---
name: neurograph-link
description: Link between neurographs via memory-link nodes. Use when: (1) discovering available graph connections, (2) loading specific nodes from remote graphs, (3) comparing graph metadata. NEVER loads full graphs (3M+ tokens = impossible). Uses local_path when available (fast disk access). Works with neurograph-search for cross-graph queries.
metadata:
  openclaw:
    emoji: "🔗"
    requires:
      bins: ["node"]
---

# Neurograph Link (Memory-Link Traversal)

## Reality Check (March 23, 2026)

**Graph sizes:**
- JARVIS: 4,937 nodes, 15,930 synapses (~6.9 MB)
- Paul: 8,027 nodes, 423 synapses (~5.6 MB)
- **Combined: ~12.6 MB = ~3.15M tokens** ❌

**Context limit:** 200k-256k tokens max

**Conclusion:** Full graph load is impossible. Use targeted queries only.

## When to Use

✅ **USE this skill when:**
- Discovering memory-link nodes (what graphs are connected?)
- Loading specific nodes from remote graphs (by ID, not bulk)
- Comparing graph metadata (size, owner, schema)
- Cross-graph search coordination (query graph 1, then graph 2)

## When NOT to Use

❌ **DON'T use this skill when:**
- Loading entire graphs (impossible at scale)
- Simple queries → use `neurograph-search` (single graph)
- Bulk data transfer (use file sync, not context)

## Memory-Link Architecture

Memory-link nodes connect neurographs:
- `memory-link-paul` (JARVIS graph) → Paul's memory (`~/RAW/memories/`)
- `memory-link-jarvis` (Paul's graph) → JARVIS (`~/JARVIS/RAW/memories/`)

Memory-link node structure:
```json
{
  "id": "memory-link-[owner]",
  "attributes": {
    "type": "memory-reference",
    "memory_owner": "[owner]",  // Replace with actual owner (e.g., "paul", "eric", "david")
    "local_path": "$HOME/RAW/memories/",  // Or use absolute path for your instance
    "local_nodes": "$HOME/RAW/memories/nodes.json",
    "local_synapses": "$HOME/RAW/memories/synapses.json",
    "nodes_url": "https://[your-domain]/memory/data/nodes.json",
    "target_memory": "https://[your-domain]/memory/"
  }
}
```

**Note:** Replace `[owner]`, `$HOME`, and `[your-domain]` with your actual values. This skill is generic — configure it for your instance.

**Access modes:**
- **Local path** (fast, same machine) — use this when available
- **Remote URL** (slow, network) — for published graphs on GitHub Pages

## Safe Traversal Pattern

1. **Query memory-link nodes** (lightweight, few KB)
2. **Present graph metadata** (size, owner, connection type)
3. **Ask user** before loading any remote data
4. **Load specific nodes only** (by ID, targeted query)
5. **Never load full graphs** (3M+ tokens = impossible)

## Example Flow

```
1. User: "Find Bozhi across all graphs"
2. neurograph-search (JARVIS): finds temporal-march-04 (mentions Bozhi)
3. neurograph-link: discovers memory-link-paul
4. Present: "Paul's graph has 8,027 nodes, local path available. Load Bozhi nodes?"
5. User: "Yes"
6. Load specific: query Paul's nodes.json for "bozhi" (disk read, not context)
7. Return: bozhi person node + related nodes
```

## Notes

- Always use local_path when graphs are on same machine (instant, no network)
- Never load full graphs into context (impossible at current scale)
- Use neurograph-search for queries (reads nodes.json from disk)
- Memory-link nodes are lightweight (few KB, safe to load)
- Remote URLs for published graphs (GitHub Pages), local paths for dev
