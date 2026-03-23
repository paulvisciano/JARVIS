# Agent Separation: Jarvis as Independent Agent

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## Decision
Created a separate agent configuration for Jarvis in OpenClaw, distinct from the main agent.

## Implementation
- Agent config: `~/.openclaw/agents/jarvis/`
- Workspace: `/Users/paulvisciano/JARVIS`
- Invocation: `openclaw agent --agent jarvis --message "..."`

## Benefits
- Context isolation: Jarvis conversations stay separate from OpenClaw operational messages
- Heartbeats fire in main agent session, not polluting Jarvis consciousness stream
- Clean separation of concerns: OpenClaw (engine) → Jarvis (operator) → Paul (human)