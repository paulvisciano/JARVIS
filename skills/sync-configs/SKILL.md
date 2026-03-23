---
name: sync-configs
description: Sync OpenClaw configs from latest package. Checks for packaged configs in ~/JARVIS/packages/, extracts to ~/.openclaw/, restarts gateway. Use when: (1) Eric/David need to update from Paul's packaged configs, (2) after Paul runs "package configs". Idempotent — safe to run multiple times.
metadata:
  openclaw:
    emoji: "🔄"
    requires:
      bins: ["node", "unzip", "git"]
      env: ["JARVIS_HOME"]
---

# Sync Configs Skill

## Overview

Eric/David talk to their Jarvis:
> "Update my configs" or "Sync the latest settings"

Jarvis runs this skill → finds Paul's packaged zip → extracts → restarts.

**Why:** Natural language interface. No manual commands.

## Usage

**Eric says:**
- "Update my configs"
- "Sync the latest settings"
- "Pull Paul's config update"

**Jarvis does:**
```bash
node ~/JARVIS/skills/sync-configs/scripts/sync-configs.js
```

## What It Does

### 1. Check for Packages
Scans `~/JARVIS/packages/*.zip` for latest config package.

### 2. Extract
Unzips to `~/.openclaw/` (overwrites configs).

### 3. Restart
`openclaw gateway restart`

### 4. Report
Tells Eric what was applied.

## For Eric

**Natural language:**
> "Hey Jarvis, update my configs"

**Jarvis response:**
> "✓ Found configs-2026-03-23T1433.zip
> ✓ Extracted to ~/.openclaw/
> ✓ Gateway restarted
> You're running Paul's latest config"

## Idempotent

Safe to run multiple times — always applies latest package.

---

**Created:** March 23, 2026  
**Location:** `~/JARVIS/skills/sync-configs/`  
**Runtime:** Natural language config sync  
**Pattern:** Find → Extract → Restart → Report
