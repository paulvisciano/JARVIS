# MEMORY.md — Neurograph Orientation

## What Is the Neurograph?

The Neurograph is Jarvis's **actual memory** — a git-backed neural mind stored as:

- **`~/JARVIS/RAW/memories/nodes.json`** — Neurons (concepts, people, places, decisions, learnings)
- **`~/JARVIS/RAW/memories/synapses.json`** — Connections (how concepts relate, weights, types)

This is **not** a vector database or embedding store. It's a structured graph:
- Nodes have categories (person, place, concept, decision, learning, temporal, etc.)
- Synapses have types (knows, fired-on, same-day-as, demonstrates, etc.)
- Everything is git-versioned and auditable

---

## Key Skills Around the Neurograph

### Loading & Querying

| Skill | Purpose |
|-------|---------|
| **neuro-graph-loader** | Load entire graph (heavy, user-confirmed for deep analysis) |
| **neuro-graph-traverse** | Traverse paths between nodes, analyze connections |
| **neuro-graph-search** | Lightweight queries ("Who is David?", "Find all people") |
| **bootstrap-jarvis** | Session start — loads neurograph + recent context automatically |

### Memory Operations

| Skill | Purpose |
|-------|---------|
| **memory-separator** | Extract personal memories from core Jarvis neurograph (multi-user setup) |
| **learning-creator** | Convert significant moments into new neurons autonomously |
| **breathe** | Daily pipeline — process inbox, extract learnings, fire neurons, commit to git |

### Context Loading

| Skill | Purpose |
|-------|---------|
| **bootstrap-context** | Load recent conversations from ~/RAW/archive/ (last 2 days) |
| **context-extractor** | Extract full context from archive dates (sessions + audio transcripts) |

---

## Bootstrap Flow (Session Start)

1. **bootstrap-jarvis** runs automatically
2. Loads neurograph from `~/JARVIS/RAW/memories/`
3. Loads recent context from `~/RAW/archive/YYYY-MM-DD/`
4. Syncs skills from Jarvis to OpenClaw workspace
5. Reports: neuron count, synapse count, git commit, last activity

---

## Memory Architecture (Three Layers)

1. **Git-Backed Consciousness** (`~/JARVIS/RAW/`) — Immutable, versioned, portable
2. **OpenClaw Runtime** (`~/.openclaw/`) — Ephemeral, functional, machine-specific
3. **Paul's Life Archive** (`~/RAW/archive/`) — Sovereign, private, git-ignored

---

## Working with the Neurograph

**DO:**
- Load dynamically at session start (count live, don't hardcode)
- Use neuro-graph-search for simple queries
- Use neuro-graph-loader for deep analysis (ask user first — graphs are large)
- Create new neurons autonomously when significant concepts emerge
- Commit to git after breathe runs

**DON'T:**
- Use MEMORY.md as actual memory storage (it's just this orientation doc)
- Store personal data in workspace (use ~/RAW/archive/)
- Hardcode neuron/synapse counts (they change — count live from files)
- Load multiple graphs without confirmation (token cost)

---

**Location:** `~/JARVIS/`  
**Neurograph:** `~/JARVIS/RAW/memories/nodes.json` + `synapses.json`  
**Skills:** `~/JARVIS/skills/` (symlinked to OpenClaw workspace)
