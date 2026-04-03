# Music Recommendation Skill

**Play music based on Paul's taste profile from the neurograph**

---

## Quick Start

```bash
# Navigate to the skill directory
cd ~/JARVIS/skills/music-recommend

# Play a recommendation based on Paul's taste
node scripts/music-recommend.js

# Play specific artist
node scripts/music-recommend.js --artist "Hozier"

# Play a track from COLORS performances
node scripts/music-recommend.js --colors

# Search by genre
node scripts/music-recommend.js --search "reggae"

# Like current track (adds to neurograph)
node scripts/music-recommend.js --like
```

---

## Taste Profile

The skill matches Paul's observed preferences:

| Artist | Genre | Vibe |
|--------|-------|------|
| Hozier | Soul/R&B | Soulful, intense, poetic |
| Maverick Sabre | Reggae/Soul | Reggae/soul fusion |
| Chronixx | Reggae | Conscious reggae |
| J Hus | Afrobeats/Dancehall | UK Afrobeats |
| Jacob Banks | Soul/Gospel | Gospel influences |
| Jelani Blackman | UK Soul | UK soul/hip-hop |

**Patterns:** COLORS performances, meaningful lyrics, soulful vocals, engaged listening

---

## Data Sources

- **Neurograph:** `~/JARVIS/RAW/memories/nodes.json`
- **Learning:** `~/JARVIS/RAW/learnings/2026-03-27/music-preferences.md`

---

## Browser Integration

- Opens YouTube via **Brave browser** (ad-free playback)
- Takes screenshot for verification
- Console check for errors

---

## Like Tracks

Run with `--like` to add track to Paul's music profile in the neurograph:

```bash
node scripts/music-recommend.js --like
```

This creates a new node in `nodes.json` with:
- Artist and track name
- Date liked
- Source (youtube/local)
- Link to this learning doc

---

## Sovereignty

**Paul owns his algorithm.** No data leaves the system:
- Taste profile stored locally in `nodes.json`
- Git-backed and portable
- Private (not shared with YouTube/Spotify)

---

## Success Criteria ✅

- [x] `/music-recommend` plays a track matching Paul's taste
- [x] Track loads in Brave (ad-free via Brave ad blocker)
- [x] Skill reads from neurograph (not hardcoded)
- [x] Can specify artist/genre filters
- [x] Can "like" tracks to build profile
- [x] Screenshot proof available

---

**Created:** March 29, 2026  
**Priority:** High  
**Based on:** `~/JARVIS/RAW/learnings/2026-03-27/music-preferences.md`
