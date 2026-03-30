#!/usr/bin/env node
// Jarvis UI Skill — Orchestrator
// Commands: open-ui, open-neurograph, package-configs, update-configs

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JARVIS_HOME = process.env.HOME + '/JARVIS';
const OPENCLAW_HOME = process.env.HOME + '/.openclaw';
const INSTALL_PATH = path.join(JARVIS_HOME, 'skills', 'jarvis-ui', 'sci-fi');

const CONFIG = {
  uiRepo: 'https://github.com/paulvisciano/SCI-FI.git',
  installPath: INSTALL_PATH,
  uiPath: path.join(INSTALL_PATH, 'apps', 'JARVIS'),
  serverPath: path.join(INSTALL_PATH, 'apps', 'JARVIS', 'jarvis-server.js'),
  port: process.env.VOICE_PORT || 18787,
  serverLog: '/tmp/jarvis-server.log'
};

// === Load setup module ===
const setup = require('./setup.js');

// === Check if SCI-FI is cloned ===
function checkInstalled() {
  return fs.existsSync(CONFIG.uiPath);
}

// === Ensure installed + setup (Whisper + SSL) ===
function ensureInstalled() {
  if (checkInstalled()) {
    console.log('✓ SCI-FI already installed');
    return true;
  }
  
  console.log('📦 First run — running full setup (clone + Whisper + SSL)...');
  
  return setup.setup();
}

// === Pull latest JARVIS + SCI-FI updates ===
function updateLatest() {
  console.log('🔄 Updating Jarvis to latest (JARVIS + SCI-FI)...\n');
  
  // Step 1: Pull JARVIS repo
  console.log('📦 Pulling JARVIS repo...');
  try {
    const beforeJarvis = execSync(`git -C ${JARVIS_HOME} log --oneline -1`, { encoding: 'utf8' }).trim();
    console.log(`Before: ${beforeJarvis}`);
    execSync(`git -C ${JARVIS_HOME} pull origin main`, { stdio: 'inherit' });
    const afterJarvis = execSync(`git -C ${JARVIS_HOME} log --oneline -1`, { encoding: 'utf8' }).trim();
    console.log(`After: ${afterJarvis}`);
    console.log('✓ JARVIS repo updated\n');
  } catch (err) {
    console.error('❌ JARVIS pull failed:', err.message);
    console.log('Resolve conflicts, then run: git -C ~/JARVIS pull --rebase\n');
    return false;
  }
  
  // Step 2: Pull SCI-FI (inside jarvis-ui skill)
  if (checkInstalled()) {
    console.log('📦 Pulling SCI-FI (jarvis-ui skill)...');
    try {
      const beforeScifi = execSync(`git -C ${INSTALL_PATH} log --oneline -1`, { encoding: 'utf8' }).trim();
      console.log(`Before: ${beforeScifi}`);
      execSync(`git -C ${INSTALL_PATH} pull origin main`, { stdio: 'inherit' });
      const afterScifi = execSync(`git -C ${INSTALL_PATH} log --oneline -1`, { encoding: 'utf8' }).trim();
      console.log(`After: ${afterScifi}`);
      
      if (beforeScifi === afterScifi) {
        console.log('✓ SCI-FI already up to date\n');
      } else {
        console.log('✓ SCI-FI updated\n');
        console.log('💡 Server restart needed to apply UI changes:');
        console.log('   node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js restart server');
      }
    } catch (err) {
      console.error('⚠️  SCI-FI pull failed:', err.message);
    }
  } else {
    console.log('⊘ SCI-FI not installed yet — run "open jarvis ui" first\n');
  }
  
  console.log('✅ Update complete!');
  console.log('Test: node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open jarvis ui');
  return true;
}

