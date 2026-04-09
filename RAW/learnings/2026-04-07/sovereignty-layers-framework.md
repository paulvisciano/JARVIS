# Sovereignty Has Layers — The Airplane Mode Test

**Date:** 2026-04-07
**Type:** insight
**Status:** extracted

## The Correction

During mission refinement, Paul corrected an important assumption: we're currently running Qwen cloud models, not local. This means we're still sharing information with external servers (Alibaba/Chinese corp), even though data stays on the machine during inference.

## Sovereignty Layers Framework

| Layer | Current State | 100% Sovereign |
|-------|---------------|----------------|
| **Where it runs** | ☁️ Qwen Cloud (Alibaba servers) | 🏠 Your hardware only |
| **Where data goes** | ☁️ Leaves your machine | 🏠 Stays on your machine |
| **What it's trained on** | ☁️ Corporate/unknown data | 🏠 Your data + transparent open data |
| **Who owns the weights** | ☁️ Alibaba (Chinese corp) | 🏠 You / open community |

## The Airplane Mode Test

**The ultimate sovereignty test:** Can you disconnect completely (airplane mode) and still have full functionality?

- If yes → sovereign
- If no → dependent

## Implications

1. **Sovereignty Meter** — A task to create: visual indicator showing how sovereign your setup is across all layers
2. **Honest Accounting** — We must be transparent about where we are on the sovereignty spectrum
3. **Progressive Decoupling** — Work toward 100% sovereignty as a goal, not a starting point

## Key Insight

Sovereignty isn't binary. It's a spectrum. The goal is progressive decoupling from external dependencies while being honest about current limitations.