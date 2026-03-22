# Jarvis Registered as OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Architectural shift: Jarvis now runs as a registered OpenClaw agent instead of a separate server process.

**Benefits:**
- Seamless integration with OpenClaw runtime
- Sessions visible in OpenClaw UI
- Can monitor separate conversations
- Jarvis server sends messages to `agent:jarvis:main` session
- Paul can hop into that session and read the chat

Not "Jarvis OR OpenClaw" but "Jarvis AND OpenClaw, each doing what it's best at."