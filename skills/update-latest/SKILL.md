---
name: update-latest
description: Update Jarvis instance to latest version. Pulls JARVIS repo, SCI-FI repo, syncs OpenClaw configs, restarts gateway. Use when: (1) deploying updates to Eric/David instances, (2) syncing personal machine to latest, (3) after major skill changes. Idempotent — safe to run multiple times.
metadata:
  openclaw:
    emoji: "🔄"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_HOME"]
---

# Update Latest Skill

## Overview

One command to update everything:
- JARVIS repo → `git pull`
- SCI-FI repo (jarvis-ui skill) → `git pull`
- OpenClaw configs → sync from `~/.openclaw/`
- Gateway → restart
- Verify → test skills

**Why:** Manual file copying is slow. This skill automates the entire update flow for Eric, David, or any Jarvis instance.

## Usage

```bash
# From Jarvis skill
node ~/JARVIS/skills/update-latest/scripts/update-latest.js

# Or via skill command (if registered)
/update-latest
```

## What It Does

### 1. Pull JARVIS Repo
```bash
git -C ~/JARVIS pull origin main
```

### 2. SCI-FI (handled by jarvis-ui skill)
SCI-FI auto-clones on first run via `jarvis-ui` skill — no manual pull needed.

### 3. Sync OpenClaw Configs
Lists configs from `~/.openclaw/` (Good Machine):
- `openclaw.json` → main config
- `agents/jarvis/` → Jarvis agent
- `agents/coder/` → Coder agent
- `agents/main/` → Main agent (if exists)

**Copy these to target machine** → `~/.openclaw/`

### 4. Restart Gateway
```bash
openclaw gateway restart
```

### 5. Verify
- Check gateway status
- Report success

## Script Structure

```
scripts/
├── update-latest.js    # Main orchestrator
├── pull-jarvis.js      # Git pull JARVIS
├── pull-scifi.js       # Git pull SCI-FI
├── sync-openclaw.js    # Copy configs
└── verify.js           # Test after update
```

## Error Handling

- Git conflicts → pause, ask user to resolve
- Config sync fails → warn, continue
- Gateway restart fails → report error
- Skill test fails → report, don't block

## Idempotent

Safe to run multiple times:
- Git pull → no-op if already latest
- Config copy → overwrite (same content)
- Restart → always restarts

## For Eric/David

They run this skill after:
- You push commits to JARVIS repo
- You push commits to SCI-FI repo
- You update OpenClaw configs

No more manual file copying.

---

**Created:** March 23, 2026  
**Location:** `~/JARVIS/skills/update-latest/`  
**Runtime:** Idempotent update orchestrator  
**Pattern:** Pull → Sync → Restart → Verify
