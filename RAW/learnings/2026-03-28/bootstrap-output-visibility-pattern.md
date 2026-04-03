# Bootstrap Output Visibility Pattern

**Date:** 2026-03-28
**Type:** pattern
**Status:** extracted

## The Problem

Exec tool calls complete silently — output goes to console but doesn't appear in chat. Bootstrap was running successfully but Paul couldn't see the output.

## Solutions Attempted

1. **yieldMs parameter** — Wait N seconds before backgrounding (doesn't actually stream)
2. **stdout flushing** — Force synchronous flush before exit (`atob('')` + 200ms wait)
3. **Background + Process polling** — `background: true` + `process(action=poll, timeout=2000)` for incremental capture
4. **File write + read** — Write to `.bootstrap-output.md`, then read and paste in chat

## Working Pattern

```javascript
// In bootstrap-jarvis.js
console.log(output); // Output to stdout
process.stdout.write('', () => {
  // Force flush
  setTimeout(() => process.exit(0), 200);
});

// In exec call
exec({
  command: "node bootstrap-jarvis.js",
  yieldMs: 5000, // Safety timeout
  background: false // Keep in foreground for output capture
});
```

## AGENTS.md Documentation

Session startup now specifies:
- Run bootstrap with `yieldMs: 5000`
- Include full bootstrap console output in first message
- Bootstrap runs ONCE per session (not a diagnostic tool)

## Key Learning

The issue wasn't the script — it was Node.js output buffering and exec tool behavior. Output visibility requires explicit flushing + foreground execution.