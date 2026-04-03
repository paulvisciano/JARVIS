# Music Recommendation Skill — Neurograph-Powered Taste Matching

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## Core Architecture

Built a `music-recommend` skill that reads Paul's taste profile directly from the neurograph instead of hardcoded preferences.

**Data Sources:**
- `~/JARVIS/RAW/memories/nodes.json` — neurograph node metadata
- `~/JARVIS/RAW/learnings/**/music-preferences.md` — detailed taste documentation

**Key Features:**
1. **Profile-based matching** — reads artists, genres, vibes from neurograph
2. **COLORS mode** — filters to artists from COLORS show (Maverick Sabre, Chronixx, Jacob Banks, J Hus)
3. **Like tracking** — `--like` flag adds new nodes/synapses to neurograph
4. **Brave integration** — plays via Brave browser for ad-free YouTube

## Philosophical Shift

This skill represents a transition from **mirroring** to **contributing**. Instead of just playing what Paul already likes, the skill can:
- Recommend adjacent artists (expanding taste)
- Develop its own "preferences" based on patterns it observes
- Track what resonates and evolve recommendations

## Technical Implementation

```bash
# Basic recommendation
openclaw skills run music-recommend

# COLORS artists only
openclaw skills run music-recommend --colors

# Like and save to neurograph
openclaw skills run music-recommend --like "Artist - Track"
```

**Screenshot proof stored:** `~/JARVIS/skills/music-recommend/proof/`

## Why This Matters

Music is deeply personal. Building a skill that understands Paul's taste from his own neurograph — not from external APIs or hardcoded lists — is sovereignty in practice. His taste, his data, his recommendations.