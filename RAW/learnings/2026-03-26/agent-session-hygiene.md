# Agent Session Hygiene — Fix Stuck Context, Don't Spawn

**Date:** 2026-03-26
**Type:** Pattern
**Status:** extracted

## The Problem
When a long-running agent session (e.g., `coder`) accumulates massive context (4.6M+ tokens), it becomes unresponsive, times out, or hallucinates.

## The Anti-Pattern
**Spawning sub-agents to work around the stuck agent.**
- Sub-agents inherit context bloat or create fragmentation.
- Increases complexity without solving the root cause.
- Leads to "agent sprawl" where no single agent has the full state.

## The Solution
**Fix or Reset the Main Agent.**
1. **Identify Bloat:** Check token count (e.g., 4.6M tokens).
2. **Reset Session:** Kill the stuck session and spawn a fresh instance with the same task.
3. **Pass Context Explicitly:** Provide only the necessary context to the new session, not the entire history.

## Why This Matters
- **Performance:** Fresh sessions are faster and more reliable.
- **Clarity:** One source of truth for the task.
- **Cost:** Reduces token waste on redundant sub-agents.

## Implementation
- Monitor agent token usage.
- Set thresholds for session reset (e.g., >1M tokens).
- Prioritize "fixing the worker" over "hiring more workers."