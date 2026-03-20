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

console.log('Done!');
