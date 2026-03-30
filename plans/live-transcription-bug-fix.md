# Live Transcription Bug — Fix Plan

**Date:** 2026-03-30  
**Type:** Bug Fix (Critical)  
**Priority:** P0 — Blocking  
**Status:** Ready for Implementation  
**Assigned to:** Cursor (Paul + AI pair programming)  

---

## The Bug

**Symptom:** Live transcription works during recording, but when recording stops (spacebar to send), the transcript shows an **old/stale transcript** instead of the current one.

**Timeline:**
1. User presses spacebar → recording starts → orb shows red
2. User speaks → live transcription appears in transcript bubble (working ✅)
3. User presses spacebar → recording stops → sends to server
4. **BUG:** Transcript bubble shows OLD transcript (from previous session/recording)
5. Expected: Should show the transcript that was just recorded

**Frequency:** Happens consistently (100% reproducible)

**History:** Attempted fixes: 5-6 times. None stuck. This suggests a **race condition**, **caching issue**, or **wrong data source**.

---

## Investigation Plan

### Step 1: Trace the Full Flow

**Document every step from recording start → transcript display:**

```
1. User presses spacebar
   ↓
2. Client: startRecording() (app.js)
   ↓
3. Browser: MediaRecorder starts → audio/webm stream
   ↓
4. Client: Audio chunks collected in mediaRecorderRef.current
   ↓
5. User presses spacebar again
   ↓
6. Client: stopRecording() (app.js)
   ↓
7. Client: Create Blob from chunks → send to server via fetch()
   ↓
8. Server: jarvis-server.js receives audio
   ↓
9. Server: Save to live/ directory (recording-TIMESTAMP.webm)
   ↓
10. Server: Transcribe with whisper.cpp
   ↓
11. Server: Write transcript to live/recording-TIMESTAMP.wav.txt
   ↓
12. Server: Archive recording (move to ~/RAW/archive/YYYY-MM-DD/audio/)
   ↓
13. Server: Send response to client (SSE? poll? webhook?)
   ↓
14. Client: Receive transcript
   ↓
15. Client: Update #transcript-text element
   ↓
16. User sees transcript
```

**Action:** Add `console.log()` at each step with timestamps. Verify the flow.

---

### Step 2: Identify Where Stale Data Enters

**Hypotheses to test:**

#### A. **Client-side caching issue**
- Is the client reading from a cached response?
- Is there a `pendingResponses` map with old data?
- Is the client polling the wrong endpoint?

**Check:**
```javascript
// In app.js, where transcript is updated
console.log('[Transcript Update] Source:', source);
console.log('[Transcript Update] Timestamp:', new Date().toISOString());
console.log('[Transcript Update] Content:', transcriptText);
```

#### B. **Server-side file mix-up**
- Is the server writing to the wrong file?
- Is the archive step overwriting the live transcript?
- Is there a race between transcription and archival?

**Check:**
```javascript
// In jarvis-server.js, after transcription
console.log('[Server] Transcript file:', transcriptPath);
console.log('[Server] Transcript content:', transcriptText);
console.log('[Server] Archive path:', archivePath);
```

#### C. **SSE/Polling race condition**
- Is the client receiving multiple events (old + new)?
- Is the SSE connection stale from a previous session?
- Is the poll interval too slow, missing the new transcript?

**Check:**
```javascript
// In app.js, SSE event handler
eventSource.addEventListener('transcript', (e) => {
  console.log('[SSE] Received event:', e.data);
  console.log('[SSE] Event timestamp:', e.timestamp);
});
```

#### D. **Timestamp mismatch in file lookup**
- Is the client looking up the transcript by timestamp?
- Is the timestamp from the recording filename different from the transcript filename?
- Is there a timezone issue (GMT+7 vs UTC)?

**Check:**
```javascript
// Where transcript filename is constructed
console.log('[Client] Recording timestamp:', recordingTimestamp);
console.log('[Client] Expected transcript file:', transcriptFilename);
```

---

### Step 3: Add Debug Logging

**Create a debug build with verbose logging:**

#### Client-side (`app.js`)

