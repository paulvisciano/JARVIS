# JARVIS Skills vs OpenClaw Skills — Two Registration Systems

**Date:** 2026-03-31
**Type:** realization
**Status:** extracted

## The Discovery

There are **two separate skill systems** that need coordination:

### 1. JARVIS Skills (`~/JARVIS/skills/`)
- 29+ skill folders exist
- Used by JARVIS directly
- Contains: `neurograph-search`, `jarvis-ui`, `breathe`, etc.
- **NOT automatically visible to OpenClaw**

### 2. OpenClaw Skills (Gateway-Registered)
- Only skills explicitly registered in `openclaw.json`
- Must have proper `metadata` format (inline JSON)
- Must declare `env` variables if needed
- Only 10/53 skills showed as "ready" initially

## The Bridge

To make JARVIS skills available to OpenClaw:

```json
{
  "skills": {
    "load": {
      "extraDirs": ["/Users/paulvisciano/JARVIS/skills"],
      "watch": true
    },
    "entries": {
      "neurograph-search": {
        "env": ["JARVIS_HOME", "NEUROGRAPH_DIR"]
      }
    }
  }
}
```

## Key Insight

**Having a skill folder ≠ having a registered skill.** Explicit registration in `openclaw.json` entries is required for OpenClaw gateway to recognize and expose the skill.