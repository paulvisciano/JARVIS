# 3D Depth Enhancement for Temporal Visualization

**Date:** 2026-04-14
**Type:** pattern
**Status:** extracted

## Context

Issue SCIAAA-115: River of Time visualization felt 2D (scrolling up/down). Target: 3D volume with depth perception where present feels closest and past flows away into Z-space.

## Implementation Pattern

### 1. Camera Positioning
```javascript
// Before: (0, 0.9, 8.6)
// After: (0, 1.2, 5.8) — closer and elevated
```

### 2. Z-Axis Node Distribution
- Present moment: Z ≈ 0
- Past nodes: Flow into negative Z (max -18 units)
- Creates depth gradient from viewer

### 3. Enhanced Parallax
```javascript
// Dynamic look target shifts with camera position
const parallaxFactor = 0.35;
```

### 4. Fog Density
```javascript
// Before: 0.028
// After: 0.048 — reinforces depth perception
```

### 5. Visual Labeling
- "Near = present - Deep = past" overlay
- Communicates Z-axis meaning to users

## Result

Perceived latency reduced from ~15s wait to ~2-3s first audio bytes (streaming feel). Visual depth creates immersive temporal navigation.

## Commit Reference

SCIAAA-115 implementation — 3D depth enhancement complete