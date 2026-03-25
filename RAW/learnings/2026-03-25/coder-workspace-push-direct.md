# Coder Workspace Pushes Direct to Main Repo

**Date:** 2026-03-25
**Type:** realization
**Status:** extracted

## Discovery

jarvis-coder works in an isolated workspace but pushes **directly to the main sci-fi repo**, not through an intermediate local sync.

## Workspace Structure

```
~/.openclaw/agents/jarvis-coder/workspace/sci-fi/
  ↓ cloned from
~/JARVIS/skills/jarvis-ui/sci-fi/
```

## Git Remote Configuration

```bash
cd ~/.openclaw/agents/jarvis-coder/workspace/sci-fi
git remote -v
# origin  /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi (fetch)
# origin  /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi (push)
```

## Workflow

1. **jarvis-coder develops** in isolated workspace (safe to experiment)
2. **Commits + pushes** → main sci-fi repo (`~/JARVIS/skills/jarvis-ui/sci-fi/`)
3. **JARVIS server serves** → test at `https://localhost:18787/neuro-graph`
4. **No intermediate localhost:8080 step needed**

## Benefits

- **Isolation** — Coder can't break live files during development
- **Direct deployment** — Changes land where they're served immediately
- **Clean workflow** — No manual pull/sync steps required
- **Version control** — All changes tracked with proper commits

## Key Learning

Workspace isolation doesn't require complex sync workflows. Point the workspace remote at the production location and push directly.