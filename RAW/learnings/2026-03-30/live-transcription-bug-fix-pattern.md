# Live Transcription Bug Fix — Poll Guard + Server Status Pattern

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Problem
After 5-6 failed attempts, the live transcription bug persisted: back-to-back recordings would show the first transcript instead of the second.

## The Solution Pattern
Two components working together:

### 1. Server-Side: Return Status, Not Fallback
```javascript
// When file is still transcribing, return status instead of archive fallback
if (!transcriptExists) {
  return { status: 'transcribing', file: recordingId }
  // NOT: return most recent archive (the bug)
}
```

### 2. Client-Side: Poll Guard with activePollId
```javascript
let activePollId = null

function startPolling(fileId) {
  cancelActivePolling() // Clear old polls first
  activePollId = fileId
  // ... poll logic
}

function cancelActivePolling() {
  if (activePollId) {
    clearInterval(activePollId)
    activePollId = null
  }
}
```

## Why This Worked
- **Server** never returns stale data when fresh data is pending
- **Client** prevents old poll callbacks from overwriting new UI state
- **Together** they eliminate the race condition that caused 5+ failed fixes

## Lesson
Persistent bugs often need coordinated fixes across client AND server — fixing one side alone leaves the race condition open.