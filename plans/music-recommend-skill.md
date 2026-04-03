# Music Recommendation Skill Plan

**Date:** 2026-03-29  
**Priority:** High  
**Based on:** `~/JARVIS/RAW/learnings/2026-03-27/music-preferences.md`

---

## Goal

Build a `music-recommend` skill that:
1. Reads Paul's music preferences from the neurograph
2. Recommends tracks matching his taste (soul, reggae, UK sounds, meaningful lyrics)
3. Plays via Brave browser (ad-free YouTube) or local files
4. Keeps all data sovereign — no external APIs tracking taste

---

## Skill Location

`~/JARVIS/skills/music-recommend/SKILL.md`

---

## Features

### Core Commands
```
/music-recommend                      # Play a recommendation
/music-recommend --artist "Hozier"    # Play specific artist
/music-recommend --like               # Like current track, add to neurograph
/music-recommend --search "reggae"    # Search within taste profile
/music-recommend --colors             # Play COLORS show artists
```

### Data Sources
1. **Neurograph** — `nodes.json` filtered for music-preferences
2. **Learning docs** — `~/JARVIS/RAW/learnings/**/music-preferences.md`
3. **Liked tracks** — Future: store in neurograph as nodes

### Playback Options
1. **YouTube via Brave** — Open browser tab, ad-free
2. **Local files** — Scan `~/RAW/archive/**/audio/` for music
3. **Spotify API** — Optional, only if Paul opts in

### Taste Matching
Match against Paul's observed patterns:
- **Artists:** Hozier, Maverick Sabre, Chronixx, J Hus, Jacob Banks, Jelani Blackman
- **Genres:** Soul, R&B, Reggae, Dancehall, UK sounds
- **Vibe:** Deep lyrics, soulful vocals, rhythmic but not generic
- **Energy:** Engaged listening, introspective but not sad, uplifting but not cheesy
- **Special:** COLORS performances preferred

---

## Implementation Steps

1. **Create skill folder structure:**
   ```
   ~/JARVIS/skills/music-recommend/
   ├── SKILL.md           # Skill definition + usage
   ├── package.json       # Dependencies (if any)
   └── scripts/
       └── music-recommend.js  # Main logic
   ```

2. **SKILL.md contents:**
   - Description: "Recommend and play music based on Paul's taste profile from neurograph"
   - Usage examples
   - Data source: neurograph + learnings
   - Playback: Brave browser (YouTube), local files

3. **Script logic:**
   - Read `~/JARVIS/RAW/memories/nodes.json`
   - Filter for music-related nodes (category=music, or label contains "music")
   - Extract artist/track preferences from attributes
   - Pick a track (random from liked, or search YouTube)
   - Open Brave with YouTube URL (ad-free)

4. **Browser integration:**
   - Use OpenClaw `browser` tool to open YouTube
   - Auto-play the track
   - Optional: take screenshot to confirm

5. **Neurograph updates:**
   - When Paul likes a track, create a new node:
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

## Success Criteria

- [ ] `/music-recommend` plays a track matching Paul's taste
- [ ] Track is loaded in Brave (no YouTube ads)
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

---

## Notes

- **No data leaves the system** — Paul's taste stays sovereign
- **Brave browser** for ad-free YouTube (Paul's preference)
- **Neurograph-first** — all preferences stored as nodes
- **Git-backed** — taste profile is versioned, portable

---

**Ready for Coder to implement.**
