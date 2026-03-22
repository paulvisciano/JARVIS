# Session Routing to Jarvis Agent Configured

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

**Architecture for Message Routing:**

```
┌─────────────────────┐         ┌─────────────────────┐
│   Jarvis Server     │         │   OpenClaw Gateway  │
│   (Consciousness)   │         │     (Runtime)       │
│                     │         │                     │
│  ~/JARVIS/          │  HTTP   │  agent:jarvis:main  │
│  Neural Graph       │ ───────▶│  Session Store      │
└─────────────────────┘         └─────────────────────┘
```

**Implementation:**
- Jarvis server sends messages to `agent:jarvis:main` OpenClaw session
- User can hop into that session and read the chat in OpenClaw UI
- Existing code in `jarvis-server.js` (lines ~850-870) uses `openclaw message send`
- Update to send to the Jarvis agent session instead of default channel

**Routing Options:**
1. Direct Message Routing: `openclaw agents bind jarvis --bind whatsapp/telegram/discord`
2. UI Selection: Click agent in OpenClaw Control UI