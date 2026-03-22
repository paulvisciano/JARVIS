# Dual Archive Root Architecture Discovered

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

There are **two separate archive roots** in the system that were causing confusion:

1. **Life Archive:** `/Users/paulvisciano/RAW/archive/` — Raw session data, audio, images, transcripts (sovereign memory)
2. **Jarvis Working Data:** `~/JARVIS/RAW/archive/` — Learnings, neurograph data, working files

**The Issue:**
- Context-extractor script wrote to `$RAW_ARCHIVE` which resolves to `/Users/paulvisciano/RAW/`
- Health checks were looking at `~/JARVIS/RAW/archive/` which was empty
- This caused false negatives in system status reports

**Resolution:** Understanding the split architecture allows proper path resolution in health checks and skills.