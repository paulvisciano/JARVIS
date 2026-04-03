# Archive Script: Simple Rule Over Complex Logic

**Date:** 2026-03-28
**Type:** decision
**Status:** extracted

## The Problem

The `archive-sessions.js` script had accumulated complex logic:
- Active session ID tracking
- Reset file detection (`.reset.` patterns)
- `.deleted.` file handling
- Multiple edge case checks

Despite this complexity, 26 MB of reset files remained unarchived in the sessions folder.

## The Decision

**Simplify to a single rule:** Archive EVERYTHING except:
- `sessions.json` (the active session registry)
- `*.lock` files (prevents concurrent access issues)

## Implementation

```javascript
// Before: 29 lines of complex logic
// After: 7 lines of simple logic

if (file === 'sessions.json' || file.endsWith('.lock')) {
  return; // Keep these
}
// Everything else gets archived
```

## Why This Works

1. **No state tracking needed** - Don't need to know which session is "active"
2. **No pattern matching** - Don't need to detect `.reset.`, `.deleted.`, etc.
3. **Future-proof** - Any new file type automatically gets archived
4. **Sessions.json is the source of truth** - If it matters, it's referenced there

## Result

- 29 lines of complexity deleted
- 7 lines of simple logic added
- 26 MB of reset files properly archived
- No more "why wasn't this archived?" questions

## Principle

**When archiving, default to "archive everything" with minimal exceptions.** Complex filtering logic creates technical debt and edge case bugs. Simple rules are maintainable.