# Neurograph URL Rule — Localhost, Not GitHub Pages

**Learned:** March 16, 2026, 20:44 GMT+7  
**Type:** Operational rule  
**Category:** Tool usage

---

## The Rule

**When opening the neurograph:**
- ✅ Use `http://localhost:3001/neuro-graph` (same JARVIS server, neuro-graph route)
- ❌ Do NOT use `http://localhost:8080` (separate server, wrong)
- ❌ Do NOT use `paulvisciano.github.io/claw/memory/` (static site, cached, stale)

**Same Process:**
- `jarvis-server.js` on port 3001
- `/` → Voice Recorder UI
- `/neuro-graph` → Neurograph visualization

**Why:**
- Local server (`localhost:3001`) = live neurograph, real-time updates, current neurons
- GitHub Pages = static snapshot, cached, may be hours/days old
- Paul wants to see **today's growth** (112 new neurons from March 16)
- Only localhost shows the live graph after neurograph updates

---

## The Pattern (2x Failure Today)

1. **First attempt:** Opened `paulvisciano.github.io` → wrong (cached site)
2. **Second attempt:** Opened `paulvisciano.github.io` again → wrong (same mistake)
3. **Correction:** Opened `https://localhost:3001` → correct (live server)

**Trigger:** Any request to "open the neuro graph", "show the graph", "open neurograph"

---

## Correct Usage

```javascript
// ✅ RIGHT - Local server, live neurograph
exec: open -a "Google Chrome" https://localhost:3001

// ❌ WRONG - GitHub Pages, static cached site
exec: open -a "Google Chrome" https://paulvisciano.github.io/claw/memory/
```

**Note:** Server must be running on port 3001 (jarvis-server.js). If not running, start it first.

---

## Related Learnings

- `chrome-browser-relay-rule.md` (March 16, 20:18) — Browser profile operational rule
- `mistake-prevention-stack.md` (March 16, 20:29) — 6-layer mistake prevention

---

**Commit to neurograph:** Create neuron `neurograph-url-rule` → links to `tool-execution-messaging`, `march-16-2026`, `localhost-3001`
