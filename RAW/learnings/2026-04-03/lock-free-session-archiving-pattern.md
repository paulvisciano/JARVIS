# Lock-Free Session Archiving Pattern

**Date:** 2026-04-03
**Type:** pattern
**Status:** extracted

## The Pattern

Use lock files (`.lock`) to signal session activity state, allowing archive systems to safely distinguish between active and completed sessions.

## Implementation

```
Session Lifecycle:
1. Session starts → Create session.jsonl + session.jsonl.lock
2. Messages written → Append to session.jsonl (lock remains)
3. Session ends → Remove session.jsonl.lock
4. Archive runs → Only moves sessions WITHOUT .lock files
```

## Benefits

| Before (Buggy) | After (Lock-Free) |
|----------------|-------------------|
| Archive moves any session file | Archive skips locked sessions |
| Data loss mid-conversation | Complete conversations preserved |
| Gateway creates new file mid-chat | Single session file per conversation |
| "Amnesiac" behavior | Full context continuity |

## Why Move (Not Copy) Is Still Correct

The original instinct to use `renameSync()` (move) was right:
- ✅ Keeps `~/.openclaw/agents/*/sessions/` clean
- ✅ No duplicate files accumulating
- ✅ Atomic operation (no partial states)

**The missing piece:** Only move when the session is truly complete (lock-free).

## Broader Application

This pattern applies to any system where:
- One process writes to files
- Another process consumes/archives those files
- Timing between write-complete and consume is non-deterministic

Lock files provide a simple, filesystem-native coordination mechanism without requiring databases or message queues.