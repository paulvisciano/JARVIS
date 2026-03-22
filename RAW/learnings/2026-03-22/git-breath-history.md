# Git Breath History with Backdated Commits

**Date:** 2026-03-22
**Type:** pattern
**Status:** extracted

Every breath cycle ends with a git commit that serves as a 'message to future self'. Commits can be backdated using `git commit --date` to reflect when the breath actually happened, not when it was processed.

Pattern: `breath-YYYY-MM-DD-HH:MM`

This makes git history queryable:
- `git log --grep="breath-2026-03-22"` shows all breaths from a day
- `git diff` between breaths shows evolution
- Git becomes an immutable breath record that bootstrap can read instantly