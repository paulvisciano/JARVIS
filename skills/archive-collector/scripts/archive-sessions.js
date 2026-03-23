#!/usr/bin/env node
/**
 * JARVIS Archive OpenClaw Sessions
 * Archives OpenClaw session files (.jsonl) by creation date
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const ARCHIVE = path.join(HOME, 'RAW', 'archive');

// Archive sessions from all agents (main, jarvis, etc.)
const AGENTS_DIR = path.join(HOME, '.openclaw', 'agents');

console.log('📚 Archive OpenClaw Sessions...');

if (!fs.existsSync(AGENTS_DIR)) {
  console.log('   ⚠️  OpenClaw agents dir not found');
  process.exit(0);
}

const agents = fs.readdirSync(AGENTS_DIR).filter(f => 
  fs.statSync(path.join(AGENTS_DIR, f)).isDirectory()
);

let totalSessions = 0;

agents.forEach(agent => {
  const sessionsDir = path.join(AGENTS_DIR, agent, 'sessions');
  
  if (!fs.existsSync(sessionsDir)) {
    return;
  }
  
  const sessionFiles = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => {
      const filePath = path.join(sessionsDir, f);
      const stat = fs.statSync(filePath);
      return {
        name: f,
        path: filePath,
        birthtime: stat.birthtime || stat.ctime,
        agent: agent
      };
    });
  
  if (sessionFiles.length === 0) {
    return;
  }
  
  totalSessions += sessionFiles.length;
  
  console.log(`   📊 ${agent}: ${sessionFiles.length} sessions`);
  
  sessionFiles.forEach(file => {
    const { name, path: filePath, birthtime, agent } = file;
    const dateStr = birthtime.toISOString().slice(0, 10);
    const targetDir = path.join(ARCHIVE, dateStr, 'sessions');
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, name);
    
    if (path.dirname(filePath) === targetDir) {
      console.log(`   ✓ ${agent}/${name} already in ${dateStr}/sessions/`);
      return;
    }
    
    fs.renameSync(filePath, targetPath);
    console.log(`   ✓ ${agent}/${name} → ${dateStr}/sessions/ (created: ${dateStr})`);
  });
});

if (totalSessions === 0) {
  console.log('   ℹ️  No session files found');
  process.exit(0);
}

console.log(`✅ Archive OpenClaw Sessions complete! (${totalSessions} total)`);
