#!/usr/bin/env node
/**
 * JARVIS Archive OpenClaw Sessions
 * Archives inactive OpenClaw session files (.jsonl) by creation date
 * Keeps active sessions (tracked in sessions.json) in runtime folder
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const ARCHIVE = path.join(HOME, 'RAW', 'archive');

// Archive sessions from all agents (main, jarvis, etc.)
const AGENTS_DIR = path.join(HOME, '.openclaw', 'agents');

console.log('📚 Archive OpenClaw Sessions (Inactive Only)...');

if (!fs.existsSync(AGENTS_DIR)) {
  console.log('   ⚠️  OpenClaw agents dir not found');
  process.exit(0);
}

const agents = fs.readdirSync(AGENTS_DIR).filter(f => 
  fs.statSync(path.join(AGENTS_DIR, f)).isDirectory()
);

let totalMoved = 0;
let totalKept = 0;

agents.forEach(agent => {
  const sessionsDir = path.join(AGENTS_DIR, agent, 'sessions');
  
  if (!fs.existsSync(sessionsDir)) {
    return;
  }
  
  // Load active session IDs from sessions.json
  const sessionsJsonPath = path.join(sessionsDir, 'sessions.json');
  let activeIds = [];
  if (fs.existsSync(sessionsJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(sessionsJsonPath, 'utf8'));
      activeIds = Object.values(data).map(s => s.sessionId).filter(Boolean);
    } catch (err) {
      console.error(`   ⚠️  Error reading sessions.json for ${agent}: ${err.message}`);
    }
  }
  
  const files = fs.readdirSync(sessionsDir);
  
  files.forEach(file => {
    const filePath = path.join(sessionsDir, file);
    if (!fs.statSync(filePath).isFile()) return;
    
    // Skip sessions.json and lock files
    if (file === 'sessions.json' || file.endsWith('.lock')) {
      totalKept++;
      return;
    }
    
    // Extract session ID from filename
    const sessionId = file.split('.jsonl')[0];
    const isReset = file.includes('.reset.');
    
    // Check if this session is active (keep main jsonl, move reset files)
    const isActive = activeIds.some(id => sessionId.startsWith(id));
    
    if (isActive && !isReset) {
      // Keep active session's main jsonl file
      totalKept++;
      return;
    }
    
    // Get creation date for archive folder
    const stat = fs.statSync(filePath);
    const dateStr = (stat.birthtime || stat.ctime).toISOString().slice(0, 10);
    const targetDir = path.join(ARCHIVE, dateStr, 'sessions');
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, file);
    
    if (path.dirname(filePath) === targetDir) {
      console.log(`   ✓ ${agent}/${file} already archived`);
      totalKept++;
      return;
    }
    
    fs.renameSync(filePath, targetPath);
    totalMoved++;
    console.log(`   ✓ ${agent}/${file} → ${dateStr}/sessions/ (${isReset ? 'reset snapshot' : 'inactive session'})`);
  });
  
  console.log(`   📊 ${agent}: ${totalMoved} moved, ${activeIds.length} active kept`);
});

console.log('\n========================================');
console.log(`✅ Archive complete`);
console.log(`   Moved: ${totalMoved} files`);
console.log(`   Kept: ${totalKept} files (active sessions + metadata)`);
console.log('========================================\n');
