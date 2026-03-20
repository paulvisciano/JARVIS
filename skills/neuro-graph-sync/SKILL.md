---
name: neuro-graph-sync
description: Synchronize neurograph with disk — ensures 1:1 mapping between files and nodes. Use when: (1) verifying graph integrity (all files have nodes), (2) creating missing nodes for archive files + learning .md files + skill files, (3) linking to temporal anchors (YYYY-MM-DD), (4) ensuring files on disk = nodes in graph. Runs verification + creation in one flow. Auto-discovers JARVIS skills and creates openclaw-skill nodes.
---

# Neuro Graph Sync (Disk ↔ Graph Synchronization)

## When to Use

✅ **USE this skill when:**
- End-of-day: sync all archives + learnings + skills to graph
- Verify graph integrity: every file has a node
- Create missing nodes: archive files + learning .md files + skill files
- Link to temporal anchors: date-based nodes
- Ensure 1:1 mapping: files on disk = nodes in graph
- Auto-discover skills: scans ~/JARVIS/skills/ for SKILL.md files
- **Synchronize:** disk state → graph state (mirror what exists)

## When NOT to Use

❌ **DON'T use this skill when:**
- Mid-day processing (use process-inbox skill instead)
- Single file archival (use memory-link-traverse)
- Graph search/queries (use neuro-graph-search)
- Full graph load for analysis (use neuro-graph-loader)

## Workflow

### Step 1: Run Sync Script

```bash
cd ~/JARVIS
node skills/neuro-graph-sync/scripts/verify-archive-learnings-nodes.js $(date +%Y-%m-%d)
```

**What this does:**
- Scans `~/RAW/archive/YYYY-MM-DD/` for all files
- Scans `~/JARVIS/RAW/learnings/YYYY-MM-DD/` for all .md files
- Scans `~/JARVIS/skills/` for all SKILL.md files (recursive)
- Checks if each file has a corresponding node in `nodes.json`
- **Creates missing nodes** with proper timestamps
- **Auto-discovers skills** → creates `openclaw-skill` nodes + file nodes + synapses
- Links skills to today's temporal node
- Reports: files on disk | with node | MISSING: X

**Output:**
```
--- 2026-03-20 ---
Archive: files on disk: 50 | with node: 50 ✓
Learnings: .md on disk: 10 | with node: 10 ✓
Skills:    SKILL.md on disk: 15 | with node: 15 ✓

=== Summary ===
Archive:  total files (excl .DS_Store): 50 | total with node: 50 ✓
Learnings: total .md files: 10 | total with node: 10 ✓
Skills:    total SKILL.md files: 15 | total with node: 15 ✓
Created 5 new archive nodes.
Created 3 new skill nodes (auto-discovered).
```

**Exit codes:**
- 0: All files have nodes (integrity OK)
- 1: Missing nodes were found (but created)

### Step 2: Verify Timestamps (Optional)

If you want detailed timestamp parsing from filenames:

```bash
cd ~/JARVIS
node skills/neuro-graph-sync/scripts/set-archive-creation-dates.js $(date +%Y-%m-%d)
node skills/neuro-graph-sync/scripts/set-learning-creation-dates.js $(date +%Y-%m-%d)
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
git commit -m "📅 $(date +%Y-%m-%d): Neurograph synced"
git push
```

## Scripts

**Location:** `skills/neuro-graph-sync/scripts/`

| Script | Purpose |
|--------|---------|
| `verify-archive-learnings-nodes.js` | Verify 1:1 mapping + create missing nodes |
| `set-archive-creation-dates.js` | Parse timestamps from filenames, set node.created |
| `set-learning-creation-dates.js` | Set learning node timestamps from birthtime |

## Expected Result

**Graph synchronized:**
```
Archive:  total files: X | total with node: X ✓
Learnings: total .md files: Y | total with node: Y ✓
Skills:    total SKILL.md: Z | total with node: Z ✓
```

**Graph integrity:** All archive files + learnings + skills represented as nodes, linked to temporal anchor for date.

## Notes

- Run at end-of-day (after all archives processed)
- Creates nodes for: audio, images, transcripts, sessions, documents
- Creates nodes for: learning .md files
- Creates nodes for: skill files (auto-discovered)
- Links all to temporal node: `YYYY-MM-DD`
- Ensures no orphaned files (all represented in graph)
- **Synchronization:** disk state → graph state (mirror what exists)
- Scripts live inside skill (self-contained)
