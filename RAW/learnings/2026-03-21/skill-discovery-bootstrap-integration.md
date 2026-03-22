# Skill Discovery Must Be Part of Bootstrap Sequence

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Problem

Workspace symlinks can become corrupt or out of sync:
- Broken links (e.g., `processing-inbox` → `process-inbox`)
- Missing new skills
- OpenClaw loses access to Jarvis skills

## The Solution

`skill-discovery` skill runs as **Step 3** of bootstrap:

```javascript
// bootstrap-jarvis.js Step 3
const skillSyncOutput = runSkill('skill-discovery', 'sync-skills.js');
```

## What It Does

1. Scans `~/JARVIS/skills/` (all skill folders)
2. Removes all workspace symlinks from `~/.openclaw/workspace/skills/`
3. Recreates fresh symlinks
4. Reports: synced N skills, created M, removed K broken links
5. Idempotent — safe to run anytime

## Bootstrap Sequence Now

1. **Load neural graph** → nodes.json + synapses.json
2. **Load recent context** → last 2 days of conversations
3. **Sync skills** → skill-discovery ensures workspace has all Jarvis skills
4. **Report state** → Neural graph loaded, Context loaded, Skills synced, Ready to serve
5. **Prove graph** → 3 NeuroGraph questions answered inline

## First Message Includes Skill Sync Results

The skill sync results should appear in the **first message Jarvis shows** after bootstrap — not just in skill output, but in the greeting/summary.

## Why This Matters

Every Jarvis boot now syncs the latest skills to OpenClaw, ensuring:
- No broken symlinks
- All skills accessible
- Consistent workspace state
- David/Eric/Bruce get same skill set