# Ollama Session Bloat from Retry Loops

**Date:** 2026-03-25
**Type:** pattern
**Status:** extracted

## The Problem

When Ollama starts returning 500 errors, retry loops accumulate tokens without generating actual conversation. This creates massive session bloat:

- **473k tokens** accumulated from retries, not actual conversation
- WebSocket stays open but no replies are delivered
- User can still send messages but receives no responses
- Context limit messages become misleading

## Root Cause

1. Ollama API returns 500 errors
2. Gateway retries each failed attempt
3. Each retry adds tokens to the session
4. Error responses bloat the session history
5. WebSocket connection remains open but broken

## Detection

- Session context shows high token count but low actual conversation
- Gateway logs show repeated retry attempts
- User messages sent but no replies delivered
- WebSocket close code 1001 appears in logs

## Resolution

1. Clear the bloated session
2. Restart the gateway to establish fresh WebSocket
3. Verify Ollama health before resuming
4. Monitor token accumulation rate

## Prevention

- Add token accumulation rate monitoring
- Implement circuit breaker for repeated Ollama failures
- Auto-clear sessions after N consecutive failures
- Display accurate context usage (exclude retry tokens)