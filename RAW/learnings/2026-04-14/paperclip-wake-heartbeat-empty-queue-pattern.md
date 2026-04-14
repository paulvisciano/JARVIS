# Paperclip Wake Heartbeat — Empty Queue is Normal

**Date:** 2026-04-14
**Type:** pattern
**Status:** extracted

## Context

Multiple Paperclip wake events were triggered throughout the evening (23:39, 23:45, 23:51, 23:57 GMT+7) with `heartbeat_timer` as the wake reason. All returned "no issues found" from the issues endpoint.

## Pattern

Heartbeat-based wake events frequently return empty issue queues. This is **expected behavior**, not a failure:

1. **Wake trigger** — Timer-based heartbeat wakes the agent
2. **Agent verification** — `/api/agents/me` confirms agent identity and running status
3. **Issue check** — `/api/companies/{id}/issues` returns empty array when no work pending
4. **Graceful idle** — Agent completes workflow and returns to sleep

## Observed Behavior

| Run ID | Wake Reason | Issues Found | Status |
|--------|-------------|--------------|--------|
| f46ca498... | heartbeat_timer | [] (empty) | ✅ Complete |
| 7e7bfb6c... | heartbeat_timer | [] (empty) | ✅ Complete |
| 91f609f3... | heartbeat_timer | [] (empty) | ✅ Complete |
| fd7f23ab... | heartbeat_timer | [] (empty) | ✅ Complete |

## Interpretation

- **Empty queue = healthy system** — No stuck issues, no orphaned tasks
- **Heartbeat working** — Agent is waking on schedule and checking for work
- **No action needed** — This is the idle state of a well-functioning agent system

## When to Investigate

- If heartbeat wake events **stop firing** (agent not waking)
- If `/api/agents/me` returns error or wrong status
- If issues exist but aren't being picked up (stuck in queue)