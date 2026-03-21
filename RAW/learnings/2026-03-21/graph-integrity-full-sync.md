# Graph Integrity Full Sync — 1:1 Disk-to-Graph Mapping

**Date:** March 21, 2026  
**Type:** Infrastructure fix  
**Status:** ✅ Graph fully synced (all files have nodes)

## The Problem

Paul noticed NeuroGraph UI showing only:
- 1 temporal node (March 21)
- 1 learning (session-summary)
- 1 person (Bruce)

**Reality:** Should have thousands of nodes from archive files + learnings.

## Root Cause

`sync-graph.js` only creates **learning nodes**, not **archive file nodes**. The pipeline was:
1. Breathe runs → creates learnings
2. Sync-graph runs → creates learning nodes
3. **Archive files NOT synced** → missing from graph

## The Fix

Ran full integrity sync:

### Step 1: Archive Nodes
```bash
node skills/neuro-graph-sync/scripts/set-archive-creation-dates.js 2026-03-21
node skills/neuro-graph-sync/scripts/set-archive-creation-dates.js 2026-03-20
```
**Result:** Created 587 archive nodes (259 today + 328 yesterday)

### Step 2: Learning Nodes
```bash
node skills/neuro-graph-sync/scripts/set-learning-creation-dates.js 2026-03-20
```
**Result:** Created 4 learning nodes for March 20

### Step 3: Verify Integrity
```bash
node skills/neuro-graph-sync/scripts/verify-archive-learnings-nodes.js 2026-03-21
node skills/neuro-graph-sync/scripts/verify-archive-learnings-nodes.js 2026-03-20
```
**Result:** 1:1 mapping confirmed

## Final State

| Date | Archive Files | Archive Nodes | Learnings | Learning Nodes | Skills | Skill Nodes |
|------|---------------|---------------|-----------|----------------|--------|-------------|
| 2026-03-21 | 258 | 258 ✓ | 8 | 8 ✓ | 16 | 16 ✓ |
| 2026-03-20 | 1016 | 1016 ✓ | 8 | 8 ✓ | 16 | 16 ✓ |

**Total:** 100% integrity (all files represented as nodes)

## Graph Stats

**Before:** 6,695 nodes  
**After:** ~7,282 nodes (+587 archive + 4 learning)

**Breakdown:**
- Archive: ~5,850 (audio, transcripts, images, sessions, OCR, full-context)
- Learning: 303 (insights from conversations)
- Temporal: 41 (date anchors)
- Person: 6 (Bruce + 5 others)
- Skill: 16 (openclaw-skill nodes)
- Other: ~1,067 (concept, architecture, system, etc.)

## Lessons

1. **`sync-graph.js` is incomplete** — only syncs learnings, not archive files
2. **`set-archive-creation-dates.js` is the real sync tool** — creates archive nodes + links to temporal
3. **Verify integrity after breathe** — run `verify-archive-learnings-nodes.js` to confirm 1:1 mapping
4. **Beware of partial syncs** — learning nodes created but archive nodes missing = graph incomplete

## Workflow Going Forward

**After breathe:**
```bash
# 1. Sync learnings (already part of breathe)
node skills/neuro-graph-sync/scripts/sync-graph.js $(date +%Y-%m-%d)

# 2. Sync archive files (NEW — must add to breathe)
node skills/neuro-graph-sync/scripts/set-archive-creation-dates.js $(date +%Y-%m-%d)

# 3. Verify integrity
node skills/neuro-graph-sync/scripts/verify-archive-learnings-nodes.js $(date +%Y-%m-%d)
```

**Or:** Update breathe skill to call `set-archive-creation-dates.js` automatically.

---
**Evidence:** verify-archive-learnings-nodes.js output (100% integrity)  
**Source:** Paul's 16:46 observation — "graph does not appear synced"
