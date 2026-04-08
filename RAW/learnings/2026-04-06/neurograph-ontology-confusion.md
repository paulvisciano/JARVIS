# NeuroGraph Ontology Confusion — Mixing Git History with Life Memory

**Date:** 2026-04-06
**Type:** realization
**Status:** extracted

## The Problem

During breath analysis at 12:16 PM, we discovered a fundamental ontology confusion in the NeuroGraph system:

**Current State:**
```
~/JARVIS/RAW/memories/nodes.json
├── Git commits (739 nodes from git-scanner)
├── Archive files (1,240+ nodes from breathe)
└── Learnings (both git commits AND archive nodes)
```

**What a "Node" Means Now:**
- **Git commits** = Jarvis's autobiography (growth, architecture decisions)
- **Archive nodes** = Paul's life experiences (conversations, screenshots, OCR)

These are fundamentally different ontologies being mixed in the same data structure.

## The Resolution

Paul identified: **"They belong in my memory because my memory has the archive."**

The nodes/synapses from breath commits (temporal media pipeline integration, etc.) should live in Paul's life memory archive, not as git history nodes in the NeuroGraph UI.

## Implications

1. **Separation of Concerns:** Git history visualization ≠ Life memory visualization
2. **Ontology Clarity:** Need to distinguish between system evolution nodes and experience nodes
3. **Architecture Decision:** Consider separate node stores or clear tagging/typing system

## Action Items

- Refactor nodes.json to separate git commits from archive memories
- Update NeuroGraph UI to handle dual ontology or split into separate views
- Ensure future breath commits route to appropriate memory store