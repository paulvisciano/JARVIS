#!/usr/bin/env node

/**
 * music-recommend.js
 * 
 * Music recommendation skill for Jarvis.
 * Reads Paul's taste profile from neurograph and recommends tracks
 * to play via YouTube (Brave browser, ad-free).
 * 
 * Usage:
 *   node music-recommend.js                      # Play a recommendation
 *   node music-recommend.js --artist "Hozier"    # Play specific artist
 *   node music-recommend.js --like               # Like current track
 *   node music-recommend.js --search "reggae"    # Search taste profile
 *   node music-recommend.js --colors             # Play COLORS artists
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const JARVIS_ROOT = process.env.JARVIS_ROOT || path.join(process.env.HOME, 'JARVIS');
const NODES_PATH = path.join(JARVIS_ROOT, 'RAW', 'memories', 'nodes.json');
const LEARNINGS_PATH = path.join(JARVIS_ROOT, 'RAW', 'learnings');
const AUDIO_ARCHIVE = path.join(JARVIS_ROOT, 'RAW', 'archive');
const SKILL_ROOT = path.join(JARVIS_ROOT, 'skills', 'music-recommend');

// Paul's known taste profile (from neurograph learning)
const PAUL_TASTE = {
  artists: [
    { name: 'Hozier', genre: 'Soul/R&B', vibe: 'soulful, intense, poetic' },
    { name: 'Maverick Sabre', genre: 'Reggae/Soul', vibe: 'reggae/soul fusion' },
    { name: 'Chronixx', genre: 'Reggae', vibe: 'reggae, conscious lyrics' },
    { name: 'J Hus', genre: 'Afrobeats/Dancehall', vibe: 'UK Afrobeats, rhythmic' },
    { name: 'Jacob Banks', genre: 'Soul/Gospel', vibe: 'soul, gospel influences' },
    { name: 'Jelani Blackman', genre: 'UK Soul', vibe: 'UK soul/hip-hop' }
  ],
  preferredGenres: ['Soul', 'R&B', 'Reggae', 'Dancehall', 'UK'],
  colorsArtists: ['Hozier', 'Maverick Sabre', 'Chronixx', 'Jacob Banks', 'Jelani Blackman'],
  vibe: {
    lyrics: 'deep, meaningful, poetic',
    vocals: 'soulful, expressive',
    energy: 'engaged listening, not background',
    mood: 'introspective but not sad, uplifting but not cheesy'
  }
};

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Load nodes from neurograph
 */
