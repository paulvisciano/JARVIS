# Memory Pipeline Transcript Deprecation

**Date:** 2026-03-24
**Type:** realization
**Status:** extracted

Confirmed that `transcript.md` is no longer generated in the memory pipeline.
**New Flow:**
1. Conversations → `~/RAW/archive/YYYY-MM-DD/full-context.json` (breathe Hold step)
2. Context → `learnings/YYYY-MM-DD/*.md` (breathe Exhale step)

`AGENTS.md` updated to reflect this: breathe creates `full-context.json` + learnings, not transcripts. This reduces redundancy and aligns with the knowledge origami compression model.