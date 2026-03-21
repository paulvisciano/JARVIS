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

if (!DATE_ARG || !/^\d{4}-\d{2}-\d{2}$/.test(DATE_ARG)) {
  console.error('Usage: node extract-context.js <YYYY-MM-DD> [output-path]');
  process.exit(1);
}

const archiveDir = path.join(RAW_ARCHIVE, DATE_ARG);
const sessionsDir = path.join(archiveDir, 'sessions');
const audioDir = path.join(archiveDir, 'audio');
const outputFile = OUTPUT_ARG || path.join(archiveDir, 'full-context.json');

// Check if archive exists
if (!fs.existsSync(archiveDir)) {
  console.error('Archive not found:', archiveDir);
  process.exit(1);
}

// Extract session messages from JSONL files (skip tool calls/results)
function extractSessions(sessionsDir) {
  if (!fs.existsSync(sessionsDir)) return [];
  
  const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.jsonl'));
  const sessions = [];
  
  files.forEach(file => {
    const filePath = path.join(sessionsDir, file);
    const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    
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
              return { role: msg.role, content: textOnly };
            }
            return { role: msg.role, content: msg.content };
          }
          
          // Handle flat structure
          if (parsed && parsed.role && parsed.content) {
            // Skip tool roles
            if (parsed.role === 'tool') return null;
            return parsed;
          }
          
          return null;
        }
        catch (e) { return null; }
      })
      .filter(m => m && m.role && m.content);
    
    sessions.push({
      file,
      messageCount: messages.length,
      messages
    });
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

// Main extraction
const sessions = extractSessions(sessionsDir);
const transcripts = extractTranscripts(audioDir);
const ocrTexts = extractOCR(archiveDir);

const context = {
  date: DATE_ARG,
  extractedAt: new Date().toISOString(),
  archivePath: archiveDir,
  sessions,
  transcripts,
  ocrTexts,
  stats: {
    sessionFiles: sessions.length,
    transcriptFiles: transcripts.length,
    ocrImages: ocrTexts.length,
    ocrExtracted: ocrTexts.filter(o => o.source === 'extracted').length,
    totalMessages: sessions.reduce((sum, s) => sum + s.messageCount, 0)
  }
};

// Write output (minified JSON to save space)
fs.writeFileSync(outputFile, JSON.stringify(context), 'utf8');

console.log(`✅ Context extracted: ${DATE_ARG}`);
console.log(`   Sessions: ${sessions.length} files, ${context.stats.totalMessages} messages`);
console.log(`   Transcripts: ${transcripts.length} files`);
console.log(`   OCR: ${context.stats.ocrImages} images (${context.stats.ocrExtracted} newly extracted)`);
console.log(`   Output: ${outputFile}`);
console.log(`   Size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
