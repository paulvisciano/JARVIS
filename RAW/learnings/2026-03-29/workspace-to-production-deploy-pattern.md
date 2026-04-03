# Workspace → Production → Kill Process Deploy Pattern

**Date:** 2026-03-29
**Type:** pattern
**Status:** extracted

## The Problem

I was editing files in my workspace clone:
```
/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/
```

But the service runs from the production directory:
```
/Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/
```

Changes weren't appearing because I was editing the wrong directory.

## The Correct Workflow

1. **Work in workspace** — Develop and test in `~/.openclaw/agents/jarvis-coder/workspace/`
2. **Push to production** — Git push changes to `/Users/paulvisciano/JARVIS/skills/jarvis-ui/`
3. **Kill the process** — Service won't auto-update on git push
4. **Auto-restart** — LaunchAgent with `KeepAlive: true` restarts the process with new code

## Why This Pattern Matters

| Step | Purpose |
|------|--------|
| Workspace isolation | Safe development, won't break production |
| Git push | Versioned deployment, auditable changes |
| Kill process | Force service to reload new code |
| KeepAlive | Automatic restart, no manual intervention |

## Common Mistakes

- ❌ Editing production directory directly (no version control)
- ❌ Expecting auto-update on git push (process keeps old code in memory)
- ❌ Restarting OpenClaw gateway instead of JARVIS server (different services)
- ❌ Not killing process after push (serving stale code)

## Verification

After deploy, verify:
```bash
# Check process is running with new PID
ps aux | grep JARVIS

# Check port is listening
lsof -i :18787

# Hard refresh browser (cache-busting may not be enough)
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

## Related Learnings

- `workspace-vs-production-directory.md` — The directory separation concept
- `service-restart-required-for-deploy.md` — Service auto-restart pattern

This learning captures the **complete deploy workflow** combining both concepts.