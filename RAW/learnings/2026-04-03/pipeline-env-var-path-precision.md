# Pipeline Environment Variables Require Exact Path Matching

**Date:** 2026-04-03
**Type:** insight
**Status:** extracted

## Core Insight
The breathe pipeline failed at the **Exhale** step because the `RAW_ARCHIVE` environment variable pointed to `~/RAW` instead of `~/RAW/archive`. Pipeline steps are sensitive to exact directory structures.

## Debugging Pattern
1. **Symptom:** Context extractor ran but found 0 sessions/0 messages despite archive step moving files.
2. **Root Cause:** Env var path mismatch (`~/RAW` vs `~/RAW/archive`).
3. **Fix:** Update `.env` to point to the specific subdirectory where archived sessions reside.

## Lesson
Environment variables for file paths must match the actual archive structure exactly. Assumptions about root directories lead to silent failures where steps run but process nothing.