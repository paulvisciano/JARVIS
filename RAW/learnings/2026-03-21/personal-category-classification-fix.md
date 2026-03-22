# Person/Event/Location Categories Are Personal Not Core

**Date:** 2026-03-21
**Type:** insight
**Status:** extracted

## The Bug

The memory separator script had `"person"` listed as a **CORE** category (line 46), not **PERSONAL**. This kept Bruce, Bozhi, and other people nodes in Jarvis's graph instead of moving them to personal memory.

## The Fix

Moved these categories to PERSONAL_CATEGORIES:
- `person` - People you know
- `event` - Life events (tournaments, meetings, trips)
- `location` - Places you've been
- `archive` - File references to your personal archive
- `conversation` - Your chats
- `transcript` - Your audio
- `session` - Your sessions

## Result

- **Personal:** 7,965 nodes → `~/RAW/memories/`
- **Core:** 844 nodes → `~/JARVIS/RAW/memories/`

This ensures Eric gets shared Jarvis knowledge but not your personal life memories.