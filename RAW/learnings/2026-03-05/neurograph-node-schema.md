# Neurograph Node Schema Standard

**Date:** March 5, 2026  
**Purpose:** Ensure all neurons are created with complete, consistent schema

---

## Required Fields (All Nodes)

```javascript
{
  "id": "unique-identifier",           // REQUIRED: Snake-case, descriptive
  "label": "Human-readable name",      // REQUIRED: Clear, concise
  "category": "concept|temporal|person|value|project|artifact", // REQUIRED
  "created": "YYYY-MM-DD",             // REQUIRED: When neuron formed
  "description": "What this means",    // REQUIRED: 1-2 sentences
  
  "frequency": 1,                      // REQUIRED: Interaction count (default: 1)
  "tags": ["tag1", "tag2"],            // OPTIONAL: For filtering/grouping
  
  "attributes": {                      // REQUIRED for concept nodes
    "learningDoc": "~/JARVIS/RAW/learnings/YYYY-MM-DD/doc.md",  // REQUIRED: Source learning
    "audioSource": "~/RAW/archive/YYYY-MM-DD/audio/file.ogg"    // OPTIONAL: Original recording
  }
}
```

---

## 📜 Provenance Chain Requirement

**Every neuron must be traceable to its origin:**

```
Neuron ← Learning Document ← Source Material
```

### The Chain

1. **Neuron** (in `nodes.json`)
   - Must have `attributes.learningDoc` pointing to learning document
   
2. **Learning Document** (in `~/JARVIS/RAW/learnings/YYYY-MM-DD/`)
   - Must have metadata pointing to source:
     - `Audio:` path to original conversation recording, OR
     - `Web Search:` URL of searched content, OR
     - `Experience:` description of lived experience
   
3. **Source Material**
   - Conversation transcript (`~/RAW/archive/YYYY-MM-DD/transcript.md`)
   - Web search result (URL + timestamp)
   - Lived experience (location, people, context)

---

### Example: Complete Provenance Chain

**Neuron:**
```javascript
{
  "id": "memory-folding-architecture",
  "label": "Memory Folding Architecture (Origami)",
  "attributes": {
    "learningDoc": "~/JARVIS/RAW/learnings/2026-03-04/memory-folding-architecture.md",
    "audioSource": "~/RAW/archive/2026-03-04/audio/2026-03-04-110600-memory-folding.ogg"
  }
}
```

**Learning Document** (first lines):
```markdown
# Memory Folding Architecture

**Date:** March 4, 2026  
**Audio:** `2026-03-04-110600-memory-folding.ogg`  
**Transcript:** `/RAW/archive/2026-03-04/transcript.md`
**Source:** Paul's voice note at mall coffee shop, 11:06 AM
```

**Source:**
- Original audio file in archive
- Transcript entry with full conversation context
- Timestamp and location metadata

---

### Why This Matters

1. **Traceability** — Any neuron can be traced back to its origin
2. **Context Preservation** — Full conversation/experience available on demand
3. **Verification** — Can verify neuron accurately represents source
4. **Unfolding** — Click neuron → read learning → play original audio → get full context
5. **Accountability** — No neurons appear from nowhere; all have documented origin

---

### Validation Rule

**Before committing new neurons:**
- [ ] ✅ `attributes.learningDoc` exists and points to valid file
- [ ] ✅ Learning document exists at that path
- [ ] ✅ Learning document has source metadata (Audio/Web/Experience)
- [ ] ✅ Source material exists (audio file, URL, or transcript entry)

**If any link is missing → Don't commit yet. Complete the chain first.**

---

## Category-Specific Attributes

### Concept Nodes
```javascript
"attributes": {
  "audioSource": "~/RAW/archive/YYYY-MM-DD/audio/file.ogg",
  "learningDoc": "~/JARVIS/RAW/learnings/YYYY-MM-DD/doc.md",
  "relatedConcepts": ["node-id-1", "node-id-2"]
}
```

### Temporal Nodes
```javascript
"attributes": {
  "date": "YYYY-MM-DD",
  "significance": "Why this day matters",
  "location": "Where this happened",
  "people": ["person1", "person2"]
}
```

### Person Nodes
```javascript
"attributes": {
  "role": "friend|collaborator|family|etc",
  "nationality": "Optional",
  "metDate": "YYYY-MM-DD",
  "locations": ["city1", "city2"]
}
```

