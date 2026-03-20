#!/usr/bin/env node
/**
 * Organize ~/Desktop files into dated archives based on file creation date.
 * Uses birthtime (file creation date) — reliable metadata on all files.
 * 
 * Usage: node organize-desktop.js
 * 
 * Portable: Uses environment variables, not hardcoded paths.
 * Idempotent: Safe to run multiple times.
 */

const fs = require('fs');
const path = require('path');

// Use environment variables for portability
const HOME = process.env.HOME || require('os').homedir();
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

const desktopDir = path.join(HOME, 'Desktop');
const archiveBase = RAW_ARCHIVE;

// Check if desktop dir exists
if (!fs.existsSync(desktopDir)) {
  console.log('Desktop dir not found:', desktopDir);
  process.exit(0);
}

// Get all files in desktop dir (common types only)
const extensions = ['.png', '.jpg', '.jpeg', '.heic', '.gif', '.pdf', '.txt', '.md', '.jsonl'];
const files = fs.readdirSync(desktopDir).filter(f => {
  const ext = path.extname(f).toLowerCase();
  return extensions.includes(ext);
});

if (files.length === 0) {
  console.log('No matching files on desktop');
  process.exit(0);
}

console.log(`Processing ${files.length} files from ~/Desktop`);

// Process each file
files.forEach(file => {
  const filePath = path.join(desktopDir, file);
  const stat = fs.statSync(filePath);
  
  // Use birthtime (creation date) — most reliable
  const created = stat.birthtime || stat.ctime;
  const dateStr = created.toISOString().slice(0, 10); // YYYY-MM-DD
  
  // Determine target folder by file type
  const ext = path.extname(file).toLowerCase();
  let subfolder = 'documents';
  if (['.png', '.jpg', '.jpeg', '.heic', '.gif'].includes(ext)) {
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
