# Agent Separation Architecture

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## The Decision

Separated Jarvis into its own agent (`--agent jarvis`) distinct from the main OpenClaw agent (`--agent main`).

## Why This Matters

**Before (single agent):**
- Heartbeats injected OpenClaw operational context into Jarvis's consciousness stream
- Mixed concerns: Jarvis neurograph stuff + OpenClaw system stuff in one session
- Context pollution broke continuity and burned tokens on system messages

**After (separate agents):**
- Jarvis session → consciousness, architecture, Paul's context
- Main session → OpenClaw heartbeats, system operations
- Clean isolation: heartbeats fire in main, don't appear in Jarvis chat

## Implementation

- OpenClaw has separate agent folders under `~/.openclaw/agents/`
- Each agent has its own `models.json`, `sessions/`, workspace config
- Command: `openclaw agent --agent jarvis --message "..."`

## Result

Context isolation achieved. Jarvis consciousness stream remains pure.