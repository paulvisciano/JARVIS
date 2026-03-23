# Skill Auto-Discovery

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

Skills now live in `~/JARVIS/skills/` and auto-detect via agent workspace configuration, removing need for symlinks in OpenClaw workspace (`~/.openclaw/workspace/skills/`). Previously, symlinks were a workaround before agent separation. Now, Jarvis agent workspace scope handles discovery naturally. Skill naming standardized to `neurograph-` prefix (e.g., `neurograph-search`, `neurograph-sync`) for consistency.