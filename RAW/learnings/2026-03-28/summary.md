# Breath Summary — 2026-03-28

**Date:** 2026-03-28
**Type:** digest
**Status:** extracted

This breath focused on diagnosing and fixing context bloat issues. The root causes were: (1) transcript duplication in active mode loading both session messages AND separate .txt transcript files, (2) bootstrap being run multiple times which accumulates context instead of replacing it, and (3) archive-sessions.js having overly complex logic that failed to archive reset files. The fixes were surgical: skip transcripts in active mode (they're already in session messages), enforce one bootstrap execution per session, and simplify the archive script to 'archive everything except sessions.json and *.lock files'. The deeper insight is that session files contain tool call metadata making them 7-10MB each, while full-context.json distills this to 80-509KB of conversation-only data. The architecture is now clearer: session files are operational logs, full-context is conversation memory, and bootstrap is initialization—not diagnostics.
