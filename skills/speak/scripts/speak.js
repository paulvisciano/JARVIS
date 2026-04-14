#!/usr/bin/env node

/**
 * 🔊 Speak — Voicebox TTS Pipeline
 * 
 * Generates speech using Voicebox API (Paul's cloned voice) and plays it back.
 * 
 * Usage:
 *   node speak.js "Your text here"
 *   node speak.js --text "Your text here"
 *   echo "Your text here" | node speak.js --stdin
 * 
 * Output:
 *   - Audio saved to: /tmp/jarvis-voicebox-<timestamp>.wav
 *   - Playback via: ffplay -nodisp -autoexit
 *   - Auto-cleanup after playback
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const VOICEBOX_URL = 'http://127.0.0.1:17493';
const PROFILE_ID = '8202f4c4-5866-4065-8280-cf5421e3135a'; // Paul V
const TMP_DIR = '/tmp';
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30; // 60 seconds max

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let text = null;
  let useStdin = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--stdin') {
      useStdin = true;
    } else if (args[i] === '--text' && args[i + 1]) {
      text = args[i + 1];
      i++;
    } else if (!args[i].startsWith('-') && !text) {
      text = args[i];
    }
  }

  return { text, useStdin };
}

// Execute shell command and return output
function exec(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', ...options });
  } catch (error) {
    if (options.allowError) {
      return error.stdout || '';
    }
    throw error;
  }
}

// Generate speech via Voicebox API
async function generateSpeech(text) {
  const timestamp = Date.now();
  const jsonPath = path.join(TMP_DIR, `voicebox-request-${timestamp}.json`);
  const wavPath = path.join(TMP_DIR, `jarvis-voicebox-${timestamp}.wav`);

  console.log(`🎤 Generating speech (${text.length} chars)...`);

  // Step 1: Write JSON payload (avoids shell escaping issues)
  const payload = {
    profile_id: PROFILE_ID,
    text: text,
    language: 'en',
    normalize: true
  };
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

  // Step 2: Generate speech (async, returns generation_id)
  const generateCmd = `curl -s -X POST "${VOICEBOX_URL}/generate" -H "Content-Type: application/json" -d @${jsonPath}`;
  const generateResult = exec(generateCmd);
  const generateData = JSON.parse(generateResult);
  const generationId = generateData.id;

  if (!generationId) {
    throw new Error(`Generation failed: ${generateData.error || 'Unknown error'}`);
  }

  console.log(`   Generation ID: ${generationId}`);
  console.log(`   Status: ${generateData.status}`);

  // Step 3: Poll status until complete
  console.log(`   Polling for completion...`);
  
  // Initial delay - Voicebox needs ~5 seconds to start generating
  await sleep(5000);
  
  let status = generateData.status;
  let attempts = 0;

  while (status === 'generating' && attempts < MAX_POLL_ATTEMPTS) {
    attempts++;
    
    // Increased timeout from 10s to 30s to handle slower generation
    const statusCmd = `curl -s --max-time 30 "${VOICEBOX_URL}/generate/${generationId}/status"`;
    const statusResult = exec(statusCmd, { allowError: true });
    
    // Parse SSE format (data: {...})
    const jsonMatch = statusResult.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const statusData = JSON.parse(jsonMatch[0]);
      status = statusData.status;
      const duration = statusData.duration || 0;
      console.log(`   Attempt ${attempts}/${MAX_POLL_ATTEMPTS}: ${status}${duration > 0 ? ` (${duration}s)` : ''}`);
    }
    
    if (status === 'generating') {
      await sleep(POLL_INTERVAL_MS);
    }
  }

  if (status !== 'completed') {
    throw new Error(`Generation did not complete (status: ${status}, attempts: ${attempts})`);
  }

  // Step 4: Download audio
  console.log(`   Downloading audio...`);
  const downloadCmd = `curl -s --max-time 30 "${VOICEBOX_URL}/audio/${generationId}" -o "${wavPath}"`;
  exec(downloadCmd);

  // Verify download
  const stats = fs.statSync(wavPath);
  if (stats.size < 1000) {
    throw new Error(`Download failed: file too small (${stats.size} bytes)`);
  }

  console.log(`   Downloaded: ${wavPath} (${(stats.size / 1024).toFixed(2)} KB)`);

  // Cleanup JSON payload
  fs.unlinkSync(jsonPath);

  return { wavPath, generationId };
}

// Play audio file
function playAudio(wavPath) {
  console.log(`🔊 Playing audio...`);
  try {
    exec(`ffplay -nodisp -autoexit "${wavPath}" 2>&1`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Playback error: ${error.message}`);
  }
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  try {
    const { text, useStdin } = parseArgs();

    // Get text from stdin or args
    let inputText = text;
    
    if (useStdin) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });

      inputText = await new Promise(resolve => {
        let lines = [];
        rl.on('line', line => lines.push(line));
        rl.on('close', () => resolve(lines.join('\n')));
      });
    }

    if (!inputText || inputText.trim().length === 0) {
      console.error('❌ Error: No text provided');
      console.error('Usage: node speak.js "Your text here"');
      console.error('   or: echo "text" | node speak.js --stdin');
      process.exit(1);
    }

    // Generate + Play
    const { wavPath } = await generateSpeech(inputText);
    playAudio(wavPath);

    // Optional: Keep audio file for archive (comment out to auto-delete)
    // console.log(`💾 Audio saved: ${wavPath}`);
    
    // Auto-cleanup (uncomment to enable)
    // fs.unlinkSync(wavPath);
    // console.log(`🧹 Cleaned up temp file`);

    console.log(`✅ Done!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run
main();
