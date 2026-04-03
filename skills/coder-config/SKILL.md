---
name: coder-config
description: Package and distribute jarvis-coder agent configuration to forks and instances
metadata:
  openclaw:
    emoji: "⚙️"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_HOME"]
---

# Coder Config (Agent Configuration Distributor)

## When to Use

✅ **USE this skill when:**
- Setting up jarvis-coder on a new machine
- Syncing coder config across multiple instances
- Sharing coder setup with other JARVIS users
- Updating coder configuration with new workflows

## What This Skill Provides

- **Agent registration script** — Adds jarvis-coder to `openclaw.json` with portable paths
- **Identity templates** — SOUL.md, USER.md, IDENTITY.md, BOOTSTRAP.md
- **Deploy script** — Copies identity files to agent workspace
- **Version tracking** — Config version history

## Quick Setup (One Command)

```bash
# Fetch latest + register coder + deploy config + restart
node ~/JARVIS/skills/coder-config/scripts/setup-coder-for-eric.js
```

## Manual Setup

```bash
# 1. Register agent in openclaw.json
node skills/coder-config/scripts/register-coder-agent.js

# 2. Deploy identity files to workspace
node skills/coder-config/scripts/deploy-coder-config.js

# 3. Restart OpenClaw
openclaw gateway restart

# 4. Verify
node skills/coder-config/scripts/register-coder-agent.js --verify
```

## Files

```
skills/coder-config/
├── SKILL.md
├── scripts/
│   ├── register-coder-agent.js
│   └── deploy-coder-config.js
├── templates/
│   ├── AGENTS.md, SOUL.md, USER.md, IDENTITY.md, BOOTSTRAP.md
└── memory/
    ├── version-bumping.md
    ├── workspace-isolation.md
    └── model-config.md
```

## Notes

- **Portable paths** — Uses `$HOME`, `$JARVIS_HOME`, not hardcoded paths
- **Idempotent** — Safe to run multiple times
- **Privacy-safe** — No personal paths exposed

---

**Created:** March 25, 2026 — Agent configuration distribution for jarvis-coder
