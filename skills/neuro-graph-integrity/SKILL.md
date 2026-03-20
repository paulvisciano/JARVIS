---
name: neuro-graph-integrity
status: deprecated
description: DEPRECATED — Use neuro-graph-sync instead. This skill previously provided read-only integrity audits, but neuro-graph-sync now includes all verification + creates missing nodes.
---

# DEPRECATED: Graph Integrity Verification

**This skill is deprecated.** Use `neuro-graph-sync` instead.

## Migration

**Before:**
```bash
# Integrity check (read-only)
node skills/neuro-graph-integrity/scripts/verify-file-dates.js 2026-03-20

# Create nodes (separate skill)
node skills/neuro-graph-digest/scripts/verify-archive-learnings-nodes.js 2026-03-20
```

**After:**
```bash
# Everything in one skill
node skills/neuro-graph-sync/scripts/verify-archive-learnings-nodes.js 2026-03-20
node skills/neuro-graph-sync/scripts/verify-file-dates.js 2026-03-20
```

## What Moved

- `verify-file-dates.js` → `neuro-graph-sync/scripts/`
- Node creation logic → `neuro-graph-sync`
- All verification + sync → `neuro-graph-sync`

## Why Deprecated

**Problem:** Two separate skills (integrity + digest) for related operations  
**Solution:** Unified `neuro-graph-sync` skill that verifies + creates nodes

**Result:** Single source of truth for disk ↔ graph synchronization

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
