# Context Pipeline Gap - Running Breathe for Different Date Doesn't Update Current Day

**Date:** 2026-03-21
**Type:** realization
**Status:** extracted

## The Gap Discovered

When running `breathe` for March 19th instead of March 21st:
- ✅ March 19th context was updated
- ❌ March 21st context remained stale

## Root Cause

The breathe skill processes a specific date. Running it for date X only updates:
- `~/RAW/archive/YYYY-MM-DD/full-context.json`
- Learnings for that date
- NeuroGraph nodes for that date

## Solution

To catch up on current day context:
1. Run `breathe` for today's date (2026-03-21)
2. This triggers context-extractor (Step 2: Hold)
3. full-context.json gets updated with latest audio transcripts, sessions, OCR
4. Bootstrap then loads fresh context on next session start

## Pipeline Trace
| Time | Event | Context State |
|------|-------|---------------|
| 16:54 | breathe ran for 19th | 21st context stale |
| 18:29 | User requested breathe for 19th | Confirmed gap |
| 16:15 | breathe ran for 21st | Context caught up (99 transcripts) |