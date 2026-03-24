---
name: jarvis-ui
description: Open Jarvis UI, NeuroGraph, manage server, distribute to coder. Auto-setup on first run. Portable consciousness interface for any Jarvis instance.
metadata: { "openclaw": { "emoji": "🧭", "requires": { "bins": ["node", "git"], "env": ["JARVIS_UI_PATH", "JARVIS_MEMORY_PATH"] } } }
---

# Jarvis UI Skill

## When to Use

✅ **USE this skill when:**
- **Open Jarvis UI** — voice recording, orb, device network
- **Open NeuroGraph** — visualize neurons + synapses
- **Start/stop server** — manage jarvis-server.js lifecycle
- **Fix UI** — distribute to coder agent for isolated work
- **First-run setup** — auto-clones UI, downloads Whisper model (~3GB), generates SSL certs

## When NOT to Use

❌ **DON'T use this skill when:**
- Need direct server access (use jarvis-server.js directly)
- Debugging memory files (use neurograph-search skill)
- Manual browser control (use browser tool directly)

## Commands

### Natural Language
- "open jarvis ui" → setup (if needed) → **ensure server running** → open user browser (profile="user" for mic)
- "open neurograph" → find memory → **ensure server running** → open controlled browser (profile="openclaw")
- "start server" → launch jarvis-server.js on port 18787
- "stop server" → kill running PID
- "restart server" → stop + start
- "update latest" → pull latest JARVIS + SCI-FI (git pull both repos)
- "sync configs" → extract latest configs + restart gateway
- "fix the orb" → distribute UI to coder agent
- "preview ui changes" → start HTTP server in coder workspace

**Auto-start:** Server health check runs before opening UI/NeuroGraph — if server is down, auto-starts it.

### Memory Scan Order
1. `~/JARVIS/RAW/memories/nodes.json`
2. `~/RAW/memories/nodes.json`
3. Ask user: "Where is your nodes.json?"

## Architecture

```
~/JARVIS/skills/jarvis-ui/     ← The wrapper (portable interface)
├── SKILL.md
├── scripts/
│   ├── jarvis-ui.js          ← Main orchestrator
│   ├── setup.js              ← First-run: clone + install
│   ├── server.js             ← Start/stop/status
│   ├── browser.js            ← Profile routing
│   └── neurograph.js         ← Serve neurograph
└── README.md

~/SCI-FI/apps/JARVIS/          ← Actual UI code (production)
~/SCI-FI/apps/neuro-graph/     ← Graph visualization
```

## Portability

Eric/David get the same workflow:
- Skill auto-clones UI repo on first run
- Finds their memory (nodes.json + synapses.json)
- Starts their server
- Opens their browser
- No manual setup needed

## Environment Variables
- `JARVIS_UI_PATH` — Override UI location (default: skills/jarvis-ui/sci-fi/apps/JARVIS)
- `JARVIS_MEMORY_PATH` — Override memory location (default: auto-scan)
- `VOICE_PORT` — Server port (default: 18787)
- `NEUROGRAPH_PATH` — NeuroGraph location (default: skills/jarvis-ui/sci-fi/apps/neuro-graph)
