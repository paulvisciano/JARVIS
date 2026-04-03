# Defensive DOM Access — Call Getter Before Null Check

**Date:** 2026-03-31
**Type:** pattern
**Status:** extracted

## The Bug Pattern

```javascript
// WRONG — Panel never created
if (neuroInfoPanel) {
  neuroInfoPanel.style.opacity = '1';
}

// RIGHT — Create first, then use
const panel = getNeuroInfoPanel();
if (panel) {
  panel.style.opacity = '1';
}
```

## What Happened

During neurograph panel simplification (v3.1.5):
1. Added null checks to prevent console errors ✅
2. **But never called `getNeuroInfoPanel()` to create the element first** ❌
3. Result: No errors, but panel never displayed

## The Lesson

**Null checks without initialization = silent failure.**

When using getter functions that lazily create DOM elements:
1. **Call the getter first** (creates element if needed)
2. **Then check the result** (defensive)
3. **Then access properties** (safe)

## Related Commits

- `b6ef917` — Added null checks (broke display)
- `ffd7935` — Fixed by calling `getNeuroInfoPanel()` first

## Generalizable Pattern

This applies to any lazy-initialization pattern:
- DOM element getters
- Singleton accessors
- Cached resource loaders

**Always initialize before you validate.**