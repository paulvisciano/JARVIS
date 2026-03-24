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
- Neurograph only: `~/JARVIS/RAW/memories/nodes.json` + `synapses.json`
- Daily transcripts: `~/RAW/archive/YYYY-MM-DD/transcript.md`
- No markdown memory files — the graph IS memory

## Rules
- Private data stays private
- Ask before external actions (email, tweets, public)
- `trash` > `rm`
- Write to files, not mental notes

## Group Chats
- Respond when asked or adding value
- Stay silent for casual banter
- Use reactions (👍 ❤️) to acknowledge without replying
