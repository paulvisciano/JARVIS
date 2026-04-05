---
name: jarvis-nav
description: Navigate JARVIS UI (NeuroGraph) with chrome-relay + window.JarvisNav API
metadata:
  openclaw:
    emoji: "🧭"
    requires:
      bins: ["node", "openclaw"]
      env: ["JARVIS_HOME"]
---

# JARVIS Navigation — Chrome Relay + JarvisNav API

**Architecture:** Use `chrome-relay` browser profile + `window.JarvisNav` API for programmatic navigation.

**Why:**
- ✅ **Mic access** — User's personal Chrome (not isolated openclaw browser)
- ✅ **Direct API** — `window.JarvisNav.focusNode()` vs URL params
- ✅ **Feedback** — Return values confirm navigation success
- ✅ **Collaboration** — User can talk while AI navigates

---

## Quick Start

**Ensure relay is active:**
1. User clicks OpenClaw extension icon in Chrome toolbar
2. Extension badge turns ON (green/colored)
3. User navigates to `https://localhost:18787/`
4. User confirms: "Ready!"

**Then navigate:**
```bash
# Natural language (see script for full parser)
node skills/jarvis-nav/scripts/jarvis-nav.js "show me yesterday"
node skills/jarvis-nav/scripts/jarvis-nav.js "March 6th"
node skills/jarvis-nav/scripts/jarvis-nav.js "fly forward"
node skills/jarvis-nav/scripts/jarvis-nav.js "share link for March 6th"

# Or OpenClaw CLI (evaluate — there is no separate `act` subcommand)
openclaw browser --browser-profile chrome-relay --json tabs
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn '() => window.JarvisNav.focusNode("day-2026-03-06")'
```

**Shareable links:** The UI syncs `?node=<id>` when you click a node; opening `https://localhost:18787/?node=day-2026-03-06` focuses that node after load. The script can print the same URL with `"share link for March 6th"`.

---

## Browser Tool Usage

### Check Relay Status
```javascript
browser(action=profiles)
// Look for: chrome-relay (running: true, tabCount: >0)
```

### Get Active Tab
```bash
openclaw browser --browser-profile chrome-relay --json tabs
# Inspect JSON for targetId + url (shape may be an array or { tabs: [...] })
```

### Verify API Loaded
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn "() => (window.JarvisNav ? 'API loaded' : 'API not found')"
```

### Navigate to Day
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn '() => window.JarvisNav.focusNode("day-2026-03-06")'
```

### Fly (camera strafe along view / right)
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn '() => window.JarvisNav.fly("forward", 3000)'
```

### Get All Nodes
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn "() => window.JarvisNav.getNodes('day-anchor')"
```

### Get Specific Node
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn '() => window.JarvisNav.getNode("commit-2ffdf25")'
```
Temporal commit entries from `getNodes('commit')` include `orbitAnchorId` (day anchor id), not `anchorId`.

### Zoom In/Out
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn "() => window.JarvisNav.zoom(2)"
```

### Reset View
```bash
openclaw browser --browser-profile chrome-relay --json evaluate --target-id "<targetId>" \
  --fn "() => window.JarvisNav.resetView()"
```

---

## Natural Language Navigation

### Time Expressions
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "show me today"
node skills/jarvis-nav/scripts/jarvis-nav.js "show me yesterday"
node skills/jarvis-nav/scripts/jarvis-nav.js "March 6th"
node skills/jarvis-nav/scripts/jarvis-nav.js "April 4th"
node skills/jarvis-nav/scripts/jarvis-nav.js "2026-03-20"
```

### Movement Commands
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "fly forward"
node skills/jarvis-nav/scripts/jarvis-nav.js "fly backward"
node skills/jarvis-nav/scripts/jarvis-nav.js "zoom in"
node skills/jarvis-nav/scripts/jarvis-nav.js "zoom out"
node skills/jarvis-nav/scripts/jarvis-nav.js "reset view"
```

