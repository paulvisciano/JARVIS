# NeuroGraph Search-First UI

**Date:** 2026-03-26
**Type:** Decision
**Status:** extracted

## The Pattern
**Search must be independent of collapsible panels.**

During NeuroGraph development, a key usability friction emerged: when side panels collapsed, search functionality was hidden or secondary.

## The Fix
1. **Search Bar:** Always visible on the main screen (top/center).
2. **Filters:** Collapsible dropdown *from* the search bar, not a separate panel.
3. **Panels:** Side panels (JARVIS/User graphs) are for visualization, not primary navigation.

## Why It Matters
- **Discoverability:** Users can search even when graphs are maximized.
- **Focus:** Reduces UI clutter; search is the primary entry point.
- **Consistency:** Matches modern search-first interfaces (Spotlight, Alfred, etc.).

## Lesson
Don't hide navigation behind structural elements. **Search is the compass, graphs are the map.**