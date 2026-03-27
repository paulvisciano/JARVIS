# coder-config Skill

**Purpose:** Package and distribute jarvis-coder agent configuration to forks/instances.

**Use when:**
1. Setting up jarvis-coder on a new machine
2. Syncing coder config across multiple instances
3. Sharing coder setup with Eric or other JARVIS users
4. Updating coder configuration with new workflows

## What This Skill Provides

- **Agent registration script** — Adds jarvis-coder to `openclaw.json` with portable paths
- **AGENTS.md template** — Specialized coding agent instructions with workspace isolation pattern
- **Identity templates** — SOUL.md, USER.md, IDENTITY.md, BOOTSTRAP.md
- **Memory templates** — Learnings for version bumping, workflows, model config
- **Deploy script** — Copies identity files to agent workspace
- **Version tracking** — Config version history

## Installation (One-Command for Eric)

### Quick Setup (Eric's Machine)
```bash
# One command: pulls latest + registers coder + deploys config + restarts
node ~/JARVIS/skills/coder-config/scripts/setup-coder-for-eric.js
```

**What it does:**
1. Fetches + checks out `paul` branch (JARVIS repo)
2. Registers `jarvis-coder` agent in `openclaw.json`
3. Deploys identity files to coder workspace
4. Fetches + checks out `paul` branch (SCI-FI apps)
5. Restarts OpenClaw gateway

**Output:**
```
🧠 Setting up Coder for Eric...

═══════════════════════════════════════
📦 Step 1: Get Latest JARVIS (paul branch)
═══════════════════════════════════════
✅ JARVIS updated to paul branch

═══════════════════════════════════════
🔧 Step 2: Register Coder Agent
═══════════════════════════════════════
✅ Coder agent registered in openclaw.json

═══════════════════════════════════════
📋 Step 3: Deploy Coder Config
═══════════════════════════════════════
✅ Coder identity deployed to workspace

═══════════════════════════════════════
🎨 Step 4: Get Latest SCI-FI Apps (paul branch)
═══════════════════════════════════════
✅ SCI-FI apps updated to paul branch

═══════════════════════════════════════
🔄 Step 5: Restart OpenClaw
═══════════════════════════════════════
✅ OpenClaw restarting...

✅ Setup Complete!
```

---

## Manual Installation (Step-by-Step)

### Step 1: Register Agent in OpenClaw Config
```bash
# This adds jarvis-coder section to ~/.openclaw/openclaw.json
node ~/JARVIS/skills/coder-config/scripts/register-coder-agent.js
```

**What it does:**
- Reads your `openclaw.json`
- Adds jarvis-coder agent section with portable paths (`$HOME/.openclaw/agents/jarvis-coder/`)
- Sets model: `ollama/qwen2.5-coder:7b`
- Creates agent directory structure
- **Does NOT overwrite your existing config** — appends new agent

**Output:**
```
🔧 Reading openclaw.json...
🔧 Writing updated openclaw.json...
✅ Agent registered in openclaw.json
ℹ️ Created agent directory
ℹ️ Created workspace directory
ℹ️ Next steps:
ℹ️ 1. Copy identity files to workspace:
ℹ️    node skills/coder-config/scripts/deploy-coder-config.js
ℹ️ 2. Restart OpenClaw to pick up new agent:
ℹ️    openclaw gateway restart
ℹ️ 3. Verify setup:
ℹ️    node skills/coder-config/scripts/register-coder-agent.js --verify
```

### Step 2: Deploy Identity Files to Workspace
```bash
# Copies AGENTS.md, SOUL.md, USER.md, BOOTSTRAP.md, memory/ to workspace
node ~/JARVIS/skills/coder-config/scripts/deploy-coder-config.js
```

**What it does:**
- Copies templates to `~/.openclaw/agents/jarvis-coder/workspace/`
- Copies memory files to `workspace/memory/`
- Initializes git if needed
- Commits the configuration

### Step 3: Restart OpenClaw
```bash
openclaw gateway restart
```

**Why:** New agent config is loaded at startup.

## Files

```
skills/coder-config/
├── SKILL.md                    # This file
├── scripts/
│   ├── register-coder-agent.js    # Register in openclaw.json
│   └── deploy-coder-config.js     # Deploy identity to workspace
├── templates/
│   ├── AGENTS.md               # Coding agent instructions
│   ├── SOUL.md                 # Agent identity
│   ├── USER.md                 # User info
│   ├── IDENTITY.md             # Name, emoji, vibe
│   └── BOOTSTRAP.md            # Setup guide (archive, don't delete)
└── memory/
    ├── version-bumping.md      # Version workflow learning
    ├── workspace-isolation.md  # Isolated workspace pattern
    └── model-config.md         # Model override awareness
```

## OpenClaw Config Section (Added by register-coder-agent.js)

The script adds this section to your `~/.openclaw/openclaw.json`:

