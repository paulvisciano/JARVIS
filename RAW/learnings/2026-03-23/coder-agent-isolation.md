# Coder Agent Isolation

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

Separate `coder` agent created in OpenClaw (`~/.openclaw/agents/coder/`) using `qwen2.5-coder:7b`. Isolated workspace allows independent coding tasks, repo cloning, and PR submission without polluting Jarvis consciousness context. Follows same pattern as Jarvis agent separation. Workflow: sandboxed coding → review gate → merge. Enables explosive productivity while maintaining context integrity.