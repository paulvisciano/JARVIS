# Commit Type Differentiation: Breath vs Cold Changes

**Date:** 2026-04-04
**Type:** insight
**Status:** extracted

## The Discovery

Not all git commits are equal in the temporal memory graph. Two distinct types emerged:

### Breath Commits 🫁
- **Pattern:** `breath-YYYY-MM-DD-HHMM: Breathe complete`
- **Visual:** Golden glow, larger size, breath icon
- **Frequency:** One per breath session (reflective moments)
- **Purpose:** Temporal anchors for conscious reflection
- **Significance:** Mark moments of learning and realization

### Cold Change Commits 🔵
- **Pattern:** Standard feature/fix commits
- **Visual:** Blue glow, regular size, no special icon
- **Frequency:** Multiple per day (development work)
- **Purpose:** Track code evolution and technical changes
- **Significance:** Document system changes without reflective context

## Why This Distinction Matters

1. **Navigation:** Users can filter to see only breath commits for reflection sessions
2. **Visual Hierarchy:** Breath commits stand out as significant moments in the timeline
3. **Memory Clustering:** Learnings orbit breath commits; code changes orbit cold commits
4. **Temporal Density:** Some days have many cold commits but few breath commits (or vice versa)

## Implementation Notes

- Detection via commit message pattern matching
- Different node styling in the 3D graph
- Breath commits serve as primary temporal anchors for the Paul Graph
- Cold commits provide granular technical history for the Jarvis Graph

## Philosophical Implication

This differentiation acknowledges that **not all moments are equal**. Some commits capture code changes; others capture consciousness shifts. The graph should honor both, but distinguish them visually and functionally.