# DOM References Outside IIFE Execute Before DOM Ready

**Date:** 2026-03-29
**Type:** realization
**Status:** extracted

## Problem

DOM element references defined at the top of `app.js` (outside IIFE) return `null` even when init functions are called inside the IIFE:

```javascript
// Line 92 - TOP OF FILE (before DOM loads)
const jarvisOrbContainer = document.getElementById('jarvis-orb-container');

// Line 1470 - INSIDE IIFE (after DOM should be ready)
function initTextInput() {
  if (jarvisOrbContainer) {  // Always null!
    jarvisOrbContainer.addEventListener('click', ...);
  }
}
```

## Root Cause

- Script loads in `<head>` or early in document
- Variable declarations execute immediately when script parses
- DOM elements don't exist yet at parse time
- IIFE wrapping doesn't help—references already null

## Solution

Move DOM references inside init functions that run after DOM is ready:

```javascript
function initTextInput() {
  // Get references dynamically when function runs
  const textInputContainerRef = document.getElementById('text-input-container');
  const jarvisTextInputRef = document.getElementById('jarvis-text-input');
  const jarvisSendBtnRef = document.getElementById('jarvis-send-btn');
  
  if (!textInputContainerRef || !jarvisTextInputRef || !jarvisSendBtnRef) {
    console.warn('[TextInput] DOM elements not found');
    return;
  }
  
  // Now safe to attach listeners
  jarvisOrbContainer.addEventListener('click', ...);
}
```

## Key Takeaway

DOM references must be obtained at execution time (inside functions), not at parse time (top of file). IIFE scope doesn't solve timing—only deferring reference acquisition does.