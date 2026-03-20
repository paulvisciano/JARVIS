---
name: graph-integrity
description: Verify neurograph integrity. Use when: (1) checking if all archive files have nodes, (2) verifying learnings are represented, (3) auditing graph completeness, (4) debugging missing neurons. Runs verification across dates or specific paths.
metadata: { "openclaw": { "emoji": "🔍", "requires": { "bins": ["node"], "files": ["~/JARVIS/RAW/memories/nodes.json"] } } }
---

# Graph Integrity Verification

## When to Use

✅ **USE this skill when:**
- Audit graph completeness: do all files have nodes?
- Verify learnings represented: every .md has a neuron?
- Debug missing neurons: which files lack nodes?
- Check specific dates: verify YYYY-MM-DD archives
- Graph integrity testing: before/after bulk operations

## When NOT to Use

❌ **DON'T use this skill when:**
- Creating nodes (use archive-digest skill)
- Searching graph content (use neural-graph-search)
- Loading full graph (use neural-graph-loader)
- Cross-graph traversal (use memory-link-traverse)

## Usage

### Verify + Create Missing Nodes (Single Date)

```bash
cd ~/JARVIS
node scripts/verify-archive-learnings-nodes.js 2026-03-20
```

### Verify + Create Missing Nodes (Multiple Dates)

```bash
cd ~/JARVIS
node scripts/verify-archive-learnings-nodes.js 2026-03-19 2026-03-20
```

### Set Archive Creation Dates (Detailed Timestamps)

```bash
cd ~/JARVIS
node scripts/set-archive-creation-dates.js 2026-03-20
# Parses timestamps from filenames: convo-jarvis-2026-03-16-094426.wav → 2026-03-16T09:44:26
# Falls back to file birthtime
```

### Set Learning Creation Dates

```bash
cd ~/JARVIS
node scripts/set-learning-creation-dates.js 2026-03-20
# Uses file birthtime for learning .md files
```

## Output Format

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

## Path Normalization

The script normalizes paths using these patterns:

**Archive paths:**
- `~/RAW/archive/...` → `$HOME/RAW/archive/...`
- `/RAW/archive/...` → `$HOME/RAW/archive/...`
- `RAW/archive/...` → `$HOME/RAW/archive/...`

**Learning paths:**
- `~/JARVIS/RAW/learnings/...` → `$HOME/JARVIS/RAW/learnings/...`
- `JARVIS/RAW/learnings/...` → `$HOME/JARVIS/RAW/learnings/...`

## What It Checks

**Archive files:**
- All files in `~/RAW/archive/YYYY-MM-DD/`
- Excludes: `.DS_Store`
- Matches against: `node.attributes.rawContentPath`, `filePath`, `sourceDocument`
- **Creates missing nodes** with file birthtime/filename timestamps

**Learning files:**
- All `.md` files in `~/JARVIS/RAW/learnings/YYYY-MM-DD/`
- Matches against: `node.attributes.sourceDocument`
- **Creates missing nodes** with file birthtime

**Note:** This script both verifies AND creates — it's not read-only. For creation dates, uses `set-archive-creation-dates.js` and `set-learning-creation-dates.js` which have more detailed timestamp parsing.

## Common Issues

**Missing nodes:**
```
Archive files missing node: 5
  - /Users/paul/RAW/archive/2026-03-20/audio/recording-*.wav
  - /Users/paul/RAW/archive/2026-03-20/images/Screenshot-*.png
```

**Fix:** Run `archive-digest` skill to create missing nodes

**Path mismatch:**
- Graph uses `~/RAW/...` but disk has absolute path
- Graph uses relative path but disk has `~/`

**Fix:** Check path normalization in script (handles all variants)

## Integration

**Part of end-of-day flow:**
1. `archive-digest` → creates nodes
2. `graph-integrity` → verifies creation
3. Git commit → graph versioned

**Standalone use:**
- Run anytime to audit graph health
- Use in CI/CD to verify graph integrity
- Debug missing neurons after bulk imports

## Notes

- Read-only: does not modify graph
- Fast: scans disk + graph in memory
- Comprehensive: checks archive + learnings
- Exit code: script returns 1 if missing (CI-friendly)
