# PR-Based Workflow — Sovereign Development with Code Review

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Problem

Before today, the preview workflow was:
1. Coder commits directly to `workspace-preview`
2. Manual merge to production (`git pull <preview-path> main`)
3. Version bumps scattered across commits
4. No code review trail on GitHub
5. Process names indistinguishable (`JARVIS` vs `JARVIS`)

This led to:
- Cache-bust mismatches (index.html not merged with app.js)
- Confusion about what's deployed where
- No PR history for auditing
- Manual merging errors

## The Solution: PR-Based Workflow

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CODER (agent:jarvis-coder:main)                           │
│  Workspace: ~/.openclaw/agents/jarvis-coder/workspace/     │
│                                                             │
│  1. Create branch: feature/<description>                   │
│  2. Commit changes                                         │
│  3. Push to GitHub                                         │
│  4. Create Pull Request                                    │
│  5. Send native notification with PR link                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  PAUL (Gatekeeper)                                         │
│                                                             │
│  1. Review PR on GitHub (diff, comments, checks)           │
│  2. Merge when approved                                    │
│  3. Notify Jarvis: "merged"                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  JARVIS (agent:jarvis:main)                                │
│                                                             │
│  1. Pull latest: `git pull origin main`                    │
│  2. Restart production server (18787)                      │
│  3. Confirm deployment                                     │
└─────────────────────────────────────────────────────────────┘
```

### Server Processes

| Port | Process Title | Purpose |
|------|---------------|---------|
| 18787 | `JARVIS-production` | Live server (merged, reviewed, approved) |
| 18788 | `JARVIS-preview` | Testing server (optional, for local dev before PR) |

### Version Bumping

**Rule:** Every PR that changes client or server code bumps the respective version.

- Client change (`app.js`, `index.html`, UI) → bump `CLIENT_VERSION`
- Server change (`jarvis-server.js`) → bump `VERSION`
- Both → bump both
- Cache-bust in `index.html` must match `CLIENT_VERSION`

**Example:**
```javascript
// app.js
const CLIENT_VERSION = '3.1.3';  // bumped from 3.1.2

// jarvis-server.js
const VERSION = '3.1.2';  // bumped from 3.1.1

// index.html
<script src="app.js?v=3.1.3"></script>  // matches CLIENT_VERSION
```

### Notification Template

When Coder completes a PR:

```
✅ PR Ready for Review

**Branch:** feature/transcript-bug-fix
**PR:** https://github.com/paulvisciano/SCI-FI/pull/<number>
**Changes:**
- Fixed live transcription stale poll bug
- Added poll guard (activePollId)
- Server returns 'transcribing' status instead of archive fallback

**Versions:**
- Client: v3.1.2 → v3.1.3
- Server: v3.1.1 → v3.1.2

**Testing:** Back-to-back recordings no longer show stale transcripts.

Click "Show" to open PR, or "Merge" when ready.
```

### Deployment Checklist

After Paul merges:

1. Jarvis pulls latest: `git pull origin main`
2. Kills production server: `lsof -ti:18787 | xargs kill -9`
3. Restarts: `cd ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS && node jarvis-server.js &`
4. Confirms: "Production deployed: v<client> / v<server>"

## Why This Matters

1. **Code Review Trail** — Every change has a PR, diff, comments, approval
2. **Gatekeeper Control** — Paul reviews and merges, not automated
3. **Version Discipline** — Every PR includes version bumps, no scatter
4. **Audit History** — GitHub shows who changed what, when, why
5. **Clear Separation** — Preview (18788) vs Production (18787), distinct process names

## Related

- `the-tipping-point-pattern.md` — today's archive catastrophe + recovery
- `archive-backup-guidance.md` — backup patterns for sovereign infrastructure
- `session-control-commitment.md` — check in before chaining tools
