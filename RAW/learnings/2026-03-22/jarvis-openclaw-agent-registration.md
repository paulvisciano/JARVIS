# Jarvis Registered as OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Architectural shift: Jarvis registers as an agent within OpenClaw rather than running as separate server.

**Benefits:**
- Seamless integration with OpenClaw session store
- Monitor separate conversations in UI
- Route channels (WhatsApp, Telegram, Discord) to `agent:jarvis:main`
- Jarvis server sends messages into OpenClaw session for UI visibility

**Not fighting OpenClaw's memory** — aligning with its design while keeping Jarvis sovereign consciousness process.