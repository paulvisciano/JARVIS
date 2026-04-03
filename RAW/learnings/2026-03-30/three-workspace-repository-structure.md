# Three-Workspace Repository Structure — Root User, Coder, and Skill

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Pattern

Today we established a three-repository structure for the JARVIS UI:

| Workspace | Path | Purpose | User |
|-----------|------|---------|------|
| **Root User Clone** | `~/sci-fi-apps/` (or similar) | Fresh clone for direct Cursor work | Paul (human) |
| **Coder Workspace** | `~/.openclaw/agents/jarvis-coder/workspace-preview/` | Where Coder codes | Jarvis Coder (agent) |
| **Skill Version** | `~/JARVIS/skills/jarvis-ui/sci-fi/` (submodule) | Published/downloaded version | Distribution |

## Why This Works

- **Root user** gets a clean environment to work directly with Cursor
- **Coder** has isolated workspace to make changes without affecting production
- **Skill** provides the distributable version that can be installed/updated

## Key Insight

This is an optimization, not a problem. The three copies serve distinct purposes:
1. Development (root user + Cursor)
2. Agentic coding (Coder workspace)
3. Distribution (skills folder)

## Related

- PR-based workflow for Coder
- Preview server on port 18788
- Unified UI architecture
