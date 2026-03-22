# Git Breath History with Backdated Commits

**Date:** 2026-03-22
**Type:** pattern
**Status:** extracted

Every breath cycle ends with a git commit. Key insight: commits should be backdated to when the breath *happened*, not when processed.

```bash
git commit --date="2026-03-15T18:00:00" -m "breath-2026-03-15-1800: ..."
```

This makes git history truly replayable. Query any day's breaths:
```bash
git log --grep="breath-2026-03-22" --oneline
```

Git becomes the immutable breath record—can't change history, full traceability.