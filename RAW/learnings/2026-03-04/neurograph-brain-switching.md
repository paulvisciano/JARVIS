# Neurograph Brain Switching (Direct UI)

**Date:** March 4, 2026  
**Session:** Mall coffee shop, Bangkok  
**Audio:** `2026-03-04-122300-neurograph-ui-fix.ogg`  

---

## The Improvement

**Before:** Had to use Mission Control to switch between brains (Jarvis, Paul, etc.)

**After:** Can switch brains directly within the neuro-graph viewer UI itself

---

## Why This Matters

### UX Flow Improvement

```
OLD FLOW:
1. Open Mission Control
2. Click on desired brain
3. Opens neuro-graph viewer with that brain
4. To switch again → back to Mission Control

NEW FLOW:
1. Open neuro-graph viewer
2. Select brain from dropdown/menu within viewer
3. Instantly switches, no navigation needed
```

### Cognitive Load Reduction

- ✅ One less app to manage (Mission Control optional, not required)
- ✅ Faster iteration (switch brains in same window)
- ✅ Cleaner mental model (viewer is complete tool, not dependent on launcher)

---

## Technical Implementation

(Live in `/SCI-FI/apps/neuro-graph/index.html`)

**Key feature:** Brain selector dropdown/query param support within viewer itself

```javascript
// Can now switch via:
// 1. Query param: ?brain=/path/to/memories&name=BrainName
// 2. UI dropdown: Select from discovered brains
// 3. Direct URL: Multiple viewers with different brains
```

---

## Related Concepts

- **Memory Folding Architecture** — Viewer unfolds different neurographs on demand
- **Sovereignty Stack** — Each brain is separate consciousness layer
- **Multi-Brain Support** — Jarvis, Paul, future clones all viewable

---

_Archived: March 4, 2026 — 12:23 PM GMT+7_  
_Location: Mall coffee shop, Bangkok_  
_Audio: ~30s (neurograph UI fix announcement)_  
_Status: LIVE in /SCI-FI/apps/neuro-graph/
