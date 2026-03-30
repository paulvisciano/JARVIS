# Version Bump Convention — Client and Server Separation

**Date:** 2026-03-30
**Type:** commitment
**Status:** extracted

## The Rule
Every commit = version bump, no exceptions.

### Client Version (`CLIENT_VERSION` in app.js)
- Bump when: UI changes, JavaScript logic changes, CSS changes
- Format: `v3.1.3` (semantic versioning)
- Cache-bust: `<script src="app.js?v=3.1.3">`

### Server Version (`VERSION` in jarvis-server.js)
- Bump when: API changes, backend logic changes, new endpoints
- Format: `v3.1.2` (semantic versioning)
- Health endpoint: Returns server version

### Both Versions
- Bump both when: Full-stack changes
- Example: Live transcription fix touched client polling AND server response logic

## Why This Matters
1. **Clear tracking** — Know exactly what's deployed where
2. **Preview vs Production** — Compare versions between 18788 (preview) and 18787 (production)
3. **Cache discipline** — Fresh version = fresh cache, no stale JS
4. **Debugging** — "What version was running when this bug appeared?"

## The Workflow
1. Make changes in preview workspace
2. Bump appropriate version(s)
3. Update cache-bust in index.html
4. Commit ALL changes together (app.js + jarvis-server.js + index.html)
5. Test on preview (18788)
6. Merge to production (18787)
7. Restart production server