# Mobile Touch Requires Pointer Events, Not Click

**Date:** 2026-04-01
**Type:** pattern
**Status:** extracted

## The Pattern

Desktop `click` event listeners do NOT work reliably on mobile touch devices. Mobile requires pointer events for unified mouse/touch handling.

## What Works

```javascript
// ❌ Desktop only - fails on mobile
canvas.addEventListener('click', handler)

// ✅ Unified mouse + touch
canvas.addEventListener('pointerdown', handler)
canvas.addEventListener('pointermove', handler)
canvas.addEventListener('pointerleave', handler)
```

## Why This Matters

- `pointerdown` fires for both mouse clicks AND touch taps
- `pointermove` replaces `mousemove` for hover tracking on mobile
- `pointerleave` clears hover state when pointer exits canvas
- Must add `e.preventDefault()` and `e.stopPropagation()` to prevent double-firing

## Applied To

- NeuroGraph node selection
- Memory toggle button
- Orb recording trigger
- Transcript panel expand/collapse

## Lesson

Always use pointer events for interactive elements that need to work on both desktop and mobile. Test on actual devices, not just desktop browser emulation.