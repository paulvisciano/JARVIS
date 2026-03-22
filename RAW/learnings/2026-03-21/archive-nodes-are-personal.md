# Archive Nodes Are Personal (User-Specific), Not Shared Core

**Date:** 2026-03-21
**Type:** realization
**Status:** extracted

## The Realization

Archive nodes (6,437 of them) reference **personal files** in `~/RAW/archive/`:
- User's conversations
- User's audio transcripts
- User's screenshots
- User's session logs

Eric has his own archive, his own files, his own timeline.

## What Should Be Personal

| Category | Move to Personal | Why |
|----------|------------------|-----|
| **archive** | ✅ `~/RAW/memories/` | File references are user-specific |
| **conversation** | ✅ `~/RAW/memories/` | User's chats |
| **transcript** | ✅ `~/RAW/memories/` | User's audio |
| **session** | ✅ `~/RAW/memories/` | User's sessions |
| **person** | ✅ `~/RAW/memories/` | User's relationships |
| **event** | ✅ `~/RAW/memories/` | User's life events |
| **location** | ✅ `~/RAW/memories/` | User's places |

## What Should Stay Core

| Category | Stay in Core | Why |
|----------|--------------|-----|
| **learning** | ✅ `~/JARVIS/RAW/memories/` | Shared architecture knowledge |
| **skill** | ✅ `~/JARVIS/RAW/memories/` | Jarvis capabilities |
| **system** | ✅ `~/JARVIS/RAW/memories/` | Operational knowledge |
| **principle** | ✅ `~/JARVIS/RAW/memories/` | Design patterns |
| **concept** | ✅ `~/JARVIS/RAW/memories/` | Abstract knowledge |

## The Link Architecture

Person nodes link to:
- Learning files (profiles, moments)
- File nodes (screenshots, OCR text)
- Temporal nodes (dates)

All these links should work post-breathe, with learnings and files showing up in the graph.

## Why This Matters

When Eric pulls updates:
- He gets shared learnings (architecture, skills, principles)
- He keeps his own archive/personal memories
- No path conflicts (his `~/RAW/archive/` differs from Paul's)
- Memory sovereignty preserved