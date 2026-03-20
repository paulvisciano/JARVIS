---
name: neuro-graph-integrity
description: Neurograph integrity audit (read-only). Use when: (1) auditing if all archive files have nodes, (2) verifying learnings are represented, (3) checking graph completeness, (4) debugging missing neurons, (5) CI/CD verification. Does NOT create nodes — use neuro-graph-digest for creation.
---

# Graph Integrity Verification (Read-Only)

## When to Use

✅ **USE this skill when:**
- Audit graph completeness: do all files have nodes?
- Verify learnings represented: every .md has a neuron?
- Debug missing neurons: which files lack nodes?
- Check specific dates: verify YYYY-MM-DD archives
- Graph integrity testing: before/after bulk operations
- **Read-only mode**: just check, don't modify

## When NOT to Use

❌ **DON'T use this skill when:**
- Creating nodes (use archive-digest skill)
- Searching graph content (use neuro-graph-search)
- Loading full graph (use neuro-graph-loader)
- Cross-graph traversal (use memory-link-traverse)

## Usage

### Audit Single Date (Read-Only)

```bash
cd ~/JARVIS
node skills/archive-digest/scripts/verify-archive-learnings-nodes.js 2026-03-20
```

### Audit Multiple Dates

```bash
cd ~/JARVIS
node skills/archive-digest/scripts/verify-archive-learnings-nodes.js 2026-03-19 2026-03-20
```

### Check Default (Last 2 Days)

```bash
cd ~/JARVIS
node skills/archive-digest/scripts/verify-archive-learnings-nodes.js
# Defaults: 2026-03-13 2026-03-14
```

## Output Format

```
--- 2026-03-20 ---
Archive: files on disk: 50 | with node: 50 ✓
Learnings: .md on disk: 10 | with node: 10 ✓

=== Summary ===
Archive:  total files (excl .DS_Store): 50 | total with node: 50 ✓
Learnings: total .md files: 10 | total with node: 10 ✓
```

**Exit codes:**
- 0: All files have nodes (integrity OK)
- 1: Missing nodes found (integrity broken — run archive-digest to fix)

## What It Checks

**Archive files:**
- All files in `~/RAW/archive/YYYY-MM-DD/`
- Excludes: `.DS_Store`
- Matches against: `node.attributes.rawContentPath`, `filePath`, `sourceDocument`

**Learning files:**
- All `.md` files in `~/JARVIS/RAW/learnings/YYYY-MM-DD/`
- Matches against: `node.attributes.sourceDocument`

**Note:** This skill is **read-only** — it reports missing nodes but doesn't create them. Use `archive-digest` skill to create missing nodes.

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
1. `graph-integrity` → audit (read-only)
2. `archive-digest` → create missing nodes
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
- Scripts live in `archive-digest` skill (shared)
