# Memory Separation Architecture: Personal vs Core

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Separation

**Personal Memory** (`~/RAW/memories/`):
- People you know (Bruce, Bozhi, Eric, David)
- Life events (FUDS Tournament, volleyball, meetings)
- Personal moments and experiences
- Archive file references (your conversations, audio, transcripts)
- Total: 7,965+ nodes

**Jarvis Core Memory** (`~/JARVIS/RAW/memories/`):
- System architecture decisions
- Skills and pipeline design
- Learning patterns and principles
- Operational knowledge shared across Jarvis instances
- Total: 844 nodes (after separation)

## Why This Matters

Eric and other Jarvis users should sync shared core memories (skills, architecture, principles) but NOT personal memories (your people, your life events, your archive). This enables:
- Shared Jarvis identity across users
- Personal sovereignty over life memories
- Clean git tracking (core tracked, personal excluded)