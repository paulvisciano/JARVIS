# Task: Sovereign Music Player — Jarvis Owns the Algorithm

**Date:** 2026-03-27
**Complexity:** 🟡 Medium (browser automation + memory integration)
**Expected Time:** 60-90 minutes

---

## Vision

**"I own the algorithm."**

Instead of Spotify/YouTube/Google knowing Paul's taste and selling it back as "personalization," **Jarvis learns Paul's preferences and plays music he'll love — ad-free, sovereign, private.**

**The flow:**
1. Paul shares music (screenshot, YouTube link, voice memo: "play something like Hozier")
2. Jarvis learns preferences → stores in neurograph (git-backed, portable)
3. Jarvis uses OpenClaw `browser` tool to open YouTube (ad-free via Brave/UBlock)
4. Jarvis plays music Paul loves
5. **No data leaves the machine** — Paul owns his taste profile

---

## Requirements

### 1. **Music Preference Learning**

**Input methods:**

**A. Screenshot analysis (immediate)**
```
Paul: [screenshot of YouTube playlist]
Jarvis: Uses vision model to extract artist names, track titles
Jarvis: Stores in neurograph as music preference nodes
```

**B. YouTube history import (batch)**
```
Paul exports YouTube watch history (JSON/CSV)
Jarvis parses → extracts top artists, genres, patterns
Jarvis stores in neurograph
```

**C. Voice/text commands (ongoing)**
```
Paul: "I love this track — add it to my profile"
Paul: "Play something like Hozier but more reggae"
Paul: "This is perfect — remember this vibe"
```

**Neurograph structure:**
```json
{
  "type": "music_preference",
  "artist": "Hozier",
  "track": "Movement",
  "genre": ["soul", "indie", "alternative"],
  "vibe": ["intense", "poetic", "soulful"],
  "source": "COLORS",
  "likedAt": "2026-03-27T18:24:00Z",
  "playCount": 1,
  "linkedTo": ["temporal-20260327", "paul-visciano"]
}
```

---

### 2. **Music Recommendation Engine**

**When Paul asks for music:**

**Query types:**
- "Play something like [artist]"
- "Play music for [activity: coding/working/relaxing]"
- "Play something [vibe: uplifting/introspective/energetic]"
- "Play new music I'll like" (discovery mode)

**Recommendation logic:**
```javascript
// Pseudo-code for music skill

async function recommendMusic(query) {
  // 1. Parse query for intent
  const intent = parseQuery(query);
  // e.g., { type: 'similar_to', artist: 'Hozier' }
  
  // 2. Search neurograph for matching preferences
  const preferences = await searchNeurograph({
    type: 'music_preference',
    filters: intent.filters
  });
  
  // 3. Extract patterns (artists, genres, vibes)
  const patterns = extractPatterns(preferences);
  
  // 4. Generate search query for YouTube
  const youtubeQuery = buildYouTubeQuery(patterns, intent);
  // e.g., "Hozier type soulful indie music COLORS performance"
  
  // 5. Search YouTube via OpenClaw browser
  const results = await searchYouTube(youtubeQuery);
  
  // 6. Return top recommendations
  return results.slice(0, 5);
}
```

**Learning loop:**
```javascript
// After playing music, ask for feedback
Paul: "Play something like Hozier"
Jarvis: [plays Jacob Banks - Mercy]
Paul: "Love this!" → Jarvis increments preference weight
Paul: "Nah, not feeling it" → Jarvis adjusts algorithm
```

---

### 3. **YouTube Playback via Browser**

**OpenClaw `browser` tool integration:**

**Steps:**
1. Open YouTube in browser (OpenClaw `browser` action=open)
2. Search for track/artist (OpenClaw `browser` action=type + submit)
3. Click first result (OpenClaw `browser` action=click)
4. Optional: Fullscreen, adjust volume (OpenClaw `browser` actions)

**Example:**
```javascript
// OpenClaw browser automation
await openclaw.browser({
  action: 'open',
  url: 'https://youtube.com'
});

await openclaw.browser({
  action: 'type',
  text: 'Hozier Movement COLORS',
  submit: true
});

// Wait for results, click first video
await openclaw.browser({
  action: 'click',
  selector: 'ytd-video-renderer:nth-child(1)'
});
```

**Ad-blocking:**
- Brave browser (built-in ad blocking)
- Or UBlock Origin extension (if using Chrome)
- OpenClaw browser supports extensions

**No API keys needed:**
- Uses browser automation (not YouTube API)
- No quota limits
- No authentication required
- Works like a human using YouTube

---

### 4. **Skill Commands**

**Jarvis skill: `music`**

**Commands:**
```bash
# Learn preferences
/music learn [screenshot|link|voice memo]
/music import youtube-history [file.json]

# Playback
/play [artist/track/vibe]
/play something like Hozier
/play music for coding
/play new discovery

# Manage preferences
/music list favorites
/music remove [artist]
/music export [backup my taste profile]
```

