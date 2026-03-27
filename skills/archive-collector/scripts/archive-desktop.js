#!/usr/bin/env node
/**
 * JARVIS Archive Desktop
 * Moves ~/Desktop files into dated archives based on file creation date.
 * Uses birthtime (file creation date) — reliable metadata on all files.
 * 
 * Usage: node archive-desktop.js
 * 
 * Portable: Uses environment variables, not hardcoded paths.
 * Idempotent: Safe to run multiple times.
 * Configurable: Respects DESKTOP_ARCHIVING_ENABLED flag (default: false)
 */

const fs = require('fs');
const path = require('path');

// Use environment variables for portability
const HOME = process.env.HOME || require('os').homedir();
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

// Load JARVIS config file for desktop archiving setting
const jarvisHome = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const CONFIG_FILE = path.join(jarvisHome, '.jarvis-config.json');
let desktopArchivingEnabled = false;

try {
  if (fs.existsSync(CONFIG_FILE)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    desktopArchivingEnabled = config.desktopArchiving?.enabled === true;
  }
} catch (e) {
  // Config file doesn't exist or is invalid - use default (disabled)
}

// Check if desktop archiving is enabled (default: disabled for privacy)
const ENV_ENABLED = process.env.DESKTOP_ARCHIVING_ENABLED === 'true' || process.env.DESKTOP_ARCHIVING_ENABLED === '1';
const desktopDir = path.join(HOME, 'Desktop');
const archiveBase = RAW_ARCHIVE;

// Early exit if desktop archiving is disabled
if (!desktopArchivingEnabled && !ENV_ENABLED) {
  console.log('Desktop archiving is disabled (see .jarvis-config.json or DESKTOP_ARCHIVING_ENABLED env var)');
  process.exit(0);
}

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
