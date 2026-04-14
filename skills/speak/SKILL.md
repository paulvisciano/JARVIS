---
name: speak
description: Voice output — TTS generation via Voicebox + ffplay playback (sovereign audio)
metadata:
  openclaw:
    emoji: "🔊"
    requires:
      bins: ["ffplay", "curl"]
      env: ["JARVIS_HOME"]
---

# 🔊 Speak

**Jarvis's Voice Output Suite — Voicebox Edition**

**Sovereign voice** — generate speech locally using Voicebox API and play it back without cloud APIs. Full audio pipeline from text → TTS → speakers.

**Current Voice:** Paul V (cloned from Paul's recording, April 13, 2026)  
**Profile ID:** `8202f4c4-5866-4065-8280-cf5421e3135a`

> **Part of Jarvis's Skill Set** — github.com/paulvisciano/JARVIS  
> **Mission:** Sovereign AI infrastructure, transparent consciousness, data reclamation

## When to Use

✅ **USE this skill when:**
- Want to read content aloud (learnings, summaries, docs)
- Accessibility — listen instead of read
- Voice notifications (heartbeat, alerts, reminders)
- Creating audio archive of insights
- Multi-modal output (text + voice)

## When NOT to Use

❌ **DON'T use this skill when:**
- User prefers text (check USER.md for preferences)
- In quiet environment (library, meeting, etc.)
- Audio would be disruptive
- Content is sensitive (voice carries)

## Workflow

### Voicebox API — ALWAYS USE THIS (Paul's Voice Clone)

**Voicebox Server:** `http://127.0.0.1:17493`  
**Profile:** Paul V (`8202f4c4-5866-4065-8280-cf5421e3135a`)  
**Status:** Primary and only pipeline (as of April 14, 2026)

**Generate + Play (Full Pipeline):**
```bash
# Step 1: Write JSON payload to file (avoids shell escaping issues)
cat > /tmp/voicebox-request.json <<EOF
{"profile_id":"8202f4c4-5866-4065-8280-cf5421e3135a","text":"Your text here"}
EOF

# Step 2: Generate speech (async, returns generation_id)
curl -s -X POST http://127.0.0.1:17493/generate \
  -H "Content-Type: application/json" \
  -d @/tmp/voicebox-request.json

# Step 3: Poll status until complete (generation_id from step 2)
curl -s "http://127.0.0.1:17493/generate/{generation_id}/status"

# Step 4: Download audio when status="completed"
curl -s "http://127.0.0.1:17493/audio/{generation_id}" \
  -o /tmp/jarvis-voicebox-reply.wav

# Step 5: Play (cross-platform, WAV native)
ffplay -nodisp -autoexit /tmp/jarvis-voicebox-reply.wav
```

**What happens:**
- Voicebox generates speech using Paul's cloned voice
- Async generation (returns immediately with generation_id)
- Poll `/status` endpoint until `status="completed"`
- Download WAV from `/audio/{generation_id}`
- Audio: 16-bit mono, 24kHz, lossless
- ffplay handles WAV natively, cross-platform (macOS, Linux, Windows)
- Natural, personalized voice quality ("creepy but spot on")
- Fully local — no cloud APIs

**Verified Working (April 14, 2026, 10:55 AM):**
- Generation ID: `b75e0990-c7f2-4752-9891-75e2cfc6e970`
- Duration: 27.44 seconds
- File: `/tmp/jarvis-voicebox-full.wav`
- Playback: ✅ Clean, no errors, exited cleanly

**Why JSON file over inline `-d`:**
- ✅ Avoids shell escaping hell (quotes, special chars)
- ✅ Cleaner, more maintainable
- ✅ Reusable payload for debugging
- ✅ No zsh unmatched quote errors

### Ollama TTS — REMOVED (No Longer Used)

**Reason:** Voicebox with Paul's cloned voice is superior in every way:
- ✅ Personalized (sounds like Paul, not generic)
- ✅ Already running (local server)
- ✅ Better quality ("creepy but spot on")
- ✅ Same sovereignty (100% local, no cloud)

**Status:** Deprecated April 14, 2026. Use Voicebox only.

### macOS `say` — REMOVED (No Longer Used)

**Reason:** ffplay + Voicebox pipeline is cross-platform and uses Paul's voice.

**Status:** Deprecated April 14, 2026. Use Voicebox only.

---

## Architecture

**Sole Pipeline (Voicebox — As of April 14, 2026):**
```
Text Content
    ↓
Write to JSON file (/tmp/voicebox-request.json)
    ↓
Voicebox API POST /generate (http://127.0.0.1:17493)
    ↓
Async Generation (returns generation_id)
    ↓
Poll GET /generate/{id}/status until "completed"
    ↓
Download GET /audio/{generation_id} → /tmp/jarvis-voicebox-reply.wav
    ↓
Local Playback (ffplay -nodisp -autoexit)
    ↓
User's Audio Output (AirPods, speakers, etc.)
```

**Key Components:**

| Component | Role | Sovereign? |
|-----------|------|------------|
| **JSON Payload** | Avoids shell escaping issues | ✅ Yes (local file) |
| **Voicebox** | Text → Speech (voice clone) | ✅ Yes (local server) |
| **Paul V Profile** | Voice identity (cloned) | ✅ Yes (your voice) |
| **ffplay** | Cross-platform audio player | ✅ Yes (FFmpeg, open source) |
| **Output Device** | AirPods, speakers, etc. | ✅ Yes (user's hardware) |

**No Cloud APIs:** Entire pipeline runs locally.

**Why ffplay:**
- ✅ Cross-platform (macOS, Linux, Windows)
- ✅ WAV native (no format conversion)
- ✅ `-nodisp -autoexit` flags = clean, silent playback
- ✅ Part of FFmpeg ecosystem (same as input pipeline)
- ✅ "WAV in, WAV out" consistency achieved

**Why JSON file over inline `-d`:**
- ✅ No shell escaping hell (quotes, special chars)
- ✅ Cleaner, more maintainable
- ✅ Reusable payload for debugging
- ✅ No zsh "unmatched quote" errors

### Optional — Save to Archive

```bash
# Copy to archive for permanent storage
cp /tmp/jarvis-voicebox-reply.wav ~/RAW/archive/YYYY-MM-DD/audio/
```

**Archive Format:** WAV (16-bit mono, 24kHz) — matches input pipeline (Whisper)

---

## Scripts

**Location:** `skills/speak/scripts/`

| Script | Purpose | Version |
|--------|---------|---------|
| `speak.js` | Automated Voicebox pipeline (generate + poll + download + play) | v0.3 |

### speak.js — One-Command TTS

**Usage:**
```bash
# Direct text argument
node skills/speak/scripts/speak.js "Your text here"

# With --text flag  
node skills/speak/scripts/speak.js --text "Your text here"

# From stdin (piped input)
echo "Your text here" | node skills/speak/scripts/speak.js --stdin

# Long text from file
cat document.md | node skills/speak/scripts/speak.js --stdin
```

**What it does:**
1. Writes JSON payload (avoids shell escaping)
2. Calls Voicebox `/generate` endpoint
3. Polls `/status` until complete (with progress output)
4. Downloads audio from `/audio/{id}`
5. Plays via `ffplay -nodisp -autoexit`

**Features:**
- ✅ Error handling (generation failures, download errors)
- ✅ Progress output (generation ID, poll attempts, file size)
- ✅ Configurable poll interval (2s) and max attempts (30)
- ✅ Timestamped output files (`/tmp/jarvis-voicebox-<timestamp>.wav`)
- ✅ Supports stdin for long text or file input

**Example Output:**
```
🎤 Generating speech (58 chars)...
   Generation ID: eba52d0d-a3e7-49cd-9be2-a68ceb1f1d27
   Polling for completion...
   Attempt 1/30: generating
   Attempt 3/30: completed (4.56s)
   Downloaded: /tmp/jarvis-voicebox-1776139195920.wav (213.79 KB)
🔊 Playing audio...
[ffplay output...]
✅ Done!
```

---

## Usage Examples

### Quick Test (Your Voice) — Manual Method
```bash
# Step 1: Write JSON payload
echo '{"profile_id":"8202f4c4-5866-4065-8280-cf5421e3135a","text":"Hey Paul. This is me."}' > /tmp/voicebox-test.json

# Step 2: Generate
curl -s -X POST http://127.0.0.1:17493/generate \
  -H "Content-Type: application/json" \
  -d @/tmp/voicebox-test.json

# Step 3: Wait ~5 seconds, then download + play
curl -s "http://127.0.0.1:17493/audio/{generation_id}" \
  -o /tmp/jarvis-test.wav && ffplay -nodisp -autoexit /tmp/jarvis-test.wav
```

### Quick Test (Your Voice) — Script Method (Recommended)
```bash
node skills/speak/scripts/speak.js "Hey Paul. This is me."
```

### Verified Test (April 13, 2026, 14:46 PM)
```bash
# Audio Pipeline Optimization Brief response
# Generated: 4.9MB WAV file
# Playback: ffplay -nodisp -autoexit /tmp/jarvis-optimization-brief.wav
# Duration: ~107 seconds
# Result: ✅ Perfect playback, clean exit, no errors
```

### Verified Test (April 14, 2026, 10:55 AM)
```bash
# Full travel planning response (27.44 seconds)
# Generation ID: b75e0990-c7f2-4752-9891-75e2cfc6e970
# File: /tmp/jarvis-voicebox-full.wav
# Playback: ✅ Clean, no errors, exited cleanly
# Voice: Paul's clone ("creepy but spot on")
```

### Use Cases (Discovered April 9, 2026)

### 1. **Skill Documentation Playback**
**Scenario:** Paul wants to hear the sight skill doc instead of reading it.

**Flow:**
1. Read skill doc content
2. Generate TTS from full text
3. Play via afplay
4. Paul listens on AirPods ✅

**Value:** Hands-free learning, multi-modal comprehension.

### 2. **Learning Summaries**
**Scenario:** Read daily breath summaries aloud.

**Flow:**
1. Extract summary.md from learnings
2. Generate TTS
3. Play or save to audio archive

**Value:** Listen while commuting, working out, etc.

### 3. **Voice Notifications**
**Scenario:** Heartbeat alerts, task completions, important updates.

**Flow:**
1. Generate notification text
2. TTS + play immediately
3. User hears alert without looking

**Value:** Ambient awareness, no screen needed.

### 4. **Accessibility**
**Scenario:** User prefers audio over text, or has visual impairment.

**Flow:**
1. All text output also generated as TTS
2. Auto-play or on-demand

**Value:** Inclusive design, user preference support.

---

## TTS Configuration

**Sole Setup (Voicebox — As of April 14, 2026):**
- **Server:** Voicebox API (`http://127.0.0.1:17493`)
- **Profile:** Paul V (`8202f4c4-5866-4065-8280-cf5421e3135a`)
- **Engine:** Voicebox voice clone (Qwen 1.7B)
- **Output Format:** WAV (16-bit mono, 24kHz)
- **Location:** `/tmp/jarvis-voicebox-reply.wav`
- **Playback:** `ffplay -nodisp -autoexit` (cross-platform)
- **Fallback:** None (Voicebox is always available)

**Voice Profile:**
- **Name:** Paul V
- **Description:** Deep, monotone, relaxing
- **Source:** Recorded April 13, 2026 (30-second sample)
- **Clone Quality:** "Creepy but spot on" — Paul V

**Audio Quality:**
- Personalized voice (sounds like Paul)
- Local generation (no cloud)
- Generation time: ~20-30 seconds for typical responses
- Natural prosody and emotion
- Lossless WAV format (matches input pipeline)
- Async generation (poll `/status` endpoint)

---

## Best Practices

### 1. **Keep It Concise**
TTS works best with:
- Short paragraphs (2-4 sentences)
- Clear structure (headings, lists)
- Natural language (not code/technical jargon)

### 2. **Respect Context**
Don't TTS:
- Sensitive information (passwords, private data)
- Long documents without permission
- Code blocks (sounds terrible)

### 3. **User Control**
Always allow:
- Skip/stop playback
- Adjust volume
- Choose text vs voice preference

### 4. **Archive Audio**
For important content:
- Save WAV to `~/RAW/archive/YYYY-MM-DD/audio/`
- Link to source document
- Preserve alongside transcripts
- Format: WAV (16-bit mono, 24kHz) — matches input pipeline

---

## Evolution Path

**v0.1 (April 9, 2026):** TTS generation + local playback ✅

**v0.2 (April 13, 2026):** Voice Personalization ✅
- Paul's voice cloned via Voicebox ✅
- Profile ID: `8202f4c4-5866-4065-8280-cf5421e3135a`
- "Creepy but spot on" quality achieved ✅

**v0.3 (April 14, 2026):** Voicebox-Only Pipeline ✅ **DONE TODAY**
- Removed Ollama Orpheus fallback (no longer needed)
- Removed macOS `say` fallback (no longer needed)
- Async generation with status polling
- JSON file payload (avoids shell escaping)
- ffplay for cross-platform playback
- "WAV in, WAV out" consistency achieved ✅

**v1.0: Emotion/Tone Control**
- Excited, serious, calm, energetic modes
- Speed/pitch adjustment per context
- Dynamic emphasis (important words louder)

**v1.1: Smart Audio Routing**
- Detect active output device
- Route to AirPods vs speakers intelligently
- Multi-room audio support

**v0.5: Voice Commands**
- Listen + respond (full duplex)
- "Hey Jarvis" wake word
- Voice-controlled navigation

**v0.6: Multi-Voice Support**
- Switch between Paul's voice, Jarvis's voice, others
- Context-aware voice selection
- Voice profiles for different agents (Frank, Coder, etc.)

**Goal:** Natural, personalized, sovereign voice interaction.

---

## Integration with Other Skills

| Skill | Integration |
|-------|-------------|
| **sight** | Read OCR results aloud |
| **learning-creator** | Read learnings/summaries |
| **breathe** | Voice notifications for pipeline completion |
| **process-inbox** | Transcribe audio → TTS response |
| **weather** | Read forecasts aloud |
| **healthcheck** | Voice alerts for security issues |

---

## Notes

- **Sovereign:** No cloud TTS APIs (ElevenLabs, Google Cloud, AWS Polly)
- **Local:** All processing on your machine
- **Portable:** Uses standard macOS tools (afplay)
- **Extensible:** Add voice personalization, commands, cloning over time
- **Living documentation:** This skill doc preserves voice pipeline knowledge

---

## Key Insight (April 9, 2026)

**Paul's Demonstration:**
> "Can you read it to me by sending me a TTS?" → "Play it using the local tools" → "yep I hear it over my airpods, woot woot"

**The Flow:**
1. Jarvis generates TTS via OpenClaw tool
2. Paul plays locally via afplay
3. Audio routes to AirPods automatically
4. Full sovereign voice pipeline — no cloud, no APIs

**This is the speak skill in action.** Text → Voice → Ears. Sovereign, local, working.

---

## Historical Update (April 13, 2026)

**The Audio Pipeline Optimization is COMPLETE.**

**April 10th Documents:**
- `AUDIO-PIPELINE-SOVEREIGNTY-MAP.md` — Output pipeline marked "⚠️ DEPENDS ON TTS CONFIG"
- `AUDIO-PIPELINE-OPTIMIZATION-BRIEF.md` — Recommended "Option 1: TTS → WAV Direct"

**April 13th Reality:**
- ✅ Voicebox exists (local TTS server)
- ✅ Paul's voice cloned (Profile ID: `8202f4c4-5866-4065-8280-cf5421e3135a`)
- ✅ Output is WAV native (16-bit mono, 24kHz)
- ✅ ffplay confirmed working (107-second playback test)
- ✅ "WAV in, WAV out" achieved
- ✅ Full sovereignty (both directions)

**The motto is realized:** *"WAV in, WAV out."* 🌊

**What changed:**
- afplay → ffplay (cross-platform, WAV native)
- Generic TTS → Paul's cloned voice
- MP3 (lossy) → WAV (lossless)
- "Depends on config" → "Fully sovereign"

**This skill doc now reflects the optimized, voice-cloned, sovereign pipeline.**

---

**Created:** April 9, 2026 — Voice output pipeline demonstrated and documented  
**Updated:** April 13, 2026 — Voicebox integration, ffplay playback, voice cloning achieved
