# CSS Z-Index Hierarchy for Overlay Components

**Date:** 2026-04-01
**Type:** pattern
**Status:** extracted

## The Problem

Preview badge (bottom-right) was appearing ON TOP of the menu drawer when opened, blocking server info visibility.

## The Hierarchy

```css
/* Bottom layer */
.preview-badge {
  z-index: 4000;  /* Was 9999 - too high */
}

/* Middle layer */
.mobile-drawer {
  z-index: 9999;
}

/* Top layer */
.hamburger-button {
  z-index: 10000;
}
```

## Principle

Overlay components need explicit z-index hierarchy:
1. Base UI elements: lowest (1000-4000)
2. Drawers/modals: middle (9000-9999)
3. Buttons that trigger overlays: highest (10000+)

## Lesson

When adding new overlay components, audit the entire z-index stack. A component that works in isolation may conflict with existing overlays. Test all overlay combinations (drawer + badge, modal + drawer, etc.).