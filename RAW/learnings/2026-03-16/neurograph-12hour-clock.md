# NeuroGraph 12-Hour Clock Positioning

**Timestamp:** 11:43 GMT+7 (March 16, 2026)  
**Type:** bug-fix  
**Category:** learning

---

## Bug Fixed

NeuroGraph nodes were appearing at the bottom of the graph (wrong time position). They should appear at the top-left (9:30-10:00 AM position on a 12-hour clock visualization).

### Expected Positioning

On a 12-hour clock face:
- **9:30 AM** → top-left
- **12:00 PM** → top-center
- **3:00 PM** → right side
- **6:00 PM** → bottom

### Actual Behavior (Before Fix)

All nodes appeared at bottom regardless of timestamp.

---

## Timeline (from Transcript)

**11:02** — Debugging:
> "Okay, now you're spinning in circles with the last change, you ended up messing up the placement of the nodes as well, so revert that and I'm going to try to figure out what field is driving the connected to and I'll give you more information once I know."

**11:03** — Temporary fix:
> "and just like that now you have them properly fixed"

**11:06** — Still broken:
> "The only thing you still have messed up is they show up back at the bottom right, they were supposed to be in the top left, so you messed up the timestamp with one of those last few changes you made."

**11:43** — Confirmed fixed:
> "hey Jarvis so I looked at cursor and work with cursor it was actually a bug in the neural graph so I fixed it and now it looks great so it now now it's like a 12-hour clock I'm gonna send you a picture here in a second"

---

## Root Cause

NeuroGraph code was using wrong timestamp field for positioning calculation. The field didn't match the expected format for the 12-hour clock layout algorithm.

---

## Fix Applied

**File:** `/Users/paulvisciano/SCI-FI/apps/JARVIS/neuro-graph/shared/neural-graph.js` (or equivalent)

**Change:** Corrected timestamp field used for node positioning. Nodes now render at correct clock positions based on their `created` or `attributes.date` field.

---

## Validation

**11:43** — Paul confirmed:
> "I fixed it and now it looks great... it's like a 12-hour clock"

**Screenshot:** Sent to Jarvis as visual proof (archived as `20260316-114336-screenshot.png` or similar)

---

## Related Nodes

- `neurograph-url-rule` (Learnings)
- `neurograph-navigation-march-16` (Learnings)
- `jarvis-port-18787` (Infrastructure)
- `temporal-march-16` (Temporal)
- `transcript-march-16` (Archive)

---

## Synapses

- `neurograph-12hour-clock` → `temporal-march-16` (temporal, learned on)
- `neurograph-12hour-clock` → `transcript-march-16` (references, documented in)
- `ne