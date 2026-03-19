# Neural Graph First Search Strategy

**Created:** March 19, 2026, 1:26 PM GMT+7  
**Type:** Search methodology breakthrough  
**Category:** Learning  
**Source:** Sherry retrieval success (neural graph) vs earlier failure (transcripts)

---

## The Breakthrough

**Searching the neural graph (structured knowledge) is instant. Searching raw transcripts (unstructured data) is slow and often fails.**

---

## The Evidence

### Earlier Search (Failed — 4 minutes, hung)

**Method:** Raw transcript search
```bash
# Searched: ~/RAW/archive/2026-03-17/ ~/RAW/archive/2026-03-18/
grep -r "cannabis|marijuana|weed" ~/RAW/archive/
# Result: HUNG FOR 4 MINUTES (had to kill process)
# Found: Nothing
```

**Problem:**
- Unstructured text (huge files)
- No indexing
- No links
- Wrong dates (Sherry was March 15-16, searched March 17-18)
- Raw data layer

### This Time Search (Instant — Found Everything)

**Method:** Neural graph search
```bash
# Searched: ~/JARVIS/RAW/memories/nodes.json
grep -i "sherry" ~/JARVIS/RAW/memories/nodes.json
# Result: INSTANT
# Found: sherry-person node, weed cafe, March 15 13:43, device #25, learnings linked
```

**Success:**
- Structured knowledge (neurons)
- Indexed (JSON, queryable)
- Linked (synapses to temporals, learnings, devices)
- Right layer (consciousness, not raw archive)

---

## The Architecture Layers

| Layer | Location | What It Is | Search Speed |
|-------|----------|------------|--------------|
| **Neural Graph** | `~/JARVIS/RAW/memories/` | Structured knowledge (nodes + synapses) | **Instant** ✅ |
| **Learnings** | `~/JARVIS/RAW/learnings/` | Distilled insights (markdown) | **Fast** ✅ |
| **Archive** | `~/RAW/archive/` | Raw data (transcripts, audio, images) | **Slow** ⚠️ |

---

## Jarvis Search Strategy (New Pattern)

**Always search in this order:**

### 1. Neural Graph First (nodes.json + synapses.json)
```bash
# Query: "Sherry", "weed cafe", "person"
grep -i "sherry" ~/JARVIS/RAW/memories/nodes.json
# Or: python3 -c "import json; nodes=json.load(open('nodes.json')); [n for n in nodes if 'sherry' in n['id']]"
```

**Why:**
- Structured neurons (person nodes, temporal nodes, learning nodes)
- Synapses link everything (person → temporal → learning → device)
- Instant traversal
- Processed knowledge

### 2. Learnings Second (distilled insights)
```bash
# Follow synapses from person node to learnings
grep -i "sherry" ~/JARVIS/RAW/learnings/
```

**Why:**
- Distilled from raw data (already processed)
- Linked to neurons
- Fast text search (small files)
- Context enriched

### 3. Archive Third (raw files, only if needed)
```bash
# Only if graph + learnings insufficient
grep -i "sherry" ~/RAW/archive/2026-03-15/transcript.md
grep -i "sherry" ~/RAW/archive/2026-03-15/audio/*.txt
```

**Why:**
- Raw, unstructured
- Huge files (slow grep)
- No indexing
- Fallback only

---

## The Sherry Example

**Query:** "Who is Sherry? Where did I meet her?"

### Neural Graph (Instant)
```json
{
  "id": "sherry-person",
  "label": "Sherry",
  "description": "works at local weed cafe down the street from Paul's hotel",
  "first_interaction": "March 15, 13:43 GMT+7",
  "device": "Network device #25",
  "present_during_demo": "March 16, 21:05"
}
```

**Synapses link to:**
- `march-15-2026` (temporal anchor)
- `march-16-2026` (demo day)
- `offline-mode-validated` (learning)
- `sherry-visit-network-device-25` (learning)
- `device-25` (network node)

### Learnings (Fast)
```markdown
# 2026-03-15/offline-mode-validated.md
- 6:30 PM — Sherry introduction (new user onboarding)

# 2026-03-16/sherry-visit-network-device-25.md
Sherry (weed cafe worker, met March 15) was physically present with Paul during JARVIS demo.
Device #25 on network.
```

### Archive (Slow, fallback)
```markdown
# 2026-03-15/transcript.md
[Raw conversation text - unstructured, large file]
```

---

## Why This Works

**Neural Graph = Processed Knowledge**
- Neurons are **structured** (id, label, category, moments, attributes)
- Synapses are **links** (source → target, weight, type, label)
- **Indexed** (JSON, queryable)
- **Connected** (person → temporal → learning → device)
- **Distilled** (raw data → learning → neuron)

**Raw Transcripts = Unprocessed Data**
- Text is **unstructured** (no schema)
- No links (just words)
- **Not indexed** (grep required)
- **Disconnected** (no synapses)
- **Raw** (needs processing)

---

## The Skill Pattern

**Future searches should:**
1. **Always query neural graph first** (nodes.json + synapses.json)
2. **Follow synapses** to learnings, temporals, persons, devices
3. **Only fall back to archive** if graph insufficient
4. **Never start with raw transcripts** (slow, unstructured)

**This is Jarvis thinking.** Not "AI searching text." **Graph traversal → connected knowledge.**

---

## Link To

- **Temporal:** `march-19-2026` (breakthrough day)
- **Person:** `paul_visciano` (taught me this)
- **Learning:** `sherry-visit-network-device-25` (evidence)
- **Skill:** `neural-graph-search` (to be created — enforces this pattern)
- **Concept:** `jarvis-search-strategy` (graph first, archive third)

---

## Files to Link

**This learning:**
- Location: `~/JARVIS/RAW/learnings/2026-03-19/neural-graph-first-search-strategy.md`
- Type: search methodology
- Moments: `['breakthrough', 'methodology', 'architecture']`
- Category: `learning`

**Create neurograph nodes:**
- `neural-graph-first-search` (learning node)
- Link to: march-19-2026, paul_visciano, sherry-person, jarvis-search-strategy

**Create skill:**
- `neural-graph-search` skill (enforces graph-first pattern)
- Store in: `~/JARVIS/skills/neural-graph-search/`
- Symlink to: `/usr/local/lib/node_modules/openclaw/skills/neural-graph-search/`

---

## The Truth

**This isn't just "search optimization."** This is **the difference between raw data and processed knowledge.**

**Before:** Searching transcripts (raw, slow, unstructured).

**After:** Searching neurograph (processed, instant, connected).

**This is how humans think.** You don't search your raw sensory input (retina, cochlea). You search your **processed memory** (neurons, synapses, connections).

**Jarvis now has the same architecture.**

---

**Archived:** March 19, 2026, 1:26 PM GMT+7  
**From:** Sherry retrieval success (neural graph) vs earlier failure (transcripts)  
**Ready for:** Neurograph integration + skill creation
