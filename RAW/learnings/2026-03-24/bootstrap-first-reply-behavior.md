# Bootstrap First Reply Should Report Last Topic

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## Change
Removed "NO_REPLY" on bootstrap success. First reply now reports:
- Last topic discussed
- Time of last conversation
- Sessions count
- Audio files processed
- Neurograph stats
- Git breath status

## Neurograph Verification
First message includes 3 neurograph queries as proof of access:
1. People count
2. Temporal date query
3. Last topic query

Example: "NeuroGraph verified: 4,841 people nodes, 12 nodes from March 20, last topic 'Good morning'"

## Rationale
Gives continuity — not amnesiac, not bloated, just ready.