#!/usr/bin/env node
/**
 * Rotate OpenClaw Sessions to Archive
 * 
 * Moves inactive session files from ~/.openclaw/agents/*/sessions/ 
 * to ~/RAW/archive/YYYY-MM-DD/sessions/
 * 
 * Keeps only the active session (tracked in sessions.json) in the runtime folder.
 * 
 * Usage: node skills/archive-collector/scripts/rotate-sessions.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const OPENCLAW_DIR = path.join(HOME, '.openclaw');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

// Get today's date for archive folder
const today = new Date().toISOString().split('T')[0];
const todayArchiveDir = path.join(RAW_ARCHIVE, today, 'sessions');

// Find all agent session directories
function findAgentSessionDirs() {
  const agentsDir = path.join(OPENCLAW_DIR, 'agents');
  if (!fs.existsSync(agentsDir)) return [];
  
  const agents = fs.readdirSync(agentsDir);
  const sessionDirs = [];
  
  for (const agent of agents) {
    const sessionDir = path.join(agentsDir, agent, 'sessions');
    if (fs.existsSync(sessionDir)) {
      sessionDirs.push({ agent, path: sessionDir });
    }
  }
  
  return sessionDirs;
}

// Parse sessions.json to get active session IDs
function getActiveSessions(sessionDir) {
  const sessionsJsonPath = path.join(sessionDir, 'sessions.json');
  if (!fs.existsSync(sessionsJsonPath)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(sessionsJsonPath, 'utf8'));
    const activeIds = [];
    
    for (const [key, session] of Object.entries(data)) {
      if (session.sessionId) {
        activeIds.push(session.sessionId);
      }
    }
    
    return activeIds;
  } catch (err) {
    console.error(`Error reading sessions.json: ${err.message}`);
    return [];
  }
}

// Rotate sessions for a single agent directory
function rotateSessionsForAgent(agentInfo) {
  const { agent, path: sessionDir } = agentInfo;
  const activeIds = getActiveSessions(sessionDir);
  
  console.log(`\n📂 Agent: ${agent}`);
  console.log(`   Active sessions: ${activeIds.length}`);
  activeIds.forEach(id => console.log(`      - ${id}`));
  
  const files = fs.readdirSync(sessionDir);
  let moved = 0;
  let kept = 0;
  let errors = 0;
  
  for (const file of files) {
    const filePath = path.join(sessionDir, file);
    if (!fs.statSync(filePath).isFile()) continue;
    
    // Skip sessions.json and lock files
    if (file === 'sessions.json' || file.endsWith('.lock')) {
      kept++;
      continue;
    }
    
    // Extract session ID from filename (UUID at start)
    const sessionId = file.split('.jsonl')[0];
    const isReset = file.includes('.reset.');
    
    // Check if this session is active
    const isActive = activeIds.some(id => sessionId.startsWith(id));
    
    if (isActive && !isReset) {
      // Keep active session's main jsonl file
      kept++;
      continue;
    }
    
    // Move inactive sessions and all reset files to archive
    const archiveFile = path.join(todayArchiveDir, file);
    
    try {
      fs.mkdirSync(todayArchiveDir, { recursive: true });
      fs.renameSync(filePath, archiveFile);
      moved++;
      console.log(`   → Moved: ${file}`);
    } catch (err) {
      errors++;
      console.error(`   ✗ Error moving ${file}: ${err.message}`);
    }
  }
  
  return { moved, kept, errors };
}

// Main rotation
function rotateAllSessions() {
  console.log('🔄 Rotating OpenClaw Sessions to Archive');
  console.log('========================================\n');
  
  // Ensure today's archive directory exists
  fs.mkdirSync(todayArchiveDir, { recursive: true });
  
  const agentDirs = findAgentSessionDirs();
  
  if (agentDirs.length === 0) {
    console.log('No agent session directories found.');
    return;
  }
  
  let totalMoved = 0;
  let totalKept = 0;
  let totalErrors = 0;
  
  for (const agentInfo of agentDirs) {
    const result = rotateSessionsForAgent(agentInfo);
    totalMoved += result.moved;
    totalKept += result.kept;
    totalErrors += result.errors;
  }
  
  console.log('\n========================================');
  console.log(`✅ Rotation complete`);
  console.log(`   Moved: ${totalMoved} files to ${todayArchiveDir}`);
  console.log(`   Kept: ${totalKept} files (active sessions)`);
  if (totalErrors > 0) {
    console.log(`   Errors: ${totalErrors}`);
  }
  console.log('========================================\n');
}

// Run
rotateAllSessions();
