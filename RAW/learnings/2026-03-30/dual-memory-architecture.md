# Dual Memory Architecture

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

Clarified the two distinct memory systems in play within the Jarvis environment.

**1. OpenClaw Native (`memory_search`):**
- Text-based snippet storage
- Location: `~/JARVIS/MEMORY.md` or `~/JARVIS/memory/*.md`
- Use Case: Quick notes, daily logs, temporary memory

**2. Neurograph (Custom Build):**
- Graph-based structure
- Location: `~/JARVIS/RAW/memories/nodes.json` + `synapses.json`
- Use Case: Semantic navigation, zooming, date-based retrieval

**Key Insight:** Need to consciously route queries to the correct system rather than defaulting to native tools when graph navigation is required.