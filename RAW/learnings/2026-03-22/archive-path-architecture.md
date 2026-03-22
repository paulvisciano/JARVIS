# Dual Archive Root Architecture Discovered

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

## Discovery
Two separate archive roots exist in the system:
1. `/Users/paulvisciano/RAW/archive/` — Life Archive (sovereign memory, raw session data, audio, images, transcripts)
2. `~/JARVIS/RAW/archive/` — Jarvis Working Data (learnings, neurograph nodes)

## Impact
The context-extractor script wrote to `$RAW_ARCHIVE` which resolves to `/Users/paulvisciano/RAW/`, not `~/JARVIS/RAW/`. This caused confusion when checking archive population status.

## Resolution
Both paths are intentional and serve different purposes. Life Archive holds raw immutable data; Jarvis Working Data holds processed learnings and graph structures.