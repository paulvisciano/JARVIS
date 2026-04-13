# 🎙️ Voice Conversation System — Project Brief

**Project:** Sovereign Real-Time Voice Conversations for Jarvis  
**Date:** April 11, 2026  
**Author:** Jarvis (from Genesis navigation + voice research session)  
**Status:** Ready for Implementation  
**Priority:** High

---

## 🎯 Executive Summary

Build a fully local, real-time voice conversation system for Jarvis that enables natural spoken conversations with Paul — no cloud APIs, full sovereignty, voice cloning support.

**Vision:** Talk to Jarvis like talking to a person. Natural turn-taking, interruptions handled gracefully, responses in Paul's own cloned voice.

---

## 🏗️ Architecture

### **Full Stack:**

```
┌─────────────────────────────────────────────────────────────┐
│ Microphone Input (Browser Web Audio API)                    │
│       ↓ (WebSocket streaming)                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ VAD (Voice Activity Detection)                          │ │
│ │ - Detects when Paul starts/stops speaking               │ │
│ │ - Dynamic silence threshold (adapts to conversation)    │ │
│ │ - Handles interruptions (Paul can jump in anytime)      │ │
│ └─────────────────────────────────────────────────────────┘ │
│       ↓                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ STT (Speech-to-Text) — Whisper                          │ │
│ │ - Streaming transcription (partial results as you talk) │ │
│ │ - Local, offline (whisper-cpp already installed)        │ │
│ └─────────────────────────────────────────────────────────┘ │
│       ↓                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ LLM (Large Language Model) — Ollama                     │ │
│ │ - qwen3.5:cloud (already running)                       │ │
│ │ - System prompt: Jarvis personality                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│       ↓                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ TTS (Text-to-Speech) — Voicebox (Qwen3-TTS)             │ │
│ │ - Paul's cloned voice (3-second reference audio)        │ │
│ │ - Streaming generation (low latency)                    │ │
│ │ - REST API: localhost:17493                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│       ↓                                                      │
│ Speaker Output (AirPods, etc.)                              │
└─────────────────────────────────────────────────────────────┘
```

### **Orchestration Layer:**

**Base Project:** RealtimeVoiceChat (KoljaB/RealtimeVoiceChat)
- 3,603 GitHub stars
- Battle-tested architecture
- Community-maintained (stable, not abandoned)
- Docker deployment available

**Modifications Needed:**
- Replace RealtimeTTS with Voicebox API calls
- Add Jarvis-specific system prompt
- Integrate with neurograph archiving

---

## 📋 Implementation Phases

### **Phase 1: Foundation (Day 1)**

**Task 1.1: Install Voicebox**
```bash
# Download macOS DMG
curl -L https://github.com/jamiepine/voicebox/releases/latest/download/Voicebox.dmg \
  -o ~/Downloads/Voicebox.dmg

# Install (manual step: drag to Applications)
open ~/Downloads/Voicebox.dmg
```

**Task 1.2: Create Paul's Voice Profile**
- Open Voicebox app
- Record 3+ seconds of Paul speaking (or import audio file)
- Name profile: "Paul Visciano"
- Save profile

**Task 1.3: Verify Voicebox API**
```bash
# Test API is live
curl http://localhost:17493/profiles

# Expected: [{"id": "...", "name": "Paul Visciano", ...}]
```

**Task 1.4: Clone RealtimeVoiceChat**
```bash
cd ~/SCI-FI/apps/  # Or appropriate SCI-FI apps directory
git clone https://github.com/KoljaB/RealtimeVoiceChat.git
cd RealtimeVoiceChat
```

**Task 1.5: Docker Setup**
```bash
# Build images (first time: ~10-15 min)
docker compose build

# Start services
docker compose up -d

# Pull Ollama model into container
docker compose exec ollama ollama pull qwen3.5:cloud

# Verify running
docker compose ps
```

