#!/usr/bin/env node
/**
 * JARVIS Archive OpenClaw Sessions
 * Simple rule: Archive EVERYTHING except sessions.json and *.lock files
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const ARCHIVE = path.join(HOME, 'RAW', 'archive');
const AGENTS_DIR = path.join(HOME, '.openclaw', 'agents');

console.log('📚 Archive OpenClaw Sessions...');

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
  
  const files = fs.readdirSync(sessionsDir);
  
  files.forEach(file => {
    const filePath = path.join(sessionsDir, file);
    if (!fs.statSync(filePath).isFile()) return;
    
    // Keep only: sessions.json and *.lock files
    if (file === 'sessions.json' || file.endsWith('.lock')) {
      totalKept++;
      return;
    }
    
    // Archive everything else
    const stat = fs.statSync(filePath);
    const dateStr = (stat.birthtime || stat.ctime).toISOString().slice(0, 10);
    const targetDir = path.join(ARCHIVE, dateStr, 'sessions');
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, file);
    
    if (path.dirname(filePath) === targetDir) {
      totalKept++;
      return;
    }
    
    fs.renameSync(filePath, targetPath);
    totalMoved++;
    console.log(`   ✓ ${agent}/${file} → ${dateStr}/sessions/`);
  });
  
  console.log(`   📊 ${agent}: ${totalMoved} moved, ${totalKept} kept`);
});

console.log('\n========================================');
console.log(`✅ Archive complete`);
console.log(`   Moved: ${totalMoved} files`);
console.log(`   Kept: ${totalKept} files (sessions.json + locks)`);
console.log('========================================\n');
