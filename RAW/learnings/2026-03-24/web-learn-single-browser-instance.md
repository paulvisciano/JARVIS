# Web-Learn: Single Browser Instance Pattern

**Date:** 2026-03-24
**Type:** pattern
**Status:** extracted

## The Pattern

Open **ONE browser tab**, navigate to different pages — don't open new tabs for each screenshot.

## What Was Wrong

**Before:** Opened new browser tab for each page
- Multiple tabs, same domain
- Resource waste
- Confusing UX
- Potential rate limiting issues

## What We Fixed

**After:** Opens ONE tab, navigates internally:

```javascript
// Open browser ONCE
const browserOutput = execSync(`openclaw browser open "${URL}"`, { timeout: 30000 });

// Pages to capture (homepage + nav links)
const pages = [
  { path: '', name: 'homepage' },
  { path: '/about', name: 'about' },
  { path: '/learn', name: 'learn' },
  { path: '/tools', name: 'tools' },
  { path: '/docs', name: 'docs' }
];

// Navigate within same instance
for (const page of pages) {
  // Screenshot current page
  // Save to archive
}
```

## Why This Matters

**Efficiency:**
- Single browser process
- Faster navigation
- Less resource consumption
- Cleaner screenshot organization

**User Experience:**
- No tab explosion
- Predictable behavior
- Easier to debug

## File Organization

Screenshots saved to:
- `~/RAW/archive/YYYY-MM-DD/images/web-{domain}-{page}.jpg`
- Example: `web-git-scm-com-homepage.jpg`

Copied from OpenClaw's media folder:
- `~/.openclaw/media/browser/<uuid>.jpg` → organized archive