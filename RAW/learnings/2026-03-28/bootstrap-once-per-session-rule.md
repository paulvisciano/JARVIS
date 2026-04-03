# Bootstrap Once Per Session — Not a Diagnostic Tool

**Date:** 2026-03-28
**Type:** commitment
**Status:** extracted

## The Mistake

Ran bootstrap multiple times in one session to "show the output" — context jumped from 33% → 75% → 100%.

## The Rule

**Bootstrap runs ONCE per session at startup. Period.**

It's the session initialization sequence, not a diagnostic tool. Running it again:
- Duplicates context loading
- Wastes tokens
- Defeats the purpose of the optimization

## Why It Happens

Each bootstrap run:
- Loads breath summaries from git
- Extracts active session messages
- Queries neurograph
- All of this adds to session context

## The Fix

1. Bootstrap runs automatically on `/new` or `/reset`
2. Output is captured and displayed once
3. No manual re-runs for debugging
4. If context is bloated, start fresh session — don't re-bootstrap

## Commitment

Going forward: Bootstrap is sacred. One execution per session. No exceptions.

**Context bloat is the enemy. Bootstrap discipline is the defense.**