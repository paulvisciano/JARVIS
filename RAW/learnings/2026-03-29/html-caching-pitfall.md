# HTML Caching Bypasses JS Versioning

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

During deployment debugging, discovered that adding version query parameters to JavaScript files (e.g., `app.js?v=timestamp`) does not prevent the browser from caching the parent `index.html` file itself.

**Symptom:**
- `index.html` contained updated cache-bust version `20260329143723`.
- Browser loaded old version `20260329023900`.

**Resolution:**
Ensure the HTML document itself is served with no-cache headers or versioned, otherwise the browser will never request the new JS version references contained within it.