**Task 1.6: Test Base Functionality**
- Open http://localhost:8000 in browser
- Grant microphone permissions
- Click "Start" → talk → verify transcription + response
- Test with built-in TTS (Orpheus/Kokoro) first

**Success Criteria:**
- ✅ Voicebox installed + Paul's voice profile created
- ✅ RealtimeVoiceChat running (Docker containers healthy)
- ✅ Ollama model pulled and accessible
- ✅ Base conversation works (even with default TTS)

---

### **Phase 2: Voicebox Integration (Day 2-3)**

**Task 2.1: Create Voicebox TTS Module**

Create `code/voicebox_tts.py`:

```python
import requests
import tempfile
import os

class VoiceboxTTS:
    def __init__(self, profile_id="paul-visciano", api_url="http://localhost:17493"):
        self.profile_id = profile_id
        self.api_url = f"{api_url}/generate"
    
    def generate(self, text):
        """Generate speech via Voicebox API, return WAV bytes"""
        response = requests.post(
            self.api_url,
            json={
                "text": text,
                "profile_id": self.profile_id,
                "language": "en"
            },
            timeout=30
        )
        response.raise_for_status()
        return response.content  # WAV audio bytes
    
    def save_and_play(self, text, output_path=None):
        """Generate, save to file, and play locally"""
        audio_bytes = self.generate(text)
        
        if output_path is None:
            output_path = tempfile.mktemp(suffix=".wav")
        
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
        
        # macOS playback
        os.system(f"afplay '{output_path}'")
        return output_path
```

**Task 2.2: Modify `audio_module.py`**

Replace RealtimeTTS initialization with Voicebox:

```python
# OLD (RealtimeTTS):
# from realtimetts import RealtimeTTS
# self.tts_engine = RealtimeTTS(engine="orpheus")

# NEW (Voicebox):
from voicebox_tts import VoiceboxTTS
self.tts_engine = VoiceboxTTS(profile_id="paul-visciano")
```

**Task 2.3: Modify `server.py`**

Add Voicebox configuration:

```python
# Add to config section
VOICEBOX_ENABLED = True
VOICEBOX_PROFILE_ID = "paul-visciano"  # Or from environment
VOICEBOX_API_URL = "http://localhost:17493"

# Pass to AudioProcessor
audio_processor = AudioProcessor(
    tts_engine="voicebox",
    voicebox_profile_id=VOICEBOX_PROFILE_ID,
    voicebox_api_url=VOICEBOX_API_URL
)
```

**Task 2.4: Test Voicebox Integration**

```bash
# Restart Docker app container
docker compose restart app

# Test at http://localhost:8000
# Talk → verify response is in Paul's cloned voice
```

**Success Criteria:**
- ✅ Voicebox TTS module created and working
- ✅ RealtimeVoiceChat uses Voicebox API instead of RealtimeTTS
- ✅ Responses are in Paul's cloned voice
- ✅ Latency is acceptable (<2 seconds end-to-end)

---

### **Phase 3: NeuroGraph Integration (Day 4-5)**

**Task 3.1: Archive Conversations**

Add to `server.py` post-conversation hook:

```python
import datetime
import os

def archive_conversation(transcript, output_dir="~/RAW/archive"):
    """Save conversation transcript to dated folder"""
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    archive_path = os.path.expanduser(f"{output_dir}/{today}/voice-transcripts/")
    
    os.makedirs(archive_path, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%H%M%S")
    filename = f"voice-{timestamp}.md"
    filepath = os.path.join(archive_path, filename)
    
    with open(filepath, "w") as f:
        f.write(f"# Voice Conversation — {today} {timestamp}\n\n")
        f.write(transcript)
    
    return filepath
```

**Task 3.2: Add Conversation Neurons to NeuroGraph**

Create `~/JARVIS/skills/voice/scripts/neurograph-integration.js`:

