# Bootstrap Streaming Pattern for Live Session Output

**Date:** 2026-03-28
**Type:** pattern
**Status:** extracted

## The Problem

The `exec` tool returns output only after the command completes, not as a live stream. Using `yieldMs` only controls when a process backgrounds—it doesn't enable streaming output to chat.

## The Solution

Use `background: true` combined with `process(action=poll, timeout=2000)` to capture output incrementally as it arrives:

```javascript
// Streaming pattern for bootstrap
exec({
  command: "node bootstrap-jarvis.js",
  background: true,
  yieldMs: 5000
});

// Poll for output
process({
  action: "poll",
  timeout: 2000
});
```

## Key Insight

- `yieldMs: 5000` = backgrounds after 5 seconds if still running (safety net)
- `background: true` + `process(poll)` = captures output as it streams
- For fast scripts (<2s), the polling may only capture final output
- The real fix: explicitly include captured output in chat reply, not just store in file

## Documentation Location

Updated in `AGENTS.md` under "Session Startup (Jarvis)" section.
