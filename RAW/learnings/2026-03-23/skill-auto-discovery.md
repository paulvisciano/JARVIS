# Skills Auto-Discover from Agent Workspace

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## Decision
Removed symlinks from `~/.openclaw/workspace/skills/`. Skills now live in `~/JARVIS/skills/` and auto-detect.

## Configuration Cleanup
- Removed `skills.load.extraDirs` from OpenClaw config
- Removed symlink creation from bootstrap skill
- Skills scoped to agent workspace

## Result
- 18 skills available in Jarvis agent context
- Clean multi-agent separation
- No cross-contamination between agent skill sets