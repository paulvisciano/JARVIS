# Institutional Memory Architecture Strategy

**Date:** 2026-03-28
**Type:** decision
**Status:** extracted

## Core Decision
Institutional learnings must be stored in structured, queryable systems, not temporary session logs.

## Architecture Layers
1. **Flash Memory** (`memory/YYYY-MM-DD.md`)
   - Temporary session logs
   - Auto-cleaned over time
   - Not for permanent knowledge

2. **Institutional Memory** (Permanent)
   - **Neurograph** (`~/JARVIS/RAW/memories/nodes.json` + `synapses.json`)
     - Structured, queryable knowledge graph
     - Connects concepts and learnings
   - **Git Learnings** (`~/JARVIS/RAW/learnings/YYYY-MM-DD/`)
     - Versioned markdown documents
     - Human-readable archival

## Rationale
Flash memory is for transient context. Institutional learning (like swarm protocols) must persist in the Neurograph for system intelligence and Git for versioned documentation. This ensures the system evolves without cluttering session logs.