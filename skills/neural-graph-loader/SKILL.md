---
name: neural-graph-loader
description: Load entire neural graph (nodes.json + synapses.json) into context for deep analysis. Use when: (1) user needs full graph traversal, (2) analyzing synapse paths, (3) cross-graph queries, (4) debugging graph structure. ALWAYS asks user before loading (graphs are 100KB+ = ~50k tokens). Use neural-graph-search for lightweight queries instead.
---

# Neural Graph Loader (Heavy, User-Confirmed)

## Overview

This skill loads entire neural graphs (nodes.json + synapses.json) into context for deep analysis, pathfinding, or cross-graph queries.

**CRITICAL:** Graphs are 100KB+ (~50k tokens). ALWAYS asks user before loading. Use `neural-graph-search` for lightweight queries (people, events, concepts).

## When to Use

| Scenario | Skill | Context Load |
|----------|-------|--------------|
| "Who is David?" | `neural-graph-search` | ~100 tokens |
| "Find all people" | `neural-graph-search` | ~100 tokens |
| "Analyze synapse paths between X and Y" | `neural-graph-loader` | ~50k tokens |
| "Load full graph for debugging" | `neural-graph-loader` | ~50k tokens |
| "Traverse to Paul's graph" | `memory-link-traverse` | Asks first |

## Workflow

### Step 1: Detect Neurograph Location

Auto-detect JARVIS neurograph (default): `$HOME/JARVIS/RAW/memories`

Or Paul's memory neurograph: `$HOME/RAW/memories`

Or user-specified path via `$NEUROGRAPH_PATH` env var.

### Step 2: Check Graph Size (CRITICAL)

Get file sizes for nodes.json + synapses.json.

Typical sizes:
- JARVIS: ~124KB (64KB nodes + 60KB synapses) = ~50k tokens
- Paul's memory: ~120KB (similar) = ~50k tokens

### Step 3: Ask User Before Loading

ALWAYS confirm:

```
⚠️ This will load the entire neural graph into context.

Graph size: 124KB (~50k tokens)
- nodes.json: 64KB (4899 nodes)
- synapses.json: 60KB (5113 synapses)

This will consume ~25% of your context window.

Continue? [y/N]
```

If user says NO:
- Fall back to `neural-graph-search` (lightweight)
- Search only, don't load full graph

If user says YES:
- Load nodes.json + synapses.json
- Enable deep traversal, pathfinding, analysis

### Step 4: Load Graph (If Confirmed)

Load nodes.json and synapses.json via Python script.

Graph now in context for analysis.

### Step 5: Enable Deep Operations

After loading, user can:
- Pathfinding: Find shortest path between node A and B
- Cluster analysis: Show all person nodes connected to March 19
- Synapse traversal: Follow all 'created-by' synapses from skill nodes
- Cross-graph queries: Compare JARVIS + Paul's graph structures

## Context Awareness (Critical)

| Graph Size | Tokens | Context % | Safe to Load? |
|------------|--------|-----------|---------------|
| < 50KB | ~20k | <10% | Yes (low risk) |
| 50-100KB | ~20-40k | 10-20% | Ask user |
| 100-150KB | ~40-60k | 20-30% | Ask user (warn) |
| > 150KB | >60k | >30% | Don't load (too expensive) |

Current graphs:
- JARVIS: 124KB (~50k tokens, 25% context) → Ask user
- Paul's memory: ~120KB (~50k tokens, 25% context) → Ask user

## Examples

### Example 1: User Wants Full Graph Analysis

User: "Load the full neurograph so I can analyze synapse patterns"

Skill: Asks for confirmation (shows size, token cost, context %)

User: "y"

Skill: Loads graph, enables deep analysis.

### Example 2: User Just Wants to Search

User: "Who is David?"

Skill: Uses lightweight search (doesn't load graph)

Result: David not in neurograph, found in learnings (Fork #002).

## Resources

### scripts/
- `check-graph-size.sh` (Bash script to check nodes.json + synapses.json sizes)
- `load-graph.py` (Python script to load graph with user confirmation)
- `prompt-user.sh` (Bash script for user confirmation prompt)

### references/
- Context budget guidelines (when to load vs search)
- Graph size thresholds (safe/ask/don't load)
- Alternative patterns (streaming, pagination, chunking)

### assets/
- User prompt templates (confirmation dialogs)
- Size warning templates (KB + token estimates)

---

Created: March 19, 2026
Location: ~/JARVIS/skills/neural-graph-loader/
Runtime: /usr/local/lib/node_modules/openclaw/skills/jarvis-skills/neural-graph-loader/ (symlinked)
Pattern: Ask before loading (graphs are 100KB+ = ~50k tokens)
Fallback: neural-graph-search for lightweight queries
