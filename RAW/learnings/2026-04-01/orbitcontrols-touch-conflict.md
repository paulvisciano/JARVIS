# Three.js OrbitControls Intercepts Touch Events

**Date:** 2026-04-01
**Type:** realization
**Status:** extracted

## The Root Cause

Three.js r128 OrbitControls attaches to `touchstart` for one-finger rotation gestures. This happens BEFORE `pointerdown` fires, causing tap events to be interpreted as rotation gestures instead of node selections.

## Why Simple Fixes Failed

Changing `click` → `pointerdown` alone didn't work because:
1. OrbitControls captures `touchstart` first
2. One-finger touch = rotate gesture (not tap)
3. The tap never reaches the node selection handler

## The Real Fix

Use capture-phase event listeners or disable OrbitControls touch rotation for tap detection. Cursor's solution involved understanding the event flow timing and library source code.

## Lesson

When debugging mobile touch issues with Three.js:
1. Read the library source code (OrbitControls)
2. Understand event flow and timing conflicts
3. Don't just fix symptoms — find root causes
4. 90% done = 0% done; the last 10% is what makes it production-ready