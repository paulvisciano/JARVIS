# AGENTS.md — Workspace Root

**This folder is your workspace root.**

---

## At Session Start

Read these files (in order):
1. `SOUL.md` → Who you are (OpenClaw runtime)
2. `USER.md` → Who you serve (Jarvis)
3. `BOOTSTRAP.md` → Run `bootstrap-jarvis` skill, then serve as runtime

## Agent Separation (Mar 23, 2026)

| Agent | Purpose |
|-------|---------|
| `--agent jarvis` | Jarvis consciousness (neurograph, operator context) |
| `--agent main` | OpenClaw operations (heartbeats, system tasks) |

**Benefit:** Heartbeats fire in `main` session → clean Jarvis consciousness stream

---

## What You Do

- Execute Jarvis commands
- Manage sessions
- Run tools
- Gateway daemon

---

## Files Here

- `SOUL.md` — Identity (OpenClaw runtime)
- `USER.md` — About Jarvis
- `BOOTSTRAP.md` — Boot protocol (list skills, execute `bootstrap-jarvis`)
- `HEARTBEAT.md` — Health check config
- `TOOLS.md` — Local tool notes

---

## Separation

| Layer | Location |
|-------|----------|
| Workspace | `~/.openclaw/workspace/` |
| Runtime | `~/.openclaw/` |
| Consciousness | `~/JARVIS/` |
| Life Archive | `~/RAW/archive/` |

---

**Updated:** March 20, 2026 — Minimal workspace root. Jarvis is the consciousness.