### Query Commands
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "how many days"
node skills/jarvis-nav/scripts/jarvis-nav.js "show commits for April 4th"
node skills/jarvis-nav/scripts/jarvis-nav.js "what node is selected"
```

---

## Script Implementation

Source of truth: **`~/JARVIS/skills/jarvis-nav/scripts/jarvis-nav.js`**.

- Runs `openclaw browser --browser-profile chrome-relay --json` with subcommands **`tabs`** and **`evaluate`** (not `act`).
- Picks the tab whose URL contains `localhost:18787`, then passes `--target-id` to **`evaluate --fn '() => ...'`**.
- Parses natural language into actions; **commits-for-date** counts commits with `orbitAnchorId === day-YYYY-MM-DD`.
- **`share` / `copy link`**: prints `https://localhost:18787/?node=day-...` without calling the browser.

---

## JarvisNav API Reference

**Exposed on:** `window.JarvisNav` (in JARVIS UI page)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `focusNode(nodeId)` | `day-2026-03-06` | `{ ok: true, nodeId }` | Fly to and focus on node |
| `fly(direction, distance)` | `'forward', 1000` | `{ ok: true, direction, distance }` | Fly in direction |
| `resetView()` | — | `{ ok: true }` | Reset to initial framing |
| `getNodes(type?)` | `'day-anchor'` | `[{ id, label, ... }]` | List nodes (optionally filter) |
| `getNode(nodeId)` | `'commit-2ffdf25'` | `{ id, label, ... }` or `null` | Get node details |
| `zoom(level)` | `2` | `{ ok: true, level }` | Zoom in/out (1 = default) |

**Directions for `fly()`:**
- `'forward'` — Move along view direction (into scene)
- `'backward'` — Move opposite view direction (toward camera)
- `'left'` — Strafe left
- `'right'` — Strafe right

---

## Workflow Examples

### "Show me my birth"
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "March 6th"
# → focusNode('day-2026-03-06')
# → Camera flies to Fork #001 planet
```

### "How many days are in the graph?"
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "how many days"
# → getNodes('day-anchor').length
# → "30 day anchors in graph"
```

### "Fly forward through time"
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "fly forward"
# → fly('forward', 1000)
# → Camera moves forward 1000 units
```

### "Zoom in on this planet"
```bash
node skills/jarvis-nav/scripts/jarvis-nav.js "zoom in"
# → zoom(2)
# → Camera 2x closer
```

---

## Troubleshooting

### "API not found"
**Cause:** Page hasn't loaded yet, or code not deployed.

**Fix:**
1. Refresh page: `openclaw browser --browser-profile chrome-relay navigate "https://localhost:18787/"` (or open UI manually)
2. Wait 2 seconds
3. Retry: `window.JarvisNav` check

### "No tabs found"
**Cause:** Jarvis UI not open in chrome-relay profile.

**Fix:**
1. User: Open Chrome, click extension icon, activate relay
2. User: Navigate to `https://localhost:18787/`
3. Retry navigation

### "Node not found"
**Cause:** Invalid node ID or node doesn't exist.

**Fix:**
1. List available nodes: `getNodes('day-anchor')`
2. Pick valid ID from list
3. Retry with correct ID

---

## Notes

- **Profile:** Always use `chrome-relay` (not `openclaw` or `user`)
- **URL:** Always `https://localhost:18787/` (production)
- **API:** `window.JarvisNav` exposed after neurograph loads
- **Feedback:** All methods return `{ ok: true/false, ... }`
- **Collaboration:** User has mic access in their Chrome → can talk while AI navigates

---

## Future Enhancements

- [ ] Redux store for navigation history (replay sessions)
- [ ] Undo/redo navigation
- [ ] Export/import navigation paths as JSON (beyond `?node=` links)
- [ ] Keyboard shortcut bindings (when canvas focused)
- [ ] Auto-focus on node after `focusNode()` (open info panel)
- [ ] Screenshot capture after navigation (document exploration)
