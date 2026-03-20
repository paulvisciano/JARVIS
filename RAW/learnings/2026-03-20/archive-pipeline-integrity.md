# Archive Pipeline Integrity — Built-in Verification

**Date:** 2026-03-20  
**Type:** Architecture Decision  
**Status:** Implemented

## Decision

Archive collector scripts now **verify integrity automatically** after organizing files:
- `archive-live.js` — verifies after processing `~/JARVIS/live/`
- `archive-desktop.js` — verifies after processing `~/Desktop/`

## What Changed

**Before:** Separate verification step (`neuro-graph-integrity` skill)  
**After:** Verification **built into** archive scripts

## How It Works

1. Archive files by birthtime (creation date)
2. Recursively scan today's archive folder
3. For each file: check if `birthtime date == folder name`
4. If mismatch: move to correct date folder
5. Report: "Checked N files, Moved M files"

## Why This Matters

**Problem:** Files from other dates can get mixed into today's archive (e.g., backup files from February landed in March 20 folder)

**Solution:** Verify immediately after archiving — don't pollute date folders with mismatched files

**Result:** Clean date-based organization, automatic correction

## Files Modified

- `~/JARVIS/skills/archive-collector/scripts/archive-live.js`
- `~/JARVIS/skills/archive-collector/scripts/archive-desktop.js`
- `~/JARVIS/skills/archive-collector/SKILL.md`

## Test Result

```
Found 4 mismatches:
- IDENTITY.md (2026-02-16) → moved to 2026-02-16/backup/
- HEARTBEAT.md (2026-02-16) → moved to 2026-02-16/backup/
- AGENTS.md (2026-02-16) → moved to 2026-02-16/backup/
- TOOLS.md (2026-02-16) → moved to 2026-02-16/backup/

✅ All files in correct date folders
```

## Pipeline Order

1. archive-collector (with built-in verification)
2. context-extractor (reads organized archive)
3. learning-creator (synthesizes insights)
4. neuro-graph-digest (creates nodes)