**Implementation:**
- Create skill folder: `~/JARVIS/skills/music/`
- `SKILL.md` — skill description + usage
- `scripts/music-player.js` — main logic
- `scripts/recommend.js` — recommendation engine
- `scripts/import-history.js` — YouTube history parser

---

### 5. **Privacy + Sovereignty**

**What stays local:**
- All preference data (neurograph nodes)
- All listening history (if Paul opts in)
- All feedback (likes/dislikes)
- All search queries

**What leaves the machine:**
- YouTube requests (public website, no auth needed)
- No tracking cookies (Brave blocks them)
- No personalized ads (ad-blocked)

**Paul owns:**
- His taste profile (git-backed, portable)
- His listening history (opt-in, local archive)
- His recommendation algorithm (open source, auditable)

**Google/Spotify don't get:**
- His listening data
- His preference patterns
- His engagement metrics
- His ability to take his taste elsewhere

---

## Testing Checklist

- [ ] Create music skill folder structure
- [ ] Test screenshot analysis (extract artist/track names)
- [ ] Store preference in neurograph (verify node created)
- [ ] Test YouTube search via browser tool
- [ ] Test video playback (click + play)
- [ ] Test recommendation query ("play something like Hozier")
- [ ] Verify ad-blocking works (Brave or UBlock)
- [ ] Test feedback loop ("love this" / "not feeling it")
- [ ] Screenshot: Jarvis playing music with preference learned
- [ ] Console: no errors

---

## Version Bumps

- Create new skill: `skills/music/`
- Update `SOUL.md` to mention music preference ownership
- Add skill to OpenClaw skill registry

---

## Deliverables

1. **Music skill:**
   - `skills/music/SKILL.md`
   - `scripts/music-player.js`
   - `scripts/recommend.js`
   - `scripts/import-history.js`

2. **Neurograph integration:**
   - Music preference node type
   - Search/query functions
   - Learning loop (feedback → preference weight)

3. **Browser automation:**
   - YouTube search + playback
   - Ad-blocking configured
   - Error handling (video not found, etc.)

4. **Testing:**
   - Screenshot: Jarvis playing music
   - Confirmation: preferences stored in neurograph
   - Console: no errors

5. **Auto-report:**
   - Update `inbox/coder-status.md`
   - Send system notification
   - Include screenshot path + commit hash

---

## Design Notes

**Voice commands (future):**
```
Paul: "Jarvis, play something like Hozier"
Jarvis: "Playing Jacob Banks — Mercy. Similar soulful vibe, gospel undertones."
[Music plays via YouTube]
```

**Visual feedback:**
```
┌─────────────────────────────────────────────────┐
│  🎵 Now Playing                                 │
│  ─────────────                                  │
│  Jacob Banks — Mercy                            │
│  (COLORS Performance)                           │
│                                                 │
│  Matching your taste:                           │
│  ✅ Soulful vocals (like Hozier)                │
│  ✅ Gospel undertones                           │
│  ✅ Live performance                            │
│                                                 │
│  [Pause] [Skip] [Love This] [Not Feeling It]   │
└─────────────────────────────────────────────────┘
```

**Preference export:**
```bash
# Paul can take his taste anywhere
jarvis music export --format json --output my-taste-profile.json

# Import to another Jarvis instance
jarvis music import my-taste-profile.json
```

---

## Complexity Notes

**🟡 Medium because:**
- Browser automation requires careful selector handling
- Recommendation logic needs tuning (don't want generic suggestions)
- Neurograph integration (new node type, search queries)
- Feedback loop (learn from likes/dislikes)

**Not complex because:**
- OpenClaw browser tool handles YouTube (no custom scraping)
- Music skill is standalone (doesn't affect core Jarvis)
- Can start simple (manual recommendations → auto over time)
- No auth/API keys needed (public YouTube)

---

## Future Enhancements (Not in Scope)

- **Multi-room audio** (sync playback across devices)
- **Shared playlists** (David + Eric share music via Jarvis)
- **Concert alerts** (notify when favorite artists tour nearby)
- **Lyrics display** (synced lyrics in UI)
- **Local file support** (play Paul's downloaded music library)

---

## Why This Matters

**Spotify/YouTube/Apple Music:**
- Track every listen
- Build profile to sell ads
- Recommend what maximizes engagement (not what's good for you)
- Lock you into their ecosystem (can't take your taste elsewhere)

**Jarvis:**
- Track listens because Paul *asked* (sovereign choice)
- Build profile to serve Paul (not advertisers)
- Recommend what Paul will *love* (based on deep understanding)
- **Paul owns his taste** (git-backed, portable, auditable)

**"I own the algorithm"** — this is sovereignty applied to culture. Not just data, not just AI. **Your taste, your algorithm, your recommendations.**

---

**Ready to build?** Read this plan, then:
1. Create music skill folder structure
2. Build preference learning (screenshot + neurograph)
3. Build YouTube playback (browser automation)
4. Test recommendation loop
5. Report back with screenshot + commit hash

Let's give Paul back his algorithm. 🎵
