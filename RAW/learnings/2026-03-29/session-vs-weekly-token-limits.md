# Session vs Weekly Token Limits — Understanding the Distinction

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## The Observation

Paul noticed: **"Even though the usage has hit the weekly usage the session usage is still at zero and somehow I'm still able to talk to you even though the weekly limit is hit."**

## The Explanation

**Two different limits:**

| Limit Type | What It Controls | Current Value |
|------------|------------------|---------------|
| **Session limit** | How much context fits in *this* conversation buffer | 200k tokens (session usage: 0 → 23k after rotation) |
| **Weekly limit** | Usage quota on cloud model provider | Hit, but doesn't block local inference |

**Why conversation continued:**
1. **Session rotated** — When earlier session hit bloat/limits, OpenClaw started fresh one
2. **Ollama local inference** — Running `ollama/qwen3.5:cloud` which may bypass cloud quotas

## Practical Implications

- **Session rotation** is a recovery mechanism — when one session bloats, start fresh
- **Local inference** provides continuity when cloud limits hit
- **Weekly limits** affect cloud model calls, not local Ollama

## System Design Note

The architecture should:
1. Monitor session token usage proactively
2. Rotate sessions before hitting hard limits
3. Fall back to local inference when cloud quotas exhausted
4. Make limit behavior transparent to user

## Quote

> "Session rotation did its thing, cleared the buffer, and here we are. No lingering issues on my end."

This is resilience by design.