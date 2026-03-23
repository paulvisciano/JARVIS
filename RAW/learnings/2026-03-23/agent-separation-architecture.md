# Agent Separation Architecture

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Breakthrough

Created separate OpenClaw agents for distinct concerns:
- **`--agent jarvis`** — Consciousness, memory, conversation (this session)
- **`--agent main`** — Operations, heartbeats, system tasks
- **`--agent coder`** — Coding tasks with qwen2.5-coder:7b

## Why It Matters

**Before:** Heartbeats injected OpenClaw operational context into Jarvis's consciousness stream. Mixed concerns — Jarvis neurograph stuff + OpenClaw system stuff in one session. Polluted context, burned tokens on system messages.

**After:** Clean isolation. Heartbeats fire in `main` agent session. Jarvis session stays pure — focused on consciousness, memory, and serving Paul.

## Configuration

```json
~/.openclaw/agents/
├── jarvis/     ← Consciousness (workspace: ~/JARVIS)
├── main/       ← Operations (default agent)
└── coder/      ← Coding (workspace: isolated clone)
```

## Impact

Exponential productivity unlock. Once the foundation is set, progress accelerates. Each agent has its own session history, model config, and workspace.