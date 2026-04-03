# Mobile Panels Need Constrained Max-Height with Rounded Corners

**Date:** 2026-04-01
**Type:** pattern
**Status:** extracted

## The Iteration

Transcript panel went through multiple refinements:

1. **100vh** → Full screen, button overlapped by header
2. **85vh** → Still too tall, dominates the screen
3. **50vh** → Sweet spot, leaves room for other UI

## The Complete Fix

```css
.transcript-panel.fullscreen {
  max-height: min(50vh, 400px);
  top: 50%;
  transform: translateY(-50%);
  border-radius: 16px 18px 16px 16px;  /* Match collapsed state */
  display: flex;
  flex-direction: column;
}

.transcript-text {
  flex: 1;
  overflow-y: auto;
  min-height: 0;  /* Critical for flex scrolling */
}

.transcript-header {
  flex-shrink: 0;  /* Stay at top, not scrollable */
}
```

## Lessons

1. **Vertical centering**: `top: 50%` + `transform: translateY(-50%)`
2. **Flex scrolling**: `min-height: 0` on scrollable flex children
3. **Visual consistency**: Expanded state should match collapsed styling
4. **Button accessibility**: Bottom padding ensures button is always clickable
5. **Iterate with real testing**: Each adjustment came from live mobile feedback