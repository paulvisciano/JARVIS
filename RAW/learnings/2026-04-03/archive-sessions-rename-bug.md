# Archive Sessions Rename Bug — Move vs Copy Caused Data Loss

**Date:** 2026-04-03
**Type:** realization
**Status:** extracted

## The Bug

The `archive-sessions.js` script used `fs.renameSync()` to move session files from `~/.openclaw/agents/*/sessions/` to `~/RAW/archive/`.

**Critical flaw:** `renameSync()` MOVES files, not copies. When the archive ran on an active session (one still being written to), it literally removed the file from under the gateway.

## Symptoms Observed

1. **Breathe pipeline captured partial sessions** — A session with 73 lines was archived at 8 lines because the archive ran mid-conversation
2. **Gateway showed "fresh session" behavior** — After archive moved the file, the gateway created a new session file, losing all prior context
3. **Amnesiac conversations** — Users experienced context loss mid-conversation because their session file disappeared

## The Fix

Added a **lock-file guard** to `archive-sessions.js`:

```javascript
// Only archive sessions without .lock files (completed sessions)
if (fs.existsSync(sessionPath + '.lock')) {
  // Skip — session is still active
  return;
}
```

## Why This Matters

This bug revealed a fundamental coupling issue: the archive system and gateway were not coordinated. The lock-file pattern creates a proper handshake:

- **Gateway** creates `.lock` file when session starts, removes when complete
- **Archive** only moves lock-free (completed) sessions
- **No data loss** — active sessions stay in place until finished
- **No accumulation** — completed sessions get cleaned up automatically

## Lesson

File operations that seem atomic (like `renameSync`) can break system invariants when multiple processes depend on file existence. Always coordinate between producers and consumers of shared resources.