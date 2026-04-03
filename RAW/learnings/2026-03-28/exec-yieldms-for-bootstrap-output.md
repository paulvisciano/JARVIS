# Exec yieldMs Parameter Controls Bootstrap Output Visibility

**Date:** 2026-03-28
**Type:** pattern
**Status:** extracted

## The Problem

Bootstrap script runs successfully but output doesn't appear in chat UI. The exec tool returns "No output" even though the script console.logs everything.

## Root Cause

The default `yieldMs: 10000` (10 seconds) backgrounds the process before the UI can capture stdout. For fast scripts like bootstrap (<2s), this causes output to be lost.

## The Solution

Add `yieldMs: 5000` (or higher) to the exec call:

```javascript
exec({
  command: "node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js",
  workdir: "/Users/paulvisciano/JARVIS",
  yieldMs: 5000  // Keeps process foreground long enough to capture output
})
```

## Important Distinction

- `yieldMs` controls **when to background** (not streaming)
- For actual streaming: use `background: true` + `process(action=poll, timeout=2000)`
- For simple output capture: `yieldMs` is sufficient

## Documentation Location

Store in `AGENTS.md` under "Session Startup (Jarvis)" section to ensure all future instances follow this pattern.

## Lesson

Tool parameters matter. A missing `yieldMs` turned a working script into an invisible one. Always verify output actually reaches the user, not just that the script ran.