Add at the top of relevant functions:
```javascript
function stopRecording() {
  console.group('[stopRecording]');
  console.log('Timestamp:', new Date().toISOString());
  console.log('MediaRecorder state:', mediaRecorderRef.current?.state);
  console.log('Audio chunks:', mediaRecorderRef.current?.chunks?.length);
  console.log('Last transcript before stop:', transcriptTextRef.current?.slice(0, 100));
  // ... rest of function
  console.groupEnd();
}

function updateTranscript(text, source) {
  console.group('[updateTranscript]');
  console.log('Source:', source);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Text length:', text.length);
  console.log('Text preview:', text.slice(0, 100));
  console.log('DOM element:', document.getElementById('transcript-text'));
  // ... rest of function
  console.groupEnd();
}
```

#### Server-side (`jarvis-server.js`)

Add at key points:
```javascript
// After receiving audio
console.group('[Server:AudioReceived]');
console.log('Timestamp:', new Date().toISOString());
console.log('File path:', filepath);
console.log('File size:', audioBuffer.length);
console.groupEnd();

// After transcription
console.group('[Server:TranscriptionComplete]');
console.log('Timestamp:', new Date().toISOString());
console.log('Transcript file:', transcriptPath);
console.log('Transcript text:', transcriptText);
console.log('Archive path:', archivePath);
console.groupEnd();

// After sending to client
console.group('[Server:ResponseSent]');
console.log('Timestamp:', new Date().toISOString());
console.log('Response method:', 'SSE' | 'poll' | 'webhook');
console.log('Response content:', responseText);
console.groupEnd();
```

---

### Step 4: Test Scenarios

**Run these tests and log results:**

1. **Fresh page load → single recording**
   - Expected: Transcript shows immediately after recording
   - Actual: ?

2. **Multiple recordings in sequence**
   - Record → Send → Record → Send → Record → Send
   - Expected: Each transcript matches its recording
   - Actual: Does transcript N show recording N or recording N-1?

3. **Long pause between recordings**
   - Record → Send → wait 30 seconds → Record → Send
   - Expected: Transcript shows current recording
   - Actual: ?

4. **Page reload → immediate recording**
   - Reload page → immediately start recording → send
   - Expected: Transcript shows current recording
   - Actual: ?

---

### Step 5: Fix Strategies

**Based on findings, apply the appropriate fix:**

#### If client-side caching:
- Clear `pendingResponses` map before each recording
- Add cache-bust parameter to transcript fetch URLs
- Invalidate old transcript data on recording start

#### If server-side file mix-up:
- Ensure transcript filename matches recording filename exactly
- Write transcript to live/ BEFORE archiving
- Add atomic file operations (write to temp, then rename)

#### If race condition:
- Add explicit sequencing (wait for transcription before archiving)
- Use promises/async-await to ensure order
- Add retry logic if transcript file not found

#### If timestamp mismatch:
- Use UTC everywhere (no timezone conversions)
- Log timestamps at each step to identify drift
- Use recording file's birthtime, not system time

---

### Step 6: Verification

**After fix, verify:**

1. ✅ Record → Send → Transcript matches recording (100% of the time)
2. ✅ Multiple recordings in sequence all show correct transcripts
3. ✅ No console errors or warnings
4. ✅ Transcript appears within 2-3 seconds of recording end
5. ✅ Live transcription during recording still works
6. ✅ Archive files created correctly in `~/RAW/archive/YYYY-MM-DD/audio/`

---

## Files to Investigate

**Client:**
- `apps/JARVIS/app.js` — `startRecording()`, `stopRecording()`, `updateTranscript()`, SSE handlers
- `apps/JARVIS/index.html` — transcript bubble element, event listeners

**Server:**
- `apps/JARVIS/jarvis-server.js` — audio upload handler, whisper transcription, archival, SSE/poll response

**Live directory:**
- `~/JARVIS/live/` — check for stale files, timestamp patterns

**Archive:**
- `~/RAW/archive/YYYY-MM-DD/audio/` — verify transcript files match recordings

---

## Success Criteria

- [ ] Bug is fixed (transcript always matches current recording)
- [ ] Root cause is documented (what was wrong, why it happened)
- [ ] Fix is committed with descriptive message
- [ ] No regressions (live transcription, archival, TTS still work)
- [ ] Debug logging can be removed or made optional (behind flag)

---

## Notes for Cursor

- **Take screenshots** of console logs during the bug reproduction
- **Commit incrementally** — each debugging step, each hypothesis test
- **Don't guess** — log everything, verify assumptions
- **This has been attempted 5-6 times** — a systematic approach is critical
- **Paul is available** for pair debugging — ask if stuck

---

**Start when ready. This is P0 — drop other work to focus on this.**