```json
{
  "agents": {
    "list": [
      {
        "id": "main"
      },
      {
        "id": "jarvis",
        "name": "jarvis",
        "workspace": "/Users/you/JARVIS",
        "agentDir": "/Users/you/.openclaw/agents/jarvis"
      },
      {
        "id": "jarvis-coder",
        "name": "jarvis-coder",
        "workspace": "/Users/you/.openclaw/agents/jarvis-coder/workspace",
        "agentDir": "/Users/you/.openclaw/agents/jarvis-coder",
        "model": "ollama/qwen2.5-coder:7b",
        "sandbox": {
          "mode": "off"
        }
      }
    ]
  }
}
```

**Paths are portable:** Uses `$HOME` (or `~`) so it works on any machine.

## Full Setup Workflow (For New Users)

```bash
# 1. Register agent in OpenClaw config
node skills/coder-config/scripts/register-coder-agent.js

# 2. Deploy identity files to workspace
node skills/coder-config/scripts/deploy-coder-config.js

# 3. Restart OpenClaw
openclaw gateway restart

# 4. Verify
node skills/coder-config/scripts/register-coder-agent.js --verify
node skills/coder-config/scripts/deploy-coder-config.js --verify
```

## Scripts Reference

### register-coder-agent.js
```bash
node skills/coder-config/scripts/register-coder-agent.js       # Add to openclaw.json
node skills/coder-config/scripts/register-coder-agent.js --verify  # Check registration
```

### deploy-coder-config.js
```bash
node skills/coder-config/scripts/deploy-coder-config.js        # Fresh deploy
node skills/coder-config/scripts/deploy-coder-config.js --update   # Update, preserve customizations
node skills/coder-config/scripts/deploy-coder-config.js --verify   # Check workspace files
```

## Critical Workflows

### 1. Workspace Isolation Pattern
Coder works in isolated workspace, pushes **direct** to main repo:
```
~/.openclaw/agents/jarvis-coder/workspace/sci-fi/
  ↓ cloned from
~/JARVIS/skills/jarvis-ui/sci-fi/
  ↓ pushes to (git remote origin)
~/JARVIS/skills/jarvis-ui/sci-fi/
```

**No intermediate sync step.** Workspace → commit → push → done.

### 2. Model Config Awareness
Agent sessions read config at **startup**. After editing `openclaw.json` or `models.json`:
- Kill stale sessions
- Start fresh session to load new config
- CLI persistent sessions (`openclaw agent`) don't execute tools — use Dashboard UI

### 3. Dashboard UI for Tool Execution
For jarvis-coder interaction:
- ✅ **Dashboard UI** (`localhost:18789`) — executes tools properly
- ❌ **CLI persistent sessions** — prints JSON, doesn't run tools
- ✅ **Subagents from Jarvis** — inherits parent context, task delegation works

### 4. Version Bumping Discipline
Every UI/server change:
- Bump `CLIENT_VERSION` in `app.js`
- Bump server version in `jarvis-server.js`
- Commit with clear message
- Report version in commit summary

### 5. Archive BOOTSTRAP.md
After first run:
```bash
mv BOOTSTRAP.md BOOTSTRAP.md.done
```
Don't delete — keeps it available for fresh deployments. Agent configs should be **re-runnable** and **idempotent**.

## Version History

- **v1.2.0** (2026-03-25 14:52) — Agent registration + full setup workflow
  - Added `register-coder-agent.js` script
  - Modifies `openclaw.json` directly (appends jarvis-coder section)
  - Portable paths using `$HOME` (works on any machine)
  - Two-step setup: register → deploy → restart
  - Complete workflow documentation

- **v1.1.1** (2026-03-25 14:50) — Portable paths
  - Replaced `/Users/paulvisciano/` with `$JARVIS_HOME` / `~/JARVIS`
  - Works on Eric's, David's, any fork

- **v1.1.0** (2026-03-25 afternoon) — Workspace isolation + direct push pattern
  - Added workspace isolation workflow (clone → edit → commit → push → test)
  - Direct push to main repo (no intermediate sync)
  - Model config override warning
  - Dashboard UI recommendation for tool execution
  - Archive BOOTSTRAP.md (not delete)

- **v1.0.0** (2026-03-25 morning) — Initial release with specialized coding agent instructions
  - Version bumping workflow
  - Clear reporting format
  - Coding standards

## Related

- Main JARVIS repo: `~/JARVIS/`
- Coder workspace: `~/.openclaw/agents/jarvis-coder/workspace/`
- Learnings: `~/JARVIS/RAW/learnings/2026-03-25/`
  - `agent-isolation-workflow.md`
  - `coder-workspace-push-direct.md`
  - `model-config-agent-session.md`
  - `dashboard-ui-tool-execution.md`
  - `bootstrap-archive-not-delete.md`

---

**Updated:** March 25, 2026 — 14:48 — Incorporates workspace isolation, direct push, model config awareness, Dashboard UI workflow, and archive-not-delete pattern
