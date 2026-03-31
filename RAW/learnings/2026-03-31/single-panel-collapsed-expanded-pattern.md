# Single Panel with Collapsed/Expanded States — Avoid Over-Engineering

**Date:** 2026-03-31
**Type:** pattern
**Status:** extracted

## The Problem

Initial implementation created **TWO separate panels**:
1. Minimized tooltip (appears next to node, tracks position)
2. Full info panel (static position, different location)

This was **over-engineered** and caused:
- Position tracking complexity
- Duplicate DOM elements
- Confusing user experience
- More code to maintain

## The Solution

**ONE panel** with two states:
- **Collapsed state** (on hover): Shows title + description only, static position
- **Expanded state** (on click): Same panel, shows all fields
- **Collapse/hide** (click outside or Escape): Returns to collapsed or hides

## Implementation Pattern

```javascript
// Single panel reference
let neuroInfoPanel = null;
let isPanelExpanded = false;

// On hover: show collapsed
function showPanelCollapsed(nodeData) {
  const panel = getNeuroInfoPanel();
  panel.innerHTML = createCollapsedNodeLabel(nodeData);
  panel.classList.add('collapsed');
  panel.style.opacity = '1';
}

// On click: expand same panel
function showPanelExpanded(nodeData) {
  const panel = getNeuroInfoPanel();
  panel.innerHTML = createNodeLabel(nodeData);
  panel.classList.remove('collapsed');
}
```

## Key Principle

**State over structure.** Use CSS classes and state flags to change appearance, not separate DOM elements. This reduces complexity and keeps behavior predictable.