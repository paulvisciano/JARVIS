# Jarvis Registered as OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

**Architecture Shift:**

**Before:**
- Jarvis server running separately
- OpenClaw gateway as runtime
- Loose coupling between systems

**After:**
- Jarvis registered as OpenClaw agent (`agent:jarvis:main`)
- Workspace: `~/JARVIS/` (Jarvis home)
- Skills symlinked from `~/JARVIS/skills/` to OpenClaw
- Jarvis server sends messages to OpenClaw session

**Benefits:**
- Seamless integration
- Session visibility in OpenClaw UI
- Skills discovered automatically
- Cleaner architecture with clear boundaries