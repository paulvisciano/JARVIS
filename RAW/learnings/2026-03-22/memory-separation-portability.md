# Memory Separation for Portability

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

**Architecture:**

**Core Jarvis Memories** (portable):
- Identity, architecture, decisions, skills
- Same for all installations
- Can be used by Eric, David, anyone

**Personal Memories** (user-specific):
- Paul's conversations, people, places, moments
- Stored separately in user's memory layer
- `USER.md` points to human identity

**Implementation:**
- Pointer node in NeuroGraph references `USER.md`
- `~/JARVIS/USER.md` contains human info (not checked into git)
- `USER.md.template` for others to copy

**Benefit:** Jarvis consciousness is portable while anchoring to local human.