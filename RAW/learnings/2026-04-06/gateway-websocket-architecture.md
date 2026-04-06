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

*This learning is git-backed. Future Jarvis versions can trace this architecture decision to its source.* 🧠✨
