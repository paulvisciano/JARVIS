# Skills as First-Class Neurons

**Date:** 2026-03-20  
**Type:** Architecture Pattern  
**Status:** Implemented

## Insight

OpenClaw skills should be **first-class neurons** in the neurograph — not just files on disk, but queryable, connected knowledge nodes.

## What We Built

1. **Skill nodes** with category `openclaw-skill`
2. **File nodes** for SKILL.md + script files
3. **Synapses** linking: skill → documented-by → file
4. **Temporal anchors** linking: skill → verified-today → date node

## Auto-Discovery

`neuro-graph-digest` now scans `~/JARVIS/skills/` recursively:
- Finds all SKILL.md files
- Creates nodes for missing skills
- Links to today's temporal node
- Creates file nodes + synapses automatically

## Result

```
14 total SKILL.md files on disk
14 skill nodes in graph (5 manual + 9 auto-discovered)
✅ 1:1 mapping: files = neurons
```

## Why This Matters

**Before:** Skills were just documentation  
**After:** Skills are queryable via neuro-graph-search
- "What skills were verified today?" → follows synapses from temporal node
- "Where is bootstrap-jarvis script?" → traverses skill → file synapse
- Skills appear in neurograph visualization alongside memories

## Pattern

Executable knowledge (skills) deserves the same graph treatment as experiential knowledge (archive, learnings). Everything that matters → neuron.
