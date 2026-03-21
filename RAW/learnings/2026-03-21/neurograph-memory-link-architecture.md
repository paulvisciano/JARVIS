# NeuroGraph Memory Link Architecture — Person→Learning→Files→Temporal

**Date:** March 21, 2026  
**Type:** Architecture design  
**Status:** ✅ Core pipeline working, enhancement roadmap defined

## Post-Breath Graph Structure

**Node types and connections:**

| Node Type | Links To | Purpose |
|-----------|----------|---------|
| **Person** | Learnings, Files, Temporal | Who you met |
| **Learning** | Person, Temporal, Files | What you learned |
| **File** | Person, Learning, Temporal | Evidence (OCR, transcripts) |
| **Temporal** | Persons, Learnings, Files | When it happened |

## Example: Bruce Person Node

```
bruce-amsterdam-cafe-owner
├── → Learning: bruce-amsterdam-cafe-owner-profile.md (March 20)
├── → Learning: bruce-meeting-march-21.md (if learn more March 21)
├── → File: Screenshot 2026-03-21 at 1.37.57 PM.png (OCR extracted)
├── → File: Screenshot 2026-03-21 at 1.38.09 PM.png (OCR extracted)
├── → File: convo-jarvis-2026-03-20-220111.wav.txt (transcript)
└── → Temporal: temporal-20260320 (March 20, 2026)
    └── → Temporal: temporal-20260321 (March 21, 2021 — if learn more)
```

## Synapse Types

| Connection | Type | Weight |
|------------|------|--------|
| Person → Learning | "learned-on" | 100 |
| Learning → Temporal | "fired-on" | 100 |
| Learning → Files | "evidenced-by" | 95 |
| Files → Temporal | "created-on" | 100 |
| Person → Files | "depicts" | 90 |

## Multi-Day Learning Pattern

**Day 1 (March 20):** Meet Bruce
- Learning: bruce-amsterdam-cafe-owner-profile.md
- Temporal: temporal-20260320
- Files: Spanish conversation screenshot + transcript

**Day 2 (March 21):** Learn more about Bruce
- **New learning:** bruce-cafe-ownership-details.md
- **New temporal:** temporal-20260321
- **New files:** Today's screenshots
- **Same person node:** bruce-amsterdam-cafe-owner (accumulates learnings across days)

## What Breathe Creates

**After running:**
1. Archive files → Screenshots, audio, transcripts in `$RAW_ARCHIVE`
2. Extract context → `full-context.json` with OCR text
3. Create learnings → `.md` files in `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/`
4. Digest NeuroGraph → Create/update nodes + synapses linking all together

## Current State

**Implemented:**
- ✅ Temporal nodes for each date
- ✅ Learning nodes from .md files
- ✅ Learning → Temporal synapses (fired-on)

**Next iteration:**
- ⏳ Link existing person nodes → new learnings
- ⏳ Link files (screenshots, OCR, transcripts) → temporal nodes
- ⏳ Link person nodes → files (depicts relationship)

---
**Evidence:** nodes.json (6,695 nodes), synapses.json (13,417 synapses), Bruce profile  
**Source:** March 21, 2026 architecture design session
