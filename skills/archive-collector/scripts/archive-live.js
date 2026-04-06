#!/usr/bin/env node
/**
 * JARVIS Archive Live
 * Moves ~/JARVIS/live/ files into dated archives based on file creation date.
 * Uses birthtime (file creation date) — reliable metadata on all files.
 * 
 * Usage: node archive-live.js
 * 
 * Portable: Uses environment variables, not hardcoded paths.
 * Idempotent: Safe to run multiple times.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const dotenvPath = path.join(__dirname, '../../.env');
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^~/, require('os').homedir());
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

// Use environment variables for portability
const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

const liveDir = path.join(JARVIS_HOME, 'live');
const archiveBase = RAW_ARCHIVE;

// Check if live dir exists
if (!fs.existsSync(liveDir)) {
  console.log('Live dir not found:', liveDir);
  process.exit(0);
}

// Get all files in live dir
const files = fs.readdirSync(liveDir).filter(f => {
  const fullPath = path.join(liveDir, f);
  return fs.statSync(fullPath).isFile();
});

if (files.length === 0) {
  console.log('No files in live dir');
  process.exit(0);
}

console.log(`Processing ${files.length} files from ~/JARVIS/live/`);

// Process live files
files.forEach(file => {
  const filePath = path.join(liveDir, file);
  const stat = fs.statSync(filePath);
  
  // Use birthtime (creation date) — most reliable
  const created = stat.birthtime || stat.ctime;
  const dateStr = created.toISOString().slice(0, 10); // YYYY-MM-DD
  
  // Determine target folder by file type
  const ext = path.extname(file).toLowerCase();
  let subfolder = 'documents';
  if (['.webm', '.wav', '.m4a', '.mp3', '.flac'].includes(ext)) {
    subfolder = 'audio';
  } else if (['.png', '.jpg', '.jpeg', '.heic', '.gif'].includes(ext)) {
    subfolder = 'images';
  } else if (ext === '.jsonl') {
    subfolder = 'sessions';
  }
  
  // Ensure archive folder exists
  const targetDir = path.join(archiveBase, dateStr, subfolder);
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Move file
  const targetPath = path.join(targetDir, file);
  
  // Skip if already in correct location
  if (path.dirname(filePath) === targetDir) {
    console.log(`✓ ${file} already in ${dateStr}/${subfolder}/`);
    return;
  }
  
  fs.renameSync(filePath, targetPath);
  console.log(`✓ ${file} → ${dateStr}/${subfolder}/ (created: ${dateStr})`);
});

console.log('Done!\n');

// === INTEGRITY VERIFICATION STEP ===
// Verify all files in today's archive actually belong there
console.log('=== Verifying Archive Integrity ===');

const todayStr = new Date().toISOString().slice(0, 10);
const todayArchiveDir = path.join(archiveBase, todayStr);

if (fs.existsSync(todayArchiveDir)) {
  let checked = 0;
  let moved = 0;
  
  // Recursively check all files in today's archive
  function checkDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        // Skip other date folders
        if (/^\d{4}-\d{2}-\d{2}$/.test(entry.name) && entry.name !== todayStr) {
          return;
        }
        checkDir(fullPath);
      } else if (entry.isFile()) {
        checked++;
        const stat = fs.statSync(fullPath);
        const created = stat.birthtime || stat.ctime;
        const fileDate = created.toISOString().slice(0, 10);
        
        if (fileDate !== todayStr) {
          moved++;
          const subfolder = path.basename(path.dirname(fullPath));
          const targetDir = path.join(archiveBase, fileDate, subfolder);
          fs.mkdirSync(targetDir, { recursive: true });
          const targetPath = path.join(targetDir, entry.name);
          fs.renameSync(fullPath, targetPath);
          console.log(`✗ ${entry.name} (created: ${fileDate}) → moved to ${fileDate}/`);
        }
      }
    });
  }
  
  checkDir(todayArchiveDir);
  
  console.log(`\nChecked: ${checked} files`);
  console.log(`Moved: ${moved} files to correct date folders`);
  if (moved === 0) {
    console.log('✅ All files in correct date folders');
  }
}

console.log('\n✅ Archive complete + verified');
