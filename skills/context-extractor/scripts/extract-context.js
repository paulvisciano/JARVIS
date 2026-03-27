#!/usr/bin/env node
/**
 * Extract clean text context from OpenClaw session JSONL files.
 * Skips base64 images, extracts only conversation text.
 * 
 * Usage: node extract-context.js <date> [output-path]
 * Example: node extract-context.js 2026-03-20
 *          node extract-context.js 2026-03-20 /path/to/output.json
 * 
 * Portable: Uses environment variables, not hardcoded paths.
 */

const fs = require('fs');
const path = require('path');

// Use environment variables for portability
const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

const DATE_ARG = process.argv[2];
const OUTPUT_ARG = process.argv[3] || null;

// Support "active" mode for extracting from active sessions folder
const IS_ACTIVE_MODE = DATE_ARG === 'active';

if (!DATE_ARG) {
  console.error('Usage: node extract-context.js <YYYY-MM-DD|active> [output-path]');
  process.exit(1);
}

let archiveDir, sessionsDir, audioDir, learningsDir, outputFile;

if (IS_ACTIVE_MODE) {
  // Active mode: extract from ~/.openclaw/agents/jarvis/sessions/
  sessionsDir = path.join(HOME, '.openclaw', 'agents', 'jarvis', 'sessions');
  audioDir = path.join(HOME, 'RAW', 'archive', new Date().toISOString().split('T')[0], 'audio');
  learningsDir = null; // No learnings for active mode
  archiveDir = path.join(JARVIS_HOME, '.openclaw', 'active-context');
  outputFile = OUTPUT_ARG || path.join(archiveDir, `active-context-${new Date().toISOString().split('T')[0]}.json`);
  
  if (!fs.existsSync(sessionsDir)) {
    console.error('Active sessions folder not found:', sessionsDir);
    process.exit(1);
  }
} else {
  // Archive mode: extract from ~/RAW/archive/YYYY-MM-DD/
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE_ARG)) {
    console.error('Usage: node extract-context.js <YYYY-MM-DD|active> [output-path]');
    process.exit(1);
  }
  archiveDir = path.join(RAW_ARCHIVE, DATE_ARG);
  sessionsDir = path.join(archiveDir, 'sessions');
  audioDir = path.join(archiveDir, 'audio');
  learningsDir = path.join(JARVIS_HOME, 'RAW', 'learnings', DATE_ARG);
  outputFile = OUTPUT_ARG || path.join(archiveDir, 'full-context.json');

  if (!fs.existsSync(archiveDir)) {
    console.error('Archive not found:', archiveDir);
    process.exit(1);
  }
}

// Extract session messages from JSONL files (skip tool calls/results)
function extractSessions(sessionsDir, isActiveMode = false) {
  if (!fs.existsSync(sessionsDir)) return [];
  
  const files = fs.readdirSync(sessionsDir).filter(f => f.includes('.jsonl'));
  const sessions = [];
  
  files.forEach(file => {
    const filePath = path.join(sessionsDir, file);
    
    // Skip lock files and very small files (likely empty/new sessions)
    try {
      const stats = fs.statSync(filePath);
      if (stats.size < 1000) {
        console.log(`   ⚭ Skipping ${file} (too small: ${(stats.size/1024).toFixed(1)}KB)`);
        return;
      }
    } catch (e) {
      return; // Skip files we can't stat
    }
    
    let lines;
    try {
      lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    } catch (e) {
      console.log(`   ⚭ Skipping ${file} (read error)`);
      return;
    }
    
    // Filter: only user + assistant text messages (skip tool calls/results)
    const messages = lines
      .map(l => {
        try {
          const parsed = JSON.parse(l);
          
          // Skip tool-related messages
          if (parsed.type === 'toolCall' || parsed.type === 'toolResult') {
            return null;
          }
          
          // Handle nested message structure (OpenClaw session format)
          if (parsed.message && parsed.message.role) {
            const msg = parsed.message;
            // Skip tool results (role: "toolResult")
            if (msg.role === 'toolResult') return null;
            // Extract text content from mixed arrays (keep text, skip tool calls/images)
            if (msg.content && Array.isArray(msg.content)) {
              const textOnly = msg.content.filter(c => c.type === 'text');
              if (textOnly.length === 0) return null;
              return { role: msg.role, content: textOnly, timestamp: parsed.timestamp };
            }
            return { role: msg.role, content: msg.content, timestamp: parsed.timestamp };
          }
          
          // Handle flat structure
          if (parsed && parsed.role && parsed.content) {
            // Skip tool roles
            if (parsed.role === 'tool') return null;
            return { role: parsed.role, content: parsed.content, timestamp: parsed.timestamp };
          }
          
          return null;
        }
        catch (e) { return null; }
      })
      .filter(m => m && m.role && m.content);
    
    // Include all sessions with any messages (no minimum threshold)
    if (messages.length > 0) {
      sessions.push({
        file,
        messageCount: messages.length,
        messages
      });
    } else {
      console.log(`   ⚭ Skipping ${file} (no messages)`);
    }
  });
  
  return sessions;
}

