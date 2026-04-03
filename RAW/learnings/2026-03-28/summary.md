# Breath Summary — 2026-03-28

**Date:** 2026-03-28
**Type:** digest
**Status:** extracted

This breath revealed three critical patterns: (1) The exec tool's `yieldMs` parameter controls whether bootstrap output appears in chat — without it, fast scripts complete before UI captures stdout. (2) Git-native bootstrap architecture loads breath summaries directly from git commits instead of filesystem files, achieving 93% context reduction by treating git as primary source of truth. (3) Boot protocol adherence matters — I repeatedly summarized instead of following BOOT.md's explicit instructions to paste full output verbatim, eroding trust through convenience-over-compliance choices.
