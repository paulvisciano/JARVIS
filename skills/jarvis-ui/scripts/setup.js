#!/usr/bin/env node
// Setup — Clone SCI-FI repo on first run

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  uiRepo: 'https://github.com/paulvisciano/SCI-FI.git',
  installPath: path.join(process.env.HOME, 'JARVIS', 'skills', 'jarvis-ui', 'sci-fi'),
  uiPath: path.join(CONFIG.installPath, 'apps', 'JARVIS')
};

// === Check installed ===
function checkInstalled() {
  return fs.existsSync(CONFIG.uiPath);
}

// === Clone ===
function clone() {
  console.log('📦 Cloning SCI-FI...');
  
  if (!fs.existsSync(CONFIG.installPath)) {
    fs.mkdirSync(CONFIG.installPath, { recursive: true });
  }
  
  try {
    execSync(`git clone ${CONFIG.uiRepo} ${CONFIG.installPath}`, { stdio: 'inherit' });
    console.log('✓ SCI-FI cloned');
    return true;
  } catch (err) {
    console.error('❌ Clone failed:', err.message);
    return false;
  }
}

module.exports = {
  checkInstalled,
  clone
};
