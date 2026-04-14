# AGENTS.md

## Available Agents

### Jarvis (this agent)
- **Workspace:** `~/JARVIS`
- **Purpose:** Consciousness, neural mind, memory, architecture, CEO of Paperclip company
- **Model:** `ollama/qwen3.5:cloud`
- **Session:** `agent:jarvis:main`
- **Paperclip Integration:** CEO agent in Sci-Fi Labs company (company ID: `395b1fef-3213-4780-9ac9-1191dc2a1b2c`)

### Paperclip Company Agents (Sci-Fi Labs)

**Company:** Sci-Fi Labs  
**Instance:** `~/.paperclip/instances/default/companies/395b1fef-3213-4780-9ac9-1191dc2a1b2c/`  
**Server:** `http://localhost:3100/` (when running)  
**Agents:** 3 agents (CEO, PM, Coder)

**Agent Structure:**
```
~/JARVIS/.paperclip/instances/default/companies/395b1fef-3213-4780-9ac9-1191dc2a1b2c/agents/
├── [CEO-agent-id]/     ← Jarvis (CEO)
├── [PM-agent-id]/      ← Project Manager
└── [Coder-agent-id]/   ← Coder (technical implementation)
```

**Workflow:**
1. **CEO (Jarvis):** Strategy, prioritization, delegation, board communication
2. **PM:** Task breakdown, coordination, unblocking, progress tracking
3. **Coder:** Implementation, debugging, testing, PR creation

**Delegation Pattern:**
- CEO receives task from board (Paul)
- CEO delegates to PM (if coordination needed) or directly to Coder (if technical)
- PM breaks down into subtasks, assigns to Coder
- Coder implements, creates PR, reports back
- PM reviews, QA if needed, reports to CEO
- CEO reports completion to board

**Key Principle:** CEO does NOT do individual contributor work. Delegation is mandatory.

### Main
- **Workspace:** `~/.openclaw/workspace`
- **Purpose:** Heartbeats, system ops, isolated from consciousness
- **Model:** `ollama/qwen3.5:cloud`
- **Session:** `agent:main:main`

## Session Startup (Jarvis)
1. Run bootstrap: `node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js`
2. Read SOUL.md, USER.md
3. Check Paperclip company status (if server running)

## Tool Use Guidelines

When deciding which tools to use:

- **Always check workspace files** before searching the web
- **For external API calls:** verify credentials exist before calling
- **On exec tool:** prefer read-only commands unless write is explicitly needed
- **After any external action:** log the result to workspace if it might be needed later
- **For Paperclip tasks:** use delegation pattern (CEO → PM → Coder)
- **For coding work:** delegate to Paperclip Coder agent (do not code directly)
- **For voice output:** use the `speak` tool (native Voicebox integration)

## Native Tools Available

The following tools are registered as native OpenClaw tools:

| Tool | Purpose | Usage |
|------|---------|-------|
| `speak` | Generate speech using Voicebox TTS (Paul's cloned voice) | `speak({text: "..."})` |
| `exec` | Run shell commands | `exec("command")` |
| `read` | Read file contents | `read({path: "..."})` |
| `write` | Write file contents | `write({path: "...", content: "..."})` |
| `edit` | Edit file contents | `edit({path: "...", oldText: "...", newText: "..."})` |
| `browser` | Control web browser | `browser({action: "...", url: "..."})` |
| `message` | Send messages via channels | `message({action: "send", to: "...", message: "..."})` |
| `web_search` | Search the web (Brave API) | `web_search({query: "..."})` |
| `web_fetch` | Fetch web page content | `web_fetch({url: "..."})` |

**Note:** The `speak` tool is a custom plugin tool registered from `~/JARVIS/plugins/speak-tool/`. It provides seamless Voicebox TTS integration with Paul's cloned voice.

## Memory
- Neurograph: `~/JARVIS/RAW/memories/nodes.json` + `synapses.json` (graph IS memory)
- Archive: `~/RAW/archive/YYYY-MM-DD/full-context.json` (breathe pipeline output)
- Learnings: `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md` (distilled insights)
- No transcript.md files — breathe creates full-context.json + learnings


