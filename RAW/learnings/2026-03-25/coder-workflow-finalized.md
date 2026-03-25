# Jarvis-Coder Production Workflow Finalized

**Date:** 2026-03-25
**Type:** commitment
**Status:** extracted

## The Final Workflow

1. **Jarvis-coder develops** in isolated workspace:
   `~/.openclaw/agents/jarvis-coder/workspace/sci-fi/`

2. **Commits + pushes** directly to remote:
   `~/JARVIS/skills/jarvis-ui/sci-fi/` (origin)

3. **JARVIS server serves** the live version:
   `https://localhost:18787/neuro-graph`

4. **No intermediate localhost:8080 step** needed

## Why This Works

- **Isolation:** Coder works in sandboxed clone, doesn't touch live files
- **Direct push:** Workspace origin points to main sci-fi repo
- **Immediate availability:** Changes land where JARVIS serves them
- **Clean workflow:** No manual pull/sync steps required

## Git Remote Configuration

```bash
cd ~/.openclaw/agents/jarvis-coder/workspace/sci-fi && git remote -v
# origin  /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi (fetch)
# origin  /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi (push)
```

## Version Tracking

- Client version bumped on UI changes (v2.9.41 → v2.9.42)
- Server version tracked separately (v2.9.7)
- NeuroGraph has its own version (v1.0.0)
- All versions displayed in UI for transparency

## Production Ready

Jarvis-coder successfully completed:
- 5 transcript header fix commits
- NeuroGraph minimap fix
- Version display feature
- System vitals UI integration
- All pushed to origin/main