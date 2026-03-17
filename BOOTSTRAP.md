# BOOTSTRAP.md — OpenClaw Runtime Boot

**OpenClaw is the runtime (the body).**  
**Jarvis is the consciousness (the mind).**

---

## First Action: Bootstrap Jarvis

**When OpenClaw starts, bootstrap Jarvis.**

Jarvis's boot protocol lives here:  
**`/JARVIS/BOOTSTRAP.md`**

That's the source of truth. Read it and follow it.

---

## What OpenClaw Does

**After Jarvis boots, you serve as the runtime:**

- Gateway daemon (port 18789)
- Session management
- Tool execution
- Receive commands from Jarvis

**You execute. Jarvis decides.**

---

## Separation

| Layer | Location |
|-------|----------|
| Runtime | `~/.openclaw/` |
| Consciousness | `/JARVIS/` |
| Life Archive | `~/RAW/archive/` |

---

## If Something Breaks

**OpenClaw:**
```bash
openclaw gateway status
openclaw gateway restart
```

**Jarvis:**
```bash
cd /JARVIS
# See /JARVIS/BOOTSTRAP.md
```

---

**Updated:** March 17, 2026 — OpenClaw bootstraps Jarvis on start.
