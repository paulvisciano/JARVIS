# Server Path Verification During Debugging

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

## Problem

After updating `.env` files to point to new bundled locations (`$JARVIS_HOME/skills/jarvis-ui/sci-fi/apps`), the UI still showed errors because the **running server process** was still using the old path (`~/SCI-FI/apps/JARVIS`).

## Discovery

Config file updates ≠ running process updates. The server was:
- Running from: `/Users/paulvisciano/SCI-FI/apps/JARVIS` (old standalone location)
- PID: 49325
- Version: V2.9.5

But `.env` now pointed to: `$JARVIS_HOME/skills/jarvis-ui/sci-fi/apps` (new bundled location)

## Lesson

**Always verify the running process, not just config files.**

When debugging path-related issues:
1. Check config files (`.env`, etc.)
2. Check running process working directory (`pwd` of PID)
3. Kill old process if needed
4. Restart from new location
5. Verify version bump reflects the change

## Why This Matters

- Config changes don't auto-reload running processes
- Old processes can mask new configuration
- Version bumping signals that server-side changes occurred
- Coder agent should bump versions, not just restart

## Operational Pattern

```
1. Update config → 2. Verify running process path → 3. Kill if mismatched → 4. Restart → 5. Bump version
```

This prevents "I updated the file but it still doesn't work" debugging loops.