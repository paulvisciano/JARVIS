---
name: neurograph-load
description: DEPRECATED — Loading entire neurograph is not feasible at scale (12M+ chars = 3M+ tokens). Use neurograph-search for queries (reads nodes.json directly, no context bloat). Bootstrap-jarvis loads graph metadata on session start (auto).
metadata: { "openclaw": { "emoji": "⚠️", "deprecated": true, "requires": { "bins": ["node"] } } }
---

# Neural Graph Loader — DEPRECATED

## ⚠️ Reality Check (March 23, 2026)

**Graph sizes:**
- JARVIS: 4,937 nodes, 15,930 synapses (~6.9 MB)
- Paul: 8,027 nodes, 423 synapses (~5.6 MB)
- **Combined: ~12.6 MB = ~3.15M tokens** (at 4 chars/token)

**Context windows:**
- Qwen 3.5 Cloud: 200k-256k tokens max
- **3.15M tokens = 12-15x over limit** ❌

## Conclusion

**Loading full graphs into context is NOT feasible.**

## What to Use Instead

✅ **neurograph-search** — Queries nodes.json directly (disk-based, no context bloat)
✅ **neurograph-link** — Traverse memory-links, load specific nodes only
✅ **bootstrap-jarvis** — Loads graph metadata on session start (auto, lightweight)

## When This Skill Might Work

Only for tiny graphs (<500 nodes, <50KB). Current graphs are 100x larger.

**Status:** Deprecated. Use search-based patterns instead.
