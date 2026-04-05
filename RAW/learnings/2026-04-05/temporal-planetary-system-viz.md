# Temporal Planetary System Visualization

**Date:** 2026-04-05
**Type:** insight
**Status:** extracted

## The Metaphor

**Day Anchors = Planets** (30 white/silver spheres, one per day)
**Commits = Moons** (orbiting their day planet)
**Breath Commits = Special Moons** (larger, gold, more prominent)
**Cold-Change Commits = Regular Moons** (smaller, blue)
**Synapses = Orbital Paths** (visible lines showing connections)

## Spatial Organization

- **Z-axis = Time** (present closest to camera, past recedes into distance)
- **Day anchors** have gravity wells — commits orbit around them
- **Variable orbit radius** (golden angle or incremental spacing)
- **Today's planet** is the framing center

## Visual Hierarchy

- Size + color = importance
- 30 day anchor labels (not 711 commit labels — keep it clean)
- Labels face camera (auto-orient via CSS2DRenderer)

## Why This Works

Temporal organization becomes intuitive. User can "fly through time" and see when learnings occurred relative to each other.