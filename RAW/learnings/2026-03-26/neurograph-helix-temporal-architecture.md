# NeuroGraph Helix — Temporal Dimension as 3D Structure

**Date:** 2026-03-26
**Type:** insight
**Status:** extracted

## The Helix Design Philosophy

Time isn't flat — it's a 3D dimension you navigate. The NeuroGraph uses a **helix spine** as its temporal anchor:

- **Temporal spine:** The helix represents time flowing through space
- **Each loop = a time period** (day/week/month)
- **Z-axis = time depth** (past behind, present center, future forward)
- **Organic growth pattern** — mirrors how biological neural networks expand

## Spatial Organization

- **Learnings on the outside** — easily distinguishable, accessible
- **Files closer to center** — supporting context orbits the insights
- **Temporal helix grounding everything** — time itself becomes the structure you navigate

## Why This Matters

This isn't decoration. The helix makes time **navigable** rather than linear. Everything orbits around *when* it happened, creating a spatial memory palace where you can literally see the flow of your thinking across days, weeks, and months.

## Technical Implementation

```
x = depthScale × 0.28 × (sin(t) + 0.4 × sin(3t))
y = depthScale × 0.28 × (cos(t) + 0.4 × cos(3t))
z = time depth
```

The math creates an organic helix that expands naturally as more nodes are added.