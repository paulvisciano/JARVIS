#!/usr/bin/env node
/**
 * JARVIS Archive OpenClaw Sessions
 * 
 * CRITICAL RULE: Only archive LOCK-FREE sessions (no .lock file present)
 * 
 * Why: Sessions with .lock files are ACTIVE - new messages are being written.
 * Moving them mid-session loses data. Only archive when session is complete.
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const ARCHIVE = path.join(HOME, 'RAW', 'archive');
const AGENTS_DIR = path.join(HOME, '.openclaw', 'agents');

console.log('📚 Archive OpenClaw Sessions (lock-free only)...');

if (!fs.existsSync(AGENTS_DIR)) {
  console.log('   ⚠️  OpenClaw agents dir not found');
  process.exit(0);
}

const agents = fs.readdirSync(AGENTS_DIR).filter(f => 
  fs.statSync(path.join(AGENTS_DIR, f)).isDirectory()
);

let totalMoved = 0;
let totalKept = 0;
let totalSkipped = 0;

agents.forEach(agent => {
  const sessionsDir = path.join(AGENTS_DIR, agent, 'sessions');
  
  if (!fs.existsSync(sessionsDir)) {
    return;
  }
  
  const files = fs.readdirSync(sessionsDir);
  
  files.forEach(file => {
    const filePath = path.join(sessionsDir, file);
    if (!fs.statSync(filePath).isFile()) return;
    
    // Always keep: sessions.json and *.lock files
    if (file === 'sessions.json' || file.endsWith('.lock')) {
      totalKept++;
      return;
    }
    
    // CRITICAL: Skip if lock file exists (session is ACTIVE)
    const lockFile = filePath + '.lock';
    if (fs.existsSync(lockFile)) {
      totalSkipped++;
      console.log(`   ⏸️  ${agent}/${file} — SKIPPED (active session, lock present)`);
      return;
    }
    
    // Archive only lock-free (complete) sessions
    const stat = fs.statSync(filePath);
    const dateStr = (stat.birthtime || stat.ctime).toISOString().slice(0, 10);
    const targetDir = path.join(ARCHIVE, dateStr, 'sessions');
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, file);
    
    // Already in archive dir
    if (path.dirname(filePath) === targetDir) {
      totalKept++;
      return;
    }
    
    fs.renameSync(filePath, targetPath);
    totalMoved++;
    console.log(`   ✓ ${agent}/${file} → ${dateStr}/sessions/`);
  });
  
  console.log(`   📊 ${agent}: ${totalMoved} moved, ${totalKept} kept, ${totalSkipped} skipped (active)`);
});

console.log('\n========================================');
console.log(`✅ Archive complete`);
console.log(`   Moved: ${totalMoved} files (complete sessions)`);
console.log(`   Kept: ${totalKept} files (sessions.json + locks)`);
console.log(`   Skipped: ${totalSkipped} files (active sessions with locks)`);
console.log('========================================\n');
