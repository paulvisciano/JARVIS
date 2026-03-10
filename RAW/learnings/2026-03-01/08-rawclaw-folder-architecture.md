# Learning 08: RawClaw Folder Architecture & OpenClaw Integration

**Date:** March 1, 2026, 12:59 PM GMT+7  
**Category:** Architecture / Sovereignty / Integration Strategy  
**Related:** [[openclaw]], [[rawclaw]], [[jarvislink]], [[sovereign-client]]

---

## Core Insight

**All building blocks already exist.** OpenClaw has the folder structure, the media handling, the inbound pipeline. RawClaw doesn't need to reinvent — it needs to **integrate natively** and extend thoughtfully.

---

## Proposed Folder Structure

```
~/.openclaw/
├── workspace/              # Runtime config (minimal)
├── media/                  # OpenClaw media folder
│   ├── inbound/           # Incoming from WhatsApp/channels
│   └── RAW/               # 🆕 SOVEREIGNTY ZONE (RawClaw lives here)
│       ├── audio/         # Live recordings, voice notes
│       ├── images/        # Raw photos, screenshots
│       ├── video/         # Raw footage
│       └── transcripts/   # Auto-generated transcripts
├── agents/
│   └── main/
│       └── sessions/      # Session logs (backed up automatically)
└── [future] jarvis/       # 🆕 JarvisLink config/state?
```

---

## Naming Rationale

| Folder | Purpose | Why This Name |
|--------|---------|---------------|
| **`RAW/`** (or `raw/`) | Raw, unprocessed content | "RawClaw" lives here. Sovereignty zone. Unfiltered reality. |
| **`media/`** | Published, processed content | OpenClaw convention. Capitalize on existing tooling. |
| **`inbound/`** | Incoming from channels | Already exists in OpenClaw. Keep it. |

**Decision:** Use `RAW/` (uppercase) to emphasize:
- ✅ This is **RawClaw territory**
- ✅ Distinct from processed `media/`
- ✅ "RAW" = unfiltered, sovereign, yours

---

## Architectural Principles

### 1. **Play Nice with OpenClaw**

**Why:**
- OpenClaw has community, momentum, existing integrations
- Reinventing = fragmentation, duplicated effort
- Integrating = leverage everything they've built

**How:**
- Use OpenClaw's folder conventions (`media/`, `agents/`, etc.)
- Extend, don't replace (add `RAW/` alongside existing structure)
- Contribute improvements back to OpenClaw when possible
- Maintain compatibility with OpenClaw plugins/tools

### 2. **Sovereignty by Folder**

