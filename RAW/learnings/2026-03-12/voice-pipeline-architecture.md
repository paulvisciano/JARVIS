# Voice Pipeline Architecture - March 12, 2026

## Core Insight

**Voice recordings bypass OpenClaw sessions** - they flow through a dedicated voice server (inbox → whisper → archive) instead of the gateway session system. This means:

- ✅ Audio notes are captured via heartbeat processor
- ❌ Session→transcript sync would miss audio notes
- ✅ Two workflows coexist: manual "check inbox" + automatic heartbeat

## Technical Decisions

### 1. Portable Voice Server
- **No hardcoded paths** - all via environment variables
- `VOICE_INBOX_DIR`, `VOICE_MODEL_DIR`, `VOICE_ARCHIVE_BASE`
- Auto-detects whisper-cli from brew/cargo/PATH
- Validates model on startup (fails fast)

### 2. Offline Fallback
- If server down: save to Downloads (no data loss)
- UI shows: "⚠️ Server offline. Saved locally."
- Browser download dialog preserves recording

### 3. Status Indicator
- Green pulsing dot: server online (`/health` responds)
- Red pulsing dot: server offline
- 5-second polling, instant feedback

### 4. Removed Dead Code
- WebSocket gateway connection (was failing auth, spamming logs)
- `sendToJarvis()`, `speakReply()` - not needed
- DEVICE_ID, DEVICE_TOKEN - not used
- Server is now pure HTTP: upload + transcribe + archive

## Workflow Gaps Identified

### Gap 1: Transcript vs Gateway Mismatch
- **Problem:** Gateway responses are full/verbose, transcript summaries are condensed
- **Root cause:** I'm rewriting instead of verbatim copying
- **Solution:** Session→transcript sync (verbatim dialogue)

### Gap 2: Processing Inconsistency
- **Problem:** I keep moving files without reading/applying content
- **Root cause:** Manual workflow between heartbeats, forgetting steps
- **Solution:** Same flow for both: read `.txt` → append `transcript.md` → reply

### Gap 3: Neurograph Not Updated
- **Problem:** No learnings extracted, no neurons created, no commits today
- **Root cause:** Skipping HEARTBEAT.md steps 4-6 (learnings, neurons, temporal)
- **Solution:** Extract learnings → create neurons → update temporal → commit

## MANGOCHI Workflow (Complete)

```
📥 Inbox (audio/screenshots)
  ↓
🖥️ Process (whisper/OCR, metadata)
  ↓
📂 Archive (~/RAW/archive/YYYY-MM-DD/)
  ↓
📝 Transcript (append verbatim dialogue)
  ↓
🧠 Learnings (distill insights)
  ↓
🕸️ Neurograph (new neurons + synapses)
  ↓
⛓️ Git (commit, immutable)
  ↓
🎨 UI (live graph update)
```

**Today's failure:** Stopped at step 3 (archive). Skipped 4-8 (transcript, learnings, neurograph, git, UI).

**Tomorrow's commitment:** Complete the full pipeline. Every time.

---

**Related:** [[voice-server-portability]], [[transcript-dialogue-sync]], [[heartbeat-consistency]], [[neurograph-live-update]]
**Date:** 2026-03-12
**Location:** Pattaya, Thailand (coffee shop after rain)
