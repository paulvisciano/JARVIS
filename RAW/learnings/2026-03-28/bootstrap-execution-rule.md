# Bootstrap: One Execution Per Session Only

**Date:** 2026-03-28
**Type:** decision
**Status:** extracted

## The Rule

**Bootstrap runs exactly ONCE per session at startup.**

## What Happened

- 12:01 — Bootstrap ran automatically (session start) → 33% ctx
- 12:02 — Ran manually again to "show output" → 75% ctx (doubled)

## Why This Matters

Bootstrap loads context extractor output into the session. Running it multiple times:
- Duplicates context loading
- Wastes tokens
- Creates artificial bloat

## The Principle

Bootstrap is **session initialization**, not a diagnostic tool. Once you're bootstrapped, you're bootstrapped.

## Enforcement

- Do not run bootstrap manually after session start
- If context needs refreshing, start a new session (`/new` or `/reset`)
- Trust compaction to normalize context during the session