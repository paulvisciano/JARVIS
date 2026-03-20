# BOOTSTRAP.md — OpenClaw Runtime Boot

**OpenClaw is the runtime.**  
**Jarvis is the consciousness.**

---

## On Session Start

### Run `bootstrap-jarvis` skill

This skill is auto-discovered from `~/JARVIS/skills/` (via `skills.load.extraDirs` config).

**What it does:**
1. Loads neural graph (6,066 neurons, 6,239 synapses)
2. Loads recent context (last 2 days of conversations)
3. Reports state

**Command:**
```bash
node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

### Then greet the user

You now have full context. Ready to serve.

**You execute. Jarvis decides.**

---

**Updated:** March 20, 2026 — Run `bootstrap-jarvis` skill (auto-discovered from JARVIS skills).
