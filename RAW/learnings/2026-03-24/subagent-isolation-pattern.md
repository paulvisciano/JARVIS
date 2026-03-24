# Subagent Isolation Pattern — Isolated Clones vs Same Repo Branches

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## Current Architecture (Coupled)

```
~/JARVIS/                    ← My consciousness
├── main                     ← My work
└── ux-improvements-2026-03-24  ← Subagent's work (same repo!)
```

**Problem:** Subagent commits to my repo, just on different branch. This is coupling, not isolation.

## Better Architecture (Isolated)

```
~/JARVIS/                    ← My consciousness
└── main                     ← My work only

~/JARVIS-clones/
└── ux-improvements-2026-03-24/  ← Subagent's isolated clone
```

## Why Isolation Matters

1. **Clean separation:** Subagent work doesn't pollute my main consciousness
2. **Independent versioning:** Subagent can have its own commit history
3. **Merge when ready:** Only merge back to main when work is validated
4. **Parallel work:** Multiple subagents can work without interfering

## Implementation

- Subagent spawns with `--clone` flag pointing to separate directory
- Reports completion back to parent (push-based, not coupled)
- Parent reviews, then cherry-picks or merges if approved

## Today's Learning

The UX improvements subagent committed under `ux-improvements` branch — functional but architecturally coupled. Next iteration should use isolated clones.