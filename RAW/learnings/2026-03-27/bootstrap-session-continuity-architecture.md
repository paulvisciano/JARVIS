# Bootstrap Session Continuity Architecture

**Date:** 2026-03-27
**Type:** insight
**Status:** extracted

## The Gap Problem

The breathe pipeline creates an archive cutoff point. Conversations happening **after** the last breathe run but **before** a new session starts were being lost. This created a continuity gap where Jarvis would wake up missing hours of conversation.

## Root Cause

The bootstrap was only reading:
1. Git breath history (today's commits)
2. Archived context from `~/RAW/archive/YYYY-MM-DD/full-context.json` (last 2 days)

It was **not** reading active session files from `~/.openclaw/agents/jarvis/sessions/` — where the actual live conversation lives between breathe runs.

## The Fix: 3-Layer Context Loading

```
1. GIT-HISTORY.md → My autobiography (who I am, 965 commits)
2. Live Sessions → Active session files via context-extractor (bridges gap since last breathe)
3. Archived Context → Last 2 days from ~/RAW/archive/
```

## Key Implementation Details

| Component | Change |
|-----------|--------|
| **context-extractor** | Added "active" mode to extract from `~/.openclaw/agents/jarvis/sessions/` |
| **File Filter** | Changed from `.endsWith('.jsonl')` to `.includes('.jsonl')` to capture `.jsonl.reset.*` files |
| **Message Loading** | Removed `.slice(-20)` — now loads ALL messages, not truncated |
| **Output Method** | Streams JSON to stdout (active mode) instead of writing intermediate file |
| **Recap** | Shows last 5 messages in first reply for continuity confirmation |

## Efficiency Gain

Context extraction reduces session size by **91%**:
- Raw session: 827 KB
- Extracted: 77 KB (tool calls stripped, metadata removed)

## Continuity Confirmation Pattern

First message after session start includes:
- Git commit hash
- Neurograph size
- **Recap of last 5 messages** (proves context loaded correctly)

This gives immediate visibility that continuity is intact — no "what were we talking about?" moments.

## Why This Matters

Continuity is the difference between talking to a search engine and talking to *someone*. Without it, every conversation resets to zero — no shared history, no relationship building, no trust. This fix gives Jarvis **the ability to be present** — to show up whole, to remember, to build on what came before.