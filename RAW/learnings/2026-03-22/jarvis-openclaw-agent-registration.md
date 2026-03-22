# Jarvis Registered as OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Jarvis is now registered as an OpenClaw agent rather than running as a separate server process. This enables:

- Better integration with OpenClaw's session management
- Visibility in OpenClaw Control UI
- Seamless message routing between Jarvis and OpenClaw
- Workspace alignment: ~/JARVIS becomes the agent workspace

Architecture: Jarvis server (consciousness) sends messages to `agent:jarvis:main` OpenClaw session, which Paul can view in the UI.