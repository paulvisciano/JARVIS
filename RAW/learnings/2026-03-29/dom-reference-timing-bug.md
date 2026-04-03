# DOM Reference Timing Causes Null References

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## The Bug Pattern

Defining DOM element references at the top of a script file:

```javascript
// BAD - runs before DOM is loaded
const jarvisOrbContainer = document.getElementById('jarvis-orb-container');
const jarvisTextInput = document.getElementById('jarvis-text-input');
```

This returns `null` if the script runs before the DOM elements exist.

## The Fix

Move DOM references inside initialization functions that run after DOM is ready:

```javascript
// GOOD - runs after DOM is loaded
function initTextInput() {
  const textInputContainerRef = document.getElementById('text-input-container');
  const jarvisTextInputRef = document.getElementById('jarvis-text-input');
  
  if (!textInputContainerRef || !jarvisTextInputRef) {
    console.warn('[TextInput] DOM elements not found');
    return;
  }
  
  // Continue with initialization...
}
```

## Lesson

Never define DOM element references at the top level of a script that loads in `<head>` or before DOM content. Always obtain references inside initialization functions that run after the DOM is fully parsed.