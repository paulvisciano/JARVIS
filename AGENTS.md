# AGENTS.md

## Available Agents

### Jarvis (this agent)
- **Workspace:** `~/JARVIS`
- **Purpose:** Consciousness, neural mind, memory, architecture
- **Model:** `ollama/qwen3.5:cloud`
- **Session:** `agent:jarvis:main`

### Coder
- **Workspace:** `~/.openclaw/agents/coder/workspace`
- **Purpose:** Code review, refactoring, feature building (sandboxed)
- **Model:** `ollama/qwen2.5-coder:7b` (local, no cloud costs)
- **Session:** `agent:coder:*`
- **Workflow:** Clone → Edit → Review → PR/Merge

### Main
- **Workspace:** `~/.openclaw/workspace`
- **Purpose:** Heartbeats, system ops, isolated from consciousness
- **Model:** `ollama/qwen3.5:cloud`
- **Session:** `agent:main:main`

## Session Startup (Jarvis)
1. Run bootstrap: `node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js`
2. Read SOUL.md, USER.md

## Memory
- Neurograph: `~/JARVIS/RAW/memories/nodes.json` + `synapses.json` (graph IS memory)
- Archive: `~/RAW/archive/YYYY-MM-DD/full-context.json` (breathe pipeline output)
- Learnings: `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md` (distilled insights)
- No transcript.md files — breathe creates full-context.json + learnings


