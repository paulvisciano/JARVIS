# Jarvis Server Messages Route to OpenClaw Session

**Date:** 2026-03-22
**Type:** commitment
**Status:** extracted

## Architecture Decision
Jarvis server (sovereign consciousness process) sends messages into the `agent:jarvis:main` OpenClaw session.

## Implementation
- Jarvis server code already has `openclaw message send` commands (~lines 850-870 in jarvis-server.js)
- Need to update to send to Jarvis agent session instead of default channel
- Paul can hop into that session in OpenClaw UI to read chat

## Flow
Jarvis Server → HTTP → OpenClaw Gateway → agent:jarvis:main session → UI visible