# NeuroGraph Node Count vs Archive File Mismatch

**Date:** 2026-03-22
**Type:** pattern
**Status:** extracted

## Problem Identified

NeuroGraph has 145 nodes created today (2026-03-22), but there are **no corresponding archive files** on disk in `~/JARVIS/RAW/archive/2026-03-22/`.

## The Mismatch

| Source | Count |
|--------|-------|
| NeuroGraph nodes (today) | 145 |
| Archive files on disk (today) | 0 |
| Archive files (yesterday 2026-03-21) | 1 session file |

## What This Means

1. **Nodes are being created** in the neurograph (from conversations, learnings, etc.)
2. **Archive pipeline isn't writing files** to the archive directory
3. **Yesterday worked** — 1 session file exists for March 21
4. **Today broken** — No files despite node creation

## Possible Causes

1. Archive pipeline not running for today's date
2. File path or date formatting issue
3. Permission or write access problem
4. Pipeline triggered but output not persisted

## Expected Behavior

NeuroGraph node count should roughly match archive file count, since nodes are created from archived conversations.

## Next Steps

1. Check archive pipeline execution logs
2. Verify date directory creation (`~/JARVIS/RAW/archive/2026-03-22/`)
3. Test manual archive write
4. Compare with yesterday's working pipeline

## Implication

Memory pipeline integrity issue — nodes exist but source archives missing, breaking traceability.