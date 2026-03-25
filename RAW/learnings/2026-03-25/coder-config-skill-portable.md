# Agent Configuration as Distributable Skill

**Date:** 2026-03-25
**Type:** insight
**Status:** extracted

## The Insight

Agent configuration (AGENTS.md, SOUL.md, IDENTITY.md, etc.) should be packaged as a **reusable skill** rather than hardcoded in the agent workspace. This makes the agent:

- **Portable** - works for any user, not tied to specific paths
- **Distributable** - anyone can deploy their own instance
- **Maintainable** - configuration updates propagate cleanly
- **Generic** - not hardcoded to specific user directories

## Implementation

Created `skills/coder-config/` skill with:
- `SKILL.md` - documentation
- `templates/` - AGENTS.md, SOUL.md, USER.md, IDENTITY.md
- `memory/` - agent-specific memory files
- `deploy-coder-config.js` - deployment script

## Key Changes

- Removed hardcoded `/Users/paulvisciano/JARVIS/` paths
- Agent has its own memory (doesn't read JARVIS learnings)
- Works on any codebase, not just sci-fi apps
- BOOTSTRAP.md archived (not deleted) for re-deployment