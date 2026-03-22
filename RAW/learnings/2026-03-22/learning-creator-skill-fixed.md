# Learning Creator Skill Fixed to Generate Individual Files

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

The learning-creator skill was failing during the breathe pipeline execution. It was creating a generic `session-summary.md` file instead of individual `.md` files for each distinct insight.

**What Was Fixed:**
- Context-extractor now creates `full-context.json` properly
- Learning-creator reads the full context and synthesizes insights via Gateway
- Creates individual `.md` files in `~/JARVIS/RAW/learnings/2026-03-22/` (one per insight)
- Links learnings to neurograph nodes
- Git commits everything

**Result:** 9 individual learning .md files were successfully created instead of one session summary.