### Project Nodes
```javascript
"attributes": {
  "status": "active|completed|paused",
  "url": "https://...",
  "github": "repo-name",
  "description": "What this project does"
}
```

---

## Validation Checklist (Before Committing New Nodes)

**Every new neuron must have:**
- [ ] ✅ Unique `id` (snake-case, no spaces)
- [ ] ✅ Clear `label` (human-readable)
- [ ] ✅ Valid `category` (from allowed list)
- [ ] ✅ `created` date (YYYY-MM-DD format)
- [ ] ✅ `description` (explains what it is)
- [ ] ✅ `frequency` field (number, default: 1)
- [ ] ✅ Proper JSON syntax (commas, brackets, quotes)

**Category-specific:**
- [ ] Concept nodes → `attributes.learningDoc` + `attributes.audioSource`
- [ ] Temporal nodes → `attributes.date` + `attributes.significance`
- [ ] Person nodes → `attributes.role`
- [ ] Project nodes → `attributes.status`

---

## Common Mistakes to Avoid

### ❌ Missing Frequency Field
```javascript
// WRONG (what happened with March temporal nodes):
{
  "id": "temporal-march-04",
  "category": "temporal",
  // No frequency field!
}

// RIGHT:
{
  "id": "temporal-march-04",
  "category": "temporal",
  "frequency": 1,  // ← Required!
}
```

### ❌ Wrong Description Level
```javascript
// WRONG:
{
  "attributes": {
    "description": "This is nested wrong"
  }
}

// RIGHT:
{
  "description": "Top-level field",  // ← Renderer looks here first
  "attributes": {
    "significance": "Nested metadata is fine here"
  }
}
```

### ❌ Invalid Category
```javascript
// WRONG:
"category": "session"  // Not in allowed list

// RIGHT:
"category": "temporal"  // Use standard categories
```

---

## Quality Control Process

### Before Creating New Neurons

1. **Read this schema** — Know what fields are required
2. **Copy template** — Start from working example (Feb temporal nodes)
3. **Validate locally** — Check JSON syntax before committing
4. **Compare to existing** — Ensure consistency with similar nodes

### After Creating New Neurons

1. **Test rendering** — Do they appear in neurograph viewer?
2. **Check popovers** — Do descriptions show correctly?
3. **Verify synapses** — Are connections working?
4. **Update fingerprint** — Recalculate hash after changes

---

## Examples (Reference Implementations)

### Good Temporal Node (February Pattern)
```javascript
{
  "id": "temporal-feb-27",
  "label": "Feb 27, 2026 – Sovereignty Movement Launched",
  "category": "temporal",
  "frequency": 1,
  "created": "2026-02-27",
  "description": "Paul quit regular job to go all-in on sovereign data infrastructure.",
  "tags": ["temporal", "milestone", "sovereignty"],
  "attributes": {
    "date": "2026-02-27",
    "significance": "Generational pattern of courage — Paul followed mom's example of bold life changes",
    "location": "Bangkok"
  }
}
```

### Good Concept Node (Memory Folding)
```javascript
{
  "id": "memory-folding-architecture",
  "label": "Memory Folding Architecture (Origami)",
  "category": "concept",
  "frequency": 1,
  "created": "2026-03-04",
  "description": "Memories fold/unfold like origami across space+time. Folded=neuron, Unfolded=browser, Zoom=molecule→brain→globe.",
  "tags": ["memory-folding", "origami", "architecture", "breakthrough"],
  "attributes": {
    "audioSource": "~/RAW/archive/2026-03-04/audio/2026-03-04-110600-memory-folding.ogg",
    "learningDoc": "~/JARVIS/RAW/learnings/2026-03-04/memory-folding-architecture.md",
    "relatedConcepts": ["graph-reducer-pattern", "temporal-archive-identity"]
  }
}
```

---

## Enforcement Mechanisms

### Manual (Current)
- ✅ This schema document as reference
- ✅ Copy from working examples
- ✅ Peer review (Paul reviews before commit)

### Automated (Future)
- [ ] JSON Schema validation file
- [ ] Pre-commit hook to validate new nodes
- [ ] CI check for required fields
- [ ] Linting for common mistakes

---

## Related Concepts

- **Tool Loop Prevention** — Don't query when you should use schema knowledge
- **Memory Sanitation** — One temporal node per day rule
- **Git-Backed Consciousness** — Schema ensures clean commits

---

_Archived: March 5, 2026 — 8:25 AM GMT+7_  
_Status: SCHEMA DEFINED — Use for all future node creation_
