# Neurograph Rendering Fix: Temporal Node Visibility

**Date:** March 5, 2026  
**Session:** Morning audit (after memory integrity task)  
**Audio:** `2026-03-05-073900-cursor-fix-summary.ogg`  

---

## The Problem

Temporal nodes (temporal-march-01 through temporal-march-04) were created in the neurograph but **not showing in the visualization**.

---

## Root Causes (Debugged by Cursor)

### 1. Missing `frequency` Field → NaN Size Calculation

**Old Code (Broken):**
```javascript
size = baseSize + (n.frequency / 85) * 10 * sizeBoost
```

**What Happened:**
- Temporal nodes don't have `frequency` field
- `n.frequency` = `undefined`
- `undefined / 85` = `NaN`
- `size = NaN`
- Renderer draws with `r = n.size * p.scale` = `NaN`
- **Result:** Nothing visible on graph

---

### 2. Description Only from `attributes` Level

**Old Code (Broken):**
```javascript
desc = n.attributes?.description
```

**What Happened:**
- Temporal nodes use top-level `description` field
- `n.attributes.description` = `undefined`
- Popover shows empty description
- **Result:** Nodes invisible AND no label on hover

---

## The Fixes (neural-graph.js)

### Fix 1: Safe Frequency/Size Calculation

```javascript
// NEW (Fixed by Cursor):
const freq = Number(n.frequency);
const safeFreq = Number.isFinite(freq) ? freq : 10;  // Fallback for temporal nodes
const size = baseSize + (safeFreq / 85) * 10 * sizeBoost;
const glow = safeFreq > 50 ? 1.5 : 1;
```

**Why It Works:**
- Converts frequency to number safely
- Falls back to `10` when undefined/NaN/Infinity
- Temporal nodes now get valid size (small but visible)
- No more NaN propagation

---

### Fix 2: Description Fallback Chain

```javascript
// NEW (Fixed by Cursor):
const desc = n.attributes?.description || n.description || '';
```

**Why It Works:**
- Checks `attributes.description` first (for neurons with nested metadata)
- Falls back to top-level `description` (for temporal nodes)
- Falls back to empty string (graceful degradation)
- All nodes now show descriptions in popover

---

## Impact

### Before Fix
```
Temporal nodes in nodes.json: ✅ Present
Rendered on graph: ❌ Invisible (NaN size)
Popover description: ❌ Empty (wrong field lookup)
User experience: "Where are my temporal nodes?"
```

### After Fix
```
Temporal nodes in nodes.json: ✅ Present
Rendered on graph: ✅ Visible (fallback size = 10)
Popover description: ✅ Shows (top-level description)
User experience: "There's my timeline!"
```

---

## Technical Details

### Data Path Resolution

The app loads from `dataBasePath` (e.g., `JARVIS-memories`) relative to page URL:

```
http://127.0.0.1:8080/?filter=temporal#
  ↓ resolves
JARVIS-memories/nodes.json
  ↓ must be same as (or copy of)
/JARVIS/RAW/memories/nodes.json
```

**Requirement:** The served data must match the actual neurograph files.

---

## Lessons Learned

### 1. **Defensive Programming Matters**
Never assume fields exist. Always validate:
```javascript
// ❌ Assumption:
size = n.frequency / 85

// ✅ Defensive:
freq = Number(n.frequency)
if (!Number.isFinite(freq)) freq = 10
```

### 2. **Flexible Field Lookup**
Support multiple data structures:
```javascript
// ❌ Rigid:
desc = n.attributes.description

// ✅ Flexible:
desc = n.attributes?.description || n.description || ''
```

### 3. **Invisible ≠ Non-Existent**
Just because something doesn't render doesn't mean the data is wrong. Could be:
- Rendering bug (this case)
- CSS hiding it
- Scale/zoom issue
- NaN propagation

**Always check the data first, then the renderer.**

---

## Related Concepts

- **Memory Sanitation** (March 4) — Created the temporal nodes in first place
- **One Temporal Node Per Day** — Organizational rule that temporal anchors follow
- **Neurograph Architecture** — How nodes/synapses map to visual representation

---

_Archived: March 5, 2026 — 7:39 AM GMT+7_  
_Location: Bangkok (morning audit)_  
_Fixed by: Cursor (Paul reviewed, requested summary)_  
_Status: RENDERING FIXED — Temporal nodes now visible_
