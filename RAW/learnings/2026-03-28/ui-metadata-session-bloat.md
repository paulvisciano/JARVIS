# Session Files Bloated by UI Metadata Wrappers

**Date:** 2026-03-28
**Type:** insight
**Status:** extracted

## Discovery

Session files contain massive bloat beyond tool call metadata — **UI metadata wrappers** on user messages are inflating file sizes dramatically.

## The Bloat Pattern

```
Sender (untrusted metadata):
```json
{
  "label": "openclaw-control-ui",
  "id": "openclaw-control-ui"
}
```
```

## Impact

- Top 5 largest messages: **700 KB - 1 MB each**
- Cause: JSON metadata blocks + wrapper text on every UI message
- This is **separate from** tool call metadata bloat

## Distinction

| Bloat Type | Source | Already Captured |
|------------|--------|------------------|
| Tool call metadata | Agent tool executions | ✅ session-file-bloat-analysis.md |
| UI metadata wrappers | Gateway chat interface | ❌ NEW |

## Optimization Opportunity

The context extractor should strip these metadata wrappers when building `full-context.json` — keep the dialogue, discard the UI plumbing.