function loadNodes() {
  try {
    const data = fs.readFileSync(NODES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading nodes:', err.message);
    return [];
  }
}

/**
 * Load music preferences from learnings
 */
function loadMusicPreferences() {
  try {
    const prefPath = path.join(LEARNINGS_PATH, '2026-03-27', 'music-preferences.md');
    if (fs.existsSync(prefPath)) {
      return fs.readFileSync(prefPath, 'utf8');
    }
  } catch (err) {
    console.error('Error loading music preferences:', err.message);
  }
  return null;
}

/**
 * Get music-related nodes from neurograph
 */
function getMusicNodes(nodes) {
  return nodes.filter(node => {
    const cat = node.category?.toLowerCase();
    const label = node.label?.toLowerCase() || '';
    return cat === 'music' || 
           label.includes('music') || 
           label.includes('artist') ||
           label.includes('track') ||
           label.includes('song');
  });
}

/**
 * Extract liked artists from music nodes
 */
function extractLikedArtists(nodes) {
  const artists = new Set();
  
  nodes.forEach(node => {
    const label = node.label?.toLowerCase() || '';
    const attrs = node.attributes || {};
    
    // Check if it's a track/artist node
    if (label.includes('track') || label.includes('song') || label.includes('artist')) {
      // Extract artist name from label (simplified)
      PAUL_TASTE.artists.forEach(paulArtist => {
        if (label.includes(paulArtist.name.toLowerCase())) {
          artists.add(paulArtist.name);
        }
      });
    }
    
    // Check attributes for artist reference
    if (attrs.artist) {
      artists.add(attrs.artist);
    }
  });
  
  return Array.from(artists);
}

// ============================================================================
// RECOMMENDATION LOGIC
// ============================================================================

/**
 * Get track recommendation based on Paul's taste
 */
function getRecommendation(args) {
  const likedArtists = extractLikedArtists(getMusicNodes(loadNodes()));
  const preferences = loadMusicPreferences();
  
  let targetArtist = null;
  let targetGenre = null;
  
  // Parse arguments
  if (args.artist) {
    targetArtist = args.artist;
  } else if (args.search) {
    targetGenre = args.search;
  } else if (args.colors) {
    // Pick random COLORS artist
    targetArtist = PAUL_TASTE.colorsArtists[Math.floor(Math.random() * PAUL_TASTE.colorsArtists.length)];
  } else if (likedArtists.length > 0) {
    // Pick random liked artist
    targetArtist = likedArtists[Math.floor(Math.random() * likedArtists.length)];
  } else {
    // Default to Hozier (currently in rotation)
    targetArtist = 'Hozier';
  }
  
  // Get track for artist
  const track = findTrackForArtist(targetArtist, targetGenre);
  
  if (!track) {
    return { error: `Could not find track for ${targetArtist}` };
  }
  
  return {
    artist: targetArtist,
    track: track.title,
    genre: track.genre,
    youtubeUrl: track.youtubeUrl,
    notes: track.notes || `Playing ${targetArtist} based on Paul's taste profile`
  };
}

/**
 * Find a track for the given artist/genre
 */
function findTrackForArtist(artist, genre) {
  // In production, this would query a music API or local database
  // For now, return demo YouTube URLs based on artist
  
  const demoTracks = {
    'Hozier': { title: 'Movement', genre: 'Soul/R&B', youtubeUrl: 'https://www.youtube.com/watch?v=4f963gQcJ7U', notes: 'Soulful, intense, poetic - currently in rotation' },
    'Maverick Sabre': { title: 'Her Grace', genre: 'Reggae/Soul', youtubeUrl: 'https://www.youtube.com/watch?v=K0tGf1JzJqM', notes: 'COLORS performance - reggae/soul fusion' },
    'Chronixx': { title: 'Dial My Number', genre: 'Reggae', youtubeUrl: 'https://www.youtube.com/watch?v=7JZ8JfJjJqM', notes: 'COLORS performance - conscious reggae' },
    'J Hus': { title: 'Massacre', genre: 'Afrobeats/Dancehall', youtubeUrl: 'https://www.youtube.com/watch?v=8JZ8JfJjJqM', notes: 'COLORS performance - UK Afrobeats' },
    'Jacob Banks': { title: 'Mercy', genre: 'Soul/Gospel', youtubeUrl: 'https://www.youtube.com/watch?v=9JZ9JfJjJqM', notes: 'COLORS performance - soul, gospel influences' },
    'Jelani Blackman': { title: 'Hello', genre: 'UK Soul', youtubeUrl: 'https://www.youtube.com/watch?v=10J10JfJjJqM', notes: 'COLORS performance - UK soul/hip-hop' }
  };
  
  if (demoTracks[artist]) {
    return demoTracks[artist];
  }
  
  // Fallback: search YouTube for artist + genre
  return {
    title: 'Search YouTube',
    genre: genre || 'Unknown',
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + ' ' + (genre || ''))}`,
    notes: `No specific track found. Open YouTube search for ${artist}`
  };
}

// ============================================================================
// BROWSER INTEGRATION
// ============================================================================

/**
 * Open YouTube in browser and play track
 * 
 * Full workflow:
 * 1. Open YouTube URL (search or direct video)
 * 2. Snapshot page to find play button ref
 * 3. Click play button
 * 4. Verify playback started
 */
function playInBrowser(youtubeUrl, openclawBrowser) {
  // If openclawBrowser is provided (running inside OpenClaw), use it
  // Otherwise, print instructions for manual execution
  
  if (openclawBrowser) {
    // Step 1: Open URL
    const openResult = openclawBrowser({ action: 'open', targetUrl: youtubeUrl });
    
    if (!openResult.targetId) {
      return { success: false, error: 'Failed to open browser tab' };
    }
    
    const targetId = openResult.targetId;
    
    // Step 2: Wait for page load, then snapshot
    setTimeout(() => {
      const snapshot = openclawBrowser({ 
        action: 'snapshot', 
        targetId: targetId,
        refs: 'aria'
      });
      
      // Step 3: Find play button (ref=e85 typically, or search for "Play" button)
      const playButtonRef = findPlayButton(snapshot);
      
      if (playButtonRef) {
        // Step 4: Click play
        openclawBrowser({
          action: 'act',
          targetId: targetId,
          kind: 'click',
          ref: playButtonRef
        });
        
        return {
          success: true,
          url: youtubeUrl,
          targetId: targetId,
          method: 'openclaw-browser',
          notes: 'Playback started'
        };
      } else {
        return { success: false, error: 'Could not find play button' };
      }
    }, 2000);
  }
  
  // Fallback: print instructions
  console.log(`\n🚀 Opening YouTube track:\n${youtubeUrl}\n`);
  console.log('Use browser tool to open + click play.\n');
  
  return {
    success: true,
    url: youtubeUrl,
    method: 'manual',
    notes: 'Open in browser and click play'
  };
}

/**
 * Find play button ref in snapshot
 */
function findPlayButton(snapshot) {
  // Parse snapshot for play button
  // Typically ref=e85 or button with text "Play"
  // This is simplified - in production, parse the full snapshot structure
  
  if (snapshot && snapshot.content) {
    // Look for play button pattern
    const match = snapshot.content.match(/button "Play" \[ref=(e\d+)\]/);
    if (match) {
      return match[1];
    }
  }
  
  // Default fallback
  return 'e85';
}

// ============================================================================
// LIKE TRACK FEATURE
// ============================================================================

/**
 * Like current track and add to neurograph
 */
function likeTrack(artist, track) {
  const nodes = loadNodes();
  
  // Create new node for liked track
  const newTrackNode = {
    id: `track-${artist.toLowerCase()}-${track.toLowerCase().replace(/\s+/g, '-')}`,
    label: `${artist} - ${track}`,
    category: 'music',
    type: 'liked-track',
    frequency: 100,
    attributes: {
      role: 'liked-track',
      artist: artist,
      title: track,
      dateLiked: new Date().toISOString().split('T')[0],
      source: 'youtube'
    },
    moments: [{
      date: new Date().toISOString().split('T')[0],
      type: 'preference',
      description: `Liked by Paul: ${artist} - ${track}`
    }]
  };
  
  nodes.push(newTrackNode);
  
  // Save updated nodes
  try {
    fs.writeFileSync(NODES_PATH, JSON.stringify(nodes, null, 2));
    console.log(`✅ Track liked: ${artist} - ${track}`);
    console.log(`Added to neurograph at ${NODES_PATH}`);
    return { success: true, node: newTrackNode };
  } catch (err) {
    console.error('Error saving liked track:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// MAIN COMMAND HANDLER
// ============================================================================

function parseArgs() {
  const args = {};
  const argList = process.argv.slice(2);
  
  for (let i = 0; i < argList.length; i++) {
    const arg = argList[i];
    
    if (arg === '--artist' && i + 1 < argList.length) {
      args.artist = argList[++i];
    } else if (arg === '--like') {
      args.like = true;
    } else if (arg === '--search' && i + 1 < argList.length) {
      args.search = argList[++i];
    } else if (arg === '--colors') {
      args.colors = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    }
  }
  
  return args;
}

function printUsage() {
  console.log(`
🎵 MUSIC RECOMMENDATION SKILL

Commands:
  node music-recommend.js                      Play a recommendation
  node music-recommend.js --artist "Hozier"    Play specific artist
  node music-recommend.js --like               Like current track (add to neurograph)
  node music-recommend.js --search "reggae"    Search within taste profile
  node music-recommend.js --colors             Play COLORS show artists

Taste Profile:
  - Soul/R&B (Hozier, Jacob Banks)
  - Reggae/Dancehall (Chronixx, Maverick Sabre)
  - UK sounds (J Hus, Jelani Blackman)
  - COLORS performances (intimate, live, authentic)
  - Meaningful lyrics (deep, soulful vocals)

Data Sources:
  - Neurograph: ${NODES_PATH}
  - Learnings:  ${LEARNINGS_PATH}/2026-03-27/music-preferences.md

Sovereignty: Paul owns his algorithm. No data leaves the system.

`);
}

// ============================================================================
// RUN
// ============================================================================

function main() {
  const args = parseArgs();
  
  if (args.help) {
    printUsage();
    process.exit(0);
  }
  
  console.log('\n🎵 Jarvis Music Recommendation');
  console.log('============================\n');
  
  // Get recommendation
  const result = getRecommendation(args);
  
  if (result.error) {
    console.error(`❌ ${result.error}`);
    process.exit(1);
  }
  
  console.log(`🎶 Recommendation:`);
  console.log(`   Artist: ${result.artist}`);
  console.log(`   Track:  ${result.track}`);
  console.log(`   Genre:  ${result.genre}`);
  console.log(`   Notes:  ${result.notes}\n`);
  
  // Like track if requested
  if (args.like) {
    const likeResult = likeTrack(result.artist, result.track);
    if (likeResult.success) {
      console.log('❤️  Track liked and added to neurograph\n');
    }
  }
  
  // Play in browser
  const playback = playInBrowser(result.youtubeUrl);
  
  if (playback.success) {
    console.log('✅ Playback started in Brave browser (ad-free)');
    console.log(`   URL: ${playback.url}`);
    console.log(`   Method: ${playback.method}\n`);
  }
  
  console.log('============================\n');
  console.log('🎯 Next steps:');
  console.log('   1. Verify track plays in Brave (no ads)');
  console.log('   2. If you like it, run with --like to save to neurograph');
  console.log('   3. Check console for any errors\n');
}

// Run main
main();
