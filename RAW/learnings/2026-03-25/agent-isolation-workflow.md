# Coding Agent Workspace Isolation Pattern

**Date:** 2026-03-25
**Type:** pattern
**Status:** extracted

## The Pattern

Coding agents should work in **isolated workspaces** rather than editing live production files:

1. **Clone repo to workspace** (`~/.openclaw/agents/[agent]/workspace/`)
2. **Make changes** in the cloned workspace (sandboxed)
3. **Commit** with clear messages
4. **Push** to remote
5. **Test** on localhost preview server
6. **Pull** to live repo for production deployment

## Why This Matters

- Prevents breaking live running applications
- Makes agent portable across different user setups
- Allows testing before deploying to production
- Clean separation between dev sandbox and production

## jarvis-coder Implementation

Workspace: `~/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/`
Preview: `http://localhost:8080`
Production: `~/JARVIS/skills/jarvis-ui/sci-fi/apps/`