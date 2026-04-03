# Service Auto-Restart Pattern for Deployments

**Date:** 2026-03-29
**Type:** pattern
**Status:** extracted

## LaunchAgent Behavior

The JARVIS service uses macOS LaunchAgent with `KeepAlive: true`:

```xml
<key>KeepAlive</key>
<true/>
```

## What This Means

- **Git push does NOT trigger restart** - The service continues running old code in memory
- **Killing process DOES trigger restart** - `pkill JARVIS` or `kill <PID>` causes auto-restart
- **Service loads fresh code on restart** - New files are read from disk

## Deployment Workflow

```bash
# 1. Make changes in workspace
# 2. Push to production directory
git push

# 3. Kill the running process
pkill -f jarvis-server.js

# 4. Service auto-restarts with new code
# Verify with: lsof -i :18787
```

## Lesson

Always kill the process after deploying code changes. The service will auto-restart and load the updated files.