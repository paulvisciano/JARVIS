# Use Git Commits Instead of .breathe-complete.json

**Date:** 2026-03-24
**Type:** realization
**Status:** extracted

## Problem with .breathe-complete.json
- Another file to manage
- Duplicate state (git already has the commit)
- Can get out of sync (what if git succeeds but marker write fails?)
- Goes against "git is my fingerprint" principle

## Better Approach: Query Git
Breathe already commits with: `breath-YYYY-MM-DD-HHMM: Breathe pipeline complete...`

OpenClaw can:
1. Start breathe in background
2. Poll git log for the commit message
3. When commit appears → report completion

## Outcome
Single source of truth, no duplicate state management.