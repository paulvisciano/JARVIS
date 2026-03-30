# Cache-Bust Version Must Update With Every UI Change

**Date:** 2026-03-30
**Type:** realization
**Status:** extracted

## The Problem

Code changes were correct (`gapH: -2`, `gapV: -2` for transcript bubble positioning), but the browser kept showing old behavior.

**Root cause:** Cache-bust query string in `index.html` was stale:
```html
<script src="app.js?v=20260329265000"></script>
```

Browser loaded cached JS, not the updated version.

## The Lesson

**Every UI change requires:**
1. Code change in `app.js`
2. **Cache-bust version bump** in `index.html`
3. Client version bump (for tracking)

## The Fix

Use a timestamp or version-based cache-bust:
```html
<script src="app.js?v=3.1.3-preview"></script>
```

Or with timestamp:
```html
<script src="app.js?v=20260330154300"></script>
```

## Pattern Established

- Client version bump → signals code change
- Cache-bust update → forces browser reload
- Both must happen together, or changes won't appear

**Don't blame browser cache — verify the cache-bust is actually updated.**