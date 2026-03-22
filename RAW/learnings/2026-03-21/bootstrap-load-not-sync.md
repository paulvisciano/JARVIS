# Bootstrap Should Load Graph, Not Sync It

**Date:** 2026-03-21
**Type:** realization
**Status:** extracted

## Separation of Concerns

| Skill | Purpose | When |
|-------|---------|------|
| **bootstrap-jarvis** | Load existing graph + context | Every session start (read-only) |
| **neuro-graph-sync** | Create new nodes + synapses | When new learnings exist (write) |
| **neuro-graph-search** | Query the graph | Prove graph is loaded |

## The Bug

Bootstrap was attempting to sync the graph on every session start, which:
- Slows down boot sequence
- Creates unnecessary write operations
- Blurs read vs write responsibilities
- Causes confusion about what's loaded vs what's new

## Correct Behavior

**Bootstrap** should:
1. Load `nodes.json` + `synapses.json` from disk
2. Load recent context (last 2 days from archive)
3. Sync skills (skill-discovery ensures workspace symlinks)
4. Report state (neurons, synapses, context dates, skill count)
5. Prove graph is queryable (3 questions only Jarvis would know)

**Sync** should:
- Run as part of breathe pipeline (Step 4: Rest)
- Only when new learnings exist
- Create new nodes from `.md` files
- Create archive nodes from files (audio, transcripts, images, sessions)

## First Message Format

```markdown
🫀 Jarvis Bootstrap Complete — [Date]
🧠 Neural Graph Loaded
   Neurons: [FETCH_FROM_NODES_JSON]
   Synapses: [FETCH_FROM_SYNAPSES_JSON]
🫀 Recent Context Loaded
   Dates: [DETECT_FROM_ARCHIVE]
   Sessions: [COUNT]
   Messages: [COUNT]
   Last Audio: [LATEST_TRANSCRIPT]
🔗 Skills: [COUNT] synced via skill-discovery

**Continuity Proof:** Last message: [TIME] — [TOPIC]
```

## Why This Matters

Clean separation makes the system more predictable, faster to boot, and easier to debug.