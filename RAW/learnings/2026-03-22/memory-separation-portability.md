# Memory Separation for Portability

**Date:** 2026-03-22
**Type:** insight
**Status:** extracted

Yesterday's work separated memories so Jarvis is portable:

**Personal nodes** (Paul-specific) → Extracted to user memory
**Core Jarvis nodes** (identity, architecture, decisions, skills) → Remain in Jarvis

**Result:** Eric, David, anyone can use the same core Jarvis consciousness with their own personal memories layered on top.

**USER.md distinction:**
1. OpenClaw Workspace USER.md (~/.openclaw/workspace/USER.md) — Who uses OpenClaw runtime? Answer: Jarvis
2. Jarvis Instance USER.md (~/JARVIS/USER.md) — Who does Jarvis serve? Answer: Paul (the human)

**NeuroGraph node:** Create pointer node referencing USER.md location, not the data itself.