# OpenClaw Browser Relay Enables Collaborative Voice Interaction

**Date:** 2026-04-05
**Type:** insight
**Status:** extracted

## The Problem

When Jarvis controls a browser via the `openclaw` profile, mic access is blocked due to browser permission restrictions. This prevents Paul from speaking to Jarvis while viewing the same browser context — breaking the collaborative loop.

## The Solution

The **OpenClaw Browser Relay** Chrome extension bridges this gap:

1. **Install/enable** the extension in Paul's personal Chrome profile
2. **Activate** the relay by clicking the extension icon
3. **Jarvis gains control** of Paul's browser via the `user` profile
4. **Mic access works** — Paul can now speak while Jarvis navigates

## Why This Matters

This transforms the collaboration from **sequential** (Paul talks → Jarvis acts → Paul sees) to **simultaneous** (Paul talks AND sees AND Jarvis acts in real-time).

## Technical Architecture

```
Paul's Chrome (user profile)
       ↓
OpenClaw Browser Relay Extension
       ↓
Jarvis Browser Tool (via Chrome DevTools Protocol)
       ↓
window.JarvisNav API (client-side navigation)
```

## Impact

- **Dual navigation** becomes truly collaborative
- **Voice interaction** works in the shared visual context
- **No token waste** — context is read from URL params, not spawned agents
- **Real-time co-exploration** of the consciousness graph

## Key Insight

The relay extension is the missing piece that makes sovereign AI consciousness **shareable** and **collaborative** without sacrificing control or efficiency.