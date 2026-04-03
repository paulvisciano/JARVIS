# Neurograph Hover → Click Expand UX

**Date:** 2026-03-31  
**Priority:** Medium  
**Area:** JARVIS UI (neurograph interaction)

---

## Current Behavior

- Hover on neurograph node → large info panel appears
- Panel has static position (fixed on screen)
- Panel is large/full-size immediately on hover

## Desired Behavior

### Hover State (Minimized)
- Hover on node → small tooltip appears **right next to the hovered node**
- Tooltip shows minimal info:
  - Node title/label
  - Maybe 1-2 key attributes (category, type)
  - "Click for details" hint
- Tooltip should be compact, unobtrusive
- Position: anchored to node position (follows the node)

### Click State (Expanded)
- Click on node → minimized tooltip expands to full info panel
- Full panel shows:
  - All node fields
  - Attributes
  - Connections/synapses
  - Moments
  - Graph context
- Panel can be dismissed (click outside, Escape key)

---

## Technical Approach

### Files to Modify
- `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/app.js`

### Key Functions
- `setupNeurographHover()` — currently handles hover + label display
- `createNodeLabel()` — generates the full panel HTML
- `applyNeurographHoverVisual()` — current hover visual state
- `focusNeurographNode()` — current click-to-focus behavior

### Implementation Steps

1. **Create minimized tooltip HTML**
   - New function: `createMinimizedNodeLabel(nodeData)`
   - Returns compact HTML (title + 1-2 fields)
   - Much smaller DOM element

2. **Modify hover handler**
   - On hover: show minimized tooltip (not full panel)
   - Position tooltip near node (use node's screen coordinates)
   - Tooltip should track node if it moves (during repulsion animation)

3. **Modify click handler**
   - On click: expand minimized tooltip → full panel
   - Animate the expansion (smooth transition)
   - Or: hide minimized, show full panel at same position

4. **Positioning logic**
   - Minimized: positioned relative to node's `getBoundingClientRect()` or 3D → 2D projection
   - Full panel: can be static (current behavior) or centered

5. **Cleanup**
   - Hover off (without click): hide minimized tooltip
   - Click outside: collapse back to minimized or close entirely
   - Escape key: close panel

---

## Success Criteria

- [ ] Hover shows small tooltip next to node
- [ ] Tooltip shows minimal info (title, category)
- [ ] Click expands to full info panel
- [ ] Smooth animation on expand
- [ ] Tooltip positioned correctly (next to hovered node)
- [ ] No console errors
- [ ] Works with existing focus/camera flight behavior

---

## Notes

- Keep existing `focusNeurographNode()` camera flight behavior
- Minimized tooltip should be lightweight (not full DOM re-render)
- Consider CSS transitions for smooth expand animation
- Test with many nodes (performance with 1000+ nodes)

---

## Reference

Current hover code in `app.js`:
- `setupNeurographHover()` — line ~1500
- `createNodeLabel()` — generates full panel
- `labelDiv` — the floating label element
