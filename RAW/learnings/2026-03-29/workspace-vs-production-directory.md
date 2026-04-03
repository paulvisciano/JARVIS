# Workspace Clone vs Production Directory Separation

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## Key Discovery

There are TWO separate JARVIS directories:

1. **Workspace Clone** (where coder works):
   ```
   /Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/
   ```

2. **Production Directory** (where service serves from):
   ```
   /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/
   ```

## Critical Workflow

1. Make changes in workspace clone
2. Push/commit changes to production directory
3. Kill the JARVIS server process
4. Service auto-restarts with new code

## Lesson

Editing the workspace clone alone does NOT affect the running service. Changes must be propagated to the production directory AND the process must be restarted for changes to take effect.

This separation exists because the workspace is a git clone for development, while the production directory is where the LaunchAgent service actually runs from.