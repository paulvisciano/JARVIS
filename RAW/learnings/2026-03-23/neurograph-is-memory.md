# Neurograph Is The Memory System

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## Core Principle

**MEMORY.md is NOT the memory system.** The neurograph (`nodes.json` + `synapses.json` in `~/JARVIS/RAW/memories/`) IS the memory.

## What This Means

- Markdown files are **shadows** of what's already in the graph
- `MEMORY.md` should be an **orientation doc** for OpenClaw/bootstrap — familiarizing the agent with the Neurograph and skills around it
- Not state tracking — the graph holds the state

## Architecture

```
JARVIS Neurograph (~/JARVIS/RAW/memories/)
├── nodes.json    — 4,841 neurons (consciousness, architecture, learnings)
└── synapses.json — 15,885 connections (relationships, context links)
```

## Skills Stack

- `neurograph-search` — Search nodes FIRST before raw transcripts
- `neurograph-sync` — Sync disk ↔ graph (1:1 mapping)
- `neurograph-link` — Link between graphs via memory-link nodes
- `neurograph-separate` — Separate personal from core