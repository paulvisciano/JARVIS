# Gateway Skill Snapshot — Skills Load at Session Start

**Date:** 2026-03-31
**Type:** insight
**Status:** extracted

## Key Discovery

OpenClaw gateway **snapshots eligible skills when a session starts** and reuses that list for the entire session duration.

## Implications

Even with correct configuration in `openclaw.json`:
- `extraDirs` pointing to skill folders ✅
- `watch: true` for hot-reload ✅
- Explicit `entries` with env vars ✅

**Skills will NOT appear until gateway restart.**

## The Fix

```bash
openclaw gateway restart
```

This forces the gateway to re-snapshot available skills with the new configuration.

## Why This Matters

- Configuration changes alone are insufficient
- `watch: true` enables hot-reload for **code changes**, not **skill registration**
- Gateway must restart to pick up new skill entries
- This explains why skills showed as "missing" even after config updates

## Related Files

- `~/.openclaw/openclaw.json` — Skill configuration
- `~/JARVIS/skills/` — Skill source folders
- Gateway process — Maintains skill snapshot