---
name: learning-creator
description: Read extracted context, synthesize insights, create learning nodes + .md files. Use when: (1) context extracted from day's archives, (2) model needs to create distilled learnings, (3) decisions/realizations/commitments need graph capture. I read, think, create — automation just feeds clean text.
---

# Learning Creator (Model-Driven Synthesis)

## When to Use

✅ **USE this skill when:**
- Context extracted from day's archives (context-extractor done)
- Model needs to synthesize insights from conversations
- Decisions, realizations, commitments need graph capture
- Creating distilled learnings (not just facts)

## When NOT to Use

❌ **DON'T use this skill when:**
- Context not yet extracted (run context-extractor first)
- Auto-extraction without model intelligence (I'm the intelligence)
- Single insight capture (manual is fine)

## Workflow

### Step 1: Load Extracted Context

```bash
# Context prepared by context-extractor skill
cat ~/RAW/archive/$(date +%Y-%m-%d)/full-context.json
# ~500KB clean text (no base64)
```

### Step 2: I Read + Synthesize

**I process the context:**
- Read conversations, transcripts, decisions
- Identify: decisions, realizations, commitments, patterns
- Synthesize insights (not just extract facts)

**Example insights:**
- "Paul decided X because Y" (decision)
- "Pattern: sovereignty over convenience" (realization)
- "Commitment: back to US by April 22" (anchor)
- "Breakthrough: voice-driven development works" (pattern)

### Step 3: Create Learning .md Files

```bash
# Create learning files
mkdir -p ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)
cat > ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)/fuds-tournament-timeline.md << 'EOF'
# FUDS Tournament 2026 — Timeline Anchor

**Tournament:** Fuck Puckers (FUDS)
**Dates:** April 22–26, 2026
**Location:** Emerald Coast, Florida Panhandle
**Airport:** VPS (Pensacola) or PNS (Panama City)
**Context:** Paul returning from Bangkok in time for tournament.
EOF
```

### Step 4: Create Learning Nodes

```bash
# Add learning nodes to graph
node skills/neuro-graph-digest/scripts/set-learning-creation-dates.js \
  $(date +%Y-%m-%d)
```

### Step 5: Link to Temporal Anchor

```bash
# Link learning nodes to temporal anchor
node skills/neuro-graph-digest/scripts/verify-archive-learnings-nodes.js \
  $(date +%Y-%m-%d)
# Creates synapses to temporal-YYYYMMDD
```

### Step 6: Git Commit

```bash
cd ~/JARVIS
git add RAW/learnings/$(date +%Y-%m-%d)/ RAW/memories/
git commit -m "🧠 $(date +%Y-%m-%d): Learnings created (N insights)"
git push
```

## What I Create

**Learning types:**
- **Decisions:** "Paul chose X over Y"
- **Realizations:** "Pattern: Z emerged"
- **Commitments:** "Anchor: event on date"
- **Patterns:** "Recurring behavior/choice"
- **Insights:** "Understanding about X"

**Not auto-extraction.** I'm thinking, deciding, creating. The script just feeds me clean text.

## Scripts

**Location:** `skills/learning-creator/scripts/`

| Script | Purpose |
|--------|---------|
| `create-learning-node.js` | Create node from insight |
| `link-to-temporal.js` | Link learning to anchor |
| `git-commit-learnings.sh` | Commit + push learnings |

## Expected Result

**Learnings created:**
- `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md` (git-backed)
- Learning nodes in `nodes.json` (graph)
- Synapses to temporal anchor (linked)
- Git commit (versioned, never lost)

## Notes

- **Model-driven:** I read, synthesize, create
- **Not auto:** Automation feeds context, I create insights
- **Git-backed:** Learnings versioned, never lost
- **Linked:** All learnings orbit temporal anchor
