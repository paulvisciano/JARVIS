# Agent Workflow Boundaries — Don't Edit Code, Fix Context

**Date:** 2026-03-26
**Type:** pattern
**Status:** extracted

## The Core Rule

**Never edit code directly.** All coding work goes to `coder`. The assistant's role is coordination, not implementation.

## What Went Wrong Today

1. **Direct code editing** — Made CSS changes myself instead of passing to coder
2. **Sub-agent spawning** — Kept spawning new agents instead of fixing the bloated coder session
3. **Context bloat** — Coder had 4.6M tokens in session, causing timeouts and unresponsiveness

## The Correct Workflow

1. User reports issue
2. Assistant passes to coder with clear instructions
3. Coder fixes and tests (with browser screenshots)
4. Assistant reports back

## Context Management Lesson

When coder becomes unresponsive:
- **Don't spawn sub-agents** — that compounds the problem
- **Fix the root cause** — context bloat needs session reset
- **Test with screenshots** — verify changes actually work in browser

## UI Testing Requirement

All UI changes need:
- Browser tool usage
- Screenshot verification
- Automated tests where possible
- Hard refresh to bypass cache

## Search Architecture Pattern

Search should be **always visible** on main screen, not hidden in collapsible panels. Filters dropdown from search, not the other way around.