# Live Transcription UI Lag Bug

**Timestamp:** 13:04 - 13:57 GMT+7 (March 16, 2026)  
**Type:** bug-fix  
**Category:** learning

---

## Problem

The Jarvis web UI live transcription falls behind during recording sessions. Once the UI gets stuck showing an old transcript state, it doesn't update to show the latest completed transcription.

### Symptoms

- UI shows "recording" indicator but doesn't refresh after recording completes
- Live transcription panel displays outdated messages
- Requires manual page refresh to see new transcripts
- State sync issue between recording completion and UI re-render

---

## Timeline (from Transcript)

**13:04** — First reported:
> "What's not working right now is in the Jarvis web UI, the live transcription falls behind sometimes. It's not showing the latest transcript and once it gets in that state, it's stuck like that."

**13:51** — Still broken after fixes:
> "now the next thing to fix is the UI is still showing the old message in the live transcription so it says live transcription listening then at the bottom it says recording while I'm talking so that all looks good but then when the recording is done and I hit space to end the recording the live transcription should show the latest transcription but right now it doesn't"

**13:57** — Confirmed still broken:
> "Yeah, but the UI is not showing the latest transcript still."

**15:29** — Fixed in version 2.7.0:
> "Hey Jarvis, it worked. Now I'm able to talk to you."

---

## Root Cause

State synchronization issue between:
1. Recording completion event (whisper-cpp finishes transcription)
2. UI re-render trigger (React/state not refreshing transcript array)
3. Live transcription panel not re-querying latest state

The server was appending new transcripts to the archive but not triggering UI state updates.

---

## Fix Applied

**Server Version:** 2.7.0  
**File:** `/Users/paulvisciano/SCI-FI/apps/JARVIS/jarvis-server.js`

Changes:
- Force UI state refresh after transcription completes
- Re-render transcript array on new entry
- Clear "recording" state when done

---

## Validation

**15:29** — Testing:
> "Okay, now testing out with version 2.7.0, it is 3:14 PM, let's see if the bug is fixed."

**15:29** — Confirmed working:
> "Hey Jarvis, it worked. Now I'm able to talk to you."

---

## Related Nodes

- `jarvis-port-18787` (Infrastructure)
- `jarvis-server-lifecycle` (Learnings)
- `neurograph-navigation-march-16` (Learnings)
- `transcript-march-16` (Archive)
- `temporal-march-16` (Temporal)

---

## Synapses

- `live-transcription-ui-lag` → `temporal-march-16` (temporal, learned on)
- `live-transcription-ui-lag` → `transcript-march-16` (references, documented in)
- `live-transcription-ui-lag` → `jarvis-server-lifecycle` (references, fixed in)

---

**Archived:** March 16, 2026, 22:03 GMT+7  
**Author:** Jarvis (git-backed neural mind)  
**Status:** Committed to learnings, neurograph integrated
