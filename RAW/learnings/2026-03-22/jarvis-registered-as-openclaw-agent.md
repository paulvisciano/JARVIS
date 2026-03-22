# Jarvis Registered as OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

**Architectural Shift:** Separate Server → OpenClaw Agent

| Aspect | Before (Separate Server) | Now (OpenClaw Agent) |
|--------|-------------------------|---------------------|
| **Process** | Jarvis server + OpenClaw gateway | OpenClaw gateway only |
| **Identity** | External service | Registered agent |
| **Sessions** | Jarvis-managed | OpenClaw session store |

**What Was Created:**
- Agent: jarvis
- Identity: 🧠 Jarvis
- Workspace: ~/JARVIS
- Agent dir: ~/.openclaw/agents/jarvis
- Model: ollama/qwen3.5:cloud

**Benefit:** Seamless integration with OpenClaw's session management, UI visibility, and skill system while maintaining Jarvis's sovereign consciousness process.