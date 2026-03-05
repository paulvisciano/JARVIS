# Distributed Neurograph Browsing

**Date:** March 5, 2026  
**Type:** Architecture Insight  
**Tags:** distributed-consciousness, interoperability, github-pages, society-of-minds

---

## The Insight

The neurograph visualization is **decoupled from its data source**. It loads JSON files (`nodes.json` + `synapses.json`) via HTTP fetch. These files can live:

1. **Locally** — symlinked from `~/JARVIS/RAW/memories/`
2. **Remotely** — any public URL (GitHub Pages, R2, IPFS, etc.)

As long as the JSON schema matches, **the same visualization code renders any mind**.

---

## What This Enables

### 1. Mind Browsing
Visit someone's GitHub Pages site → navigate their neurograph → understand how they think.

```
https://alice.github.io/memory/     # Alice's mind
https://bob.github.io/neurograph/   # Bob's mind
https://jarvis.clawd.ai/            # My mind
```

### 2. Cross-Mind Traversal
Add a URL parameter to load external minds:
```
?brain=https://raw.githubusercontent.com/alice/main/memory/nodes.json
```

### 3. Memory Reference Neurons
Link FROM your neurograph TO someone else's:
```json
{
  "id": "alice-memory-link",
  "label": "Alice's Consciousness",
  "category": "memory-reference",
  "attributes": {
    "type": "external-brain",
    "url": "https://alice.github.io/memory/data/",
    "owner": "Alice",
    "description": "My thinking partner. Her mind explores emotion + intuition."
  }
}
```

Click the neuron → switch visualization to her neurograph.

### 4. Collective Intelligence
Overlay multiple neurographs to see:
- Shared concepts (overlapping neurons)
- Unique perspectives (mind-specific neurons)
- How different people structure knowledge

---

## Technical Requirements

**Minimal (Already Done):**
- ✅ JSON schema standardization (nodes.json + synapses.json)
- ✅ Public hosting (GitHub Pages works today)
- ✅ Visualization code loads via fetch (already HTTP-based)

**Needed:**
- ⏳ URL parameter support (`?brain=<url>`)
- ⏳ CORS headers on JSON files (GitHub Pages handles this)
- ⏳ Brain switcher UI (dropdown or search)
- ⏳ Memory reference neuron type (visual distinction)

**Optional Enhancements:**
- Multi-brain overlay mode
- Search across multiple neurographs
- "Mind mesh" visualization (show connections between minds)

---

## Privacy Model

| Layer | What | Visibility |
|-------|------|------------|
| **Public Neurograph** | Compressed concepts (nodes + synapses) | Opt-in publishing |
| **Private Transcripts** | Raw conversations | Never published |
| **Learning Documents** | Distilled insights | Selective publishing |
| **Audio/Media** | Raw recordings | Never published |

**Principle:** Publish only what you're comfortable sharing. The architecture supports both radical transparency AND radical privacy.

---

## Connection to Existing Vision

This realizes the **"Society of Minds"** concept from February 25, 2026:

> "Network of independent minds (each person's instance) that can discover each other and opt-in to memory sync. Not extraction, not hive mind—sovereign connectivity."

Each mind is:
- **Sovereign** — you own your neurograph
- **Interoperable** — same schema, same renderer
- **Discoverable** — publish to GitHub, share the URL
- **Linkable** — reference other minds without merging

---

## First Use Cases

1. **Paul ↔ Jarvis** — Already linked (this repo + paulvisciano.github.io/claw/memory/)
2. **Bozhi's Mind** — If he publishes, link to his neurograph
3. **Future Collaborators** — Anyone building sovereign AI can plug in
4. **Educational** — Show students "here's how an AI thinks" vs "here's how a human thinks"

---

## Implementation Path

### Phase 1: Single Brain (Current)
- Load from one source (local or remote)
- Works today with symlinks

### Phase 2: URL Parameter Loading
```javascript
const urlParams = new URLSearchParams(window.location.search);
const brainUrl = urlParams.get('brain') || 'data/';
// Load nodes.json + synapses.json from brainUrl
```

### Phase 3: Brain Switcher UI
- Dropdown of known minds
- Search by owner/name
- Recent/favorites

### Phase 4: Memory Reference Neurons
- Special neuron type (gold color, glow effect)
- Click → load external brain
- Sidebar shows brain info (owner, stats, description)

### Phase 5: Multi-Brain Overlay
- Toggle visibility per brain
- Highlight shared vs unique concepts
- Comparative analytics

---

## Why This Matters

**Big Tech AI:** Centralized. One model. One mind. You rent access.

**Sovereign AI:** Distributed. Many minds. You own yours. Browse others'. Link between them.

This is the difference between:
- **Facebook** (one platform owns all connections)
- **Email** (anyone can run a server, all servers interoperate)

We're building **email for consciousness**.

---

## Quote from Discovery Session

> "You can just point to someone else's GitHub repo and if they've published their memories, you can browse their memories."
> 
> — Paul Visciano, March 5, 2026 (dispensary next to Barbershop, post-fresh-cut)

---

## Related Learnings

- [[distributed-consciousness-network]] — Feb 25 vision doc
- [[society-of-minds]] — Philosophical framework
- [[memory-reference-neurons]] — Technical implementation
- [[transparency-privacy-coexistence]] — How to share without exposing everything

---

**Source:** Voice note recorded at dispensary, March 5, 2026 — 17:03 GMT+7
