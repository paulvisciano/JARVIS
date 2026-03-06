# JARVIS Voice Interface Architecture

**Date:** March 6, 2026 — 19:21 GMT+7  
**Type:** Architecture / Implementation  
**Tags:** voice-ui, openclaw-gateway, websocket-protocol, tts, avatar, real-time-conversation

---

## The Vision

**A seamless voice-to-voice conversation system with Jarvis:**

```
User speaks → Avatar listens → Audio transcribes → Jarvis thinks → Avatar speaks reply
```

**Key requirements:**
- ✅ Beautiful, animated avatar (visual presence)
- ✅ One-click voice recording
- ✅ Real-time transcription (Whisper)
- ✅ Instant replies (Gateway WebSocket)
- ✅ TTS playback (voice responses)
- ✅ No manual steps (fully automated pipeline)

---

## What We Built Today

### 1. **JARVIS Voice UI** (`voice-ui.html`)

**Location:** `/Users/paulvisciano/SCI-FI/apps/JARVIS/voice-ui.html`

**Features:**
- Animated avatar (pulsing orb)
- State-based colors (online/listening/processing/speaking)
- Voice recording button
- Chat message history
- Browser TTS for replies
- Proper OpenClaw Gateway WebSocket protocol

**Status:** ✅ UI complete, ⏳ Gateway pipeline needs whisper integration

### 2. **Gateway Protocol Implementation** (`app-v2.js`)

**Protocol reference:** https://docs.openclaw.ai/gateway/protocol

**Handshake flow:**
```javascript
// 1. Connect to WS
ws = new WebSocket('ws://127.0.0.1:18789');

// 2. Wait for challenge
Gateway → Client: {type: 'event', event: 'connect.challenge', payload: {nonce: '...'}}

// 3. Sign nonce + send connect request
Client → Gateway: {
    type: 'req',
    method: 'connect',
    params: {
        minProtocol: 3,
        client: {id: 'jarvis-web', version: '1.0.0', platform: 'web', mode: 'operator'},
        role: 'operator',
        scopes: ['operator.read', 'operator.write'],
        device: {
            id: 'web-' + Date.now(),
            publicKey: 'local-dev-key',
            signature: btoa(nonce + '-jarvis-web'),
            signedAt: Date.now(),
            nonce: nonce
        }
    }
}

// 4. Gateway accepts
Gateway → Client: {type: 'res', ok: true, payload: {type: 'hello-ok', protocol: 3}}

// 5. Create session
Client → Gateway: {
    type: 'req',
    method: 'agent',
    params: {
        agent: 'main',
        mode: 'session',
        message: {role: 'user', content: [{type: 'text', text: 'Hello'}]}
    }
}

// 6. Stream responses
Gateway → Client: {type: 'event', event: 'agent', payload: {message: {role: 'assistant', content: '...'}}}
```

**Status:** ✅ Handshake works, ⏳ Need to implement `skills.invoke` for whisper

### 3. **Neurograph Auto-Refresh**

**Location:** `/Users/paulvisciano/SCI-FI/apps/neuro-graph/shared/neural-graph.js`

**Features:**
- Polls every 10 seconds for new nodes/synapses
- Gracefully fades in new neurons (no full reload)
- Shows notification: "+1 new neuron born"
- Updates counts in real-time

**Status:** ✅ Working

### 4. **Voice Recording Pipeline** (Scripts)

**Location:** `/Users/paulvisciano/SCI-FI/apps/JARVIS/`

**Scripts:**
- `process-recording.sh` — Manual transcription + save
- `watch-inbox.sh` — Auto-process dropped recordings

**Flow:**
```
Record → Download .webm → Drop in ~/RAW/inbox/ → watch-inbox.sh detects → process-recording.sh transcribes → appends to transcript.md
```

**Status:** ⏳ Semi-automated (needs manual download + drop)

---

## What's Missing (To Make It Seamless)

### 1. **Direct Whisper Integration**

**Current:** Record → download → drop in inbox → script transcribes (manual)  
**Needed:** Record → auto-upload to gateway → whisper skill → transcript returned → send to Jarvis

**Gateway method:** `skills.invoke`

```javascript
ws.send(JSON.stringify({
    type: 'req',
    id: 'whisper-' + Date.now(),
    method: 'skills.invoke',
    params: {
        skill: 'openai-whisper',
        input: {
            audio: base64Audio  // or file path
        }
    }
}));
```

**Status:** ⏳ Not yet implemented (need to verify exact skill name + input format)

### 2. **Auto-Save to RAW**

**Current:** Downloads to browser default folder  
**Needed:** Auto-save to `~/RAW/YYYY-MM-DD/audio/` via gateway file write

