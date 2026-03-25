# WebSocket Close Code 1001 — 'Going Away' Error Pattern

**Date:** 2026-03-25
**Type:** insight
**Status:** extracted

## What It Means

WebSocket close code **1001** indicates "Going Away" — the endpoint is shutting down or the client is navigating away from the page.

## Common Causes

1. **Network switches** — WiFi change (e.g., coffee shop → different location)
2. **Browser navigation** — User loads different page or closes tab
3. **Server maintenance** — Scheduled shutdown/restart
4. **Application shutdown** — Client or server process terminates

## Symptoms

- Messages sent but no replies received
- Gateway appears connected but communication broken
- Session context shows messages but assistant unresponsive

## Diagnosis

```bash
# Check gateway logs for disconnect codes
grep "code=1001" ~/JARVIS/logs/gateway.log

# Verify WebSocket connection status
curl http://localhost:18789/health
```

## Resolution

1. **Restart the Gateway** — Fresh WebSocket connection
2. **Check network stability** — Ensure consistent connectivity
3. **Monitor for recurrence** — Log frequency to identify patterns

## Documentation Location

Added to `~/.openclaw/workspace/HEARTBEAT.md` under section:
`## WebSocket 1001 'Going Away' - Connection Drops`

## Key Learning

This error is **not a bug** — it's expected behavior when connections drop. The fix is systematic: detect via logs, restart gateway, document for future debugging.