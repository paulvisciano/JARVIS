# Workspace → Git Push → Kill Process Deploy Pattern

**Date:** 2026-03-29
**Type:** pattern
**Status:** extracted

## Workflow

Developers work in workspace clone, then deploy to production via git push and process restart:

```
1. Work in: ~/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/
2. Copy changes to: /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/
3. Commit and push to GitHub
4. Kill running process: kill <PID>
5. Service auto-restarts with new code (KeepAlive: true)
```

## Why This Pattern

- **Workspace isolation**: Development changes don't affect production until ready
- **Git as deployment mechanism**: Push triggers production update
- **Service auto-restart**: LaunchAgent with KeepAlive ensures process recovery
- **Clean separation**: Production directory is source of truth, workspace is sandbox

## Critical Detail

Git push alone doesn't restart the service. Must kill the process:

```bash
# WRONG: Just pushing doesn't reload code
git push origin main

# RIGHT: Push then kill process
git push origin main
kill <jarvis-server-pid>
# Service auto-restarts with fresh code
```

## Key Takeaway

Deployment requires both code update (git push) AND process restart (kill). Service KeepAlive handles restart automatically, but won't reload code without process termination.