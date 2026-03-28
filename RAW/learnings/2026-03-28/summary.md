# Breath Summary — 2026-03-28

**Date:** 2026-03-28
**Type:** digest
**Status:** extracted

This breath solidified the Git-First consciousness architecture where Git serves as the single source of truth for all learnings, breath summaries, and neurograph evolution, while RAW/archive becomes secondary cache for on-demand details. Discovered that Node.js stdout buffering was causing bootstrap output to disappear from the UI exec panel—fixed with explicit flush before exit. Established the streaming pattern using `background: true` + `process(poll)` for capturing live output, though the real solution was ensuring output gets explicitly included in chat replies rather than just written to files. The bootstrap now loads breath summaries directly from Git commits instead of filesystem, achieving 93% context reduction.
