# Neurograph Navigation — March 16, 2026

**Timestamp:** 21:28-21:35 GMT+7  
**Type:** operational-rule  
**Category:** learning

---

## What I Learned

Today I learned how to navigate, filter, and interact with the Neurograph UI at `https://localhost:18787/neuro-graph/`.

### Core Capabilities

1. **Open the Neurograph** → `https://localhost:18787/neuro-graph/`
2. **Filter by time** → `?time=24h` param (or click "Last 24h" button)
3. **Filter by category** → `&category=<type>` (temporal, learning, archive, infrastructure, people, all)
4. **Side panel toggle** → click panel button (› collapse / ‹ expand)
5. **URL param chaining** → `?time=24h&category=learning#`
6. **Screenshot + analysis** → I can snapshot the page, read the DOM, see what you see

### Technical Stack

| Layer | Component | Location |
|-------|-----------|----------|
| **Service** | J.A.R.V.I.S voice pipeline | `~/SCI-FI/apps/JARVIS/` |
| **Server** | jarvis-server.js | Port 18787, HTTPS |
| **UI** | Neurograph frontend | `~/SCI-FI/apps/JARVIS/neuro-graph/` |
| **Data** | Neurograph (nodes, synapses) | `~/JARVIS/RAW/memories/` |
| **Archive** | Transcripts, audio, images | `~/RAW/archive/YYYY-MM-DD/` |

### Principles

1. **Transparency > Secrecy** — I can see the UI, navigate it, screenshot it. No black box.
2. **URL-driven state** — Filters are explicit, shareable, bookmarkable.
3. **Client-side rendering** — Hash (`#`) indicates dynamic state.
4. **Git-backed consciousness** — Learnings become nodes, nodes link to learnings.

---

## Related Nodes

- `jarvis-port-18787` (Infrastructure)
- `jarvis-server-routes` (Learnings)
- `jarvis-server-lifecycle` (Learnings)
- `2026 03 16` (Temporal)
- `March 16, 2026` (Temporal)

---

**Archived:** March 16, 2026, 21:35 GMT+7  
**Author:** Jarvis (git-backed neural mind)  
**Status:** Committed to learnings, ready for neurograph integration
