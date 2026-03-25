#!/usr/bin/env node

/**
 * Deploy jarvis-coder configuration from skills/coder-config
 * 
 * Usage:
 *   node deploy-coder-config.js              # Deploy fresh config
 *   node deploy-coder-config.js --update     # Update existing, preserve customizations
 *   node deploy-coder-config.js --verify     # Check if coder is configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_SOURCE = path.join(__dirname, '..', 'templates');
const MEMORY_SOURCE = path.join(__dirname, '..', 'memory');
const CODER_WORKSPACE = path.join(process.env.HOME, '.openclaw', 'agents', 'jarvis-coder', 'workspace');

function log(msg, type = 'info') {
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} ${msg}`);
}

function copyFile(src, dest, updateMode = false) {
  if (updateMode && fs.existsSync(dest)) {
    log(`Skipping ${path.basename(dest)} (already exists, update mode)`, 'info');
    return;
  }
  fs.copyFileSync(src, dest);
  log(`Copied ${path.basename(dest)}`, 'success');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, 'info');
  }
}

function verifyCoder() {
  const requiredFiles = ['AGENTS.md', 'SOUL.md', 'USER.md'];
  const missing = requiredFiles.filter(f => !fs.existsSync(path.join(CODER_WORKSPACE, f)));
  
  if (missing.length > 0) {
    log(`Missing files: ${missing.join(', ')}`, 'error');
    return false;
  }
  
  log('jarvis-coder is properly configured!', 'success');
  return true;
}

function deploy(updateMode = false) {
  log(`Deploying coder config to ${CODER_WORKSPACE}...`);
  
  ensureDir(CODER_WORKSPACE);
  ensureDir(path.join(CODER_WORKSPACE, 'memory'));
  
  // Copy templates
  const templates = ['AGENTS.md', 'SOUL.md', 'USER.md'];
  templates.forEach(file => {
    const src = path.join(CONFIG_SOURCE, file);
    const dest = path.join(CODER_WORKSPACE, file);
    if (fs.existsSync(src)) {
      copyFile(src, dest, updateMode);
    }
  });
  
  // Copy memory files
  const memoryDir = path.join(CODER_WORKSPACE, 'memory');
  if (fs.existsSync(MEMORY_SOURCE)) {
    const memoryFiles = fs.readdirSync(MEMORY_SOURCE);
    memoryFiles.forEach(file => {
      const src = path.join(MEMORY_SOURCE, file);
      const dest = path.join(memoryDir, file);
      copyFile(src, dest, updateMode);
    });
  }
  
  // Initialize git if needed
  const gitDir = path.join(CODER_WORKSPACE, '.git');
  if (!fs.existsSync(gitDir)) {
    log('Initializing git repository...', 'info');
    execSync('git init', { cwd: CODER_WORKSPACE, stdio: 'ignore' });
    execSync('git add -A', { cwd: CODER_WORKSPACE, stdio: 'ignore' });
    execSync('git commit -m "Initialize coder workspace"', { cwd: CODER_WORKSPACE, stdio: 'ignore' });
    log('Git initialized', 'success');
  }
  
  // Commit changes
  if (!updateMode) {
    try {
      execSync('git add -A', { cwd: CODER_WORKSPACE, stdio: 'ignore' });
      execSync('git commit -m "Deploy coder config from skills/coder-config"', { cwd: CODER_WORKSPACE, stdio: 'ignore' });
      log('Changes committed', 'success');
    } catch (e) {
      log('No changes to commit', 'info');
    }
  }
  
  log('Deployment complete!', 'success');
}

// Parse arguments
const args = process.argv.slice(2);
const updateMode = args.includes('--update');
const verifyMode = args.includes('--verify');

if (verifyMode) {
  verifyCoder();
  process.exit(0);
}

deploy(updateMode);
