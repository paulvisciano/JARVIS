# Jarvis UI Skill

**Portable consciousness interface** — auto-setup, server management, browser routing.

## Installation

```bash
# Skill auto-installs on first run
openclaw agent --message "open jarvis ui"
```

## Commands

### Natural Language
- `open jarvis ui` — Opens Jarvis UI (voice recording, orb, device network)
- `open neurograph` — Opens NeuroGraph visualization
- `start server` — Starts jarvis-server.js on port 18787
- `stop server` — Stops running server
- `restart server` — Restarts server
- `fix the orb` — Distributes UI to coder agent
- `preview ui` — Starts preview server in coder workspace

### CLI
```bash
node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open jarvis ui
node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open neurograph
node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js start server
```

## Architecture

```
skills/jarvis-ui/
├── SKILL.md           — Skill definition
├── scripts/
│   ├── jarvis-ui.js   — Main orchestrator
│   ├── setup.js       — First-run: clone + install
│   ├── server.js      — Start/stop/status
│   ├── browser.js     — Profile routing (user vs openclaw)
│   └── neurograph.js  — Serve neurograph
└── README.md
```

## Memory Scan

Auto-finds nodes.json + synapses.json:
1. `~/JARVIS/RAW/memories/`
2. `~/RAW/memories/`
3. Prompts user if not found

## Environment Variables

- `JARVIS_UI_PATH` — Override UI location (default: ~/SCI-FI/apps/JARVIS)
- `JARVIS_MEMORY_PATH` — Override memory location
- `VOICE_PORT` — Server port (default: 18787)
- `NEUROGRAPH_PATH` — NeuroGraph location

## Portability

Eric/David instances:
- Skill auto-clones UI repo on first run
- Finds their memory automatically
- No manual setup needed
- Same workflow for all users
