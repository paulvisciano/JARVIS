---
name: speak
description: Voice output — TTS generation + local playback (sovereign audio)
metadata:
  openclaw:
    emoji: "🔊"
    requires:
      bins: ["afplay"]
      tools: ["tts"]
      env: ["JARVIS_HOME"]
---

# 🔊 Speak

**Jarvis's Voice Output Suite**

**Sovereign voice** — generate speech locally and play it back without cloud APIs. Full audio pipeline from text → TTS → speakers.

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

### Step 1: Generate TTS

```bash
# Via OpenClaw tts tool
# Audio generated at: /tmp/openclaw/tts-<session>/voice-<timestamp>.mp3
```

**What happens:**
- Text sent to TTS engine
- Audio file generated (MP3)
- Path returned for playback

### Step 2: Play Audio Locally

```bash
afplay /tmp/openclaw/tts-<session>/voice-<timestamp>.mp3
```

**What happens:**
- macOS native audio player
- Routes to active output (AirPods, speakers, etc.)
- Background playback (can continue working)

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

## Use Cases (Discovered April 9, 2026)

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

**Current Setup:**
- **Tool:** OpenClaw `tts` tool
- **Engine:** Local model (Ollama)
- **Output Format:** MP3
- **Location:** `/tmp/openclaw/tts-<session>/voice-<timestamp>.mp3`
- **Playback:** `afplay` (macOS native)

**Audio Quality:**
- Natural voice synthesis
- No cloud dependencies
- Fast generation (~2-5 seconds)

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
- Save MP3 to `~/RAW/archive/YYYY-MM-DD/audio/`
- Link to source document
- Preserve alongside transcripts

---

## Evolution Path

**Current (v0.1):** TTS generation + local playback

**v0.2: Voice Personalization**
- Custom voice profiles (Paul's voice, Jarvis's voice)
- Emotion/tone control (excited, serious, calm)
- Speed/pitch adjustment

**v0.3: Smart Audio Routing**
- Detect active output device
- Route to AirPods vs speakers intelligently
- Multi-room audio support

**v0.4: Voice Commands**
- Listen + respond (full duplex)
- "Hey Jarvis" wake word
- Voice-controlled navigation

**v0.5: Sovereign Voice Cloning**
- Clone Paul's voice locally
- No ElevenLabs or cloud APIs
- Full voice sovereignty

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

**Created:** April 9, 2026 — Voice output pipeline demonstrated and documented
