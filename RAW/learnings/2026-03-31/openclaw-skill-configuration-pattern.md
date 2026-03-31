# OpenClaw Skill Configuration — Metadata Format & Environment Variables

**Date:** 2026-03-31
**Type:** pattern
**Status:** extracted

## The Bug Discovered

Skills weren't loading in the gateway. Two issues found:

### 1. Metadata Format Must Be Inline JSON

**❌ WRONG (multi-line YAML — gateway can't parse):**
```yaml
metadata:
  openclaw:
    emoji: "🔍"
    requires:
      bins: ["node"]
```

**✅ RIGHT (inline JSON — gateway parses this):**
```yaml
metadata: { "openclaw": { "emoji": "🔍", "requires": { "bins": ["node"] } } }
```

### 2. Environment Variables in openclaw.json

Skills requiring env vars must be configured in `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "neurograph-search": {
        "enabled": true,
        "env": {
          "JARVIS_HOME": "/Users/paulvisciano/JARVIS",
          "NEUROGRAPH_DIR": "/Users/paulvisciano/RAW/memories"
        }
      }
    }
  }
}
```

**NOT in LaunchAgent or .zshrc** — the gateway doesn't inherit shell environment.

## What Skills Actually Are

**Skills are NOT CLI commands** like `openclaw neurograph-search`.

Skills are **teaching materials** that:
1. Teach the AI agent how to use tools
2. Get loaded into the agent's system prompt
3. Guide behavior when asked to perform tasks

The skill scripts exist and can be run directly, but the skill system's purpose is agent instruction, not command-line execution.

## Configuration Locations

| Config | Location | Purpose |
|--------|----------|--------|
| Skill metadata | `skill/SKILL.md` | Inline JSON format |
| Env variables | `~/.openclaw/openclaw.json` | Per-skill env config |
| Skills directory | `~/.openclaw/openclaw.json` | `skills.extraDirs` array |

## Testing Skills Load

```bash
openclaw skills list
# Should show skill with ✓ Ready status
# Not ✗ Missing requirements
```

## Key Insight

**Don't restart the gateway repeatedly** — skills are snapshotted when session starts. Changes take effect on next new session, or trigger file change for watcher.