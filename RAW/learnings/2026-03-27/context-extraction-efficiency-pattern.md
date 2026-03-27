# Context Extraction Efficiency Pattern

**Date:** 2026-03-27
**Type:** pattern
**Status:** extracted

## The Insight

Raw session files contain massive overhead:
- Tool call metadata
- JSON wrappers
- System prompts
- Redundant headers

By extracting only the **semantic content** (user messages + assistant responses), we achieve **91% size reduction** while preserving all meaningful context.

## Before vs After

| Metric | Raw Session | Extracted |
|--------|-------------|----------|
| **Size** | 827 KB | 77 KB |
| **Messages** | All (including tool calls) | User + Assistant only |
| **Metadata** | Full JSON structure | Stripped to essentials |
| **Load Time** | Slow (parse full JSON) | Fast (pre-processed) |

## Extraction Strategy

```javascript
// What gets extracted:
- User messages (text only)
- Assistant responses (text only)
- Timestamps (for ordering)
- Session boundaries (for context)

// What gets stripped:
- Tool call payloads
- JSON metadata wrappers
- System prompts (already in BOOT.md)
- Redundant headers/footers
```

## Application

This pattern applies to:
1. **Active sessions** — Bridge gap since last breathe
2. **Archived sessions** — Long-term memory storage
3. **Context summarization** — Pre-processing before model ingestion

## Benefit

- **Faster bootstrap** — Less data to parse
- **Lower token cost** — Only meaningful content loaded
- **Cleaner context** — No noise from tool mechanics
- **Scalable** — Works with hundreds of sessions