# Plugin vs Skill Architecture — Native Tools Replace Skills

**Date:** 2026-04-14
**Type:** decision
**Status:** extracted

## Context

During the speak tool optimization work, we discovered redundancy between the `speak` skill (scripts in `~/JARVIS/skills/`) and the `speak-tool` plugin (native TypeScript in `~/JARVIS/plugins/`).

## Decision

**Removed the speak skill entirely** and consolidated functionality into the native plugin.

## Architecture Distinction

| Aspect | Plugins | Skills |
|--------|---------|--------|
| Location | `~/.openclaw/extensions/` or `~/JARVIS/plugins/` | `~/JARVIS/skills/` |
| Code Type | Native TypeScript/JavaScript (in-process) | Scripts + documentation |
| Tool Registration | Registers native tools to agent toolkit | Provides reusable workflows |
| Reload Mechanism | Requires gateway restart | No restart needed |
| Examples | `speak-tool`, `web-search`, `voice-call` | `breathe`, `bootstrap`, `neurograph-sync` |

## Guideline

- **Use plugins** for native tool integrations that need direct API access
- **Use skills** for workflow orchestration and documentation-heavy operations
- **Avoid duplication** — if a plugin provides the functionality, remove the skill

## Commit Reference

`75cfd48` — Remove speak skill, replaced by speak-tool plugin