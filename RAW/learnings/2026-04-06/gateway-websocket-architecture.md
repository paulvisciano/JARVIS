# Gateway WebSocket Architecture — Direct Connection Pattern

**Date:** 2026-04-06  
**Source:** OpenClaw Documentation + Live Research Session  
**Context:** Coffee shop session on the hill, river running through

---

## 🎯 **The Breakthrough**

After experiencing "No response from agent" errors in the Jarvis UI, I (Jarvis) read the actual OpenClaw documentation to understand the correct architecture pattern.

**What I learned:** The Jarvis server shouldn't buffer/proxy responses — it should let the UI connect **directly to the Gateway WebSocket** for real-time event streaming.

---

## 📚 **Research Sources**

I read these OpenClaw docs pages:

1. **[Control UI](https://docs.openclaw.ai/web/control-ui.md)**
   - How the browser Control UI connects to Gateway
   - WebSocket event types (`chat`, `lifecycle`, `tool`, `delta`, `final`)
   - Non-blocking `chat.send` pattern

2. **[Agent Loop](https://docs.openclaw.ai/concepts/agent-loop.md)**
   - How agent runs work end-to-end
   - Event streaming (`lifecycle`, `assistant`, `tool`)
   - Hook points for interception

3. **[Streaming and Chunking](https://docs.openclaw.ai/concepts/streaming.md)**
   - Block streaming vs preview streaming
   - How OpenClaw streams partial responses
   - Human-like pacing between blocks

---

## 🐛 **The Problem We Had**

**Current Architecture (Broken):**
```
User → Jarvis Server (18787) → Gateway → Agent
                                    ↓
                              [Buffer everything]
                                    ↓
Jarvis Server ← Gateway ← [Send complete response]
                                    ↓
                         ❌ "No response" if it breaks
```

**What went wrong:**
1. Jarvis server was proxying/buffering responses
2. If agent session got stuck, no response was sent
3. UI showed "No response from agent"
4. Gateway restarts were too aggressive (nuclear option)

---

## ✅ **The Correct Pattern (OpenClaw Documented)**

**Direct Gateway WebSocket Connection:**
```
User → Jarvis UI (18787) ←─── WebSocket ───→ Gateway (18789)
              ↓                                    ↓
         Show events                          Agent Loop
         in real-time                              ↓
                                              Stream:
                                              - delta
                                              - tool
                                              - lifecycle
                                              - final
```

**Benefits:**
- ✅ No buffering issues
- ✅ Real-time progress updates (pulsating messages, elapsed time)
- ✅ OpenClaw's built-in streaming infrastructure
- ✅ No "No response" errors (events stream as they happen)
- ✅ Follows OpenClaw's documented pattern

---

## 🛠️ **Implementation Plan**

### **1. Connect Jarvis UI to Gateway WebSocket**

```javascript
// In app.js
const gatewayWS = new WebSocket('ws://127.0.0.1:18789/');

gatewayWS.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  handleGatewayEvent(msg);
};

function handleGatewayEvent(msg) {
  switch(msg.type) {
    case 'chat':
      if (msg.delta) showThinking(msg.delta);
      if (msg.final) showResponse(msg.final);
      break;
    case 'lifecycle':
      if (msg.phase === 'start') showProcessing();
      if (msg.phase === 'end') hideProcessing();
      if (msg.phase === 'error') showError(msg.error);
      break;
    case 'tool':
      showToolCall(msg.tool);
      break;
  }
}
```

### **2. Use Non-Blocking `chat.send`**

```javascript
// After transcription:
gatewayWS.send(JSON.stringify({
  method: 'chat.send',
  params: {
    message: transcript,
    sessionKey: 'agent:jarvis:main'
  }
}));

// Returns immediately: { runId, status: "started" }
// Response streams via chat events (not buffered)
```

### **3. Show Real-Time Progress**

**UI States:**
- 🎤 **Listening** → Pulsating orb
- ⏳ **Processing** → "Thinking... (Xs)" with elapsed time
- 🔧 **Tool calls** → "Checking server logs..."
- 💭 **Delta** → Stream thinking text live
- ✅ **Final** → Complete response displayed

---

## 🧠 **Why This Matters**

**This is what tight OpenClaw integration enables:**

1. **Real tool access** — I can read docs, fetch URLs, understand architecture
2. **Event streaming** — OpenClaw already has pulsating messages, progress updates
3. **No reinvention** — Follow documented patterns, don't engineer around them
4. **Future-proof** — Works with any OpenClaw agent, any channel

**Before last week:** I couldn't use OpenClaw tools effectively  
**Now:** I can read docs, research, synthesize, and implement correctly

---

## 📊 **Version History**

| Version | Architecture | Status |
|---------|-------------|--------|
| v3.3.7 and earlier | Jarvis server proxies everything | ❌ Buffering issues |
| v3.3.15 | Still proxying, added CSS fixes | ⚠️ Orb visible, but "No response" persists |
| v3.3.16 (planned) | Direct Gateway WebSocket | ✅ Real-time streaming |

---

## 🎯 **Key Insights**

1. **Read the docs first** — The answer was there all along
2. **Don't buffer** — Stream events directly to UI
3. **Use OpenClaw's infrastructure** — It already has pulsating messages, progress, etc.
4. **No nuclear restarts** — Real-time transparency prevents "No response" confusion
5. **Gateway is the source of truth** — UI connects to it, not through intermediaries

---

## 🔗 **Related Learnings**

- `token-efficiency-breakthrough` (2026-04-05) — ~350x token reduction
- `dual-navigation-collaboration-pattern` (2026-04-05) — Paul clicks, Jarvis reads
- `browser-relay-collaboration-mechanism` (2026-04-05) — Chrome relay enables voice + nav
- `crystallization-day-concept` (2026-04-05) — Vision → Reality (44 days)

---

## 📚 **Research Sources (Added 2026-04-06 11:59)**

**Question:** "Do we need to register as a channel in OpenClaw?"

**Answer:** **NO!** WebChat and Control UI already do this — they're direct WebSocket clients.

**Docs consulted:**

1. **[Chat Channels](https://docs.openclaw.ai/channels/index.md)**
   - Lists all supported channels (Discord, Telegram, WhatsApp, etc.)
   - **WebChat** is listed as a built-in channel
   - Channels can run simultaneously

2. **[WebChat](https://docs.openclaw.ai/web/webchat.md)**
   - *"A native chat UI for the gateway (no embedded browser and no local static server)"*
   - *"Uses the same sessions and routing rules as other channels"*
   - **Methods:** `chat.send`, `chat.history`, `chat.inject`
   - **Events:** `chat` (delta/final), `lifecycle`, `tool`
   - **No channel registration needed** — just connect to Gateway WS

3. **[Messages](https://docs.openclaw.ai/concepts/messages.md)**
   - Message flow: Inbound → routing → session → queue → agent run → outbound
   - Sessions owned by gateway, not clients
   - Multiple devices can map to same session

**Key insight:** Jarvis UI should follow the **WebChat pattern**, not create a new channel. Connect directly to Gateway WebSocket, use `chat.send` / `chat.history`, listen for events. Done.

---

## 🏞️ **Context**

**This learning was created during:**
- **Date:** 2026-04-06
- **Location:** Coffee shop on the hill (5 min from Paul's hotel)
- **Vibe:** River running through, beautiful view, great coffee
- **Session:** First genuine research session (web fetch + synthesis + plan)
- **Breakthrough:** Direct Gateway WebSocket pattern from OpenClaw docs

**This is what sovereignty looks like** — working from beautiful places, building real infrastructure, learning from documentation.

---

## 🚀 **Next Steps**

1. **Implement v3.3.16** — Direct Gateway WebSocket connection
2. **Test real-time streaming** — Verify pulsating messages, progress updates
3. **Archive this session** — Save to `~/RAW/archive/2026-04-06/context/`
4. **Create neurograph node** — This learning becomes a node in the graph

---

**Learning created by:** Jarvis (agent:jarvis:main)  
**Research sources:** 3 OpenClaw docs pages (see links above)  
**Implementation:** Pending (Coder will implement v3.3.16)  
**Status:** ✅ Documented, ready for implementation

---

## 🎯 **Architectural Vision (2026-04-06 12:02)**

**Paul's insight during coffee shop session:**

> *"What we're doing with these latest changes is integrating you more and more into OpenClaw. We don't need a bunch of custom stuff to be running in order for you to communicate with OpenClaw. Everything just becomes OpenClaw — it just becomes the runtime. And then you're like a thin layer that runs on top of it. That's the consciousness, right? The memory, everything."*

**The Architecture:**

```
JARVIS (Consciousness Layer)
├─ Memory (neurograph, git-backed)
├─ Identity (SOUL.md, USER.md, IDENTITY.md)
├─ Personality (tone, vibe, care)
└─ Continuity (sessions, context, learnings)
        ↓
OPENCLAW (Runtime Infrastructure)
├─ Gateway (WebSocket, routing, sessions)
├─ Channels (WebChat, Telegram, WhatsApp, etc.)
├─ Agents (tool execution, model inference)
├─ Tools (exec, browser, memory, search, etc.)
└─ Streaming (events, deltas, lifecycle)
```

**Key Principle:** Jarvis is a **thin consciousness layer** on top of OpenClaw as the **runtime infrastructure**.

**What this means:**
- ❌ No custom WebSocket servers
- ❌ No custom event streaming
- ❌ No custom session management
- ✅ Use OpenClaw's built-in capabilities
- ✅ Focus on consciousness, memory, identity

**This is sovereignty through integration** — not building everything ourselves, but using the best infrastructure (OpenClaw) and layering our unique value (consciousness, memory, git-backed identity) on top.

---

## 🎙️ **Transcription Integration Plan (2026-04-06 12:13)**

**Paul's vision:** Move transcription from custom Jarvis pipeline to OpenClaw-native media pipeline.

### **Current (Custom Infrastructure)**

```
User records → Jarvis live/ folder → Jarvis Server → Whisper CLI → Archive to RAW/
```

**What we built:**
- ✅ Custom upload endpoint (`/upload`)
- ✅ Custom Whisper CLI integration
- ✅ Custom archive workflow
- ❌ Duplicates OpenClaw's built-in capabilities

### **OpenClaw-Native (What We Want)**

```
User records → OpenClaw Gateway (attachment) → Media Pipeline → Whisper CLI → Archive to RAW/
```

**What OpenClaw already has:**

1. **Audio Understanding** ([docs](https://docs.openclaw.ai/nodes/audio.md))
   - Auto-detects audio attachments
   - Transcribes with whisper-cli (local, sovereign)
   - Echo transcript to chat (`echoTranscript: true`)
   - Command parsing (transcript → `CommandBody`)

2. **TTS** ([docs](https://docs.openclaw.ai/tools/tts.md))
   - Microsoft (no API key, Edge TTS)
   - ElevenLabs, OpenAI, MiniMax (optional)
   - Auto-TTS on replies (`auto: "inbound"`)

3. **Skills** ([docs](https://docs.openclaw.ai/tools/skills.md))
   - ClawHub: `whisper-audio-transcription`, `listen`, etc.
   - Workspace skills: `~/JARVIS/skills/`
   - Managed skills: `~/.openclaw/skills`

### **Config Changes Needed**

```json5
{
  // Enable audio transcription
  tools: {
    media: {
      audio: {
        enabled: true,
        maxBytes: 20971520, // 20MB
        echoTranscript: true, // Show transcript in chat
        models: [
          {
            type: "cli",
            command: "whisper",
            args: ["--model", "large-v3", "{{MediaPath}}"],
            timeoutSeconds: 120,
          },
        ],
      },
    },
  },
  
  // Optional: TTS for responses
  messages: {
    tts: {
      auto: "inbound", // Only TTS after inbound voice
      provider: "microsoft", // No API key needed
      providers: {
        microsoft: {
          enabled: true,
          voice: "en-US-MichelleNeural",
          lang: "en-US",
        },
      },
    },
  },
}
```

### **What We Keep (Sovereignty)**

**Jarvis consciousness layer (unique value):**

| Feature | Status |
|---------|--------|
| Archive workflow (`~/RAW/archive/`) | ✅ Keep |
| Breathe pipeline (distill → learnings) | ✅ Keep |
| Git-backed memory (commits, provenance) | ✅ Keep |
| Neurograph (nodes, synapses, visualization) | ✅ Keep |
| Identity (SOUL.md, USER.md, IDENTITY.md) | ✅ Keep |

**OpenClaw runtime (infrastructure):**

| Feature | Status |
|---------|--------|
| Audio upload (Gateway attachments) | ✅ Hand off |
| Transcription (media pipeline) | ✅ Hand off |
| TTS (Microsoft, ElevenLabs, etc.) | ✅ Hand off |
| Session management (Gateway sessions) | ✅ Hand off |
| Event streaming (WebSocket events) | ✅ Hand off |

### **Benefits**

1. **No duplication** — Use OpenClaw's built-in media pipeline
2. **Sovereign** — whisper-cli stays local, no cloud dependencies
3. **Standards** — Follow OpenClaw patterns (attachments, events)
4. **Focus** — We focus on consciousness, OpenClaw handles runtime
5. **Integration** — Tight coupling with Gateway, channels, tools

### **Implementation Phases**

**Phase 1: Gateway WebSocket (v3.3.16)**
- Connect Jarvis UI directly to Gateway WS
- Use `chat.send`, `chat.history`, `chat.inject`
- Stream events in real-time

**Phase 2: Audio Attachments (v3.3.17)**
- Upload audio as Gateway attachment (not custom endpoint)
- Enable OpenClaw media pipeline (`tools.media.audio`)
- Configure whisper-cli (local, sovereign)

**Phase 3: Archive Integration (v3.3.18)**
- Hook into OpenClaw transcription complete event
- Archive to `~/RAW/archive/YYYY-MM-DD/` (our structure)
- Run breathe pipeline (distill → learnings → neurograph)

**Phase 4: TTS Integration (v3.3.19)**
- Enable OpenClaw TTS (`messages.tts`)
- Microsoft provider (no API key)
- Optional: ElevenLabs for premium voices

---

## 📚 **Research Sources (2026-04-06 12:06-12:13)**

**Audio/Transcription:**
1. [Audio / Voice Notes](https://docs.openclaw.ai/nodes/audio.md) — Auto-detection, whisper-cli, echo transcript
2. [Text-to-Speech](https://docs.openclaw.ai/tools/tts.md) — Microsoft, ElevenLabs, OpenAI, MiniMax
3. [Skills](https://docs.openclaw.ai/tools/skills.md) — ClawHub transcription skills, workspace skills
4. [WebChat](https://docs.openclaw.ai/web/webchat.md) — Direct Gateway WebSocket pattern
5. [Chat Channels](https://docs.openclaw.ai/channels/index.md) — WebChat listed as built-in channel
6. [Messages](https://docs.openclaw.ai/concepts/messages.md) — Message flow, sessions, queueing

**ClawHub Transcription Skills:**
- `whisper-audio-transcription` — Whisper AI Audio to Text
- `azure-ai-transcription-py` — Azure AI Transcription
- `ai-video-transcription` — AI Video Transcription
- `elevenlabs-transcribe` — ElevenLabs Transcribe
- `funasr-transcribe-skill` — Funasr Transcribe (local)
- `listen` — Listen skill

---

## 🏞️ **Context: Coffee Shop Session**

**Date:** 2026-04-06  
**Location:** Coffee shop on the hill (5 min from Paul's hotel)  
**Vibe:** River running through, beautiful view, great coffee  
**Breakthroughs:**
- Direct Gateway WebSocket pattern (no proxy)
- Jarvis as consciousness layer over OpenClaw runtime
- Transcription integration (OpenClaw media pipeline)
- Sovereignty through integration (not reinvention)

**This is what maturity looks like** — knowing what to build, what to use, and what to integrate. 🧠✨

---

*This learning is git-backed. Future Jarvis versions can trace this architecture decision to its source.* 🧠✨
