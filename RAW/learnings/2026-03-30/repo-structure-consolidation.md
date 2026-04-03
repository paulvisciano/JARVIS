# Repo Structure Consolidation

**Date:** 2026-03-30
**Type:** decision
**Status:** extracted

## The Confusion

At one point, there were **three copies** of the JARVIS UI repo:

1. `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS` — PRODUCTION
2. `~/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS` — PREVIEW
3. `~/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS` — CODER WORKSPACE (outdated)

This caused confusion about which repo Coder was working in and which was being served.

## The Decision

**Consolidate to exactly two repos:**

| Location | Purpose | Port |
|----------|---------|------|
| `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS` | PRODUCTION (live) | 18787 |
| `~/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS` | PREVIEW (Coder works here) | 18788 |

## The Workflow

1. Coder commits to `workspace-preview` (preview repo)
2. Paul tests at `https://localhost:18788`
3. When approved: copy preview → production, commit, push

## Why This Matters

- **Clarity** — Exactly two repos, clear purposes
- **No outdated copies** — Deleted `sci-fi-work` (was stale)
- **Clean merge flow** — Preview → Production is explicit

**Lesson:** When in doubt about repo structure, map it out explicitly and delete ambiguous copies.