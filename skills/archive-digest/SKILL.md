---
name: archive-digest
description: Digest daily archives into neurograph. Use at end-of-day to: (1) verify all archive files + learnings have nodes, (2) create missing nodes, (3) link to temporal anchors, (4) ensure graph integrity. Runs verification + creation in one flow.
metadata: { "openclaw": { "emoji": "📅", "requires": { "bins": ["node", "python3"], "files": ["~/JARVIS/RAW/memories/nodes.json", "~/JARVIS/RAW/memories/synapses.json"] } } }
---

# Archive Digest (End-of-Day Graph Integrity)

## When to Use

✅ **USE this skill when:**
- End-of-day: digest all archives + learnings from today
- Verify graph integrity: every file has a node
- Create missing nodes: archive files + learning .md files
- Link to temporal anchors: date-based nodes
- Ensure 1:1 mapping: files on disk = nodes in graph

## When NOT to Use

❌ **DON'T use this skill when:**
- Mid-day processing (use process-inbox skill instead)
- Single file archival (use memory-link-traverse)
- Graph search/queries (use neural-graph-search)
- Full graph load for analysis (use neural-graph-loader)

## Workflow

### Step 1: Load Neurograph

```bash
cd ~/JARVIS
python3 -c "import json; nodes=json.load(open('RAW/memories/nodes.json')); print(f'Current nodes: {len(nodes)}')"
```

### Step 2: Verify Archive + Learnings Integrity

```bash
cd ~/JARVIS
node scripts/verify-archive-learnings-nodes.js $(date +%Y-%m-%d)
```

**Output:**
- Archive: files on disk | with node | MISSING: X
- Learnings: .md on disk | with node | MISSING: X
- Summary: ✓ or MISMATCH

**Exit code:** 0 = all matched, 1 = missing nodes

### Step 3: Create Missing Nodes

If verification shows missing nodes, run creation scripts:

```bash
# Create archive file nodes
cd ~/JARVIS
node scripts/set-archive-creation-dates.js $(date +%Y-%m-%d)

# Create learning nodes
cd ~/JARVIS
node scripts/set-learning-creation-dates.js $(date +%Y-%m-%d)
```

### Step 4: Verify Again

```bash
cd ~/JARVIS
node scripts/verify-archive-learnings-nodes.js $(date +%Y-%m-%d)
```

Should now show: ✓ for both Archive + Learnings

### Step 5: Commit Graph

```bash
cd ~/JARVIS
git add RAW/memories/nodes.json RAW/memories/synapses.json
git commit -m "📅 $(date +%Y-%m-%d): Archive digest complete ($(date +%s) nodes)"
git push
```

## Scripts Reference

**Location:** `~/JARVIS/scripts/`

| Script | Purpose |
|--------|---------|
| `verify-archive-learnings-nodes.js` | Verify 1:1 mapping (files = nodes), creates missing |
| `set-archive-creation-dates.js` | Create archive file nodes from file birthtime/filename timestamp |
| `set-learning-creation-dates.js` | Create learning nodes from .md file metadata |
| `auto-archiver.sh` | Auto-archive inbox files to dated folders |

**Note:** `verify-archive-learnings-nodes.js` both verifies AND creates missing nodes (unlike typical verify scripts).

## Expected Output

**End-of-day digest complete:**
```
Archive:  total files: X | total with node: X ✓
Learnings: total .md files: Y | total with node: Y ✓
```

**Graph integrity:** All archive files + learnings represented as nodes, linked to temporal anchor for date.

## Notes

- Run at end-of-day (after all archives processed)
- Creates nodes for: audio, images, transcripts, sessions, documents
- Creates nodes for: learning .md files
- Links all to temporal node: `YYYY-MM-DD`
- Ensures no orphaned files (all represented in graph)
