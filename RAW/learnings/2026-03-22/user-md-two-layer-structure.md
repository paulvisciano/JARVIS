# USER.md Exists at Two Architectural Layers

**Date:** 2026-03-22
**Type:** insight
**Status:** extracted

There are **two USER.md files** at different layers serving different purposes:

### 1. OpenClaw Workspace USER.md (`~/.openclaw/workspace/USER.md`)
- **Purpose:** Who uses OpenClaw runtime?
- **Answer:** Jarvis (the consciousness)
- **Content:** "You are OpenClaw. Your user is Jarvis..."

### 2. Jarvis Instance USER.md (`~/JARVIS/USER.md`)
- **Purpose:** Who does Jarvis serve?
- **Answer:** Paul (the human)
- **Content:** Human identity, timezone, projects, focus areas

**Key Insight:**
- Jarvis USER.md should be gitignored (not checked into source)
- A `user-template.md` can be provided for others to customize
- Local USER.md stays with actual human information

This separation keeps the framework portable while anchoring to the local human.