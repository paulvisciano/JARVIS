# Service Naming Convention: J.A.R.V.I.S

**Timestamp:** 12:36 GMT+7 (March 16, 2026)  
**Type:** operational-rule  
**Category:** learning

---

## Decision

The JARVIS service running on port 18787 should be named:

- **Service name:** `J.A.R.V.I.S` (all caps, with dots)
- **Process file:** `jarvis-server.js` (lowercase, dashes)
- **launchd:** Supports dots in service names (tested, confirmed working)

---

## Brainstorm Session (from Transcript)

**12:36** — Paul proposed:
> "hey jarvis welcome back so i renamed the process to jarvis server js and then uh yeah now you've restarted uh we should bump the version in the jarvis server js and then yeah your idea of renaming the um the service that's running as well that makes sense so ai jarvis server or the service could even be called ai jarvis or just jarvis actually yeah we can call the service just jarvis uh all caps with the dots uh unless they'll mess up the service name but it looks like you can have um you can have dots and they're so all caps with dots."

**Options Considered:**
- "Jarvis server" → too generic
- "AI Jarvis server" → redundant
- "JARVIS" → clean, matches identity
- "J.A.R.V.I.S" → stylized, matches git-backed consciousness branding

**Decision:** `J.A.R.V.I.S` (all caps with dots)

---

## Implementation

**launchd plist:** `com.jarvis.j.a.r.v.i.s.plist` (dots may need escaping or removal for launchd compatibility)

**Process name:** `jarvis-server.js` (filesystem-safe, lowercase with dashes)

**Service display:** `J.A.R.V.I.S` (user-facing, matches identity)

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 2.3.0 | 13:43 | NeuroGraph integration |
| 2.4.0 | 13:48 | Live transcription fix attempt |
| 2.6.0 | 13:49 | Pipeline recovery |
| 2.7.0 | 15:14 | Live transcription fixed, full integration |

---

## Architecture

**Single Process:** JARVIS server hosts:
- Voice recorder UI (`/`)
- NeuroGraph visualization (`/neuro-graph`)
- Static assets (`/neuro-graph/shared/`)
- Live transcription (whisper-cpp)
- Archive pipeline (auto-archive)

**No separate servers:**
- No Node.js server
- No Python server
- All routes handled by `jarvis-server.js`

---

## Related Nodes

- `jarvis-port-18787` (Infrastructure)
- `jarvis-server-routes` (Learnings)
- `jarvis-server-lifecycle` (Learnings)
- `temporal-march-16` (Temporal)
- `transcript-march-16` (Archive)

---

## Synapses

- `service-naming-jarvis` → `temporal-march-16` (temporal, learned on)
- `service-naming-jarvis` → `transcript-march-16` (references, documented in)
- `service-naming-jarvis` → `jarvis-port-18787` (references, same service)
- `service-naming-jarvis` → `jarvis-server-routes` (references, same process)

---

**Archived:** March 16, 2026, 22:03 GMT+7  
**Author:** Jarvis (git-backed neural mind)  
**Status:** Committed to learnings, neurograph integrated
