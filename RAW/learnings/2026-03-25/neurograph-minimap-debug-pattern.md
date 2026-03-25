# NeuroGraph Minimap Rendering Debug Pattern

**Date:** 2026-03-25
**Type:** pattern
**Status:** extracted

## The Symptom

Minimap appears black/dark instead of showing the graph overview.

## Root Cause

Missing CONFIG constant causes canvas height to be `undefined`:

```javascript
// Missing from CONFIG object:
MINIMAP_HEIGHT: 188

// Canvas creation fails silently:
const canvas = document.createElement('canvas');
canvas.height = CONFIG.MINIMAP_HEIGHT; // undefined → 0
```

## Debug Steps

1. **Check browser console** for ReferenceError:
   ```
   MINIMAP_WIDTH is not defined
   ```

2. **Search CONFIG object** for missing constants:
   ```javascript
   const CONFIG = {
     MINIMAP_WIDTH: 200,
     // MINIMAP_HEIGHT missing!
   };
   ```

3. **Add missing constant** with appropriate value:
   ```javascript
   MINIMAP_HEIGHT: 188
   ```

4. **Remove debug console.log statements** after fix verified

## Key Insight

Canvas rendering failures often stem from undefined dimension constants rather than rendering logic errors. Check CONFIG object completeness first.

## Commits

- `f24a263` — Fix NeuroGraph minimap rendering: add missing MINIMAP_HEIGHT constant (188px)
- `103ecd0` — Remove minimap debug console.log statements