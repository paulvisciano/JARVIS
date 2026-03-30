# Transcript Speech Bubble Polish

**Date:** 2026-03-30  
**Type:** UI refinement  
**Priority:** High  
**Assigned to:** jarvis-coder  

---

## Goal

Make the transcript panel feel like a **speech bubble coming from Jarvis** (the orb), not a massive header blocking the view.

---

## Current State

- Transcript is anchored to orb's top-right corner (working)
- Header is too large/heavy — dominates the panel
- Overall feel is more "modal" than "natural speech bubble"

---

## What Needs to Change

### 1. **Shrink the header**
- Reduce padding (e.g., `16px` → `8px` or `10px`)
- Reduce font-size on timestamp/status text
- Make the "Expand/Collapse" button more subtle (icon-only or smaller text)
- Consider making header semi-transparent or blending it into the bubble

### 2. **Make the bubble feel lighter**
- Reduce overall panel opacity slightly (e.g., `0.95` → `0.85` or `0.9`)
- Softer border glow (less intense cyan, more subtle)
- Consider removing or softening the gradient rim on the bubble
- Reduce `box-shadow` intensity

### 3. **Improve the speech bubble illusion**
- Add a subtle **triangle/arrow pointer** from the bubble toward the orb (CSS `::before` or `::after` with borders or clip-path)
- Position the arrow at the **bottom-left corner** of the transcript (pointing down-left toward the orb)
- Make the arrow match the bubble's glass style (gradient, blur, border)

### 4. **Typography refinements**
- Reduce base font-size slightly if it feels too large
- Increase line-height for readability at smaller sizes
- Ensure transcript text doesn't feel cramped

### 5. **Animation on appear/disappear**
- Fade + slight scale-in when transcript becomes visible (e.g., `scale(0.95)` → `scale(1)`)
- Fade + slight scale-out when collapsing
- Duration: ~200-250ms, ease-out

---

## Technical Notes

**Files to modify:**
- `apps/JARVIS/index.html` — CSS for `#transcript`, `.transcript-header`, bubble styles
- `apps/JARVIS/app.js` — possibly `toggleTranscriptFullscreen()`, `positionTranscriptBubble()`, animation triggers

**Keep working:**
- Anchoring to orb's top-right (via `positionTranscriptBubble()`)
- Fullscreen expand/collapse functionality
- Scrollable transcript content
- Responsive behavior (mobile/desktop)

**Design reference:**
- Think **iOS message bubbles** or **Discord reply bubbles** — light, subtle, conversational
- Not a **modal dialog** or **notification panel**

---

## Success Criteria

- [ ] Header feels compact, not dominant
- [ ] Bubble feels like it's "coming from" the orb (arrow/pointer helps)
- [ ] Overall panel feels lighter, less intrusive
- [ ] Text is still readable
- [ ] Animations feel smooth, not jarring
- [ ] Works on mobile and desktop

---

## Workflow

1. **Make changes** in `apps/JARVIS/index.html` + `app.js`
2. **Test in browser** — open JARVIS UI, trigger transcript, check:
   - Bubble appearance
   - Header size
   - Arrow/pointer visibility
   - Animations
3. **Lint** — no console errors
4. **Commit** — descriptive message (e.g., `feat(JARVIS): transcript speech bubble polish`)
5. **Push** — `git push origin main`
6. **Report back** with commit hash + brief summary

---

## Context

This is part of the futuristic UI sprint (March 29-30, 2026). The neurograph is working, the orb is a 3D video sphere, vitals are glassmorphic. The transcript should feel like **Jarvis is speaking to you** — not like a chat app panel.

Reference commits from today:
- `a550209` — transcript chat bubble anchored to orb top-right
- `4b4597f` + `3212280` — vitals glass modal
- `5adeba7` — neurograph CPU optimizations

---

**Start when ready. Ping me if anything's unclear.**
