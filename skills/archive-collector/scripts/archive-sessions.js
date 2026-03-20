#!/usr/bin/env node
/**
 * JARVIS Archive OpenClaw Sessions
 * Archives OpenClaw session files (.jsonl) by creation date
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const OPENCLAW_SESSIONS = path.join(HOME, '.openclaw', 'agents', 'main', 'sessions');
const ARCHIVE = path.join(HOME, 'RAW', 'archive');

console.log('📚 Archive OpenClaw Sessions...');

if (!fs.existsSync(OPENCLAW_SESSIONS)) {
  console.log('   ⚠️  OpenClaw sessions dir not found');
  process.exit(0);
}

const sessionFiles = fs.readdirSync(OPENCLAW_SESSIONS)
  .filter(f => f.endsWith('.jsonl'))
  .map(f => {
    const filePath = path.join(OPENCLAW_SESSIONS, f);
    const stat = fs.statSync(filePath);
    return {
      name: f,
      path: filePath,
      birthtime: stat.birthtime || stat.ctime
    };
  });

if (sessionFiles.length === 0) {
  console.log('   ℹ️  No session files found');
  process.exit(0);
}

console.log(`   📊 Found ${sessionFiles.length} sessions`);

sessionFiles.forEach(file => {
  const { name, path: filePath, birthtime } = file;
  const dateStr = birthtime.toISOString().slice(0, 10);
  const targetDir = path.join(ARCHIVE, dateStr, 'sessions');
  
  fs.mkdirSync(targetDir, { recursive: true });
  
  const targetPath = path.join(targetDir, name);
  
  if (path.dirname(filePath) === targetDir) {
    console.log(`   ✓ ${name} already in ${dateStr}/sessions/`);
    return;
  }
  
  fs.renameSync(filePath, targetPath);
  console.log(`   ✓ ${name} → ${dateStr}/sessions/ (created: ${dateStr})`);
});

console.log('✅ Archive OpenClaw Sessions complete!');
