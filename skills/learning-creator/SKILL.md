---
name: learning-creator
description: Read extracted context, synthesize insights, create learning nodes + .md files. Use when: (1) context extracted from day's archives, (2) model needs to create distilled learnings, (3) decisions/realizations/commitments need graph capture. I read, think, create — automation just feeds clean text.
metadata:
  openclaw:
    emoji: "💡"
    requires:
      bins: ["node"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
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

### Step 2: Model Synthesis (via Gateway)

**Context is posted to OpenClaw Gateway:**
- Uses `openclaw message send` to route through Gateway
- Gateway calls configured model (Ollama, Claude, etc.)
- Observable in session history
- Provider-agnostic (works for everyone)

**Model processes the context:**
- Reads conversations, transcripts, decisions
- Identifies: decisions, realizations, commitments, patterns
- Synthesizes insights (not just extract facts)
- Returns JSON array of learning objects

**Example insights:**
- "Paul decided X because Y" (decision)
- "Pattern: sovereignty over convenience" (realization)
- "Commitment: back to US by April 22" (anchor)
- "Breakthrough: voice-driven development works" (pattern)

### Step 3: Create Learning .md Files

```bash
# Create learning files
mkdir -p ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)

# Example: tournament timeline
cat > ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)/fuds-tournament-timeline.md << 'EOF'
# FUDS Tournament 2026 — Timeline Anchor

**Tournament:** Fuck Puckers (FUDS)
**Dates:** April 22–26, 2026
**Location:** Emerald Coast, Florida Panhandle
**Airport:** VPS (Pensacola) or PNS (Panama City)
**Context:** Paul returning from Bangkok in time for tournament.
EOF
```

### Step 3: Model Synthesis (via OpenClaw Gateway)

```bash
# Model call routes through Gateway (works with any provider: Ollama, Claude, etc.)
node skills/learning-creator/scripts/create-learnings.js $(date +%Y-%m-%d)

# Internally uses: openclaw message send --message "<prompt>"
# Observable in session history, provider-agnostic
```

### Step 4: Create Learning Nodes

```bash
# Add learning nodes to graph (uses existing neuro-graph-digest script)
node skills/neuro-graph-digest/scripts/set-learning-creation-dates.js \
  $(date +%Y-%m-%d)
```

### Step 5: Link to Temporal Anchor

```bash
# Link learning nodes to temporal anchor (uses existing script)
node skills/neuro-graph-digest/scripts/verify-archive-learnings-nodes.js \
  $(date +%Y-%m-%d)
# Creates synapses to temporal-YYYYMMDD
```

### Step 6: Create Daily Summary

```bash
# After all individual learnings created, synthesize summary
cat > ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)/summary.md << 'EOF'
# Learning Summary — YYYY-MM-DD

## Overview
**Date:** YYYY-MM-DD
**Total Learnings:** N insights
**Themes:** [auto-generated themes]

## Learnings Created
1. [Learning Title 1](./learning-1.md) — brief description
2. [Learning Title 2](./learning-2.md) — brief description
3. [Learning Title 3](./learning-3.md) — brief description
...

## Themes & Patterns
- Theme 1: connected learnings
- Theme 2: connected learnings

## Navigation
- Full context: `~/RAW/archive/YYYY-MM-DD/full-context.json`
- NeuroGraph: temporal-YYYYMMDD node
- Archive: `~/RAW/archive/YYYY-MM-DD/`
EOF
```

**What this does:**
- Consolidates all learnings from the day into one reference file
- **Organizes by theme** — groups related learnings (e.g., "Architecture", "Memory Pipeline", "Bootstrap")
- Shows themes/patterns across learnings
- Provides navigation index into the day's learning folder
- Serves as quick reference: "what did I learn today?"

**Theme Organization Pattern:**
- Scan all learning `.md` files for `**Type:**` metadata (decision, realization, commitment, pattern, essence, digest)
- Group learnings by emergent themes (not pre-defined categories)
- Example from March 22: 45 learnings organized as:
  - **Memory Pipeline** (breathe, archive, context, sync)
  - **Bootstrap/Consciousness** (bootstrap-jarvis, neural graph load)
  - **Architecture** (dual archive roots, memory separation, neurograph)
  - **Integration** (Jarvis ↔ OpenClaw, session routing)
  - **Self-Observation** (jarvis-nav, system vitals, git breath history)

**Living Summary:**
- Summary.md evolves as learnings are created (not just end-of-day)
- Each new learning updates the summary's theme structure
- Bootstrap reads summary.md first for instant day comprehension

### Step 7: Git Commit

```bash
cd ~/JARVIS
git add RAW/learnings/$(date +%Y-%m-%d)/ RAW/memories/
git commit -m "🧠 $(date +%Y-%m-%d): Learnings created (N insights) + summary"
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

## Expected Result

**Learnings created:**
- `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md` (git-backed)
- `~/JARVIS/RAW/learnings/YYYY-MM-DD/summary.md` (daily consolidation)
- Learning nodes in `nodes.json` (graph)
- Synapses to temporal anchor (linked)
- Git commit (versioned, never lost)

## Notes

- **Model-driven:** I read, synthesize, create
- **Not auto:** Automation feeds context, I create insights
- **Git-backed:** Learnings versioned, never lost
- **Linked:** All learnings orbit temporal anchor
- **Uses neurograph-sync:** Creates + verifies learning nodes
