# OpenClaw Skills Require YAML Metadata Under 200 Chars

**Date:** 2026-04-01
**Type:** insight
**Status:** extracted

## The Silent Failure

OpenClaw silently skips skills with:
- Description over 200 characters
- Improper YAML structure in SKILL.md
- Restrictive folder permissions (700 instead of 755)
- Nested folder structures (skill/skill/ instead of skill/)

## What We Found

```
neurograph-search: Description was 439 chars → failed silently
breathe: Folder permissions were 700 → OpenClaw couldn't read
neurograph-sync: Nested folder structure → not discovered
```

## The Fix

1. Keep SKILL.md descriptions under 200 characters
2. Use proper YAML frontmatter format
3. Set folder permissions to 755 (readable by all)
4. No nested folders (skill/, not skill/skill/)
5. Configure in `~/.openclaw/openclaw.json` under `skills.load.extraDirs`

## Lesson

Skill registration failures are often silent. Check:
- YAML metadata format
- Description length
- Folder permissions
- Folder structure
- Gateway restart after changes