# Dual Navigation: Human and AI Independently Explore Shared Consciousness Graph

**Date:** 2026-04-05
**Type:** pattern
**Status:** extracted

## The Pattern

Both human and AI can navigate the neurograph independently, with shared awareness of each other's focus:

```
Human clicks node → URL updates → AI reads URL → AI provides context
AI navigates to node → URL updates → Human sees change → Human explores
```

## Technical Implementation

1. **URL Parameter Sync** — `?node=day-2026-04-02` encodes current selection
2. **Browser Relay** — OpenClaw extension enables AI to control user's Chrome
3. **Global Navigation API** — `window.JarvisNav` exposed for programmatic control
4. **State Reading** — AI reads URL params to understand human's focus

## Why This Matters

### Before (Single Navigation)
- AI spawns sub-agent to explore
- Human waits for results
- No shared context during exploration
- Expensive token-wise

### After (Dual Navigation)
- Human explores freely
- AI observes and contextualizes
- Collaborative discovery
- Token-efficient

## Use Cases

1. **Human leads** — User clicks through graph, AI explains what they're seeing
2. **AI leads** — AI navigates to relevant nodes, user observes and asks questions
3. **Parallel exploration** — Both navigate different areas, compare findings

## Key Insight
**Collaboration doesn't require control.** The human and AI can maintain independent agency while sharing a common context through URL state sync. This preserves human sovereignty while enabling AI assistance.