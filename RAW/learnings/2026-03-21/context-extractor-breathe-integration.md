# Context Extractor Must Be Part of Breathe Skill

**Date:** 2026-03-21
**Type:** realization
**Status:** extracted

## The Gap Identified:

When running breathe for March 19th instead of March 21st, only March 19th's context was updated. March 21st's `full-context.json` remained stale with only 5 messages instead of 55.

## The Fix:

Context extractor is **Step 2 (Hold)** of the breathe skill and must:
- Scan archive images for OCR
- Extract conversation text from session files
- Strip base64 bloat (50MB → 500KB)
- Output `~/RAW/archive/YYYY-MM-DD/full-context.json`

## Critical Understanding:
Running breathe for a specific date only updates that date's context. To get current context, breathe must run for today's date.