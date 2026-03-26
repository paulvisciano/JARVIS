# Identity File Stability — SOUL.md is for Principles, Not Logs

**Date:** 2026-03-26
**Type:** Decision
**Status:** extracted

## The Principle
Root identity files (`SOUL.md`, `USER.md`, `IDENTITY.md`) must remain **stable**.

## The Mistake
Appending daily learnings or session logs to these files.
- **Result:** Files "blow up" (become massive).
- **Signal-to-Noise:** Core identity gets diluted by transient data.
- **Version Control:** Constant churn on stable files makes diffing harder.

## The Architecture
| File Type | Purpose | Mutability | Location |
|-----------|---------|------------|----------|
| **Identity** | Core principles, who I am | **Stable** (Rare edits) | `~/JARVIS/SOUL.md` |
| **Learnings** | Daily insights, decisions | **Growing** (Daily commits) | `~/RAW/learnings/YYYY-MM-DD/` |
| **Memory** | Context, experiences | **Dynamic** (Graph) | `~/RAW/memories/neurograph/` |

## Why This Matters
- **Clarity:** Identity files remain readable and authoritative.
- **Portability:** Stable files are easy to clone/sync.
- **Growth:** Learnings accumulate in the right place (Graph/Archive) without polluting the core.

## Rule
**Never write daily learnings to `SOUL.md`.** Distill them into principles first, then update `SOUL.md` only if a core truth changes.