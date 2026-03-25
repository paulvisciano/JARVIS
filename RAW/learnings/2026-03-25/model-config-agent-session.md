# Model Config Overrides Agent Session Settings

**Date:** 2026-03-25
**Type:** realization
**Status:** extracted

## The Issue

`openclaw.json` had jarvis-coder hardcoded to `ollama/qwen2.5-coder:7b`, but `models.json` kept getting overwritten to `qwen3.5:cloud`. The agent config was overriding the models.json file.

## Root Causes

1. **Model mismatch** - agent config hardcoded different model than desired
2. **Config override** - agent config overriding models.json edits
3. **Stale sessions** - old sessions stuck in bad states

## Resolution

- Fixed `openclaw.json` to use correct model
- Killed stale agent sessions
- Fresh session loads new config properly

## Lesson

Agent sessions read config at **startup**. Any active session won't automatically reload new instructions. Must restart agent sessions after config changes.