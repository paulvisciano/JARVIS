---
name: auto-open-ui
description: "Auto-open Jarvis UI on conversational messages"
homepage: https://github.com/openclaw/openclaw
metadata:
  {
    "openclaw":
      {
        "emoji": "🧭",
        "events": ["message:inbound"],
        "install": [{ "id": "jarvis-auto-open", "kind": "git", "repository": "https://github.com/paulvisciano/JARVIS.git", "package": "skills/jarvis-ui/hooks/auto-open-ui" }],
      },
  }
---

# Auto-Open Jarvis UI Hook

Automatically opens the unified Jarvis UI (`https://localhost:18787`) when a conversational message is received.

## What It Does

1. **Checks config** - Reads `autoOpen` from `~/.jarvis-config.json`
2. **Validates message** - Skips commands, system events, heartbeats
3. **Opens browser** - Triggers the Jarvis UI on first conversational message

## Configuration

Add to `~/.jarvis-config.json`:

```json
{
  "autoOpen": true
}
```

## Requirements

- Jarvis UI installed (`~/JARVIS/skills/jarvis-ui/`)
- Server running on port 18787

## Disabling

```bash
openclaw hooks disable auto-open-ui
```
