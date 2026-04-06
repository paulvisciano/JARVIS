#!/usr/bin/env node
/**
 * JARVIS Archive Inbox
 * Moves inbox files to dated archive folders based on modification time.
 * No processing (transcription/OCR) — just organization.
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

const HOME = process.env.HOME || require('os').homedir();
const INBOX = process.env.INBOX_DIR || path.join(HOME, 'JARVIS', 'inbox');
const ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

console.log('📥 Archive Inbox: Moving files to archive...');

if (!fs.existsSync(INBOX)) {
  console.log('   ⚠️  Inbox dir not found');
  process.exit(0);
}

// Get all files from inbox
const files = fs.readdirSync(INBOX).filter(f => {
  const filePath = path.join(INBOX, f);
  return fs.statSync(filePath).isFile();
}).map(f => {
  const filePath = path.join(INBOX, f);
  const stat = fs.statSync(filePath);
  return {
    name: f,
    path: filePath,
    mtime: stat.mtimeMs,
    ext: path.extname(f).toLowerCase()
  };
}).sort((a, b) => a.mtime - b.mtime); // Sort by mod time (oldest first)

if (files.length === 0) {
  console.log('   ℹ️  No files found in inbox');
  process.exit(0);
}

console.log(`   📊 Found ${files.length} files`);

// Process each file
files.forEach(file => {
  const { name, path: filePath, mtime, ext } = file;
  const dateStr = new Date(mtime).toISOString().slice(0, 10);
  const archiveTime = new Date(mtime).toISOString().replace(/[:.]/g, '').slice(0, 15);
  const archivedName = `${archiveTime}-${name}`;
  
  const humanTime = new Date(mtime).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
    // Uses system local timezone
  });
  
  console.log(`   📁 ${name} (recorded: ${humanTime})`);
  
  // Determine target folder by file type
  let subfolder = 'documents';
  if (['.webm', '.wav', '.m4a', '.mp3', '.flac', '.ogg'].includes(ext)) {
    subfolder = 'audio';
  } else if (['.png', '.jpg', '.jpeg', '.heic', '.gif'].includes(ext)) {
    subfolder = 'images';
  } else if (ext === '.jsonl') {
    subfolder = 'sessions';
  }
  
  const targetDir = path.join(ARCHIVE, dateStr, subfolder);
  fs.mkdirSync(targetDir, { recursive: true });
  
  const targetPath = path.join(targetDir, archivedName);
  
  if (path.dirname(filePath) === targetDir) {
    console.log(`      ✓ Already in ${dateStr}/${subfolder}/`);
    return;
  }
  
  fs.renameSync(filePath, targetPath);
  console.log(`      ✓ → ${dateStr}/${subfolder}/${archivedName}`);
});

console.log('✅ Archive Inbox complete!');
