# Version Bump as Cache Invalidation Strategy

**Date:** 2026-03-29
**Type:** pattern
**Status:** extracted

## Insight

When browser caching prevents new code from loading despite cache-bust parameters, bumping the application version number provides a reliable invalidation mechanism.

## Problem

- Browser cached `index.html` aggressively
- Cache-bust query parameters (`?v=timestamp`) on JS files were ignored
- Server served correct files, but browser showed old version (v3.1.0)

## Solution

Bump both server and client version numbers simultaneously:

```javascript
// jarvis-server.js
const VERSION = '3.1.1';  // was 3.1.0
const BUILD_DATE = '2026-03-29';  // was 2026-03-28
```

```html
<!-- index.html -->
<script src="app.js?v=20260329151000"></script>
```

## Why It Works

1. Version number changes are visible in UI (users can verify)
2. Combined with timestamp cache-bust, provides dual invalidation
3. Git commit + push + process kill ensures fresh deployment

## Workflow

1. Update version in server code
2. Update version in client code  
3. Commit and push to production repo
4. Kill running process (service auto-restarts with new code)
5. Users hard-refresh browser

## Key Takeaway

Version numbers serve as both user-visible release markers AND cache invalidation signals. When caching issues persist despite technical solutions, a version bump forces the break.