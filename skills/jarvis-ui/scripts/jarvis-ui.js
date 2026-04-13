#!/usr/bin/env node
// Jarvis UI Skill — Orchestrator
// Commands: open-ui, preview, package-configs, update-configs
// Note: NeuroGraph is merged into main UI (no separate route)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JARVIS_HOME = process.env.HOME + '/JARVIS';
const OPENCLAW_HOME = process.env.HOME + '/.openclaw';
const INSTALL_PATH = path.join(JARVIS_HOME, 'skills', 'jarvis-ui', 'sci-fi');

const CONFIG = {
  uiRepo: 'https://github.com/paulvisciano/SCI-FI.git',
  installPath: INSTALL_PATH,
  uiPath: path.join(INSTALL_PATH, 'apps', 'JARVIS-UI'),
  serverPath: path.join(INSTALL_PATH, 'apps', 'JARVIS-UI', 'jarvis-server.js'),
  previewPath: path.join(OPENCLAW_HOME, 'agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS'),
  productionPort: 18787,
  previewPort: 18788,
  productionLog: '/tmp/jarvis-production.log',
  previewLog: '/tmp/jarvis-preview.log'
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
  if (cmd.includes('preview') || (cmd.includes('open') && cmd.includes('preview'))) return 'preview';
  if (cmd.includes('package') && cmd.includes('config')) return 'package-configs';
  if (cmd.includes('sync') && cmd.includes('config')) return 'sync-configs';
  if (cmd.includes('update') && (cmd.includes('config') || cmd.includes('settings'))) return 'sync-configs';
  if (cmd.includes('update') && (cmd.includes('latest') || cmd.includes('jarvis') || cmd.includes('scifi'))) return 'update-latest';
  if (cmd === 'pull' || cmd === 'pull-latest') return 'update-latest';
  if (cmd.includes('restart') && cmd.includes('server')) return 'restart-server';
  if (cmd.includes('stop') && cmd.includes('server')) return 'stop-server';
  if (cmd.includes('start') && cmd.includes('server')) return 'start-server';
  
  return 'unknown';
}

// === Kill server on port ===
function killServer(port) {
  try {
    execSync(`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill 2>/dev/null`);
    console.log(`✓ Killed server on port ${port}`);
    return true;
  } catch (err) {
    // No server running on this port
    return false;
  }
}

// === Check server health ===
function checkServerHealth(port) {
  try {
    const result = execSync(`lsof -i :${port} 2>&1 | grep LISTEN`, { encoding: 'utf8' });
    if (result && result.includes('LISTEN')) {
      return true;
    }
  } catch (err) {
    // Port not listening
  }
  return false;
}

// === Start production server ===
function startProductionServer() {
  const port = CONFIG.productionPort;
  
  if (checkServerHealth(port)) {
    console.log(`✓ Production server already running on port ${port}`);
    return true;
  }
  
  console.log(`🚀 Starting production server on port ${port}...`);
  try {
    execSync(`cd ${CONFIG.uiPath} && nohup node jarvis-server.js > ${CONFIG.productionLog} 2>&1 &`);
    // Wait for server to start
    let attempts = 0;
    while (!checkServerHealth(port) && attempts < 10) {
      execSync('sleep 1');
      attempts++;
    }
    if (checkServerHealth(port)) {
      console.log(`✅ Production server started (port ${port})`);
      return true;
    } else {
      console.error('❌ Production server failed to start');
      return false;
    }
  } catch (err) {
    console.error('❌ Production server start failed:', err.message);
    return false;
  }
}

// === Start preview server ===
function startPreviewServer() {
  const port = CONFIG.previewPort;
  
  if (checkServerHealth(port)) {
    console.log(`✓ Preview server already running on port ${port}`);
    return true;
  }
  
  console.log(`🚀 Starting preview server on port ${port}...`);
  try {
    execSync(`cd ${CONFIG.previewPath} && VOICE_PORT=${port} JARVIS_PREVIEW=true nohup node jarvis-server.js > ${CONFIG.previewLog} 2>&1 &`);
    // Wait for server to start
    let attempts = 0;
    while (!checkServerHealth(port) && attempts < 10) {
      execSync('sleep 1');
      attempts++;
    }
    if (checkServerHealth(port)) {
      console.log(`✅ Preview server started (port ${port})`);
      return true;
    } else {
      console.error('❌ Preview server failed to start');
      return false;
    }
  } catch (err) {
    console.error('❌ Preview server start failed:', err.message);
    return false;
  }
}

