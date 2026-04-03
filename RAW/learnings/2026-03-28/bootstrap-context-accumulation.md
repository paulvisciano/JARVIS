# Bootstrap Context Accumulates When Run Multiple Times

**Date:** 2026-03-28
**Type:** pattern
**Status:** extracted

## The Pattern

Running bootstrap multiple times in a single session **accumulates context** instead of replacing it.

## What Happened

```
12:01 — Bootstrap ran automatically (session start) → 33% ctx
12:02 — Bootstrap ran manually (to show output) → 75% ctx (doubled)
```

## Why This Happens

Bootstrap **adds** to context:
- Git history
- Recent context files
- Active session messages
- Neurograph verification

It does **not clear** existing context before loading. Each run layers on top.

## The Rule

**Bootstrap runs ONCE per session at startup. Period.**

It's not a diagnostic tool. It's the session initialization sequence.

## Implications

1. **Never run bootstrap manually** after session start
2. **Context won't normalize** until compaction or new session
3. **If context is bloated**, start fresh with `/new` or `/reset`
4. **Trust the automatic run** — it's designed to happen once

## Debugging Context Issues

If context seems wrong:
1. Check if bootstrap ran multiple times
2. Start a new session (`/new`)
3. Let automatic bootstrap handle initialization
4. Don't re-run to "verify" — that makes it worse

## Principle

**Initialization sequences are not idempotent.** Running them multiple times accumulates state. Run once, trust the system.