# Environment Variable Inline Comments Break Path Resolution

**Date:** 2026-04-14
**Type:** realization
**Status:** extracted

## The Bug

Inline comments in `.env` files are **included in the variable value**, not stripped:

```bash
# BROKEN - comment becomes part of value
RAW_MEMORIES=~/RAW/memories # User's memory (archive nodes)
```

This sets `RAW_MEMORIES` to the literal string `~/RAW/memories # User's memory (archive nodes)` — the entire comment is part of the value!

## Impact

This caused:
- Path resolution failures in breathe pipeline
- Tilde expansion bugs (the `#` and comment text broke path parsing)
- Silent failures that were hard to debug

## The Fix

**Option 1: Move comments to separate lines**
```bash
# User's memory (archive nodes)
RAW_MEMORIES=~/RAW/memories
```

**Option 2: Use $HOME instead of ~** (more portable)
```bash
RAW_MEMORIES=$HOME/RAW/memories
```

## Lesson

Never use inline comments in `.env` files. Bash-style `#` comments only work on their own line — anything after `=` is part of the value until the newline.

## Related

- Node.js doesn't expand `~` or `$HOME` in environment variables — they're literal strings
- Scripts must explicitly expand tildes using `path.join(getHome(), envVar.slice(2))`
- Consider using actual absolute paths in `.env` for maximum portability