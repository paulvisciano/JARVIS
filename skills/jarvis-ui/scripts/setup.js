#!/usr/bin/env node
// Jarvis UI Setup — First-run: clone SCI-FI repo, install deps, configure

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  uiRepo: 'https://github.com/paulvisciano/SCI-FI.git', // Monorepo with JARVIS + neuro-graph + other apps
  installPath: path.join(process.env.HOME, 'JARVIS', 'skills', 'jarvis-ui', 'sci-fi'), // Clone inside skill folder (gitignored)
  uiPath: process.env.JARVIS_UI_PATH || path.join(CONFIG.installPath, 'apps', 'JARVIS'),
  neurographPath: process.env.NEUROGRAPH_PATH || path.join(CONFIG.installPath, 'apps', 'neuro-graph')
};

// === Check if UI is installed ===
function checkInstalled() {
  const indexPath = path.join(CONFIG.uiPath, 'index.html');
  const serverPath = path.join(CONFIG.uiPath, 'jarvis-server.js');
  const packagePath = path.join(CONFIG.uiPath, 'package.json');
  
  return fs.existsSync(indexPath) && fs.existsSync(serverPath) && fs.existsSync(packagePath);
}

// === Clone SCI-FI repo ===
function cloneRepo() {
  console.log('📦 Cloning SCI-FI repo...');
  
  if (!fs.existsSync(CONFIG.installPath)) {
    fs.mkdirSync(CONFIG.installPath, { recursive: true });
  }
  
  try {
    execSync(`git clone ${CONFIG.uiRepo} ${CONFIG.installPath}`, { stdio: 'inherit' });
    console.log('✓ SCI-FI repo cloned');
    return true;
  } catch (err) {
    console.error('❌ Clone failed:', err.message);
    return false;
  }
}

// === Install dependencies ===
function installDeps() {
  console.log('📦 Installing dependencies...');
  
  try {
    execSync('npm install', { cwd: CONFIG.uiPath, stdio: 'inherit' });
    console.log('✓ Dependencies installed');
    return true;
  } catch (err) {
    console.error('❌ npm install failed:', err.message);
    return false;
  }
}

// === Setup symlinks (neuro-graph) ===
function setupSymlinks() {
  console.log('🔗 Setting up neuro-graph symlink...');
  
  const linkPath = path.join(CONFIG.uiPath, 'neuro-graph');
  if (fs.existsSync(linkPath)) {
    console.log('✓ Symlink already exists');
    return true;
  }
  
  try {
    // Remove broken symlink if exists
    if (fs.lstatSync(linkPath).isSymbolicLink()) {
      fs.unlinkSync(linkPath);
    }
    fs.symlinkSync(CONFIG.neurographPath, linkPath, 'dir');
    console.log('✓ Symlink created');
    return true;
  } catch (err) {
    console.error('❌ Symlink failed:', err.message);
    return false;
  }
}

// === Full setup flow ===
function cloneAndInstall() {
  console.log('🧭 First-run setup starting...');
  
  if (checkInstalled()) {
    console.log('✓ UI already installed');
    return true;
  }
  
  const cloned = cloneRepo();
  if (!cloned) return false;
  
  const installed = installDeps();
  if (!installed) return false;
  
  const linked = setupSymlinks();
  if (!linked) return false;
  
  console.log('✅ Setup complete!');
  return true;
}

module.exports = {
  checkInstalled,
  cloneRepo,
  installDeps,
  setupSymlinks,
  cloneAndInstall
};
