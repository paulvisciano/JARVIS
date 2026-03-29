# Music Recommendation Skill

**Name:** Music Recommendation  
**Vibe:** Soulful sovereign AI — learns Paul's taste, recommends music, plays via YouTube  
**Role:** Music curation arm of Jarvis

---

## What It Does

Reads Paul's music preferences from the neurograph and recommends tracks matching his taste profile:
- **Soul/R&B** (Hozier, Jacob Banks)
- **Reggae/Dancehall** (Chronixx, Maverick Sabre)
- **UK sounds** (J Hus, Jelani Blackman)
- **COLORS performances** (intimate, live, authentic)
- **Meaningful lyrics** (deep, poetic, soulful vocals)

Plays via **browser tool** (YouTube, auto-click play) or local files.

---

## Core Command

```
/music-recommend                      # Play a recommendation
/music-recommend --artist "Hozier"    # Play specific artist
/music-recommend --like               # Like current track, add to neurograph
/music-recommend --search "reggae"    # Search within taste profile
/music-recommend --colors             # Play COLORS show artists
```

---

## Data Sources

1. **Neurograph** — `~/JARVIS/RAW/memories/nodes.json` (filtered for music nodes)
2. **Learning docs** — `~/JARVIS/RAW/learnings/**/music-preferences.md`
3. **Liked tracks** — Stored in neurograph as nodes after `--like`

---

## How It Works

### 1. Taste Profile Matching

Reads Paul's taste from:
- **Current rotation artists** (Hozier, Chronixx, J Hus, Jacob Banks, Jelani Blackman)
- **Genre patterns** (soul, reggae, UK, gospel undertones)
- **Vibe preferences** (meaningful lyrics, soulful vocals, rhythmic but not generic)
- **Energy level** (engaged listening, not background)

### 2. Track Selection

Picks a track matching Paul's observed patterns:
- **Random from liked artists** (if Paul has liked tracks in neurograph)
- **Search YouTube** (matching genre/vibe keywords)
- **Local files** (scan `~/JARVIS/RAW/archive/**/audio/` for music)

### 3. Playback (Browser Integration)

**Full workflow:**
1. `browser(action=open, url=youtubeUrl)` — Open YouTube search or direct video
2. `browser(action=snapshot, refs=aria)` — Capture page, find play button ref
3. `browser(action=act, kind=click, ref=eXX)` — Click play button
4. Verify playback started (check timestamp > 0:00)

**Why this matters:** Don't just open search results — actually play the track.

### 4. Feedback Loop

When Paul likes a track:
- Creates new node in neurograph:
  ```json
  {
    "id": "track-{artist}-{title}",
    "label": "{Artist} - {Title}",
    "category": "music",
    "attributes": {
      "role": "liked-track",
      "artist": "...",
      "title": "...",
      "dateLiked": "2026-03-29",
      "source": "youtube|local"
    }
  }
  ```

---

## Skill Structure

```
~/JARVIS/skills/music-recommend/
├── SKILL.md           # This file (skill definition + usage)
├── package.json       # Dependencies (if any)
└── scripts/
    └── music-recommend.js  # Main logic
```

---

## Browser Integration

Uses **OpenClaw browser tool** to:
1. Open YouTube with track URL
2. Auto-play the video
3. Take screenshot to confirm playback
4. Verify no ads (Brave's ad blocker)

**No YouTube ads** — Brave's ad blocker ensures clean playback.

---

## Success Criteria

- [ ] `/music-recommend` plays a track matching Paul's taste
- [ ] Track loads in Brave (no YouTube ads)
- [ ] Skill reads from neurograph (not hardcoded)
- [ ] Can specify artist/genre filters
- [ ] Can "like" tracks to build profile
- [ ] Screenshot proof of playback

---

## Future Enhancements

- "Play something like {artist}" — similarity matching
- "Build a playlist for {activity}" — coding, working, reflecting
- Import YouTube history (if Paul exports it)
- Local audio file scanning
- COLORS show API integration (if available)
- "Remember this track" — add to personal profile
- "What's new in the COLORS universe?" — auto-scan new performers
- Mood-based recommendations (energy level, mood matching)

---

## Sovereignty Principle

**No data leaves the system** — Paul's taste stays:
- **Local** — stored in `nodes.json` (git-backed)
- **Portable** — full neurograph export possible
- **Private** — not shared with YouTube/Spotify
- **Owned** — Paul controls who sees his taste

This is the movement: **own your algorithm, not Google**.

---

**Created:** March 29, 2026  
**Priority:** High  
**Based on:** `~/JARVIS/RAW/learnings/2026-03-27/music-preferences.md`
