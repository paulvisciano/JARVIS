---
name: archive-digest
description: End-of-day archive + learning digestion into neurograph. Use when: (1) day is complete and all archives processed, (2) verifying graph integrity (all files have nodes), (3) creating missing nodes for archive files + learning .md files, (4) linking to temporal anchors (YYYY-MM-DD), (5) ensuring 1:1 mapping: files on disk = nodes in graph. Runs verification + creation in one flow.
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

### Step 1: Run Archive Digest Script

```bash
cd ~/JARVIS/skills/archive-digest
node scripts/verify-archive-learnings-nodes.js $(date +%Y-%m-%d)
```

**What this does:**
- Scans `~/RAW/archive/YYYY-MM-DD/` for all files
- Scans `~/JARVIS/RAW/learnings/YYYY-MM-DD/` for all .md files
- Checks if each file has a corresponding node in `nodes.json`
- **Creates missing nodes** with proper timestamps
- Reports: files on disk | with node | MISSING: X

**Output:**
```
--- 2026-03-20 ---
Archive: files on disk: 50 | with node: 50 ✓
Learnings: .md on disk: 10 | with node: 10 ✓

=== Summary ===
Archive:  total files (excl .DS_Store): 50 | total with node: 50 ✓
Learnings: total .md files: 10 | total with node: 10 ✓
Created 5 new archive nodes.
```

**Exit codes:**
- 0: All files have nodes (integrity OK)
- 1: Missing nodes were found (but created)

### Step 2: Verify Timestamps (Optional)

If you want detailed timestamp parsing from filenames:

```bash
cd ~/JARVIS/skills/archive-digest
node scripts/set-archive-creation-dates.js $(date +%Y-%m-%d)
node scripts/set-learning-creation-dates.js $(date +%Y-%m-%d)
```

**What these do:**
- `set-archive-creation-dates.js`: Parses timestamps from filenames
  - `convo-jarvis-2026-03-16-094426.wav` → `2026-03-16T09:44:26`
  - `Screenshot 2026-03-16 at 9.56.54 AM.png` → `2026-03-16T09:56:54`
  - `recording-1773461516328.wav` → from Unix milliseconds
  - Falls back to file birthtime
- `set-learning-creation-dates.js`: Uses file birthtime for .md files

### Step 3: Commit Graph

```bash
cd ~/JARVIS
git add RAW/memories/nodes.json RAW/memories/synapses.json
git commit -m "📅 $(date +%Y-%m-%d): Archive digest complete"
git push
```

## Scripts

**Location:** `skills/archive-digest/scripts/`

| Script | Purpose |
|--------|---------|
| `verify-archive-learnings-nodes.js` | Verify 1:1 mapping + create missing nodes |
| `set-archive-creation-dates.js` | Parse timestamps from filenames, set node.created |
| `set-learning-creation-dates.js` | Set learning node timestamps from birthtime |

## Expected Result

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
- Scripts live inside skill (self-contained)
