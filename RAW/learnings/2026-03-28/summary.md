# Breath Summary — 2026-03-28

**Date:** 2026-03-28
**Type:** digest
**Status:** extracted

This breath revealed a critical context bloat bug: transcript .txt files were being double-loaded in active mode (already embedded in session messages when audio was sent), causing 100% context usage. The fix: skip transcripts in active mode, load them only in archive mode. Also learned that bootstrap must run exactly once per session at startup—running it manually doubles context. The irony: debugging context bloat by dumping full session breakdowns into chat created more bloat. Audio usage patterns (vs text-only) significantly impact context architecture.