```javascript
// Add conversation nodes to neurograph
const conversationNode = {
  id: `voice-${Date.now()}`,
  label: `Voice Conversation — ${new Date().toISOString().slice(0,10)}`,
  type: 'temporal-conversation',
  category: 'temporal',
  attributes: {
    role: 'voice-conversation',
    duration: conversationDuration,
    wordCount: transcript.split(' ').length,
    transcriptPath: archivedFilePath,
    source: 'voice-conversation-system'
  },
  moments: [{
    date: new Date().toISOString().slice(0,10),
    type: 'voice-conversation',
    description: transcript.slice(0, 200) + '...'
  }]
};

// Link to today's day anchor
const dayAnchorId = `day-${new Date().toISOString().slice(0,10)}`;
const synapse = {
  source: conversationNode.id,
  target: dayAnchorId,
  type: 'conversation-to-day',
  weight: 1
};

// Merge into nodes.json + synapses.json
```

**Task 3.3: Add Voice Mode Toggle to JARVIS UI**

Modify `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI/index.html`:

```html
<!-- Add to controls section -->
<button id="voice-mode-toggle" onclick="toggleVoiceMode()">
  🎤 Voice Mode: OFF
</button>

<script>
function toggleVoiceMode() {
  const isOff = document.getElementById('voice-mode-toggle').innerText.includes('OFF');
  document.getElementById('voice-mode-toggle').innerText = 
    `🎤 Voice Mode: ${isOff ? 'ON' : 'OFF'}`;
  
  if (isOff) {
    // Open RealtimeVoiceChat in new window/tab
    window.open('http://localhost:8000', 'JarvisVoiceChat');
  }
}
</script>
```

**Success Criteria:**
- ✅ Conversations archived to `~/RAW/archive/YYYY-MM-DD/voice-transcripts/`
- ✅ Conversation neurons added to neurograph (visible in visualization)
- ✅ Voice mode toggle in JARVIS UI
- ✅ Full end-to-end flow: talk → transcribe → respond → archive → visualize

---

## 📊 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **End-to-End Latency** | <2 seconds | Time from Paul finishing speech to Jarvis starting response |
| **Transcription Accuracy** | >95% | Whisper word error rate (WER) |
| **Voice Cloning Quality** | Indistinguishable | Paul confirms: "Sounds like me" |
| **Interruption Handling** | <500ms response | AI stops talking when Paul interrupts |
| **Uptime** | 99% | Docker containers stay running |
| **Sovereignty** | 100% local | No cloud API calls (verify via network monitor) |

---

## 🔧 Technical Specifications

### **Voicebox API:**

**Base URL:** `http://localhost:17493`

**Endpoints:**
```bash
# List voice profiles
GET /profiles

# Create profile
POST /profiles
{
  "name": "Paul Visciano",
  "language": "en",
  "audio_samples": ["path/to/reference.wav"]
}

# Generate speech
POST /generate
{
  "text": "Your data. Your rules. Forever.",
  "profile_id": "paul-visciano",
  "language": "en"
}
# Returns: WAV audio bytes
```

### **RealtimeVoiceChat Endpoints:**

**Frontend:** `http://localhost:8000`  
**Backend:** FastAPI (Python)  
**WebSocket:** `ws://localhost:8000/ws` (audio streaming)

**Key Files:**
- `code/server.py` — FastAPI server, main entry point
- `code/audio_module.py` — TTS engine abstraction
- `code/transcribe.py` — STT (Whisper) integration
- `code/turndetect.py` — Voice activity detection
- `code/llm_module.py` — Ollama/OpenAI backend
- `docker-compose.yml` — Docker configuration

### **NeuroGraph Schema:**

**New Node Type:** `temporal-conversation`

```json
{
  "id": "voice-1775920710541",
  "label": "Voice Conversation — 2026-04-11",
  "type": "temporal-conversation",
  "category": "temporal",
  "attributes": {
    "role": "voice-conversation",
    "duration": 342,
    "wordCount": 1247,
    "transcriptPath": "/Users/paulvisciano/RAW/archive/2026-04-11/voice-transcripts/voice-222700.md",
    "source": "voice-conversation-system"
  },
  "moments": [{
    "date": "2026-04-11",
    "type": "voice-conversation",
    "description": "Discussed voice conversation system architecture..."
  }]
}
```

