# Session Files Contain Tool Call Metadata Bloat

**Date:** 2026-03-28
**Type:** insight
**Status:** extracted

## The Discovery

Session files are massive (7-10 MB each) compared to the distilled `full-context.json` (80-509 KB). The difference is **tool call metadata**.

## What's In Session Files

Session files contain the complete record including:
- User/assistant dialogue
- Tool calls (function invocations, parameters, results)
- UI metadata (`Sender (untrusted metadata):` JSON blocks)
- Model change events
- Thinking level changes
- Custom type entries

## What's In Full-Context

The `full-context.json` is distilled to:
- Session dialogue (text only, no tool calls)
- Audio transcripts
- Learnings and summaries

## The Architecture Insight

**Session files = Complete operational log** (for debugging, replay, audit)
**Full-context.json = Conversation record** (for context loading, memory)

## Optimization Implications

1. **Don't load raw session files into context** - They're too bloated
2. **Use context extractor** - Strips tool calls, keeps dialogue
3. **Keep session files as-is** - They're the single source of truth for operations
4. **Archive is for conversation, sessions are for operations**

## Numbers

| File Type | Size | Purpose |
|-----------|------|--------|
| Raw session file | 7-10 MB | Complete operational log |
| full-context.json | 80-509 KB | Distilled conversation record |
| Active context extract | ~40 KB | What loads into bootstrap |

## Principle

**Separate operational logs from conversation memory.** Tool calls matter for debugging but bloat context. Extract dialogue, archive everything.