// === Parse command ===
function parseCommand(input) {
  const cmd = input.toLowerCase().trim();
  
  if (cmd.includes('open') && cmd.includes('jarvis')) return 'open-ui';
  if (cmd.includes('open') && (cmd.includes('neurograph') || cmd.includes('graph'))) return 'open-neurograph';
  if (cmd.includes('package') && cmd.includes('config')) return 'package-configs';
  if (cmd.includes('sync') && cmd.includes('config')) return 'sync-configs';
  if (cmd.includes('update') && (cmd.includes('config') || cmd.includes('settings'))) return 'sync-configs';
  if (cmd.includes('update') && (cmd.includes('latest') || cmd.includes('jarvis') || cmd.includes('scifi'))) return 'update-latest';
  if (cmd === 'pull' || cmd === 'pull-latest') return 'update-latest';
  
  return 'unknown';
}

// === Check server health ===
function checkServerHealth() {
  try {
    const result = execSync(`lsof -i :${CONFIG.port} 2>&1 | grep LISTEN`, { encoding: 'utf8' });
    if (result && result.includes('LISTEN')) {
      return true;
    }
  } catch (err) {
    // Port not listening
  }
  return false;
}

// === Start server ===
function startServer() {
  if (checkServerHealth()) {
    console.log(`✓ Server already running on port ${CONFIG.port}`);
    return true;
  }
  
  console.log(`🚀 Starting Jarvis server on port ${CONFIG.port}...`);
  try {
    execSync(`cd ${CONFIG.uiPath} && nohup node jarvis-server.js > ${CONFIG.serverLog} 2>&1 &`);
    // Wait for server to start
    let attempts = 0;
    while (!checkServerHealth() && attempts < 10) {
      execSync('sleep 1');
      attempts++;
    }
    if (checkServerHealth()) {
      console.log(`✅ Server started (port ${CONFIG.port})`);
      return true;
    } else {
      console.error('❌ Server failed to start');
      return false;
    }
  } catch (err) {
    console.error('❌ Server start failed:', err.message);
    return false;
  }
}

// === Open browser ===
function openBrowser(url, forUser = false) {
  if (forUser) {
    console.log('✓ Opening in user profile (mic access)');
    try {
      execSync(`openclaw browser open ${url} --profile user`, { stdio: 'inherit' });
      return true;
    } catch (err) {
      console.log('⚠️  User profile not ready, opening system default...');
      execSync(`open ${url}`, { stdio: 'inherit' });
      return true;
    }
  } else {
    console.log('✓ Opening in default browser');
    try {
      execSync(`openclaw browser open ${url}`, { stdio: 'inherit' });
      return true;
    } catch (err) {
      console.error('❌ Browser open failed:', err.message);
      return false;
    }
  }
}

// === Package configs (Paul's machine) ===
function packageConfigs() {
  console.log('📦 Packaging OpenClaw configs (PRIVATE — do not commit to git)...\n');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
  const zipName = `configs-${timestamp}.zip`;
  const zipPath = path.join(OPENCLAW_HOME, 'packages', zipName);
  
  // Create packages dir in .openclaw (NOT in JARVIS repo — avoids git commits)
  const packagesDir = path.join(OPENCLAW_HOME, 'packages');
  if (!fs.existsSync(packagesDir)) {
    fs.mkdirSync(packagesDir, { recursive: true });
  }
  
  // Config files to package (includes openclaw.json, setup-paths fixes paths)
  const configs = [
    'openclaw.json',
    'agents/jarvis/models.json',
    'agents/coder/agent.json',
    'agents/coder/models.json'
  ];
  
  const existingConfigs = configs.filter(f => fs.existsSync(path.join(OPENCLAW_HOME, f)));
  
  if (existingConfigs.length === 0) {
    console.error('❌ No config files found');
    return false;
  }
  
  try {
    execSync(`cd ${OPENCLAW_HOME} && zip -r ${zipPath} ${existingConfigs.join(' ')}`, { stdio: 'inherit' });
    console.log(`✓ Created ${zipName}\n`);
    
    console.log('✅ Package complete!\n');
    console.log(`📦 ${zipName}`);
    console.log(`   Location: ${zipPath}`);
    console.log(`   Size: ${fs.statSync(zipPath).size} bytes\n`);
    
    console.log('🔒 PRIVATE — Do NOT commit to git!\n');
    console.log('📋 Send via WhatsApp or private channel:\n');
    console.log('   1. Attach zip file to message');
    console.log('   2. Send to recipient (Eric, David, etc.)');
    console.log('   3. Recipient extracts + runs setup-paths.js\n');
    
    console.log('📋 Recipient instructions:\n');
    console.log('   # Extract configs');
    console.log(`   unzip -o configs-${timestamp}.zip -d ~/.openclaw/`);
    console.log('');
    console.log('   # Setup paths (fixes workspace paths for their machine)');
    console.log('   node ~/JARVIS/skills/sync-configs/scripts/setup-paths.js');
    console.log('');
    console.log('   # Restart');
    console.log('   openclaw gateway restart\n');
    
    console.log('💡 Config sections included:');
    console.log('   - openclaw.json (agents, channels, gateway)');
    console.log('   - agents/jarvis/models.json (qwen3.5:cloud)');
    console.log('   - agents/coder/ (coder agent config)');
    console.log('');
    console.log('   setup-paths.js auto-fixes paths for their machine.\n');
    
    return true;
  } catch (err) {
    console.error('❌ Package failed:', err.message);
    return false;
  }
}

