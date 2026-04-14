# Paperclip Server Commands — npx Over pnpm

**Date:** 2026-04-14
**Type:** pattern
**Status:** extracted

## Problem

Paperclip documentation recommends `pnpm paperclipai` commands, but this requires installing pnpm globally — an unnecessary dependency for users who primarily use npm.

## Solution

Use `npx @paperclipai/server` for all Paperclip operations:

```bash
# Quickstart (one command)
npx @paperclipai/server onboard --yes

# Start existing instance
npx @paperclipai/server run

# Health checks
npx @paperclipai/server doctor

# Configuration
npx @paperclipai/server configure

# Network access
npx @paperclipai/server allowed-hostname
```

## Benefits

1. **No pnpm installation required** — works with default npm
2. **No global binary** — commands run via npx without permanent installation
3. **Always latest version** — npx fetches current package version
4. **Lower friction** — reduces setup steps for new instances

## Updated Skill Reference

`paperclip-company` skill updated to reflect npx pattern (commits `a7fe416`, `ab60fa0`)