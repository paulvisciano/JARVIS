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
  port: process.env.VOICE_PORT || 18787
};

// === Check if SCI-FI is cloned ===
function checkInstalled() {
  return fs.existsSync(CONFIG.uiPath);
}

// === Clone SCI-FI on first run ===
function ensureInstalled() {
  if (checkInstalled()) {
    console.log('✓ SCI-FI already installed');
    return true;
  }
  
  console.log('📦 First run — cloning SCI-FI...');
  
  try {
    execSync(`git clone ${CONFIG.uiRepo} ${INSTALL_PATH}`, { stdio: 'inherit' });
    console.log('✓ SCI-FI cloned');
    return true;
  } catch (err) {
    console.error('❌ Clone failed:', err.message);
    return false;
  }
}

// === Parse command ===
function parseCommand(input) {
  const cmd = input.toLowerCase().trim();
  
  if (cmd.includes('open') && cmd.includes('jarvis')) return 'open-ui';
  if (cmd.includes('open') && (cmd.includes('neurograph') || cmd.includes('graph'))) return 'open-neurograph';
  if (cmd.includes('package') && cmd.includes('config')) return 'package-configs';
  if (cmd.includes('update') && (cmd.includes('config') || cmd.includes('settings'))) return 'update-configs';
  
  return 'unknown';
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

// === Update configs (Eric's machine) ===
function updateConfigs() {
  console.log('🔄 Updating OpenClaw configs...\n');
  
  // Find latest package
  const packagesDir = path.join(JARVIS_HOME, 'packages');
  if (!fs.existsSync(packagesDir)) {
    console.error('❌ No packages directory found');
    console.log('Paul needs to run "package configs" first\n');
    return false;
  }
  
  const files = fs.readdirSync(packagesDir).filter(f => f.endsWith('.zip')).sort().reverse();
  
  if (files.length === 0) {
    console.error('❌ No config packages found');
    console.log('Paul needs to run "package configs" first\n');
    return false;
  }
  
  const latestZip = files[0];
  const zipPath = path.join(packagesDir, latestZip);
  
  console.log(`📦 Found: ${latestZip}`);
  console.log(`   Size: ${fs.statSync(zipPath).size} bytes\n`);
  
  try {
    console.log('🗜️  Extracting...');
    execSync(`unzip -o ${zipPath} -d ${OPENCLAW_HOME}`, { stdio: 'inherit' });
    console.log('✓ Extracted\n');
    
    console.log('🔄 Restarting Gateway...');
    execSync('openclaw gateway restart', { stdio: 'inherit' });
    console.log('✓ Restarted\n');
    
    console.log('✅ Configs updated!');
    console.log(`   Applied: ${latestZip}\n`);
    
    console.log('💡 Cleanup (optional):');
    console.log(`   rm ${zipPath}`);
    console.log('   git -C ~/JARVIS commit -m "cleanup: extracted configs"\n');
    
    return true;
  } catch (err) {
    console.error('❌ Update failed:', err.message);
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
    console.log(`🚀 Opening https://localhost:${CONFIG.port}`);
    openBrowser(`https://localhost:${CONFIG.port}`, true);
    break;
    
  case 'open-neurograph':
    console.log('🧭 Opening NeuroGraph...');
    ensureInstalled();
    console.log(`🚀 Opening https://localhost:${CONFIG.port}/neuro-graph`);
    openBrowser(`https://localhost:${CONFIG.port}/neuro-graph`);
    break;
    
  case 'package-configs':
    packageConfigs();
    break;
    
  case 'update-configs':
    updateConfigs();
    break;
    
  default:
    console.log('Usage: node jarvis-ui.js <command>');
    console.log('Commands:');
    console.log('  open jarvis ui     — Open Jarvis UI (user profile for mic)');
    console.log('  open neurograph    — Open NeuroGraph (default browser)');
    console.log('  package configs    — Package OpenClaw configs (Paul: zip + commit + push)');
    console.log('  update configs     — Update OpenClaw configs (Eric: extract + restart)');
    process.exit(1);
}