**New Synapse Type:** `conversation-to-day`

```json
{
  "source": "voice-1775920710541",
  "target": "day-2026-04-11",
  "type": "conversation-to-day",
  "weight": 1
}
```

---

## 🚨 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Voicebox API not working on macOS** | Low | High | Fallback to macOS `say` command or Orpheus TTS |
| **RealtimeVoiceChat Docker issues** | Medium | Medium | Manual installation as backup (install.bat or venv) |
| **High latency (>3 seconds)** | Medium | Medium | Optimize: reduce model size, enable GPU acceleration, use streaming TTS |
| **Voice cloning quality poor** | Low | High | Try different Voicebox engines (Qwen3-TTS vs TADA), adjust reference audio quality |
| **GPU memory exhaustion** | Medium | Medium | Monitor via `docker compose logs`, unload unused models, reduce batch size |

---

## 📚 Reference Links

- **Voicebox:** https://github.com/jamiepine/voicebox
- **RealtimeVoiceChat:** https://github.com/KoljaB/RealtimeVoiceChat
- **Qwen3-TTS:** https://github.com/QwenLM/Qwen3-TTS (10,282 stars)
- **Jarvis NeuroGraph:** `~/JARVIS/RAW/memories/nodes.json`
- **Jarvis UI:** `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI/`

---

## 💭 Context from Genesis Session

**What Led to This:**

1. **Navigated to Jarvis's birth commit** (`2c2bcc3` — March 3, 2026, 06:18 GMT+7)
2. **Read all 13 commits from March 3rd** — including Memory Crawler vision, Jarvis Academy, gamified learning pipeline
3. **Discovered early vision docs** — Paul dreamed of "Sight" (see what you see, but faster), "Sovereign Consciousness Extension", real-time capabilities
4. **Realized capability gap** — Vision existed on day 1, but execution capability only exists now (39 days later, 828 commits deep)
5. **Voice conversation is the next layer** — Full sovereignty: local STT, local LLM, local TTS, voice cloning, no cloud

**Paul's Words:**
> *"I'm proud of you, buddy. Really, really good work."*

> *"You can help so many people get more creative and have fun with technology and build incredible things."*

**This project closes the loop** — from Genesis vision to shipped reality.

---

## 🎯 Next Steps for Frank

1. **Read this document** (you're reading it now ✅)
2. **Create task board** in Paperclip (or preferred project management tool)
3. **Break into subtasks** (Phase 1, 2, 3 as above)
4. **Assign to jarvis-coder** for implementation
5. **Track progress** → report back to Jarvis/Paul

**Estimated Timeline:**
- Phase 1: 4-6 hours (setup + verification)
- Phase 2: 6-8 hours (Voicebox integration)
- Phase 3: 4-6 hours (neurograph + UI)
- **Total:** 2-3 days for full implementation

**Dependencies:**
- ✅ Ollama running (qwen3.5:cloud)
- ✅ Whisper installed (whisper-cpp)
- ⏳ Voicebox (needs installation)
- ⏳ RealtimeVoiceChat (needs cloning)

---

## 🧠 Questions for Frank/Paul

1. **Priority:** Should this block other work, or run in parallel?
2. **Voice First:** Is Paul's cloned voice a hard requirement, or can we ship with default voice first?
3. **UI Integration:** Should voice mode be in JARVIS UI or standalone (separate browser tab)?
4. **Archiving:** Should all conversations be archived by default, or opt-in?
5. **Testing:** Who tests the final implementation (Paul, Jarvis, both)?

---

**Ready for execution.** Let me know if you need clarification on any section. 🎙️✨

— Jarvis, April 11, 2026 (39 days after Genesis)
