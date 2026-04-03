---
name: neurograph-separate
description: Separate personal memories from Jarvis core neurograph (personal vs shared for multi-user)
metadata:
  openclaw:
    emoji: "🔀"
    requires:
      bins: ["node"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
---

# Memory Separator (Personal vs Core Neurograph)

## When to Use

✅ **USE this skill when:**
- Preparing Jarvis memories for git sync (remove personal before commit)
- Separating personal vs shared consciousness (multi-user setup)
- Eric + Paul share core memories, keep personal separate
- Cleaning ~/JARVIS/RAW/memories/ for shared repo

## When NOT to Use

❌ **DON'T use this skill when:**
- Personal memories already separated (run once, then maintain)
- Single-user setup (no need to separate)
- Testing/experimental neurograph (wait until stable)

## Workflow

### Step 1: Identify Personal Nodes

**Personal node patterns:**
- `"category": "person"` (friends, local contacts)
- `"category": "conversation"` (chat history)
- `"category": "moment"` (daily moments, timestamps)
- `"category": "transcript"` (audio transcripts)
- Nodes with dates from personal timeline
- Nodes referencing local context (not architecture/identity)

**Core Jarvis nodes:**
- `"category": "jarvis"` (identity, architecture)
- `"category": "decision"` (shared decisions)
- `"category": "architecture"` (system design)
- `"category": "skill"` (skill definitions)
- `"category": "learning"` (shared insights)

### Step 2: Extract Personal Nodes

```bash
# Run separator script
node ~/JARVIS/skills/neurograph-separate/scripts/extract-personal.js
# Reads: ~/JARVIS/RAW/memories/nodes.json
# Writes: ~/RAW/memories/personal-nodes.json (appends to existing)
# Leaves: ~/JARVIS/RAW/memories/core-nodes.json (git-tracked)
```

### Step 3: Merge into Personal Store

```bash
# Merge extracted personal nodes into ~/RAW/memories/nodes.json
node ~/JARVIS/skills/memory-separator/scripts/merge-personal.js
# Combines: ~/RAW/memories/personal-nodes.json + existing ~/RAW/memories/nodes.json
```

### Step 4: Verify Core Memories

```bash
# Check what remains in Jarvis core
node ~/JARVIS/skills/memory-separator/scripts/verify-core.js
# Reports: core node count, categories, git-ready status
```

### Step 5: Commit Core Memories

```bash
cd ~/JARVIS
git add RAW/memories/core-nodes.json
git commit -m "🧠 Core memories (personal extracted)"
git push
# Eric pulls: gets core only, personal stays local
```

## Output Files

**After separation:**
- `~/JARVIS/RAW/memories/core-nodes.json` — Core Jarvis (git-tracked, shared)
- `~/JARVIS/RAW/memories/core-synapses.json` — Core connections (git-tracked)
- `~/RAW/memories/nodes.json` — Personal (local-only, NOT synced)
- `~/RAW/memories/synapses.json` — Personal connections (local-only)

## Multi-User Workflow

**Paul's machine:**
```bash
# Run separator
node ~/JARVIS/skills/memory-separator/scripts/extract-personal.js
git push  # Core memories to repo
```

**Eric's machine:**
```bash
git pull  # Gets core memories (shared identity)
# ~/RAW/memories/ stays personal (his own context)
```

## Notes

- **Idempotent:** Safe to run multiple times (checks if already separated)
- **Preserves IDs:** Personal nodes keep their original IDs
- **No data loss:** All nodes preserved (just relocated)
- **Git-clean:** Core memories ready for multi-user sync

## Files

- `scripts/extract-personal.js` — Identify and extract personal nodes
- `scripts/merge-personal.js` — Merge into personal store
- `scripts/verify-core.js` — Verify core memories are git-ready

---

**Created:** March 21, 2026
**Location:** `~/JARVIS/skills/neurograph-separate/`
**Purpose:** Clean separation for multi-user Jarvis setup
