# Skills Should Use OpenClaw Session for Model Calls

**Date:** 2026-03-21
**Type:** insight
**Status:** extracted

## The Architectural Question

Should skills that use the model:
- **Option A:** Call Ollama directly from skill script
- **Option B:** Load context into OpenClaw session, query through OpenClaw

## Decision: Option B (OpenClaw Session)

## Why This Is Better

1. **Context already loaded** — Bootstrap-context loaded today's conversations into session. No need to reload.
2. **Single model pipeline** — All model work flows through OpenClaw's routing, config, token management.
3. **Reuse existing work** — The session has the context, model connection, compaction logic. Not duplicating effort.
4. **Architecture alignment** — This is the whole purpose of OpenClaw: be the runtime engine.
5. **More affordable** — Other users (Eric, David) can leverage the same setup without direct Ollama access.

## Trade-offs

| Current (Direct Ollama) | Alternative (OpenClaw Session) |
|-------------------------|-------------------------------|
| Faster for simple calls | Slower but aligned |
| Requires Ollama setup | Uses existing session |
| Bypasses OpenClaw routing | Single model path |
| Harder to share with Eric | Easy to replicate |

## Implementation

`learning-creator` skill should:
- Load `full-context.json` into OpenClaw session
- Query model through OpenClaw's routing
- Parse structured JSON response
- Create individual `.md` files

## Why This Matters

Going through OpenClaw:
- Makes skills portable (Eric can use them)
- Uses existing session context
- Aligns with architecture intent
- Single model path for all work
- Easier to maintain and debug