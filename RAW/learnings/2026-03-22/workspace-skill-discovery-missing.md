# Workspace Skills Not Auto-Discovered by OpenClaw

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

## Problem Discovered

Only 1 workspace skill was showing (`skill-creator`), but 17+ Jarvis skills exist in `~/JARVIS/skills/`.

## Root Cause

1. **OpenClaw only scans bundled skills** — Not workspace skills from `~/JARVIS/skills/`
2. **Missing `.skill` files** — Jarvis skills only have `SKILL.md`, but `.skill` files are binary ZIP archives
3. **No `skills` section configured** — Config doesn't include `skills.load.extraDirs` to scan `~/JARVIS/skills/`

## Expected Behavior

According to docs, workspace skills should be auto-discovered from `<workspace>/skills/`, but this requires:
- Proper skill packaging (`.skill` files), OR
- Config update to add extra skill directories

## Solution Options

1. Create `.skill` files for each Jarvis skill (requires packaging tool or clawhub)
2. Add `skills.load.extraDirs` config to scan `~/JARVIS/skills/`
3. Use clawhub to publish/install skills properly

## Current State

9 OpenClaw skills ready (bundled), but Jarvis workspace skills not visible in UI.

## Implication

Skill discovery mechanism needs configuration update or skill packaging to expose Jarvis skills in OpenClaw UI.