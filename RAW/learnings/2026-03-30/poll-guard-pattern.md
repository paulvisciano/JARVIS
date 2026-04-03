# Poll Guard Pattern — Preventing Stale Transcript Overwrites

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Problem

Live transcription bug haunted us for 5-6 attempts. The issue:

1. User records phrase A → stops → server transcribing...
2. User immediately records phrase B → stops
3. Client polls: `/transcript/latest?file=recording-B`
4. Server can't find B yet (still transcribing)
5. Server falls back to: "most recent archive" → returns phrase A's transcript ❌
6. Client displays wrong transcript

## The Solution: Poll Guard

```javascript
// Track active poll ID
let activePollId = null;

// On new recording start
function cancelActivePolling() {
  if (activePollId) {
    clearTimeout(activePollId);
    activePollId = null;
  }
}

// On poll start
activePollId = setTimeout(pollForTranscript, POLL_INTERVAL);
```

## How It Works

1. **New recording starts** → `cancelActivePolling()` clears any pending polls
2. **Poll ID tracked** → Each poll has unique identifier
3. **Stale polls ignored** → If `activePollId` changed, discard result
4. **Fresh poll only** → Only the most recent poll's result is displayed

## Why This Fixes The Bug

- Prevents old poll results from overwriting new transcripts
- Ensures transcription state is always synchronized with current recording
- Race condition eliminated by canceling in-flight polls on new recording

## Pattern Applicability

This pattern applies to any polling-based UI where:
- Multiple rapid requests can occur
- Response order is not guaranteed
- Stale data would corrupt user experience

## Lesson

Sometimes the fix isn't more complex logic — it's ensuring old operations don't interfere with new ones. The poll guard is a simple guardrail that prevents temporal confusion.