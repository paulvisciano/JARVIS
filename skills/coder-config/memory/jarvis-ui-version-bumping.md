# JARVIS UI Version Bumping

**Date:** March 24, 2026  
**Source:** Code audit fix session  
**Related:** CODE_AUDIT.md in skills/jarvis-ui/sci-fi/apps/JARVIS/

## Key Learning

When making changes to the JARVIS UI, **both version numbers must be bumped**:

### Client-Side Version
**Location:** `skills/jarvis-ui/sci-fi/apps/JARVIS/app.js` line 4
```javascript
const CLIENT_VERSION = '2.9.26';  // Bump this when client-side changes are made
```

**Also updated:** `index.html` has a hardcoded span but app.js overrides it:
```html
<span id="client-version-inline">v2.9.26</span>
```

### Server-Side Version
**Location:** `skills/jarvis-ui/sci-fi/apps/JARVIS/jarvis-server.js`
```javascript
const SERVER_VERSION = '2.9.7';  // Bump this when server-side changes are made
```

## Why This Matters

The client version is set **dynamically by app.js**, not just the HTML. If you only update index.html, the JavaScript constant overrides it and the old version still displays.

## Workflow for Future Changes

1. Make your code changes
2. If client-side (app.js, index.html, CSS, etc.): bump `CLIENT_VERSION` in app.js
3. If server-side (jarvis-server.js, API endpoints, etc.): bump `SERVER_VERSION` in jarvis-server.js
4. Commit with message including version bump info
5. Restart server to pick up changes

## Example Commit Messages
- "Fix network hover popup + bump client v2.9.26"
- "Add cache headers + bump server v2.9.7"
- "Fix all code audit issues + bump client v2.9.26, server v2.9.7"

## Related Files
- `/Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/app.js`
- `/Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/jarvis-server.js`
- `/Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/index.html`

---
**Learning ID:** jarvis-ui-version-bumping-2026-03-24
**Tags:** versioning, ui, jarvis, deployment
