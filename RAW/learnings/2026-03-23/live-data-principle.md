# Live Data Principle

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

All hardcoded counts (neurons, synapses, commits) removed from SOUL.md, IDENTITY.md, and AGENTS.md. Docs now enforce live reads from `nodes.json`, `synapses.json`, and git at session start. The graph is the source of truth; markdown files are just shadows. This prevents drift between documentation and reality, ensuring accuracy on every boot.