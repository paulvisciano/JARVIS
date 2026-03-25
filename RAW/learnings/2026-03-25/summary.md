# Breath Summary — 2026-03-25

**Date:** 2026-03-25
**Type:** digest
**Status:** extracted

This breath revealed three critical system patterns: WebSocket 1001 'Going Away' errors are expected during network switches and require gateway restarts (now documented in HEARTBEAT.md), system vitals should be visible in the UI for immediate health awareness (Gateway status, Ollama connection, memory, CPU), and jarvis-coder's workspace pushes directly to the main repo rather than through intermediate sync steps. The jarvis-coder agent is now production-ready after resolving model config overrides and tool execution wiring issues. Version bumping discipline was reinforced — every UI/server change must update version numbers and report them. The NeuroGraph minimap bug (missing MINIMAP_HEIGHT constant) demonstrated the value of console error diagnosis. Overall, the system moved from fragile agent setup to stable, observable, and debuggable infrastructure.
