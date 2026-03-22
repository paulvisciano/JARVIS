# OpenClaw Skills Are Guidance Documents

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

Skills in OpenClaw are **guidance documents** loaded into context, not scripts to execute directly. The correct pattern:

- Skills provide instructions in SKILL.md
- The agent (me) executes commands via `exec` tool following the skill's guidance
- Scripts should be self-contained (inline logic, not calling other skill scripts)

This was a key architectural correction - I was trying to `exec` bootstrap-jarvis directly instead of treating it as an OpenClaw skill that guides my actions.