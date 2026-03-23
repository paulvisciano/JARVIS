# Skill As Distribution Mechanism

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Breakthrough

The skill IS the installer. The UI code is sovereign.

```
User says: "open jarvis ui"
Skill checks: UI exists?
↓ NO → Clone repo, npm install, configure
↓ YES → Start server, check port
Open browser (profile="user" for mic access)
Done — talking to Jarvis
```

## No Manual Setup

- No "where do I clone this?"
- No "how do I configure the path?"
- No "which port is it running on?"

## Skill Structure

```
~/JARVIS/skills/jarvis-ui/
├── SKILL.md           — Skill definition
├── README.md          — Documentation
└── scripts/
    ├── jarvis-ui.js   — Orchestrator
    ├── setup.js       — Clone + install
    ├── server.js      — Start/stop/status
    ├── browser.js     — Profile routing (user vs openclaw)
    └── neurograph.js  — Serve graph
```

## Same For NeuroGraph

User says: "open neurograph"
Skill scans default folders (`~/JARVIS/RAW/memories/`, `~/RAW/memories/`)
If not found → ask: "Where is your nodes.json?"

## Impact

Portable. One command sets up everything. Eric can pull latest and run the skill — no manual file copying.