// === Open browser ===
function openBrowser(url, forUser = false) {
  if (forUser) {
    console.log('✓ Opening in user browser (mic access)');
    // Use native open command to ensure it opens in user's actual browser (not OpenClaw sandbox)
    try {
      execSync(`open "${url}"`, { stdio: 'inherit' });
      console.log('✓ Opened in system default browser (user profile)');
      return true;
    } catch (err) {
      console.error('❌ Browser open failed:', err.message);
      // Fallback to openclaw browser
      try {
        execSync(`openclaw browser open ${url}`, { stdio: 'inherit' });
        return true;
      } catch (err2) {
        return false;
      }
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
    console.error('❌ No config files found to package');
    return false;
  }
  
  try {
    console.log('📦 Files to package:');
    existingConfigs.forEach(f => console.log(`   - ${f}`));
    console.log('');
    
    // Create zip
    const filesStr = existingConfigs.join(' ');
    execSync(`cd ${OPENCLAW_HOME} && zip -r ${zipPath} ${filesStr}`, { stdio: 'inherit' });
    
    console.log('');
    console.log(`✅ Packaged to: ${zipPath}`);
    console.log(`   Size: ${fs.statSync(zipPath).size} bytes`);
    console.log('');
    console.log('📤 Next steps:');
    console.log('   1. Commit zip to your personal repo (NOT JARVIS repo)');
    console.log('   2. Push to GitHub');
    console.log('   3. On Eric\'s machine: run "sync configs"');
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

// === Restart server ===
function restartServer() {
  console.log('🔄 Restarting production server...\n');
  
  // Kill existing
  killServer(CONFIG.productionPort);
  
  // Wait for port to free up
  execSync('sleep 1');
  
  // Start new
  startProductionServer();
  
  console.log('');
  console.log('✅ Server restarted!');
  console.log(`   URL: https://localhost:${CONFIG.productionPort}`);
  console.log('   Test: node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open jarvis ui\n');
  
  return true;
}

// === Stop server ===
function stopServer() {
  console.log('🛑 Stopping production server...\n');
  
  if (killServer(CONFIG.productionPort)) {
    console.log('✅ Server stopped\n');
    return true;
  } else {
    console.log('⊘ No server was running\n');
    return false;
  }
}

// === Start server ===
function startServer() {
  console.log('🚀 Starting production server...\n');
  
  if (startProductionServer()) {
    console.log('');
    console.log('✅ Server started!');
    console.log(`   URL: https://localhost:${CONFIG.productionPort}`);
    console.log('   Test: node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open jarvis ui\n');
    return true;
  }
  return false;
}

// === Main ===
const command = process.argv.slice(2).join(' ');
const action = parseCommand(command || '');

switch (action) {
  case 'open-ui':
    console.log('🧭 Opening Jarvis UI (Production)...\n');
    ensureInstalled();
    
    // Start production server (doesn't affect preview - they run independently)
    startProductionServer();
    console.log(`\n🚀 Opening https://localhost:${CONFIG.productionPort}`);
    openBrowser(`https://localhost:${CONFIG.productionPort}`, true);
    break;
    
  case 'open-neurograph':
    console.log('🧭 Opening NeuroGraph (Production)...\n');
    console.log('ℹ️  Note: NeuroGraph is now the main UI (merged into root view)\n');
    ensureInstalled();
    
    // Start production server (doesn't affect preview - they run independently)
    startProductionServer();
    console.log(`\n🚀 Opening https://localhost:${CONFIG.productionPort}/`);
    openBrowser(`https://localhost:${CONFIG.productionPort}/`);
    break;
    
  case 'preview':
    console.log('🧭 Opening Preview Server...\n');
    
    // Start preview server (doesn't affect production - they run independently)
    startPreviewServer();
    console.log(`\n🚀 Opening https://localhost:${CONFIG.previewPort}`);
    openBrowser(`https://localhost:${CONFIG.previewPort}`);
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
    
  case 'restart-server':
    restartServer();
    break;
    
  case 'stop-server':
    stopServer();
    break;
    
  case 'start-server':
    startServer();
    break;
    
  default:
    console.log('Usage: node jarvis-ui.js <command>');
    console.log('');
    console.log('Commands:');
    console.log('  open jarvis ui     — Open Jarvis UI (user profile for mic, auto-starts server)');
    console.log('  open neurograph    — Open NeuroGraph (default browser, auto-starts server)');
    console.log('  preview            — Open preview server (port 18788, for testing UI changes)');
    console.log('  start server       — Start production server (port 18787)');
    console.log('  stop server        — Stop production server');
    console.log('  restart server     — Restart production server');
    console.log('  update latest      — Pull latest JARVIS + SCI-FI (git pull both repos)');
    console.log('  sync configs       — Extract latest configs + restart gateway');
    console.log('  package configs    — Package OpenClaw configs (Paul: zip + commit + push)');
    console.log('');
    console.log('Port mapping:');
    console.log('  Production: 18787 (default, "open jarvis ui")');
    console.log('  Preview:    18788 (explicit request, "preview")');
    console.log('');
    process.exit(1);
}
