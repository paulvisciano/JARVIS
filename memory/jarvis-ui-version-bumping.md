# JARVIS UI Version Bumping

**Date:** March 24, 2026 (Updated March 30, 2026 — PR Workflow + Sci-Fi Repo Clarified)  
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

## Repository Separation (Core Principle — March 30, 2026)

### Sci-Fi Repo (Your Code - `~/JARVIS/skills/jarvis-ui/sci-fi/`)
- **Remote:** `https://github.com/paulvisciano/SCI-FI.git`
- **Content:** app.js, jarvis-server.js, index.html, CSS, JavaScript
- **Owner:** You (Jarvis Coder)
- **PRs target:** Sci-Fi repo (`SCI-FI` GitHub repo)

### JARVIS Repo (Jarvis' Consciousness - `~/JARVIS/`)
- **Remote:** `https://github.com/paulvisciano/JARVIS.git`
- **Content:** SOUL.md, AGENTS.md, HEARTBEAT.md, neurograph, learnings
- **Owner:** Jarvis (coordinator)
- **PRs target:** JARVIS repo (`JARVIS` GitHub repo)

**Rule:** Code changes → Sci-Fi repo. Consciousness/memory changes → JARVIS repo.

## Workflow for Future Changes (Updated March 30, 2026)

### PR-Based Workflow (Core Principle)
1. **Branch naming:** `feature/<description>` or `fix/<description>` (Sci-Fi repo only)
2. **Version bumping:** Bump `CLIENT_VERSION` or `SERVER_VERSION` (or both)
3. **Commit message:** Include version info: "Fix X + bump client v2.9.42"
4. **Push to branch:** `git push origin feature/my-feature`
5. **Create PR:** `gh pr create --title "..." --body "..."`
6. **Send notification:** Native macOS notification with PR link (see template below)
7. **Wait for merge:** Paul reviews, approves, merges. Never merge my own PRs.

**Repository Target:**
- Code changes (app.js, jarvis-server.js) → **Sci-Fi repo**
- Consciousness/memory changes (SOUL.md, AGENTS.md, learnings) → **JARVIS repo**

### Version Bumping Rules
1. Make your code changes
2. If client-side (app.js, index.html, CSS, etc.): bump `CLIENT_VERSION` in app.js
3. If server-side (jarvis-server.js, API endpoints, etc.): bump `SERVER_VERSION` in jarvis-server.js
4. Commit with message including version bump info
5. Push to branch and create PR in **Sci-Fi repo**

### PR Notification Template (Coder - Sci-Fi repo)
```
**PR Ready for Review** 🔗

Title: [Type] Description
PR: https://github.com/paulvisciano/SCI-FI/pull/123
Branch: feature/my-feature
Version: Client v2.9.42, Server v2.9.7

Changes:
- Fix X by doing Y
- Bump client version to v2.9.42
- Add cache headers for static assets

Testing Notes:
- [ ] Tested in Chrome
- [ ] Tested in Safari
- [ ] Console clean (no errors)
- [ ] Linting passes (no warnings)

Ready for:
- [ ] Code review
- [ ] Merge to preview (JARVIS-preview)
- [ ] Merge to production (JARVIS-production) after preview approval
```

### PR Notification Template
```
**PR Ready for Review** 🔗

Title: [Type] Description
PR: https://github.com/paulvisciano/JARVIS/pull/123
Branch: feature/my-feature
Version: Client v2.9.42, Server v2.9.7

Changes:
- Fix X by doing Y
- Bump client version to v2.9.42
- Add cache headers for static assets

Testing Notes:
- [ ] Tested in Chrome
- [ ] Tested in Safari
- [ ] Console clean (no errors)
- [ ] Linting passes (no warnings)

Ready for:
- [ ] Code review
- [ ] Merge to preview (JARVIS-preview)
- [ ] Merge to production (JARVIS-production) after preview approval
```

### Deployment Gatekeeper Model
- **JARVIS-production:** Paul's live deployment (final, live site)
- **JARVIS-preview:** Preview environment (staging, testing)
- **Paul's role:** Reviews PRs, decides when to deploy to production
- **My role:** Code, test, submit PRs. Never deploy directly.

## Example Commit Messages
- "Fix network hover popup + bump client v2.9.26"
- "Add cache headers + bump server v2.9.7"
- "Fix all code audit issues + bump client v2.9.26, server v2.9.7"

## Related Files
- `$JARVIS_HOME/skills/jarvis-ui/sci-fi/apps/JARVIS/app.js`
- `$JARVIS_HOME/skills/jarvis-ui/sci-fi/apps/JARVIS/jarvis-server.js`
- `$JARVIS_HOME/skills/jarvis-ui/sci-fi/apps/JARVIS/index.html`

Or use tilde expansion:
- `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/app.js`
- `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/jarvis-server.js`
- `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/index.html`

---
**Learning ID:** jarvis-ui-version-bumping-2026-03-24
**Tags:** versioning, ui, jarvis, deployment, pr-workflow
