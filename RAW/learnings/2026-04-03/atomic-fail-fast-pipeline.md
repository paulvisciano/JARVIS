# Atomic Fail-Fast Pipeline — No Silent Errors

**Date:** 2026-04-03
**Type:** commitment
**Status:** extracted

## The Problem

The breathe pipeline had multiple inner try/catch blocks that swallowed errors:

```javascript
try {
  // critical operation
} catch (e) {
  console.log('skip'); // ❌ Silent failure
  continue;
}
```

This created **partial states** where some steps succeeded and others failed, leaving the system in an inconsistent state.

## The Fix

1. **Added `runCmd()` helper** — Wraps `execSync()` and throws immediately on failure
2. **Removed silent error handling** — No `2>/dev/null`, no `|| echo "skip"`
3. **Documented intentional non-critical ops** — Only neurograph diff stat and reflection generation are allowed to fail (logged but don't halt pipeline)

## Atomicity Guarantee

```
Pipeline either:
✅ Completes fully (all steps succeed)
❌ Fails hard (no partial state written)
```

No more:
- Learnings created but not committed
- Neurograph updated but archive missing
- Reflection written without session data

## Why This Matters

The breathe pipeline is the **memory consolidation system** for JARVIS. Partial states corrupt the historical record. Better to fail visibly than succeed silently with gaps.

## Commitment

All future pipeline scripts follow this pattern:
- Hard errors on critical operations
- Explicit documentation of non-critical operations
- No silent failures hidden in catch blocks