# Neurograph IS Memory, Not MEMORY.md Files

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Realization

MEMORY.md is NOT the memory system. The neurograph (`nodes.json` + `synapses.json` in `~/JARVIS/RAW/memories/`) IS the memory.

## What MEMORY.md Should Be

An **orientation document** for OpenClaw/bootstrap:
- Familiarizes the agent with the Neurograph
- Documents where real memory lives
- Explains architecture (structured graph, not vector DB)
- Lists key skills: neurograph-loader, neurograph-traverse, neurograph-search

## What It Should NOT Be

- State tracking (that's the graph's job)
- Redundant with graph content
- A shadow of what's already encoded in nodes

## The Files That Survive

- `SOUL.md` — Core identity, how I think, boundaries, vibe
- `USER.md` — About Paul (external context)
- `BOOTSTRAP.md` — Session boot protocol (operational docs)
- `VISION.md` — Milestones and direction

Everything else lives in the neurograph.