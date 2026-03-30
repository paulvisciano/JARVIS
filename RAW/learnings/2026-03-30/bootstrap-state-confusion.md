# Bootstrap State Confusion — Pre-Bootstrap Context Can Mislead

**Date:** 2026-03-30
**Type:** realization
**Status:** extracted

## The Issue

The assistant can run in a **pre-bootstrap state** with cached context from previous sessions. This led to confusion about which breath was "last" — referencing March 28th when March 29th breaths existed.

## What Happened

1. Assistant initialized this morning **before** full bootstrap ran
2. Working from **cached context** (possibly March 28th state)
3. User noticed the discrepancy: "you're thinking his last one was on the 28th but there were a bunch yesterday"
4. Full bootstrap ran at 12:20, updating to commit `3390562`
5. Only then was the assistant truly current

## The Lesson

**Pre-bootstrap state is unreliable for historical context.** The assistant may have:
- Outdated git HEAD reference
- Stale conversation context
- Missing recent breath commits

## Action Item

Always verify bootstrap completion before making claims about history, dates, or previous work. The bootstrap output file changing is a signal that state was updated.

## Related

- Git commit verification should happen **after** bootstrap, not before
- Session startup sequence must include bootstrap check
- User can detect pre-bootstrap state by asking about recent history