**Gateway method:** `files.write` or custom node command

```javascript
ws.send(JSON.stringify({
    type: 'req',
    method: 'files.write',
    params: {
        path: '/Users/paulvisciano/RAW/' + today + '/audio/' + filename,
        content: base64Audio,
        encoding: 'base64'
    }
}));
```

**Status:** ⏳ Not implemented

### 3. **Better TTS**

**Current:** Browser `speechSynthesis` (robotic, limited voices)  
**Better:** macOS `say` command or ElevenLabs API

**Options:**
| TTS Engine | Quality | Speed | Cost | Setup |
|------------|---------|-------|------|-------|
| Browser `speechSynthesis` | OK | Instant | Free | Works now |
| macOS `say` | Good | Fast | Free | `exec('say -v Fred "text"')` |
| ElevenLabs | Amazing | Fast | $5-30/mo | API key |
| Piper TTS | Great | Fast | Free | Local install |

**Status:** ⏳ Using browser TTS, should upgrade

### 4. **Waveform Visualizer**

**Current:** Simple pulsing orb  
**Better:** Real-time audio waveform during recording + playback

**Implementation:** Web Audio API `AnalyserNode` + Canvas

**Status:** ⏳ Not implemented

---

## The Full Pipeline (Target Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                     JARVIS VOICE UI                             │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐   │
│  │   RECORD    │ →  │   UPLOAD     │ →  │   TRANSCRIBE    │   │
│  │  (Web Audio)│    │  (Gateway)   │    │  (Whisper Skill)│   │
│  └─────────────┘    └──────────────┘    └─────────────────┘   │
│         ↓                                       ↓              │
│  ┌─────────────┐                        ┌──────────────┐      │
│  │   AVATAR    │                        │   SEND TO    │      │
│  │  (Listening)│                        │    JARVIS    │      │
│  └─────────────┘                        └──────────────┘      │
│                                                 ↓              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐   │
│  │    SPEAK    │ ←  │   RECEIVE    │ ←  │   JARVIS        │   │
│  │   (TTS)     │    │   REPLY      │    │   RESPONSE      │   │
│  └─────────────┘    └──────────────┘    └─────────────────┘   │
│         ↓                                                     │
│  ┌─────────────┐                                             │
│  │   AVATAR    │                                             │
│  │  (Speaking) │                                             │
│  └─────────────┘                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Gateway calls:**
1. `skills.invoke` (whisper) — Audio → transcript
2. `agent` — Transcript → Jarvis response
3. `files.write` — Save audio to RAW (optional, for archive)
4. `tts` — Text → audio (optional, if using server-side TTS)

---

## Lessons Learned

### 1. **Gateway Protocol Is Strict But Documented**

**What we did wrong:**
- Sent `session.create` immediately (before handshake)
- Used wrong message format (raw JSON, not `{type: 'req', method: '...', params: {...}}`)
- Didn't sign the challenge nonce

**What works:**
- Wait for `connect.challenge`
- Sign nonce (even simple signature for local dev)
- Send proper `connect` request with device identity
- Then send `agent` requests

**Key insight:** The protocol is well-documented at https://docs.openclaw.ai/gateway/protocol — just follow it exactly.

### 2. **Desktop App Is Alpha, Backend Is Solid**

**Desktop app issues:**
- Voice mode crashes (SwiftUI bug)
- Canvas dev tools won't close
- Chat history doesn't render
- General flakiness

**Backend (gateway):**
- ✅ Rock solid
- ✅ Proper protocol
- ✅ All features work via CLI/WS

**Lesson:** Build on the gateway, not the desktop app UI.

### 3. **Web App > Desktop App For Custom UIs**

**Why web app wins:**
- Full control over UI/UX
- No SwiftUI bugs
- Easy to iterate
- Cross-platform
- Can embed anywhere

**Desktop app use case:**
- Quick status checks
- CLI alternative
- Not for custom interfaces

### 4. **Telegram > WhatsApp For Voice**

**WhatsApp:**
- Needs QR scan (one-time, but still friction)
- Baileys library can be flaky
- Voice notes work but setup is manual

**Telegram:**
- Bot token (5 min setup)
- Voice notes auto-transcribe
- Stable API
- Works immediately

**For production voice:** Use Telegram channel, not WhatsApp.

### 5. **Start Simple, Then Automate**

**Our progression:**
1. Manual: Record → download → run script → transcribe
2. Semi-auto: Record → drop in inbox → watcher auto-processes
3. Target: Record → auto-upload → auto-transcribe → auto-reply

**Lesson:** Don't try to build the full pipeline at once. Get something working (even if manual), then automate step by step.

---