// Extract audio transcripts
function extractTranscripts(audioDir) {
  if (!fs.existsSync(audioDir)) return [];
  
  const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.txt'));
  const transcripts = [];
  
  files.forEach(file => {
    const filePath = path.join(audioDir, file);
    const text = fs.readFileSync(filePath, 'utf8').trim();
    transcripts.push({
      file,
      text
    });
  });
  
  return transcripts;
}

// Extract OCR from screenshots (images without .txt files)
function extractOCR(archiveDir) {
  const imagesDir = path.join(archiveDir, 'images');
  const ocrResults = [];
  
  if (!fs.existsSync(imagesDir)) return ocrResults;
  
  const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.heic'];
  const files = fs.readdirSync(imagesDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return imageExts.includes(ext);
  });
  
  console.log(`\n🔍 Scanning ${files.length} images for OCR...`);
  
  files.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const txtPath = filePath + '.txt';
    
    // Skip if OCR already exists
    if (fs.existsSync(txtPath)) {
      const text = fs.readFileSync(txtPath, 'utf8').trim();
      ocrResults.push({
        file,
        text,
        source: 'existing'
      });
      console.log(`   ✓ ${file} (existing OCR)`);
      return;
    }
    
    // Run tesseract OCR
    console.log(`   ⏳ OCR: ${file}...`);
    const { execSync } = require('child_process');
    try {
      const stdout = execSync(`tesseract "${filePath}" stdout -l eng --psm 6 2>/dev/null`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      });
      const text = stdout.trim();
      
      // Save OCR output
      fs.writeFileSync(txtPath, text, 'utf8');
      
      ocrResults.push({
        file,
        text,
        source: 'extracted'
      });
      console.log(`   ✓ ${file} (OCR extracted: ${text.length} chars)`);
    }
    catch (err) {
      console.log(`   ✗ ${file} (OCR failed: ${err.message.split('\n')[0]})`);
    }
  });
  
  return ocrResults;
}

// Extract existing learnings for today
function extractLearnings(learningsDir) {
  if (!fs.existsSync(learningsDir)) return [];
  
  const files = fs.readdirSync(learningsDir).filter(f => f.endsWith('.md'));
  const learnings = [];
  
  files.forEach(f => {
    const filePath = path.join(learningsDir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const title = content.split('\n')[0]?.replace('#', '').trim() || f;
    learnings.push({
      filename: f,
      title,
      content,
      size: content.length
    });
  });
  
  return learnings;
}

// Main extraction
const sessions = extractSessions(sessionsDir, IS_ACTIVE_MODE);
const transcripts = extractTranscripts(audioDir);
const ocrResults = IS_ACTIVE_MODE ? [] : extractOCR(archiveDir); // Skip OCR in active mode
const learnings = IS_ACTIVE_MODE ? [] : extractLearnings(learningsDir); // Skip learnings in active mode

const context = {
  date: DATE_ARG,
  extractedAt: new Date().toISOString(),
  archivePath: archiveDir,
  sessions,
  transcripts,
  ocrTexts: ocrResults,
  learnings,
  stats: {
    sessionFiles: sessions.length,
    transcriptFiles: transcripts.length,
    ocrImages: ocrResults.length,
    ocrExtracted: ocrResults.filter(o => o.source === 'extracted').length,
    learningFiles: learnings.length,
    totalMessages: sessions.reduce((sum, s) => sum + s.messageCount, 0)
  }
};

// Write output (minified JSON to save space)
fs.writeFileSync(outputFile, JSON.stringify(context), 'utf8');

console.log(`✅ Context extracted: ${IS_ACTIVE_MODE ? 'active sessions' : DATE_ARG}`);
console.log(`   Sessions: ${sessions.length} files, ${context.stats.totalMessages} messages`);
console.log(`   Transcripts: ${transcripts.length} files`);
if (!IS_ACTIVE_MODE) {
  console.log(`   OCR: ${ocrResults.length} images (${context.stats.ocrExtracted} newly extracted)`);
  console.log(`   Learnings: ${learnings.length} existing for ${DATE_ARG}`);
}
console.log(`   Output: ${outputFile}`);
console.log(`   Size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
