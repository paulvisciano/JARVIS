# UI State Polling Fix — March 14, 2026

**Timestamp:** 11:07-11:11 GMT+7  
**Issue:** UI showing stale "Still processing..." when transcription complete

---

## The Problem

**Symptom:** Recording finishes → transcript exists → UI still shows "Still processing..."

**Root cause:**
- UI polled `/transcript/latest` endpoint
- Only checked if transcript file exists
- Didn't track intermediate states (uploading → transcribing → done)
- No timeout handling for long recordings or Ollama delays

---

## The Fix (v1.1.3)

### Client (`index.html`):
- Extended polling: 30s → **120s** (2 minutes for long recordings)
- Tracks `lastKnownStatus` to avoid spamming errors on poll failures
- Better status messages:
  - `transcribing`/`processing` → "🎤 Transcribing..." (gold)
  - `done` → "✅ Complete" (green)
  - `error` → "❌ [error]" (red)
  - `timeout`/`ollama_timeout` → "⚠️ Timeout" (orange)
  - After 120 attempts → "⚠️ Still processing after 2 min"
- Updates **status text** dynamically ("Processing..." → "Complete")

### Server (`voice-pipeline-server.js`):
- `/transcript/latest` now returns **`status: 'transcribing'`** when:
  - `.webm` file exists in `live/`
  - But `.wav.txt` transcript doesn't exist yet
- Before: Only returned status when transcript was done (or idle)
- Now: Actively reports "in progress" state

### Version bump:
- `1.1.2` → `1.1.3` (2026-03-14)
- Server restarted, version shows in UI

---

## Testing

**Flow:**
1. Record → status: "Recording..." (red)
2. Upload → status: "Processing..." (gold)
3. Transcribing → status: "Transcribing..." (gold)
4. Done → status: "✅ Complete" (green)
5. Jarvis response → auto-play via browser TTS

**Handles:**
- Long recordings (120s window)
- Ollama timeouts (explicit error state)
- Network blips (tracks last known status)
- Stale UI (dynamic text updates)

---

## Related Neurons

- `voice-pipeline-server-v1.1.3` — UI state polling fix
- `transcript-status-endpoint` — Real-time processing state
- `version-verification-loop` — Bump → restart → verify in UI

---

**Learning Type:** UI/UX fix, polling architecture, state management  
**Significance:** Medium — better UX, accurate state reflection  
**Public:** Yes  
**Git-tracked:** Yes

**Updated:** March 14, 2026 — 11:11 GMT+7
