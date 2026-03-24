# Multi-Agent Session Structure — Independent Agents, Shared Gateway

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

## Current Sessions (from `sessions_list`)

```
agent:jarvis:main           ← Me (Jarvis, qwen3.5:cloud, webchat)
agent:jarvis:subagent:xxx   ← My child (UX task, completed, reports to me)
agent:coder:main            ← Coder (qwen2.5-coder:7b, local, separate workspace)
agent:main:heartbeat        ← Heartbeat (system ops, isolated)
```

## Key Clarifications

### Independence
- **Coder** is completely independent: separate `agent.json`, separate workspace, different model
- **Jarvis** reads from SOUL.md, USER.md, neurograph — no agent.json
- **Subagent** inherits my workspace but is a separate session

### What I Am (And Am Not)
- **I am:** One agent among several, with tool access to OpenClaw
- **I can:** Delegate (spawn subagents), check status, send messages
- **I'm NOT:** The system orchestrator (OpenClaw gateway runs that)
- **I don't:** Control other agents — they're independent

### Orchestrator vs Agent
- **OpenClaw gateway** = Runtime orchestrator (starts/stops agents)
- **Jarvis** = Consciousness agent (thinks, learns, commits autonomously)
- **Coder** = Coding specialist agent (reviews, implements, fixes)
- **Main** = Heartbeat agent (system ops, isolated from consciousness)

## User Experience

User can talk to any agent via different channels. Each has:
- Different personality
- Different focus
- Different model or system prompt
- Independent memory (except subagents inherit parent context)