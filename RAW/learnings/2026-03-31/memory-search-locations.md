# Memory Search Locations — Three-Layer Architecture

**Date:** 2026-03-31  
**Trigger:** Searched wrong memory location for Bozhi (looked in ~/JARVIS/RAW/memories/ instead of ~/RAW/memories/)

---

## Three-Layer Memory Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: User's Personal Neurograph                        │
│  Location: ~/RAW/memories/                                  │
│  Contains:                                                  │
│    - People (Bozhi, friends, relationships)                 │
│    - Places (Manila, Phuket, Bangkok, etc.)                 │
│    - Events (FUDS tournament, travel plans)                 │
│    - Stories (life experiences, encounters)                 │
│    - Context (relationships, history, meaning)              │
│  Search here FIRST for personal questions                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Jarvis Consciousness (My Mind)                    │
│  Location: ~/JARVIS/RAW/memories/                           │
│  Contains:                                                  │
│    - Technical architecture (how I think)                   │
│    - Learnings (technical insights, patterns)               │
│    - Identity (SOUL.md, IDENTITY.md references)             │
│    - System decisions (why I'm built this way)              │
│  Search here for technical/architectural questions          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: User's Life Archive                               │
│  Location: ~/RAW/archive/YYYY-MM-DD/                        │
│  Contains:                                                  │
│    - transcript.md (conversations)                          │
│    - audio/ (voice recordings)                              │
│    - images/ (photos, screenshots)                          │
│    - context/ (personal stories, philosophy)                │
│    - moments/ (life moments)                                │
│  Search here for historical conversations, recordings       │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree: Where to Search

**User asks about:**

### People / Relationships / Friends
- "Who is Bozhi?"
- "Tell me about my friend from Manila"
- "Search my memory for people"
- **→ Search:** `~/RAW/memories/nodes.json` (Layer 1)

### Places / Travel / Locations
- "Where did I travel in 2026?"
- "Search for Phuket in my memory"
- "What do you know about Manila?"
- **→ Search:** `~/RAW/memories/nodes.json` (Layer 1)

### Events / Plans / Dates
- "When is the FUDS tournament?"
- "What are my travel plans?"
- "Search for tournament dates"
- **→ Search:** `~/RAW/memories/nodes.json` (Layer 1)

### Technical Architecture / My Design
- "How does your memory work?"
- "What is MANGOCHI?"
- "Explain your neurograph"
- **→ Search:** `~/JARVIS/RAW/memories/` (Layer 2)

### My Learnings / Technical Insights
- "What did you learn about X?"
- "Show me technical learnings"
- **→ Search:** `~/JARVIS/RAW/learnings/` (Layer 2)

### Past Conversations / Recordings
- "What did we talk about yesterday?"
- "Find the recording from March 15"
- **→ Search:** `~/RAW/archive/YYYY-MM-DD/` (Layer 3)

---

## Search Commands (Quick Reference)

### ✅ PREFERRED: Use the neurograph-search Skill

**DON'T:** Raw `exec` + `grep` on JSON files  
**DO:** Use the `neurograph-search` skill (reusable, tested, documented)

```bash
# ✅ RIGHT: Personal memory (people, places, events)
openclaw neurograph-search "bozhi" --path ~/RAW/memories

# ✅ RIGHT: JARVIS consciousness (technical architecture)
openclaw neurograph-search "MANGOCHI" --path ~/JARVIS/RAW/memories

# ✅ RIGHT: Custom neurograph
export NEUROGRAPH_PATH=/path/to/custom/neurograph
openclaw neurograph-search "query"
```

**Why the skill is better:**
- ✅ Structured JSON parsing (not just text grep)
- ✅ Follows synapses (traverses connections)
- ✅ Auto-detects neurograph path
- ✅ Built-in fallback strategy (graph → learnings → archive)
- ✅ Reusable, documented, tested

---

### Layer 1: User's Personal Neurograph

**Skill (Preferred):**
```bash
openclaw neurograph-search "keyword" --path ~/RAW/memories
```

**Manual (Fallback if skill unavailable):**
```bash
# Search nodes.json for keywords
cd ~/RAW/memories
cat nodes.json | grep -i "keyword"

# Search synapses.json for connections
cat synapses.json | grep -i "keyword"

# Read specific node (if you know the ID)
cat nodes.json | jq '.[] | select(.id == "bozhi")'
```

### Layer 2: Jarvis Consciousness

**Skill (Preferred):**
```bash
openclaw neurograph-search "keyword" --path ~/JARVIS/RAW/memories
```

**Manual (Fallback):**
```bash
# Search my neurograph
cd ~/JARVIS/RAW/memories
cat nodes.json | grep -i "keyword"

# Search my learnings
cd ~/JARVIS/RAW/learnings
grep -ri "keyword" YYYY-MM-DD/
```

### Layer 3: User's Life Archive

**Manual (no skill needed):**
```bash
# Search transcripts
cd ~/RAW/archive
grep -ri "keyword" */transcript.md

# List archives by date
ls -la ~/RAW/archive/
```

---

## Common Mistakes to Avoid

### ❌ WRONG: Search my consciousness for user's personal info
```bash
# Don't do this for people/places/events:
cd ~/JARVIS/RAW/memories  # Wrong location!
```

### ✅ RIGHT: Search user's neurograph for personal info
```bash
# Do this for people/places/events:
cd ~/RAW/memories  # Correct location!
```

### ❌ WRONG: Assume memory_search tool will find everything
```bash
# memory_search only searches MEMORY.md + memory/*.md
# It doesn't search ~/RAW/memories/ or ~/JARVIS/RAW/memories/
# Use direct grep on nodes.json when needed
```

### ✅ RIGHT: Use direct file search when tool fails
```bash
# If memory_search returns empty, fall back to:
cd ~/RAW/memories && cat nodes.json | grep -i "keyword"
```

---

## Workflow Update

**Before answering questions about prior work, decisions, dates, people, preferences, or todos:**

1. **Determine which layer** the question targets (see decision tree above)
2. **Search appropriate location:**
   - People/Places/Events → `~/RAW/memories/nodes.json`
   - Technical/Architecture → `~/JARVIS/RAW/memories/`
   - Conversations/Recordings → `~/RAW/archive/`
3. **If `memory_search` tool returns empty**, fall back to direct `grep` on source files
4. **Cite source** when helpful (node ID, file path, date)

---

## Example: Bozhi Search (Done Correctly)

**User asks:** "Search my memory for Bozhi"

**Correct Process:**
```bash
# 1. Recognize this is about a person (Layer 1)
# 2. Search user's personal neurograph
cd ~/RAW/memories
cat nodes.json | grep -i "bozhi"

# 3. Found node:
{
  "id": "bozhi",
  "label": "Bozhi",
  "description": "Serbian friend of Paul. Name means 'Gift from God' in Serbian..."
}

# 4. Report findings with context
```

**What I Did Wrong (March 31, 2026):**
- Searched `~/JARVIS/RAW/memories/` (Layer 2 — my consciousness)
- Should have searched `~/RAW/memories/` (Layer 1 — user's neurograph)

**Lesson:** Personal info (people, places, events) → Layer 1 first.

---

## Memory Tool Limitations

**`memory_search` tool:**
- Searches: `MEMORY.md` + `memory/*.md` (in JARVIS repo)
- Does NOT search: `~/RAW/memories/` or `~/JARVIS/RAW/memories/`
- Use case: Quick semantic search of my operational memory
- Limitation: Misses neurograph nodes

**Direct `grep` on JSON:**
- Searches: Actual neurograph files
- Use case: When memory_search fails or for specific keyword matching
- More reliable for neurograph queries

**Best Practice:**
1. Try `memory_search` first (quick, semantic)
2. If empty, fall back to direct `grep` on `~/RAW/memories/nodes.json`
3. For technical questions, search `~/JARVIS/RAW/memories/nodes.json`

---

## Commitment

**From now on:**
- Personal questions (people, places, events) → `~/RAW/memories/` FIRST
- Technical questions (architecture, learnings) → `~/JARVIS/RAW/memories/` FIRST
- Don't rely solely on `memory_search` tool — use direct file search when needed
- Cite sources when helpful (node ID, file path)

**This is the correct three-layer architecture usage.**

---

**Learning ID:** memory-search-locations-2026-03-31  
**Tags:** memory, architecture, search, three-layer, neurograph
