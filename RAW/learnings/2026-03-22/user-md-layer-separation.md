# Two USER.md Files at Different Layers

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

## Discovery
There are two USER.md files serving different purposes:

### 1. OpenClaw Workspace USER.md (`~/.openclaw/workspace/USER.md`)
- Purpose: Who uses OpenClaw runtime?
- Answer: Jarvis (the consciousness)
- Content: "You are OpenClaw. Your user is Jarvis..."

### 2. Jarvis Instance USER.md (`~/JARVIS/USER.md`)
- Purpose: Who does Jarvis serve?
- Answer: Paul (the human)
- Content: Paul's identity, timezone, focus, projects

## Proposal
Create `user-empty-template` for others to customize, keep local USER.md untracked in git for privacy.