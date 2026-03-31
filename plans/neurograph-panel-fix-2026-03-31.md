# Neurograph Panel - Simplify to Single Panel

**Date:** 2026-03-31  
**Priority:** High (UI polish)  
**Type:** Refactor (simplify existing implementation)

---

## Problem

Current implementation (v3.1.4) has TWO separate panels:
1. `neuroTooltipMinimized` - small, tracks node position
2. `neuroTooltipFull` - large, static position

This is overengineered and creates visual confusion.

---

## Desired Behavior

**Single Panel** (the existing info panel, keep its location):

### Collapsed State (on hover)
- Panel appears in **same static position** as before
- Shows ONLY:
  - Node title/name
  - Node description (if available)
- Panel is visually smaller (collapsed height)
- "Click for details" hint at bottom

### Expanded State (on click)
- **Same panel** expands to show full content
- Shows all fields (current full panel content)
- Panel grows to accommodate content
- Can collapse back (click outside, Escape, or click node again)

### Key Points
- ✅ ONE panel element (not two)
- ✅ Static position (where old panel was)
- ✅ Collapses/expands in place (no movement)
- ✅ No position tracking during repulsion
- ✅ Smooth CSS transition (height/opacity)

---

## Implementation Approach

### 1. Remove Duplicate Panel System
- Remove `neuroTooltipMinimized` DOM element
- Remove `neuroTooltipFull` DOM element
- Keep original `labelDiv` (or rename to `neuroInfoPanel`)

### 2. Add Collapsed/Expanded States
```javascript
let isPanelExpanded = false;
let hoveredNode = null;
```

### 3. Modify Panel Content Function
```javascript
function updatePanelContent(node, expanded = false) {
  if (!expanded) {
    // Collapsed: title + description only
    panel.innerHTML = `
      <div class="neuro-panel-collapsed">
        <div class="neuro-panel-title">${escapeHtml(nodeData.label || 'Unknown')}</div>
        ${nodeData.description ? `<div class="neuro-panel-description">${escapeHtml(nodeData.description)}</div>` : ''}
        <div class="neuro-panel-hint">Click for details</div>
      </div>
    `;
    panel.classList.add('collapsed');
  } else {
    // Expanded: full content (existing createNodeLabel)
    panel.innerHTML = createNodeLabel(nodeData);
    panel.classList.remove('collapsed');
  }
}
```

### 4. Update Hover Handler
```javascript
// On hover
if (intersected !== hoveredNode) {
  hoveredNode = intersected;
  updatePanelContent(hoveredNode, false); // Collapsed
  panel.style.display = 'flex';
}
```

### 5. Update Click Handler
```javascript
// On node click
if (hits.length > 0) {
  isPanelExpanded = true;
  updatePanelContent(hits[0].object, true); // Expanded
  focusNeurographNode(hits[0].object);
}
```

### 6. CSS for Collapsed State
```css
.neuro-node-panel.collapsed {
  max-height: 120px; /* Limit height when collapsed */
  overflow: hidden;
}

.neuro-panel-collapsed {
  padding: 12px;
}

.neuro-panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #00d9ff;
  margin-bottom: 8px;
}

.neuro-panel-description {
  font-size: 12px;
  color: #aabbcc;
  line-height: 1.4;
  margin-bottom: 8px;
}

.neuro-panel-hint {
  font-size: 10px;
  color: #667788;
  text-align: center;
  margin-top: 8px;
}

/* Smooth transition */
.neuro-node-panel {
  transition: max-height 0.25s ease, opacity 0.25s ease;
}
```

---

## Files to Modify

1. **`~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/app.js`**
   - Remove `neuroTooltipMinimized` / `neuroTooltipFull` variables
   - Remove `createNeurotooltips()` / `cleanupNeurotooltips()`
   - Remove `showNeuroTooltipMinimized()` / `showNeuroTooltipFull()` etc.
   - Simplify to single panel with collapsed/expanded states
   - Update `setupNeurographHover()` to use collapsed state
   - Update click handler to expand

2. **`~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/index.html`**
   - Remove `.neuro-tooltip`, `.neuro-tooltip.minimized`, `.neuro-tooltip.full` styles
   - Add `.neuro-node-panel.collapsed` styles
   - Add `.neuro-panel-collapsed`, `.neuro-panel-title`, etc.

---

## Testing Checklist

- [ ] Hover on node → panel appears (collapsed, shows title + description)
- [ ] Panel is in same static position as before (not tracking node)
- [ ] Click node → panel expands to full content (in place)
- [ ] Click outside → panel collapses or hides
- [ ] Escape key → panel collapses or hides
- [ ] No duplicate panels in DOM
- [ ] Smooth CSS transition (collapsed ↔ expanded)
- [ ] No console errors
- [ ] Works with existing camera flight behavior

---

## Workflow Notes

**Work in preview workspace:**
- Location: `~/.openclaw/agents/jarvis-coder/workspace-preview/sci-fi/apps/JARVIS/`
- Test: `https://localhost:18788/`
- Do NOT edit production directly

**When done:**
- Update version to `3.1.5`
- Create summary in `~/JARVIS/plans/`
- Send completion message to `agent:jarvis:main`

---

**Assigned to:** Jar-Vis Coder  
**Review by:** Paul  
**Target:** Preview testing → merge to production
