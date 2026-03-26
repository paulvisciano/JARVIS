# Agent Context Bloat — 5M+ Tokens Kills Responsiveness

**Date:** 2026-03-26
**Type:** pattern
**Status:** extracted

## The Problem

The `jarvis-coder` agent accumulated 5M+ tokens in its session context. Symptoms:
- Timeouts on every message (even simple "are you there" checks)
- No responses despite messages being sent
- Gateway errors: "session file locked"
- Rate limit errors (429) compounding the issue

## Root Cause

OpenClaw's auto-compaction runs at session limits, but:
1. Compaction doesn't clear the working context fast enough
2. Long-running coding sessions accumulate tool outputs, file reads, browser screenshots
3. Each iteration adds ~100K+ tokens
4. Eventually the agent becomes unresponsive

## Solution Pattern

1. **Monitor token count** — Check before each major task
2. **Fresh session for new work** — Don't revive bloated sessions
3. **Commit before context dies** — Save work incrementally
4. **Spawn fresh agent** — When unresponsive, don't ping — replace

## Principle

**A bloated agent context is like a cluttered workspace — eventually you can't find anything or get anything done. Fresh starts are faster than cleanup.**