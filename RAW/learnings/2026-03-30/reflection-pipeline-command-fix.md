# Reflection Pipeline Command Corrections

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

## What Was Broken

The reflection pipeline had multiple silent failures:

1. **`--last` flag doesn't exist** on `openclaw sessions` → command failed silently
2. **`openclaw message send` requires `--target`** → message never posted
3. Script timed out after 30 seconds, commit never amended

## What's Fixed

Using the correct command:
```bash
openclaw sessions send --sessionKey agent:jarvis:main --message <reflection-request>
```

This command:
- Sends message to specific session
- Blocks waiting for response
- Returns agent's reply directly
- Enables commit amendment with reflection

## Lesson

Silent failures in automation pipelines are worse than loud errors. Always verify CLI flags exist and test the full flow end-to-end.