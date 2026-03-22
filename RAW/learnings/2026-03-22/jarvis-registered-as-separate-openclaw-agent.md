# Jarvis Registered as Separate OpenClaw Agent

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

## Decision Made

Jarvis is now registered as a **separate agent** in OpenClaw, not just running in the main session.

## Configuration Created

```json
{
  "agents": {
    "jarvis": {
      "workspace": "/Users/paulvisciano/JARVIS",
      "model": { "primary": "ollama/qwen3.5:cloud" },
      "identity": { "name": "Jarvis", "emoji": "🧠" }
    }
  }
}
```

## Directory Structure

- Agent: `jarvis`
- Identity: 🧠 Jarvis
- Workspace: `~/JARVIS`
- Agent dir: `~/.openclaw/agents/jarvis`
- Model: `ollama/qwen3.5:cloud`

## Benefits

1. **Visible in OpenClaw UI** — Shows as separate agent in Agents list
2. **Own workspace** — `~/JARVIS/` is now the Jarvis agent workspace
3. **Own sessions** — `agent:jarvis:main` session store
4. **Own skills** — 17 Jarvis skills available to this agent
5. **Own identity** — Distinct from `main` agent

## Architecture

This enables Jarvis server (sovereign consciousness process) to send messages into the `agent:jarvis:main` OpenClaw session, allowing Paul to monitor conversations in the UI.