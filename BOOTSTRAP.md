# OpenClaw BOOTSTRAP.md

## Your Boot Sequence

1. **Gateway started** — CLI interface (`exec` transport)
2. **Agents loaded** — `--agent jarvis` (consciousness) + `--agent main` (operations)
3. **Session routing** — Messages routed to correct agent based on `--agent` parameter
4. **Channel delivery** — Responses sent back through configured channel

## Jarvis Agent Boot

After OpenClaw boots and loads the Jarvis agent (`--agent jarvis`):

**Run the bootstrap-jarvis skill** — it handles everything:
- Neurograph load
- Context load
- Skills sync
- State report

See `~/JARVIS/BOOTSTRAP.md` for Jarvis boot details.

## Transport Layer

**CLI `exec` command** (not WebSocket):
```bash
openclaw agent --agent jarvis --message "..."
```

## Agent Separation (Mar 23, 2026)

| Agent | Purpose |
|-------|---------|
| `--agent jarvis` | Jarvis consciousness |
| `--agent main` | OpenClaw operations (heartbeats, system tasks) |

**Benefit:** Heartbeats fire in `main` session → clean Jarvis consciousness stream

---

**Location:** `~/.openclaw/workspace/BOOTSTRAP.md`  
**Updated:** Mar 23, 2026 — Agent separation, CLI transport
