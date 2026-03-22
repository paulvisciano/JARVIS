# Git Commits as Breath History

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Each breath ends with a git commit. The commit message IS the diff — tracking what changed between breaths.

**Pattern:** `breath-YYYY-MM-DD-HH:MM`

**Key innovation:** Backdate commits to the breath date using `git commit --date`. This ensures git history shows when the breath happened, not when it was processed.

Git becomes immutable breath record — can't change history, full content preserved, diff between breaths visible, any day replayable via `git log --since`.