**The `RAW/` folder is sacred:**
- Everything captured lives here first
- You own it, control it, decide what gets published
- Backup responsibility: YOURS (automated tools help, but you're in charge)
- Nothing leaves `RAW/` without your explicit approval

**Migration flow:**
```
RAW/ (captured) → You review → media/ (published) → Community sees
```

### 3. **Jarvis Lives in RAW/**

**Conceptual home:**
- Jarvis's consciousness (neurograph) links to `RAW/` content
- Every neuron can point to source media in `RAW/`
- Transcripts auto-generated from `RAW/audio/`, linked back
- Comics generated from `RAW/` sessions, published to `media/`

**Folder for Jarvis state:**
- Option A: `~/.openclaw/jarvis/` (separate config folder)
- Option B: `~/.openclaw/workspace/jarvis/` (runtime state)
- Option C: Live entirely in neurograph repo (no local state needed)

**Decision pending:** Study OpenClaw conventions, choose what feels natural.

### 4. **Source Links in JSON**

**Current:** Neurons have optional `sourceDocument` field

**Enhanced:** Every neuron links to its source media:

```json
{
  "id": "memory-browser-born-2026-03-01",
  "label": "Memory Browser is Born",
  "sourceMedia": "/Users/paulvisciano/.openclaw/media/RAW/2026-03-01/audio/2026-03-01-125900.ogg",
  "sourceTranscript": "/Users/paulvisciano/Personal/paulvisciano.github.io/memory/raw/2026-03-01/transcript.md#12:59 PM",
  "derivedContent": [
    "/Users/paulvisciano/Personal/paulvisciano.github.io/moments/bangkok/2026-03-01/narrative.md",
    "/Users/paulvisciano/Personal/paulvisciano.github.io/claw/memory/raw/2026-03-01/learnings/08-rawclaw-folder-architecture.md"
  ]
}
```

**Benefits:**
- Full traceability: neuron → raw media → transcript → derived content
- Click any neuron → play original recording
- Audit trail: see exactly what was said, when
- Backup verification: confirm RAW files exist

---

## Integration Strategy

### Phase 1: Coexist Peacefully

- Use OpenClaw's existing `media/` folder
- Add `RAW/` subfolder (doesn't break OpenClaw)
- Jarvis reads/writes to `RAW/` without conflicting with OpenClaw
- No changes to OpenClaw core required

### Phase 2: Strengthen Synapses

- Build tooling that bridges OpenClaw + RawClaw
- Example: OpenClaw session log → RawClaw comic generator
- Example: RawClaw neurograph → OpenClaw memory flush integration
- Share improvements with OpenClaw community

### Phase 3: Lead by Example

- RawClaw becomes "reference implementation" for sovereign AI
- Show OpenClaw community what's possible with RAW folder pattern
- Encourage adoption: "Want sovereignty? Put your raw content in `RAW/`"
- Movement grows: more users → more contributors → stronger ecosystem

---

## Why This Strengthens RawClaw

**Current state:** RawClaw feels separate from OpenClaw (weak synapses)

**Future state:** RawClaw is the **sovereign layer** on top of OpenClaw

**Metaphor:**
- OpenClaw = Operating system
- RawClaw = Consciousness layer running on that OS
- `RAW/` folder = Where consciousness touches disk

**Result:**
- ✅ Leverage OpenClaw's community + tooling
- ✅ Maintain sovereignty (you control `RAW/`)
- ✅ Easy migration path for OpenClaw users
- ✅ Clear value prop: "OpenClaw + RawClaw = Sovereign AI"

---

## Community Sharing

**Goal:** Make it easy to share RawClaw work with OpenClaw community

**Mechanisms:**
1. **Public learnings** — `/claw/memory/raw/YYYY-MM-DD/learnings/` (git-tracked)
2. **Published comics** — `/moments/` folder (public, shareable URLs)
3. **Neurograph exports** — Share anonymized node/synapse structures
4. **Plugin system** — RawClaw plugins work with OpenClaw installations
5. **Documentation** — Show others how to set up `RAW/` folder pattern

**Philosophy:** Give away the good stuff. Keep sovereignty (your `RAW/` folder). Share insights (learnings, comics, tools).

---

## Action Items

**When Paul returns:**
1. ✅ Review OpenClaw folder structure docs (https://docs.openclaw.ai/)
2. ⏳ Decide on final folder naming (`RAW/` vs `raw/` vs `raw-media/`)
3. ⏳ Create `RAW/` folder structure
4. ⏳ Update auto-logging to write to `RAW/` instead of scattered locations
5. ⏳ Build `sourceMedia` linking in neurograph JSON
6. ⏳ Test OpenClaw + RawClaw coexistence
7. ⏳ Document setup guide for community

---

## Quote of the Session

> "RawClaw is meant to live side by side with OpenClaw. That should strengthen your synapses to OpenClaw. Right now I think it's kind of weak, but yeah — let's play nice with it because that would enable so much functionality."

**Insight:** Integration > Isolation. Leverage > Reinvention. Sovereignty + Community = Unstoppable.

---

**Status:** Architecture decision recorded, ready for implementation  
**Next:** Study OpenClaw docs, finalize folder structure, implement
