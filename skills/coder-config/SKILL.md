# coder-config Skill

**Purpose:** Package and distribute jarvis-coder agent configuration to forks/instances.

**Use when:**
1. Setting up jarvis-coder on a new machine
2. Syncing coder config across multiple instances
3. Sharing coder setup with Eric or other JARVIS users
4. Updating coder configuration with new workflows

## What This Skill Provides

- **AGENTS.md template** — Specialized coding agent instructions
- **Memory templates** — Learnings for version bumping, workflows
- **Setup script** — Deploy config to `~/.openclaw/agents/jarvis-coder/`
- **Version tracking** — Config version history

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
│   └── USER.md                 # User info
└── memory/
    └── jarvis-ui-version-bumping.md  # Version workflow learning
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

## Version History

- **v1.0.0** (2026-03-25) — Initial release with specialized coding agent instructions
  - Version bumping workflow
  - Clear reporting format
  - Coding standards

## Related

- Main JARVIS repo: `~/JARVIS/`
- Coder workspace: `~/.openclaw/agents/jarvis-coder/workspace/`
- Learning: `~/JARVIS/RAW/learnings/2026-03-24/jarvis-ui-version-bumping.md`

---

**Updated:** March 25, 2026 — Portable coder configuration
