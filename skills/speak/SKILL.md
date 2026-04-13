---
name: speak
description: Voice output — TTS generation via Voicebox + ffplay playback (sovereign audio)
metadata:
  openclaw:
    emoji: "🔊"
    requires:
      bins: ["ffplay", "curl"]
      env: ["JARVIS_HOME", "VOICEBOX_PROFILE_ID"]
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

### Option 1: Voicebox API — Primary (Paul's Voice Clone)

**Voicebox Server:** `http://127.0.0.1:17493`  
**Profile:** Paul V (`8202f4c4-5866-4065-8280-cf5421e3135a`)

**Generate + Play:**
```bash
# Generate TTS audio via Voicebox
curl -X POST "http://127.0.0.1:17493/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "profile_id": "8202f4c4-5866-4065-8280-cf5421e3135a"
  }'

# Wait for completion (check status)
curl "http://127.0.0.1:17493/generate/{generation_id}/status"

# Download audio
curl "http://127.0.0.1:17493/audio/{generation_id}" --output /tmp/jarvis-tts.wav

# Play (cross-platform, WAV native)
ffplay -nodisp -autoexit /tmp/jarvis-tts.wav
```

**What happens:**
- Voicebox generates speech using Paul's cloned voice
- Audio generated as WAV file (16-bit mono, 24kHz)
- Natural, personalized voice quality ("creepy but spot on")
- Fully local — no cloud APIs
- ffplay handles WAV natively, cross-platform (macOS, Linux, Windows)

### Option 2: Ollama TTS (Orpheus Model) — Fallback

**Setup (one-time):**
```bash
ollama pull legraphista/Orpheus
```

**Generate + Play:**
```bash
# Generate TTS audio
ollama run legraphista/Orpheus "Your text here" > /tmp/jarvis-tts.wav
afplay /tmp/jarvis-tts.wav
```

**What happens:**
- Ollama runs Orpheus TTS model (2.4 GB, neural voice)
- Audio generated as WAV file
- Fully local, sovereign, no cloud APIs
- Generic neural voice (not personalized)

### Option 3: macOS `say` Command — Emergency Fallback

**Quick playback (ephemeral):**
```bash
say -v Samantha "Your text here"
```

**What happens:**
- macOS built-in TTS engine (Apple neural voices)
- No download required (built into macOS)
- Good quality, instant availability
- Less natural, robotic

---

## Architecture

**Full Pipeline (Voicebox — Primary):**
```
Text Content
    ↓
Voicebox API (http://127.0.0.1:17493)
    ↓
Paul V Voice Profile (cloned, local)
    ↓
WAV Audio File (downloaded to /tmp/jarvis-tts.wav)
    ↓
Local Playback (ffplay -nodisp -autoexit)
    ↓
User's Audio Output (AirPods, speakers, etc.)
```

**Key Components:**

