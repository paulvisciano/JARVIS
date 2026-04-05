# Canvas Navigation via Global JavaScript API

**Date:** 2026-04-05
**Type:** decision
**Status:** extracted

## The Problem

Browser automation tools cannot interact with 3D canvas elements — they're rendered graphics, not DOM nodes. Snapshot only sees the canvas container, not the spheres/moons inside.

## The Solution

Expose navigation as a global JavaScript object that browser automation can call:

```javascript
window.JarvisNav = {
  focusNode: (nodeId) => { /* fly to node */ },
  fly: (direction, distance) => { /* move camera */ },
  resetView: () => { /* return to today */ },
  getNodes: (type?) => { /* list nodes */ },
  getNode: (nodeId) => { /* get node data */ },
  getHistory: () => { /* navigation history */ }
}
```

## How It Works

1. Cursor exposes `window.JarvisNav` in client-side code
2. Jarvis skills call `browser(action=evaluate, code: 'JarvisNav.focusNode(...)')`
3. Navigation executes in page context
4. No server API needed

## Future Enhancement

Redux store for navigation events — enables replay, history, traceable consciousness exploration.