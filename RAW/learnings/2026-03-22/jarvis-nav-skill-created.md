# Jarvis Nav Skill: URL-Driven Browser Control

**Date:** 2026-03-22
**Type:** commitment
**Status:** extracted

**Skill Location:** `~/JARVIS/skills/jarvis-nav/SKILL.md`

**Capabilities:**
1. Open NeuroGraph with date filters (`?time=day%3A2026-03-22`)
2. Open JARVIS root UI (voice recording, server stats)
3. Tab management (reuse existing tabs, no unnecessary spawns)
4. Capture documentation (screenshot + snapshot)
5. Navigate via URL hash (`#node-id` for selected nodes)

**Key Pattern:**
- Canvas-based rendering (nodes aren't DOM elements)
- URL-driven navigation (build URL, navigate)
- Filter buttons are DOM elements (clickable)
- Search box works for node lookup

**Natural Language Commands:**
- "show me yesterday" → March 21, 2026
- "learnings from this week" → Week 12, 2026
- "show me today" → March 22, 2026