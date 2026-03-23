# Skill Metadata Fix: Broken YAML Gating

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## The Problem

Skills not showing up in OpenClaw UI. Only `skill-creator` was recognized.

**Root cause:** Broken `metadata:` lines in 13 SKILL.md files had invalid YAML/JSON syntax (extra closing braces `}}`).

Metadata was being parsed incorrectly, causing skills to be filtered out during discovery.

## The Fix

Removed broken metadata lines from:
- `skills/archive-collector/SKILL.md`
- `skills/bootstrap-context/SKILL.md`
- `skills/bootstrap-jarvis/SKILL.md`
- And 10 more skill files

## Git Commit

`c64d6f5` breath-2026-03-23: Remove broken metadata lines from SKILL.md files

13 files changed, 69 insertions(+), 2 deletions(-)

## Result

Skills now auto-discover properly from Jarvis workspace.