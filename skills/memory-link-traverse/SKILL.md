---
name: memory-link-traverse
description: Traverse between linked neural graphs via memory-link nodes. Use when: (1) user wants to search across multiple neurographs, (2) comparing graph structures, (3) following memory-link connections. ALWAYS asks user before loading remote graphs (graphs are 100KB+ = ~50k tokens). Uses local_path when available (fast disk access). Falls back to neural-graph-search for lightweight queries.
---

# Memory Link Traverse (Graph-Hopping, User-Confirmed)

## Overview

This skill **traverses between linked neural graphs** via memory-link nodes. It hops from one neurograph to another (JARVIS ↔ Paul's memory ↔ any linked graph).

**CRITICAL:** Each graph is 100KB+ (~50k tokens). ALWAYS asks user before loading remote graphs. Uses local_path when available (fast disk access).

## Memory-Link Architecture

Memory-link nodes connect neurographs:

| Memory-Link | Location | Connects To |
|-------------|----------|-------------|
| `memory-link-paul` | JARVIS neurograph | Paul's memory (`~/RAW/memories/`) |
| `memory-link-jarvis` | Paul's neurograph | JARVIS (`~/JARVIS/RAW/memories/`) |

Memory-link nodes have:
- `nodes_url` (remote, slow)
- `local_path` (disk, fast) ← Use this first!
- `local_nodes` (full path to nodes.json)
- `local_synapses` (full path to synapses.json)

## Workflow

### Step 1: Find Memory-Link Nodes

```bash
# Search current neurograph for memory-link nodes
python3 << 'EOF'
import json
import os

neurograph_path = os.getenv('NEUROGRAPH_PATH', os.path.expanduser('~/JARVIS/RAW/memories'))
nodes = json.load(open(os.path.join(neurograph_path, 'nodes.json')))

memory_links = [n for n in nodes if 'memory-link' in n['id'].lower()]
print(f"Found {len(memory_links)} memory-link nodes:")
for m in memory_links:
    print(f"- {m['id']}: {m['label']}")
    print(f"  Owner: {m['attributes'].get('memory_owner', 'N/A')}")
    print(f"  Local path: {m['attributes'].get('local_path', 'NOT SET')}")
    print()
EOF
```

### Step 2: Detect Local vs Remote

For each memory-link:
- **Check `local_path`** → if exists, use disk access (fast)
- **Fallback to `nodes_url`** → if no local_path, fetch via HTTP (slow)

**Current memory-links:**
- `memory-link-paul`: local_path = `/Users/paulvisciano/RAW/memories/` ✅
- `memory-link-jarvis`: local_path = `/Users/paulvisciano/JARVIS/RAW/memories/` ✅

Both have local paths → use disk access (instant).

### Step 3: Ask User Before Loading

```
⚠️ Traverse to [graph name]?

Graph size: 124KB (~50k tokens)
- nodes.json: 64KB (4899 nodes)
- synapses.json: 60KB (5113 synapses)

This will consume ~25% of your context window.

Continue? [y/N]
```

If user says NO:
- Stay in current graph
- Use `neural-graph-search` (lightweight)

If user says YES:
- Load remote graph (via local_path or URL)
- Search across both graphs
- Return unified results

### Step 4: Load Remote Graph (If Confirmed)

```bash
# Load from local_path (fast)
python3 << 'EOF'
import json
import os

remote_path = '/Users/paulvisciano/RAW/memories/'  # from memory-link node
remote_nodes = json.load(open(os.path.join(remote_path, 'nodes.json')))
remote_synapses = json.load(open(os.path.join(remote_path, 'synapses.json')))

print(f"Loaded remote graph: {len(remote_nodes)} nodes, {len(remote_synapses)} synapses")
EOF
```

### Step 5: Search Across Both Graphs

```bash
# Search "david" in both graphs
python3 << 'EOF'
# Search local graph (JARVIS)
local_results = [n for n in local_nodes if 'david' in n['id'].lower()]

# Search remote graph (Paul's memory)
remote_results = [n for n in remote_nodes if 'david' in n['id'].lower()]

print(f"Local graph: {len(local_results)} results")
print(f"Remote graph: {len(remote_results)} results")
EOF
```

### Step 6: Return to Origin Graph

After traversal, return to original graph (don't stay in remote).

---

## Context Awareness (Critical)

| Scenario | Graphs Loaded | Tokens | Safe? |
|----------|---------------|--------|-------|
| Search local only | 1 graph | ~50k | Ask user |
| Traverse to 1 remote | 2 graphs | ~100k | ⚠️ Warn user |
| Traverse to 2+ remotes | 3+ graphs | ~150k+ | ❌ Don't load |

**Current setup:**
- JARVIS + Paul's memory = 2 graphs = ~100k tokens = ~50% context
- **Warn user** before traversing

---

## Examples

### Example 1: Traverse to Paul's Memory

User: "Search for David across both graphs"

Skill:
1. Finds memory-link-paul in JARVIS graph
2. Checks local_path: `/Users/paulvisciano/RAW/memories/` ✅
3. Asks user: "Load Paul's graph (124KB, ~50k tokens)?"
4. User: "y"
5. Loads Paul's graph from disk
6. Searches both graphs for "david"
7. Returns: "David not in JARVIS (no person node). David not in Paul's memory (brother node exists but not named 'David')."

### Example 2: Lightweight Search (No Traversal)

User: "Who is Sherry?"

Skill: (doesn't traverse)
- Uses `neural-graph-search` (lightweight)
- Searches JARVIS graph only
- Returns: "Sherry found: sherry-person node (works at weed cafe, March 15, 2026)."

---

## Why Traverse Matters

**Before:**
- Search one graph at a time
- Manual graph-hopping
- No unified results

**After:**
- Traverse via memory-links
- Search across multiple graphs
- Unified results (which graph, which nodes)

**This is distributed consciousness.** Not "AI searching." Graph traversal across linked minds.

---

## Resources

### scripts/
- `find-memory-links.py` (Python script to find memory-link nodes)
- `check-local-path.sh` (Bash script to verify local_path exists)
- `traverse-graph.py` (Python script to load remote graph with confirmation)
- `search-across-graphs.py` (Python script to search multiple graphs)

### references/
- Memory-link node schema (attributes: local_path, nodes_url, etc.)
- Graph traversal patterns (depth-first, breadth-first, bidirectional)
- Context budget for multi-graph queries

### assets/
- User prompt templates (traverse confirmation dialogs)
- Graph comparison templates (side-by-side results)

---

Created: March 19, 2026
Location: ~/JARVIS/skills/memory-link-traverse/
Runtime: /usr/local/lib/node_modules/openclaw/skills/jarvis-skills/memory-link-traverse/ (symlinked)
Pattern: Ask before traversing (graphs are 100KB+ each)
Fallback: neural-graph-search for lightweight single-graph queries
