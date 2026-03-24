#!/usr/bin/env node

/**
 * Session Rotator + Server Health — Aggressive rotation with size + time triggers
 * 
 * Prevents: 10 MB bloat, stale locks, timeout cascade
 * Runs: Hourly via cron/LaunchAgent
 * Also: Ensures neuro-graph server is running
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Config
const MAX_SESSION_SIZE_MB = 5;
const MAX_SESSION_SIZE_BYTES = MAX_SESSION_SIZE_MB * 1024 * 1024;
const INACTIVE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours
const LOCK_AGE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
const SESSIONS_DIR = path.join(process.env.HOME, '.openclaw', 'agents');
const ARCHIVE_DIR = path.join(process.env.HOME, 'RAW', 'archive', new Date().toISOString().split('T')[0], 'sessions');
const SERVER_PORT = 18787;
const SERVER_DIR = path.join(process.env.HOME, 'JARVIS', 'skills', 'jarvis-ui', 'sci-fi', 'apps', 'JARVIS');
const SERVER_LOG = '/tmp/jarvis-server.log';

// Ensure archive dir exists
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// Helpers
function log(...args) {
  console.log(...args);
}

function warn(...args) {
  console.warn(...args);
}

function getSessions(agentsDir) {
  const sessions = [];
  const agents = fs.readdirSync(agentsDir);
  
  for (const agent of agents) {
    const agentPath = path.join(agentsDir, agent);
    if (!fs.statSync(agentPath).isDirectory()) continue;
    
    const sessionsPath = path.join(agentPath, 'sessions');
    if (!fs.existsSync(sessionsPath)) continue;
    
    const files = fs.readdirSync(sessionsPath);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl') && !f.includes('.reset'));
    
    for (const file of jsonlFiles) {
      const fullPath = path.join(sessionsPath, file);
      const stats = fs.statSync(fullPath);
      sessions.push({
        agent,
        file,
        path: fullPath,
        size: stats.size,
        mtime: stats.mtimeMs,
        ageMs: Date.now() - stats.mtimeMs
      });
    }
  }
  
  return sessions;
}

function rotateSession(session, reason) {
  const basename = path.basename(session.file, '.jsonl');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const newName = `${basename}.reset.${timestamp}.jsonl`;
  const archivePath = path.join(ARCHIVE_DIR, newName);
  
  log(`   🔄 Rotating ${session.agent}/${basename} (${reason})`);
  fs.renameSync(session.path, archivePath);
  
  // Also move lock file if exists
  const lockPath = session.path + '.lock';
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
  }
  
  return archivePath;
}

function cleanupLocks(agentsDir) {
  let cleaned = 0;
  
  const agents = fs.readdirSync(agentsDir);
  for (const agent of agents) {
    const agentPath = path.join(agentsDir, agent);
    if (!fs.statSync(agentPath).isDirectory()) continue;
    
    const sessionsPath = path.join(agentPath, 'sessions');
    if (!fs.existsSync(sessionsPath)) continue;
    
    const files = fs.readdirSync(sessionsPath);
    const lockFiles = files.filter(f => f.endsWith('.lock'));
    
    for (const lockFile of lockFiles) {
      const fullPath = path.join(sessionsPath, lockFile);
      const stats = fs.statSync(fullPath);
      const ageMs = Date.now() - stats.mtimeMs;
      
      if (ageMs > LOCK_AGE_THRESHOLD_MS) {
        log(`   🔓 Removing stale lock: ${lockFile} (${Math.round(ageMs / 60000)} mins old)`);
        fs.unlinkSync(fullPath);
        cleaned++;
      }
    }
  }
  
  return cleaned;
}

function checkServerHealth() {
  try {
    // Check if port is listening
    const result = execSync(`lsof -i :${SERVER_PORT} 2>&1 | grep LISTEN`, { encoding: 'utf8' });
    if (result && result.includes('LISTEN')) {
      log('   ✓ Neuro-graph server running');
      return true;
    }
  } catch (err) {
    // Port not listening
  }
  
  warn('   ⚠️ Neuro-graph server not running — starting...');
  try {
    execSync(`cd ${SERVER_DIR} && nohup node jarvis-server.js > ${SERVER_LOG} 2>&1 &`);
    log(`   ✅ Server started (PID: $!, port: ${SERVER_PORT})`);
    return true;
  } catch (err) {
    warn(`   ❌ Failed to start server: ${err.message}`);
    return false;
  }
}

// Main
function rotate() {
  log('🔄 Session Rotator —', new Date().toISOString().split('T')[0]);
  log(`   Checking sessions in ${SESSIONS_DIR}`);
  log('');
  
  // Server health check first
  checkServerHealth();
  log('');
  
  const sessions = getSessions(SESSIONS_DIR);
  let rotated = 0;
  let sizeRotated = 0;
  let ageRotated = 0;
  
  // Size checks
  log('   Size checks:');
  for (const session of sessions) {
    const sizeMB = (session.size / 1024 / 1024).toFixed(2);
    if (session.size > MAX_SESSION_SIZE_BYTES) {
      warn(`   ⚠️ ${session.agent}/${path.basename(session.file)}: ${sizeMB} MB → rotating...`);
      rotateSession(session, 'size');
      rotated++;
      sizeRotated++;
    } else {
      log(`   ✓ ${session.agent}/${path.basename(session.file)}: ${sizeMB} MB (ok)`);
    }
  }
  log('');
  
  // Age checks
  log('   Age checks:');
  const activeSessions = sessions.filter(s => {
    const baseName = path.basename(s.file, '.jsonl');
    // Check if session has recent activity (lock file or recent mtime)
    const lockPath = s.path + '.lock';
    const hasLock = fs.existsSync(lockPath);
    const isActive = hasLock || s.ageMs < INACTIVE_THRESHOLD_MS;
    
    if (!isActive) {
      warn(`   ⚠️ ${s.agent}/${baseName}: inactive ${Math.round(s.ageMs / 60000)} mins → rotating...`);
      rotateSession(s, 'age');
      rotated++;
      ageRotated++;
    } else {
      log(`   ✓ ${s.agent}/${baseName}: active ${Math.round(s.ageMs / 60000)} mins ago`);
    }
    
    return isActive;
  });
  log('');
  
  // Lock cleanup
  log('   Lock cleanup:');
  const locksCleaned = cleanupLocks(SESSIONS_DIR);
  if (locksCleaned === 0) {
    log('   ✓ No stale locks found');
  }
  log('');
  
  // Summary
  log('   Summary:');
  log(`   - Checked: ${sessions.length} sessions`);
  log(`   - Rotated: ${rotated} (${sizeRotated} size, ${ageRotated} age)`);
  log(`   - Locks cleaned: ${locksCleaned}`);
  log(`   - Active kept: ${activeSessions.length}`);
  log('✅ Rotation complete');
}

rotate();
