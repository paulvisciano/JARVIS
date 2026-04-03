# Node.js Stdout Buffering Causes Missing Exec Output

**Date:** 2026-03-28
**Type:** insight
**Status:** extracted

## The Problem

Bootstrap script output was not appearing in the OpenClaw UI exec panel, even though `console.log` statements were in the code. The script ran successfully but output was "No output" in the UI.

## Root Cause

Node.js buffers stdout by default. When a script exits quickly, the buffer may not flush before the process terminates, causing the UI to capture nothing.

## The Fix

Add explicit synchronous stdout flush at the end of the script:

```javascript
// Force stdout flush before exit
process.stdout.write('', () => {
  setTimeout(() => process.exit(0), 200);
});
```

Or use synchronous wait:
```javascript
const { execSync } = require('child_process');
execSync('sleep 0.2'); // Forces buffer flush
process.exit(0);
```

## Lesson

When writing scripts for tool execution that must display output:
1. Don't rely on automatic stdout flushing
2. Add explicit flush/sync wait before exit
3. Test in the actual execution environment, not just terminal
