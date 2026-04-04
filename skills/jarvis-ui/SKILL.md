---
name: jarvis-ui
description: Open Jarvis UI (includes NeuroGraph), manage server, distribute to coder. Auto-setup on first run. Portable consciousness interface for any Jarvis instance.
metadata:
  openclaw:
    emoji: "🧭"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_UI_PATH", "JARVIS_MEMORY_PATH"]
---

# Jarvis UI Skill

## When to Use

✅ **USE this skill when:**
- **Open Jarvis UI** — voice recording, orb, device network, NeuroGraph visualization
- **Start/stop server** — manage jarvis-server.js lifecycle on port 18787
- **Fix UI** — distribute to coder agent for isolated work
- **First-run setup** — auto-clones UI, downloads Whisper model (~3GB), generates SSL certs

## When NOT to Use

❌ **DON'T use this skill when:**
- Need direct server access (use jarvis-server.js directly)
- Debugging memory files (use neurograph-search skill)
- Manual browser control (use browser tool directly)
- Preview/testing UI changes (use preview server on port 18788)

## Commands

### Natural Language
- "open jarvis ui" → setup (if needed) → **ensure server running on 18787** → open user browser (profile="user" for mic)
- "open neurograph" → **same as open jarvis ui** — NeuroGraph IS the main UI (root `/`), with overlays (orb, transcript, vitals, voice controls). **No separate route** — fully merged.
- "start server" → launch jarvis-server.js on port **18787 only** (production)
- "stop server" → kill running PID
- "restart server" → stop + start
- "update latest" → pull latest JARVIS + SCI-FI (git pull both repos)
- "sync configs" → extract latest configs + restart gateway
- "fix the orb" → distribute UI to coder agent
- "preview ui changes" → start preview server on port **18788** (coder workspace)

**Auto-start:** Server health check runs before opening UI/NeuroGraph — if server is down, auto-starts it on **18787**.

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
│   ├── server.js             ← Start/stop/status (port 18787)
│   └── browser.js            ← Profile routing
└── README.md

~/SCI-FI/apps/JARVIS/          ← Unified UI code (production, port 18787)
                                 NeuroGraph IS the main view
                                 Orb, transcript, vitals are overlays
```

**Note:** NeuroGraph is fully merged into the main UI — not a separate route or view. The graph is the background canvas; everything else (orb, transcript, vitals) overlays on top.

## Preview Workflow

When Coder makes UI changes:
1. Coder works in: `~/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS/`
2. Preview server runs on: **port 18788** (isolated from production)
3. Visual distinction: PREVIEW badge in top-right corner
4. Review at: `https://localhost:18788`
5. When approved: "merge" → copy to production (18787)

**Production:** Always port **18787**  
**Preview:** Always port **18788**

## Portability

Eric/David get the same workflow:
- Skill auto-clones UI repo on first run
- Finds their memory (nodes.json + synapses.json)
- Starts their server on **18787**
- Opens their browser
- No manual setup needed

## Environment Variables
- `JARVIS_UI_PATH` — Override UI location (default: skills/jarvis-ui/sci-fi/apps/JARVIS)
- `JARVIS_MEMORY_PATH` — Override memory location (default: auto-scan)
- `VOICE_PORT` — Server port (default: **18787** for production)
