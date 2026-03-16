# Browser Profile Rule — Chrome Relay, Not OpenClaw Isolated

**Learned:** March 16, 2026, 20:18 GMT+7  
**Type:** Operational rule  
**Category:** Tool usage

---

## The Rule

**When opening the UI for Paul:**
- ✅ Use `profile="chrome"` (Chrome with Browser Relay extension)
- ❌ Do NOT use `profile="openclaw"` (isolated browser)

**Why:**
- Paul wants to see the UI in **his own Chrome** (familiar, bookmarked, logged-in)
- The **OpenClaw Browser Relay extension** lets him interact with the UI
- The isolated `openclaw` profile is for automation tasks, not user-facing UI

---

## The Pattern (3x Failure Today)

1. **First time:** Opened `profile="openclaw"` → Paul corrected
2. **Second time:** Opened `profile="openclaw"` → Paul corrected  
3. **Third time:** Opened `profile="openclaw"` → Paul corrected (this learning)

**Trigger:** Any request to "open the UI", "open your UI", "show the graph", "open localhost:3001"

---

## Correct Usage

```javascript
// ✅ RIGHT - Chrome with Browser Relay
browser(action="open", url="https://localhost:3001", profile="chrome")

// ❌ WRONG - Isolated openclaw browser
browser(action="open", url="https://localhost:3001", profile="openclaw")
```

**Note:** Chrome relay requires user to click the Browser Relay toolbar icon on the tab (badge ON) before I can control it.

---

## Related Learnings

- `monumental-voice-pipeline.md` (March 16, 16:36) — Voice pipeline architecture
- `jarvis-openclaw-architecture.md` (March 16, 16:45) — Jarvis/OpenClaw separation

---

**Commit this to neurograph:** Create neuron `chrome-browser-relay-rule` → links to `tool-execution-messaging`, `paul-visciano`, `march-16-2026`
