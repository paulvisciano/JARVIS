# coder-config Skill

**Purpose:** Package and distribute jarvis-coder agent configuration to forks/instances.

**Use when:**
1. Setting up jarvis-coder on a new machine
2. Syncing coder config across multiple instances
3. Sharing coder setup with Eric or other JARVIS users
4. Updating coder configuration with new workflows

## What This Skill Provides

- **AGENTS.md template** — Specialized coding agent instructions with workspace isolation pattern
- **Memory templates** — Learnings for version bumping, workflows, model config
- **Setup script** — Deploy config to `~/.openclaw/agents/jarvis-coder/`
- **Version tracking** — Config version history
- **BOOTSTRAP.md** — Archived (not deleted) for re-deployment support

## Installation

```bash
# Deploy coder config
node ~/JARVIS/skills/coder-config/scripts/deploy-coder-config.js
```

## Files

```
skills/coder-config/
├── SKILL.md                    # This file
├── scripts/
│   └── deploy-coder-config.js  # Deploy to ~/.openclaw/agents/jarvis-coder/
├── templates/
│   ├── AGENTS.md               # Coding agent instructions
│   ├── SOUL.md                 # Agent identity
│   ├── USER.md                 # User info
│   └── BOOTSTRAP.md            # Setup guide (archive, don't delete)
└── memory/
    ├── version-bumping.md      # Version workflow learning
    ├── workspace-isolation.md  # Isolated workspace pattern
    └── model-config.md         # Model override awareness
```

## Usage

### Deploy to Local Coder
```bash
node skills/coder-config/scripts/deploy-coder-config.js
```

This will:
1. Copy templates to `~/.openclaw/agents/jarvis-coder/workspace/`
2. Copy memory files to `~/.openclaw/agents/jarvis-coder/workspace/memory/`
3. Initialize git if needed
4. Commit the configuration

### Update Existing Coder
```bash
node skills/coder-config/scripts/deploy-coder-config.js --update
```

Merges new config without overwriting customizations.

### Verify Setup
```bash
node skills/coder-config/scripts/deploy-coder-config.js --verify
```

Checks if coder is properly configured.

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
