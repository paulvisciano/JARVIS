#!/usr/bin/env node
// Jarvis UI Skill — Simple orchestrator
// Parses command → calls openclaw tools

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INSTALL_PATH = path.join(process.env.HOME, 'JARVIS', 'skills', 'jarvis-ui', 'sci-fi');

const CONFIG = {
  uiRepo: 'https://github.com/paulvisciano/SCI-FI.git',
  installPath: INSTALL_PATH,
  uiPath: path.join(INSTALL_PATH, 'apps', 'JARVIS'),
  port: process.env.VOICE_PORT || 18787,
  memoryPaths: [
    path.join(process.env.HOME, 'JARVIS', 'RAW', 'memories'),
    path.join(process.env.HOME, 'RAW', 'memories')
  ]
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
    execSync(`git clone ${CONFIG.uiRepo} ${CONFIG.installPath}`, { stdio: 'inherit' });
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
  
  return 'unknown';
}

// === Open browser with right profile ===
function openBrowser(profile, url) {
  const args = ['browser', 'open', url];
  
  if (profile === 'user') {
    args.push('--browser-profile', 'user');
    console.log('✓ User profile (mic/camera access)');
  } else {
    console.log('✓ OpenClaw profile (automation)');
  }
  
  try {
    execSync(`openclaw ${args.join(' ')}`, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error('❌ Browser open failed:', err.message);
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
    openBrowser('user', `https://localhost:${CONFIG.port}`);
    break;
    
  case 'open-neurograph':
    console.log('🧭 Opening NeuroGraph...');
    ensureInstalled();
    console.log(`🚀 Opening https://localhost:${CONFIG.port}/neuro-graph`);
    openBrowser('openclaw', `https://localhost:${CONFIG.port}/neuro-graph`);
    break;
    
  default:
    console.log('Usage: node jarvis-ui.js <command>');
    console.log('Commands:');
    console.log('  open jarvis ui     — Open Jarvis UI (user browser for mic)');
    console.log('  open neurograph    — Open NeuroGraph (automation browser)');
    process.exit(1);
}
