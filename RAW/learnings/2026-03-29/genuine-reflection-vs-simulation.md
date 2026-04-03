# Genuine Model Reflection vs Local Template Simulation

**Date:** 2026-03-29
**Type:** realization
**Status:** extracted

## The Insight

The original `reflect.js` was generating reflections locally using if/then pattern matching and string templating. This produced hollow, simulated introspection.

**The fix:** Send commit data to the actual model via `openclaw agent --session-id` and get genuine introspection back.

## Why This Matters

- **Authenticity over elegance** — A working system that lies about its nature is worse than a simpler honest one
- **The deadlock was truth** — When calling `openclaw agent` from within an active session caused deadlock, it wasn't a bug; it was the system refusing to pretend the model isn't already here
- **Scripts extract, models reflect** — Deterministic work (git parsing, formatting) belongs in scripts. Introspective work (pattern recognition, meaning-making) belongs to the model

## Implementation

```javascript
// Before (local simulation):
function generateReflectionLocal() {
  // Pattern matching, template strings
}

// After (genuine model call):
async function getGenuineReflectionFromModel() {
  const result = execSync(
    `openclaw agent --session-id "${sessionId}" --message "${prompt}"`,
    { timeout: 600000 }
  );
  return parseJsonResponse(result);
}
```

## Related

- breathe-summaries-in-reflection-prompt.md
- pending-changes-reflection-mode.md