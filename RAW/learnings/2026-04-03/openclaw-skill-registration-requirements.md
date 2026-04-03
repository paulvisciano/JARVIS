# OpenClaw Skill Registration Requires Symlinks + Path Resolution

**Date:** 2026-04-03
**Type:** insight
**Status:** extracted

## Core Insight
Having a skill directory exist (`~/JARVIS/skills/breathe/`) and enabling it in `openclaw.json` is **not sufficient** for the skill to load. OpenClaw requires valid symlinks into its skills directory AND path resolution that stays within the configured root.

## Key Findings
1. **Symlinks Required:** Skill discovery synced 25 skills, but `breathe`, `neurograph-search`, and `neurograph-sync` were missed. Manual symlink creation was necessary.
2. **Path Resolution Warning:** OpenClaw logs showed "Skipping skill path that resolves outside its configured root" — indicating symlinks must resolve cleanly within the expected directory structure.
3. **Gateway Restart Still Needed:** Even after fixing symlinks, a gateway restart is required for OpenClaw to recognize the new links (confirming March 31 learning, but adding the symlink prerequisite).

## Actionable Pattern
- **Check:** `openclaw skills list` after any skill addition.
- **Fix:** Manually create symlinks if discovery misses them.
- **Verify:** Ensure symlink paths resolve within OpenClaw's configured root to avoid skip warnings.
- **Reload:** Restart gateway to finalize loading.