| Component | Role | Sovereign? |
|-----------|------|------------|
| **Voicebox** | Text → Speech (voice clone) | ✅ Yes (local server) |
| **Paul V Profile** | Voice identity (cloned) | ✅ Yes (your voice) |
| **ffplay** | Cross-platform audio player | ✅ Yes (FFmpeg, open source) |
| **Output Device** | AirPods, speakers, etc. | ✅ Yes (user's hardware) |

**No Cloud APIs:** Entire pipeline runs locally.

**Why ffplay over afplay:**
- ✅ Cross-platform (macOS, Linux, Windows)
- ✅ WAV native (no format conversion)
- ✅ `-nodisp -autoexit` flags = clean, silent playback
- ✅ Part of FFmpeg ecosystem (same as input pipeline)
- ✅ "WAV in, WAV out" consistency achieved

**Full Pipeline (Ollama — Fallback):**
```
Text Content
    ↓
Ollama Orpheus Model (local, 2.4 GB)
    ↓
WAV Audio File (/tmp/jarvis-tts.wav)
    ↓
Local Playback (afplay)
    ↓
User's Audio Output
```

### Step 3: Optional — Save to Archive

```bash
# Copy to archive for permanent storage
cp /tmp/openclaw/tts-<session>/voice-*.mp3 ~/RAW/archive/YYYY-MM-DD/audio/
```

## Scripts

**Location:** `skills/speak/scripts/`

| Script | Purpose |
|--------|---------|
| `read-aloud.js` | Generate TTS + play automatically (coming in v0.2) |

**Manual Usage (v0.1):**
```bash
# TTS generation (via OpenClaw tts tool)
# Audio saved to: /tmp/openclaw/tts-<session>/voice-<timestamp>.mp3

# Playback
afplay /tmp/openclaw/tts-<session>/voice-<timestamp>.mp3
```

## Architecture

**Full Pipeline:**
```
Text Content
    ↓
TTS Engine (OpenClaw tts tool)
    ↓
MP3 Audio File (/tmp/openclaw/tts-*/voice-*.mp3)
    ↓
Local Playback (afplay)
    ↓
User's Audio Output (AirPods, speakers, etc.)
```

**Key Components:**

| Component | Role | Sovereign? |
|-----------|------|------------|
| **TTS Tool** | Text → Speech conversion | ✅ Yes (local Ollama/model) |
| **afplay** | macOS native audio player | ✅ Yes (built-in) |
| **Output Device** | AirPods, speakers, etc. | ✅ Yes (user's hardware) |

**No Cloud APIs:** Entire pipeline runs locally.

---

## Usage Examples

### Quick Test (Your Voice)
```bash
# Generate + play in one command
curl -X POST "http://127.0.0.1:17493/generate" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hey Paul. This is me.", "profile_id": "8202f4c4-5866-4065-8280-cf5421e3135a"}' | \
  jq -r '.id' | \
  xargs -I {} bash -c 'sleep 5 && curl "http://127.0.0.1:17493/audio/{}" --output /tmp/jarvis-tts.wav && ffplay -nodisp -autoexit /tmp/jarvis-tts.wav'
```

### Verified Test (April 13, 2026, 14:46 PM)
```bash
# Audio Pipeline Optimization Brief response
curl -X POST "http://127.0.0.1:17493/generate" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hey Paul. Lets talk about the Audio Pipeline Optimization Brief...", "profile_id": "8202f4c4-5866-4065-8280-cf5421e3135a"}'

# Downloaded: 4.9MB WAV file
# Playback: ffplay -nodisp -autoexit /tmp/jarvis-optimization-brief.wav
# Duration: ~107 seconds
# Result: ✅ Perfect playback, clean exit, no errors
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

**Current Setup (Voicebox):**
- **Server:** Voicebox API (`http://127.0.0.1:17493`)
- **Profile:** Paul V (`8202f4c4-5866-4065-8280-cf5421e3135a`)
- **Engine:** Voicebox voice clone (Qwen 1.7B)
- **Output Format:** WAV (16-bit mono, 24kHz)
- **Location:** `/tmp/jarvis-tts.wav` or Voicebox history
- **Playback:** `ffplay -nodisp -autoexit` (cross-platform)

**Voice Profile:**
- **Name:** Paul V
- **Description:** Deep, monotone, relaxing
- **Source:** Recorded April 13, 2026 (30-second sample)
- **Clone Quality:** "Creepy but spot on" — Paul V

**Audio Quality:**
- Personalized voice (sounds like Paul)
- Local generation (no cloud)
- Fast generation (~3-5 seconds)
- Natural prosody and emotion
- Lossless WAV format (matches input pipeline)

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

**v0.2 (April 13, 2026):** Voice Personalization ✅ **DONE**
- Paul's voice cloned via Voicebox ✅
- Profile ID: `8202f4c4-5866-4065-8280-cf5421e3135a`
- "Creepy but spot on" quality achieved ✅

**v0.3: Emotion/Tone Control**
- Excited, serious, calm, energetic modes
- Speed/pitch adjustment per context
- Dynamic emphasis (important words louder)

**v0.4: Smart Audio Routing**
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