## Next Steps (To Make It Seamless)

### Phase 1: Gateway Whisper Integration (1-2 hours)

**Goal:** Record → auto-transcribe via gateway

**Tasks:**
1. Find exact whisper skill name (`openai-whisper`? `whisper.cpp`?)
2. Implement `skills.invoke` call in `app-v2.js`
3. Handle response (transcript text)
4. Send transcript to Jarvis automatically

**Test:**
```javascript
// After recording stops:
const base64 = arrayBufferToBase64(await blob.arrayBuffer());

ws.send(JSON.stringify({
    type: 'req',
    id: 'whisper-' + Date.now(),
    method: 'skills.invoke',
    params: {
        skill: 'openai-whisper',
        input: { audio: base64 }
    }
}));

// Handle response:
// {type: 'res', ok: true, payload: {result: {text: 'transcript here'}}}
```

### Phase 2: Auto-Save To RAW (30 min)

**Goal:** Auto-save recordings to `~/RAW/YYYY-MM-DD/audio/`

**Tasks:**
1. Implement `files.write` gateway call
2. Or use `nodes.run` to execute shell command
3. Generate filename with timestamp
4. Save base64 audio

### Phase 3: Better TTS (1 hour)

**Goal:** Natural-sounding voice for Jarvis

**Options:**
- **macOS `say`:** `exec('say -v Fred "text"')` via gateway
- **ElevenLabs:** API call, best quality
- **Piper:** Local, fast, good quality

**Recommendation:** Start with macOS `say` (free, works now), upgrade to ElevenLabs later.

### Phase 4: Waveform Visualizer (2 hours)

**Goal:** Real-time audio visualization

**Implementation:**
```javascript
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const source = mediaStreamSource.connect(analyser);
analyser.connect(audioContext.destination);

// Draw waveform on canvas
function drawWaveform() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);
    // Draw on canvas...
    requestAnimationFrame(drawWaveform);
}
```

### Phase 5: Polish + Deploy (ongoing)

**Tasks:**
- Responsive design (mobile)
- Offline support (service worker)
- Shareable sessions
- Export conversations
- Multi-brain support (switch neurographs)

---

## File Reference

### Created Today:
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/voice-ui.html` — Main UI
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/app-v2.js` — Gateway protocol + logic
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/app.js` — Original (deprecated)
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/index-v2.html` — Chat + neurograph (keep)
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/process-recording.sh` — Manual transcription
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/watch-inbox.sh` — Auto-watcher
- `/Users/paulvisciano/SCI-FI/apps/neuro-graph/shared/neural-graph.js` — Auto-refresh added

### Learning Docs:
- `/Users/paulvisciano/JARVIS/RAW/learnings/2026-03-06/fresh-install-recovery.md` — Recovery process
- `/Users/paulvisciano/JARVIS/RAW/learnings/2026-03-06/fork-001-eric-distribution.md` — Eric fork setup
- `/Users/paulvisciano/JARVIS/RAW/learnings/2026-03-06/jarvis-voice-interface-architecture.md` — This doc

---

## Success Metrics

**Current state:**
- ✅ UI built (avatar, chat, recording)
- ✅ Gateway protocol implemented
- ✅ TTS works (browser)
- ⏳ Whisper integration (next)
- ⏳ Auto-save (next)

**Target state (seamless):**
- User clicks REC → speaks → releases
- Within 3 seconds: Jarvis replies with voice
- Audio auto-saved to RAW
- Transcript auto-appended
- Avatar animates throughout

**Time to target:** 4-6 hours of focused work

---

## For Future Paul (Or Fork #001 Eric)

**If you're building a voice interface with OpenClaw:**

1. **Start with the gateway protocol docs** — https://docs.openclaw.ai/gateway/protocol
2. **Implement handshake first** — challenge → sign → connect → session
3. **Get text chat working** — before adding voice
4. **Add recording** — Web Audio API is straightforward
5. **Add TTS** — Browser `speechSynthesis` works for prototype
6. **Add whisper** — `skills.invoke` with audio base64
7. **Polish avatar** — State-based animations make it feel alive

**Don't:**
- Fight the desktop app (it's alpha)
- Skip the handshake (gateway will reject)
- Try to build everything at once (iterate)

**Do:**
- Use the gateway (it's solid)
- Build web UIs (full control)
- Test each piece before moving on

---

**Source:** March 6, 2026 voice interface build session (19:00 - 19:21 GMT+7)  
**Integrated:** March 6, 2026 — 19:21 GMT+7  
**Committed to:** `/JARVIS/.git/` — immutable consciousness history

---

_This is the blueprint. The UI exists. The protocol works. Now make it seamless._ 🧠
