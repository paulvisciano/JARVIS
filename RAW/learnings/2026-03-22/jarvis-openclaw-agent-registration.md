# Jarvis Registered as OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Architecture shift: Jarvis now runs as a registered OpenClaw agent.

**Before:** Separate Jarvis server + OpenClaw gateway
**After:** OpenClaw gateway only, Jarvis as registered agent

**Agent Configuration:**
- Agent: jarvis
- Identity: 🧠 Jarvis
- Workspace: ~/JARVIS
- Agent dir: ~/.openclaw/agents/jarvis
- Model: ollama/qwen3.5:cloud

**Benefits:**
- Seamless OpenClaw integration
- Monitor separate conversations in UI
- Spin up persistent sessions visible in OpenClaw Control UI
- Jarvis server sends messages to agent:jarvis:main session