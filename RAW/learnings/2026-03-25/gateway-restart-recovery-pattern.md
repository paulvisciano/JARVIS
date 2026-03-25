# Gateway Restart Fixes WebSocket 1001 Issues

**Date:** 2026-03-25
**Type:** pattern
**Status:** extracted

## The Symptom

- Messages sent through gateway receive no replies
- WebSocket close code 1001 ("Going Away") appears in logs
- Restarting the gateway immediately resolves the issue

## Timeline Pattern

```
13:35:21 - webchat disconnected code=1001 → reconnected
13:36:47 - webchat disconnected code=1001 → reconnected
13:36:56 - webchat disconnected code=1001 → reconnected
13:37-13:40 - messages sent, no replies delivered
13:40 - gateway restart → fresh WebSocket → working again
```

## What 1001 Means

**Definition:** The endpoint is going away - server shutting down or client navigating away.

**Common Causes:**
1. Browser navigation (page reload, tab close)
2. Server maintenance/restart
3. Network switches (WiFi change)
4. Application shutdown
5. Session timeout

## Why Restart Works

- Clears stale WebSocket connections
- Resets connection state machine
- Establishes fresh message routing
- Clears any stuck message queues

## Documentation

Added to `~/.openclaw/workspace/HEARTBEAT.md`:
- Symptoms section
- Detection commands
- Recovery procedures
- Prevention recommendations