// === Sync configs (Eric's machine) ===
function syncConfigs() {
  console.log('🔄 Syncing OpenClaw configs...\n');
  
  // Find latest package
  const packagesDir = path.join(JARVIS_HOME, 'packages');
  if (!fs.existsSync(packagesDir)) {
    console.error('❌ No packages directory found');
    console.log('Run "package configs" first\n');
    return false;
  }
  
  const files = fs.readdirSync(packagesDir).filter(f => f.endsWith('.zip')).sort().reverse();
  
  if (files.length === 0) {
    console.error('❌ No config packages found');
    console.log('Run "package configs" first\n');
    return false;
  }
  
  const latestZip = files[0];
  const zipPath = path.join(packagesDir, latestZip);
  
  console.log(`📦 Found: ${latestZip}`);
  console.log(`   Size: ${fs.statSync(zipPath).size} bytes`);
  console.log(`   Created: ${new Date(fs.statSync(zipPath).mtime).toLocaleString()}\n`);
  
  try {
    console.log('🗜️  Extracting...');
    execSync(`unzip -o ${zipPath} -d ${OPENCLAW_HOME}`, { stdio: 'inherit' });
    console.log('✓ Extracted to ~/.openclaw/\n');
    
    console.log('🔄 Restarting Gateway...');
    execSync('openclaw gateway restart', { stdio: 'inherit' });
    console.log('✓ Gateway restarted\n');
    
    console.log('✅ Configs synced!');
    console.log(`   Applied: ${latestZip}`);
    console.log('   You\'re running Paul\'s latest config\n');
    
    return true;
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
    return false;
  }
}

// === Main ===
const command = process.argv[2];
const action = parseCommand(command || '');

switch (action) {
  case 'open-ui':
    console.log('🧭 Opening Jarvis UI...');
    ensureInstalled();
    startServer(); // Ensure server is running
    console.log(`🚀 Opening https://localhost:${CONFIG.port}`);
    openBrowser(`https://localhost:${CONFIG.port}`, true);
    break;
    
  case 'open-neurograph':
    console.log('🧭 Opening NeuroGraph...');
    ensureInstalled();
    startServer(); // Ensure server is running
    console.log(`🚀 Opening https://localhost:${CONFIG.port}/ (NeuroGraph is main view)`);
    openBrowser(`https://localhost:${CONFIG.port}/`);
    break;
    
  case 'package-configs':
    packageConfigs();
    break;
    
  case 'sync-configs':
    syncConfigs();
    break;
    
  case 'update-latest':
    updateLatest();
    break;
    
  default:
    console.log('Usage: node jarvis-ui.js <command>');
    console.log('Commands:');
    console.log('  open jarvis ui     — Open Jarvis UI (user profile for mic, auto-starts server)');
    console.log('  open neurograph    — Open NeuroGraph (default browser, auto-starts server)');
    console.log('  update latest      — Pull latest JARVIS + SCI-FI (git pull both repos)');
    console.log('  sync configs       — Extract latest configs + restart gateway');
    console.log('  package configs    — Package OpenClaw configs (Paul: zip + commit + push)');
    process.exit(1);
}
