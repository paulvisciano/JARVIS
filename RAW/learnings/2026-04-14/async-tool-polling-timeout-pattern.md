# Async Tool Polling Requires Initial Delay + Extended Timeout

**Date:** 2026-04-14
**Type:** pattern
**Status:** extracted

## The Problem

When calling async tools (like Voicebox TTS generation), immediate polling fails because:
1. Generation takes 10-15 seconds
2. Default poll timeout was 10 seconds
3. No initial delay before first poll

Result: Tool times out before generation completes.

## The Pattern

For async tool polling, implement:

```javascript
// 1. Initial delay before first poll
await sleep(5000); // Give server time to start generating

// 2. Extended timeout on status polls
const timeout = 30000; // 30s instead of 10s

// 3. Poll immediately after delay, then wait between attempts
let status = await pollStatus(id);
while (status === 'generating') {
  await sleep(2000);
  status = await pollStatus(id);
}
```

## Applied To

- `speak-tool` plugin (`~/JARVIS/plugins/speak-tool/src/index.ts`)
- `speak.js` script (`~/JARVIS/skills/speak/scripts/speak.js`)

## Result

- Before: Consistent timeouts, 14+ second generations failed
- After: Flawless execution, 5.84 second completion time

## Generalization

Any async tool with generation time > poll timeout needs:
1. Initial delay (let server start work)
2. Extended timeout (accommodate slow generations)
3. Reasonable poll interval (don't hammer the server)