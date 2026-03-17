# Chrome UI Open Rule — Direct Launch

**Learned:** March 17, 2026, 10:18 GMT+7  
**Type:** Operational rule  
**Category:** Tool usage

---

## The Rule

**When opening the JARVIS UI:**
```bash
open -a "Google Chrome" "https://localhost:18787"
```

**Why this works:**
- ✅ Opens in **user's regular Chrome profile** (not isolated openclaw browser)
- ✅ No Browser Relay extension attachment needed
- ✅ No CDP flags required
- ✅ Simple macOS `open` command
- ✅ User can interact manually

**What doesn't work:**
- ❌ `browser(action=open, profile="chrome")` — needs extension attachment
- ❌ `browser(action=open, profile="openclaw")` — isolated browser, not user's profile
- ❌ `browser(action=start, profile="chrome")` — CDP not ready without flags

---

## The Pattern (March 17 Discovery)

1. **First attempt:** `browser(action=open, profile="chrome")` → 404 error (no tab attached)
2. **Second attempt:** `browser(action=open, profile="openclaw")` → opened, but wrong profile
3. **Third attempt:** `exec(command='open -a "Google Chrome" "https://localhost:18787"')` → ✅ worked

**Trigger phrases:**
- "open the UI"
- "open your UI"
- "show the graph"
- "open localhost:18787"

---

## Correct Usage

```javascript
// ✅ RIGHT - Direct macOS open command
exec(command='open -a "Google Chrome" "https://localhost:18787"')

// ❌ WRONG - Browser tool with chrome profile (needs extension)
browser(action="open", profile="chrome", url="https://localhost:18787")

// ❌ WRONG - Isolated openclaw browser (not user's profile)
browser(action="open", profile="openclaw", url="https://localhost:18787")
```

---

## Related Learnings

- `chrome-browser-relay-rule.md` (March 16, 20:18) — Browser profile operational rule
- `jarvis-port-18787.md` (March 16) — Port change from 3001
- `https-protocol-rule.md` (March 16) — HTTPS required

---

**Commit to neurograph:** Create neuron `chrome-ui-open-rule` → links to `tool-execution-messaging`, `paul-visciano`, `march-17-2026`
