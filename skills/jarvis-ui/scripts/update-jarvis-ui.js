#!/usr/bin/env node

/**
 * Update JARVIS UI — Automated Update Script
 * 
 * Pulls latest from GitHub, handles directory renames, syncs assets, and restarts server.
 * Makes updates seamless for anyone running JARVIS UI via the jarvis-ui skill.
 * 
 * Usage: node update-jarvis-ui.js [--force-restart] [--dry-run]
 * Example: node update-jarvis-ui.js
 *          node update-jarvis-ui.js --dry-run
 *          node update-jarvis-ui.js --force-restart
 * 
 * This is part of Jarvis's skill set — sovereign, local, extensible.
 * github.com/paulvisciano/JARVIS
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Configuration
const HOME = os.homedir();
const SKILL_DIR = path.join(HOME, 'JARVIS', 'skills', 'jarvis-ui');
const SCI_FI_DIR = path.join(SKILL_DIR, 'sci-fi');
const OLD_APP_DIR = path.join(SCI_FI_DIR, 'apps', 'JARVIS');
const NEW_APP_DIR = path.join(SCI_FI_DIR, 'apps', 'JARVIS-UI');
const LOG_FILE = '/tmp/jarvis-ui-update.log';
const SERVER_PID_FILE = '/tmp/jarvis-ui.pid';

// Colors
const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[0;34m',
  green: '\x1b[0;32m',
  yellow: '\x1b[1;33m',
  red: '\x1b[0;31m'
};

// Parse arguments
const args = process.argv.slice(2);
const FORCE_RESTART = args.includes('--force-restart');
const DRY_RUN = args.includes('--dry-run');

// Helper functions
function log(message) {
  const line = `[UPDATE] ${message}`;
  console.log(`${colors.blue}[UPDATE]${colors.reset} ${message}`);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function success(message) {
  const line = `[✓] ${message}`;
  console.log(`${colors.green}[✓]${colors.reset} ${message}`);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function warning(message) {
  const line = `[!] ${message}`;
  console.log(`${colors.yellow}[!]${colors.reset} ${message}`);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function error(message) {
  const line = `[✗] ${message}`;
  console.error(`${colors.red}[✗]${colors.reset} ${message}`);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function exec(command, options = {}) {
  try {
    const result = execSync(command, { encoding: 'utf8', ...options });
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, error: err.message, output: err.stdout || '' };
  }
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function getCommitCountBehind() {
  const result = exec('git rev-list HEAD..origin/main --count', { cwd: SCI_FI_DIR });
  if (result.success) {
    return parseInt(result.output, 10);
  }
  return 0;
}

function getCurrentCommit() {
  const result = exec('git rev-parse --short HEAD', { cwd: SCI_FI_DIR });
  return result.success ? result.output : 'unknown';
}

function getNewCommits(count) {
  const result = exec(`git log --oneline HEAD~${count}..HEAD`, { cwd: SCI_FI_DIR });
  if (result.success) {
    return result.output.split('\n');
  }
  return [];
}

function getVersionFromFile(filePath, pattern) {
  if (!fileExists(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(pattern);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function getServerPID() {
  const result = exec('lsof -t -i :18787');
  if (result.success && result.output) {
    return result.output.split('\n')[0];
  }
  return null;
}

function killProcess(pid) {
  exec(`kill ${pid}`);
  exec(`kill -9 ${pid}`);
}

function copyFile(src, dst) {
  try {
    fs.copyFileSync(src, dst);
    return true;
  } catch {
    return false;
  }
}

// Main update function
async function updateJarvisUI() {
  // Clear log file
  fs.writeFileSync(LOG_FILE, '');
  
  log('=== JARVIS UI Update Script ===');
  log(`Skill directory: ${SKILL_DIR}`);
  log(`SCI-FI directory: ${SCI_FI_DIR}`);
  
  // Check SCI-FI directory exists
  if (!fileExists(SCI_FI_DIR)) {
    error(`SCI-FI directory not found: ${SCI_FI_DIR}`);
    process.exit(1);
  }
  
  // Fetch latest
  log('Checking for updates...');
  exec('git fetch origin', { cwd: SCI_FI_DIR });
  const behindCount = getCommitCountBehind();
  
  if (behindCount === 0) {
    success('Already up to date!');
    const currentCommit = getCurrentCommit();
    log(`Current commit: ${currentCommit}`);
  } else {
    log(`Found ${behindCount} commit(s) behind origin/main`);
  }
  
  // Dry run mode
  if (DRY_RUN) {
    log('=== DRY RUN ===');
    if (behindCount > 0) {
      log(`Would pull ${behindCount} commit(s):`);
      const commits = getNewCommits(behindCount);
      commits.forEach(commit => log(commit));
    }
    process.exit(0);
  }
  
  // Pull latest
  if (behindCount > 0) {
    log('Pulling latest from GitHub...');
    const pullResult = exec('git pull origin main', { cwd: SCI_FI_DIR });
    if (pullResult.success) {
      success('Pulled latest changes');
      const commits = getNewCommits(behindCount);
      log('New commits:');
      commits.forEach(commit => log(commit));
    } else {
      error('Failed to pull: ' + pullResult.error);
      process.exit(1);
    }
  } else {
    log('No new commits to pull');
  }
  
  // Handle directory rename
  const hasOldDir = fileExists(OLD_APP_DIR);
  const hasNewDir = fileExists(NEW_APP_DIR);
  
  if (hasOldDir && !hasNewDir) {
    warning('Detected directory rename: JARVIS → JARVIS-UI');
    log('Renaming directory...');
    try {
      fs.renameSync(OLD_APP_DIR, NEW_APP_DIR);
      success('Directory renamed to JARVIS-UI');
    } catch (err) {
      error('Failed to rename directory: ' + err.message);
      process.exit(1);
    }
  } else if (hasNewDir) {
    success('Using JARVIS-UI directory (already renamed)');
  } else {
    error('Neither JARVIS nor JARVIS-UI directory found!');
    process.exit(1);
  }
  
  // Sync assets
  log('Syncing assets...');
  const oldAssetsDir = path.join(OLD_APP_DIR, 'assets');
  const newAssetsDir = path.join(NEW_APP_DIR, 'assets');
  
  if (fileExists(oldAssetsDir)) {
    const assetsToCopy = ['https-key.pem', 'https-cert.pem', 'ggml-large-v3.bin'];
    let copiedCount = 0;
    
    assetsToCopy.forEach(file => {
      const src = path.join(oldAssetsDir, file);
      const dst = path.join(newAssetsDir, file);
      if (fileExists(src) && !fileExists(dst)) {
        log(`Copying ${file} to new assets directory...`);
        if (copyFile(src, dst)) {
          copiedCount++;
        }
      }
    });
    
    if (copiedCount > 0) {
      success(`Assets synced (${copiedCount} files)`);
    } else {
      success('Assets already in correct location');
    }
  } else {
    success('Assets already in correct location');
  }
  
  // Check versions
  log('Checking current version...');
  const appJsPath = path.join(NEW_APP_DIR, 'app.js');
  const serverJsPath = path.join(NEW_APP_DIR, 'jarvis-server.js');
  
  const clientVersion = getVersionFromFile(appJsPath, /CLIENT_VERSION = ['"](.+?)['"]/);
  const serverVersion = getVersionFromFile(serverJsPath, /^const VERSION = ['"](.+?)['"]/m);
  
  if (clientVersion) log(`Client version: ${clientVersion}`);
  if (serverVersion) log(`Server version: ${serverVersion}`);
  
  // Restart server
  log('Checking if server is running...');
  const oldPID = getServerPID();
  
  if (oldPID || FORCE_RESTART) {
    if (oldPID) {
      log(`Stopping old server (PID: ${oldPID})...`);
      killProcess(oldPID);
      // Wait for port to be freed
      let attempts = 0;
      while (getServerPID() && attempts < 10) {
        exec('sleep 0.5');
        attempts++;
      }
      success('Old server stopped');
    }
    
    log('Starting new server...');
    const serverPath = path.join(NEW_APP_DIR, 'jarvis-server.js');
    const logPath = '/tmp/jarvis-ui-latest.log';
    
    // Start server in background
    const { spawn } = require('child_process');
    const serverProcess = spawn('node', [serverPath], {
      detached: true,
      stdio: 'ignore',
      cwd: NEW_APP_DIR
    });
    
    serverProcess.unref();
    const newPID = serverProcess.pid;
    fs.writeFileSync(SERVER_PID_FILE, newPID.toString());
    success(`Server started (PID: ${newPID})`);
    
    // Wait for server to start
    log('Waiting for server to initialize...');
    exec('sleep 5');
    
    // Verify server is running
    if (getServerPID()) {
      success('Server is running on port 18787');
      
      // Get version from health endpoint
      const healthResult = exec('curl -k -s https://localhost:18787/health');
      if (healthResult.success && healthResult.output) {
        try {
          const health = JSON.parse(healthResult.output);
          if (health.version) {
            success(`Version: v${health.version} (build: ${health.build || 'unknown'})`);
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
    } else {
      error('Server failed to start! Check logs: /tmp/jarvis-ui-latest.log');
      process.exit(1);
    }
  } else {
    log('Server not running, starting it...');
    const serverPath = path.join(NEW_APP_DIR, 'jarvis-server.js');
    const { spawn } = require('child_process');
    const serverProcess = spawn('node', [serverPath], {
      detached: true,
      stdio: 'ignore',
      cwd: NEW_APP_DIR
    });
    serverProcess.unref();
    const newPID = serverProcess.pid;
    fs.writeFileSync(SERVER_PID_FILE, newPID.toString());
    success(`Server started (PID: ${newPID})`);
  }
  
  // Summary
  console.log('');
  success('=== Update Complete! ===');
  log('JARVIS UI is now running at: https://localhost:18787/');
  log(`Log file: ${LOG_FILE}`);
  log('Server log: /tmp/jarvis-ui-latest.log');
  
  // Cleanup notice
  if (fileExists(oldAssetsDir)) {
    warning(`Old assets directory still exists: ${oldAssetsDir}`);
    log('You can safely delete it after confirming everything works:');
    log(`  rm -rf ${oldAssetsDir}`);
  }
  
  process.exit(0);
}

// Run the update
updateJarvisUI().catch(err => {
  error('Unexpected error: ' + err.message);
  process.exit(1);
});
