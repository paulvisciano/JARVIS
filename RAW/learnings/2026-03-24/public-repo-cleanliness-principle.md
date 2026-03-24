# Public Repository Cleanliness Principle

**Date:** 2026-03-24
**Type:** pattern
**Status:** extracted

## Insight

Public repository files must reflect actual architecture — not aspirational or obsolete documentation.

## What We Learned

During the March 24 cleanup session, we went through public files one-by-one to verify legitimacy:

- **AGENTS.md** — Removed rules/group chats sections (features we don't have)
- **BOOT.md** — Updated to reference skills, not direct script execution
- **Memory pipeline docs** — Removed transcript.md references (now uses full-context.json + learnings)

## Principle

**"If it's public, it must be true."**

Public files are visible on GitHub and represent the system's external contract. They should:
1. List only available agents (jarvis, coder, main)
2. Document actual memory pipeline (neurograph + breathe, not transcripts)
3. Reference skill operations (not internal script paths)
4. Exclude private data, internal rules, or planned features

## Rationale

- Prevents confusion for collaborators
- Ensures documentation matches running system
- Reduces cognitive load — no speculation about "what might exist"
- Makes the public repo a trustworthy source of truth

## Application

When updating public files:
- Ask: "Does this exist right now?"
- Remove sections about future/planned features
- Keep architecture docs minimal and accurate
- Private implementation details stay in .gitignored files