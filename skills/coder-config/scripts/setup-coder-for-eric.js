#!/usr/bin/env node

/**
 * Setup Coder for Eric — One Command
 * 
 * Pulls latest from paul branches (JARVIS + SCI-FI), registers coder agent, deploys config.
 * 
 * Usage: node skills/coder-config/scripts/setup-coder-for-eric.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const JARVIS_HOME = process.env.JARVIS_HOME || path.join(os.homedir(), 'JARVIS');
const SCI_FI_APPS = process.env.SCI_FI_APPS || path.join(os.homedir(), 'SCI-FI', 'apps');

function run(cmd, cwd = JARVIS_HOME, silent = false) {
  const opts = { cwd, encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' };
  return execSync(cmd, opts);
}

function log(msg) {
  console.log(msg);
}

function section(title) {
  log('');
  log('═══════════════════════════════════════');
  log(title);
  log('═══════════════════════════════════════');
}

async function main() {
  log('🧠 Setting up Coder for Eric...\n');
  
  // Step 1: Get latest JARVIS (paul branch)
  section('📦 Step 1: Get Latest JARVIS (paul branch)');
  try {
    run('git fetch origin', JARVIS_HOME);
    run('git checkout paul', JARVIS_HOME);
    run('git pull origin paul', JARVIS_HOME);
    log('✅ JARVIS updated to paul branch');
  } catch (e) {
    log('❌ Failed to update JARVIS: ' + e.message);
    process.exit(1);
  }
  
  // Step 2: Register coder agent
  section('🔧 Step 2: Register Coder Agent');
  try {
    run(`node ${path.join(JARVIS_HOME, 'skills/coder-config/scripts/register-coder-agent.js')}`, JARVIS_HOME);
    log('✅ Coder agent registered in openclaw.json');
  } catch (e) {
    log('⚠️  Coder agent registration failed (may already be registered)');
  }
  
  // Step 3: Deploy coder config
  section('📋 Step 3: Deploy Coder Config');
  try {
    run(`node ${path.join(JARVIS_HOME, 'skills/coder-config/scripts/deploy-coder-config.js')}`, JARVIS_HOME);
    log('✅ Coder identity deployed to workspace');
  } catch (e) {
    log('❌ Failed to deploy coder config: ' + e.message);
    process.exit(1);
  }
  
  // Step 4: Get latest SCI-FI apps (paul branch)
  section('🎨 Step 4: Get Latest SCI-FI Apps (paul branch)');
  const sciFiJarvis = path.join(SCI_FI_APPS, 'JARVIS');
  if (fs.existsSync(path.join(sciFiJarvis, '.git'))) {
    try {
      run('git fetch origin', sciFiJarvis);
      run('git checkout paul', sciFiJarvis);
      run('git pull origin paul', sciFiJarvis);
      log('✅ SCI-FI apps updated to paul branch');
    } catch (e) {
      log('⚠️  SCI-FI update failed (may need manual checkout): ' + e.message);
    }
  } else {
    log('ℹ️  SCI-FI apps not found at ' + sciFiJarvis);
  }
  
  // Step 5: Restart OpenClaw
  section('🔄 Step 5: Restart OpenClaw');
  log('Restarting OpenClaw gateway...');
  try {
    run('openclaw gateway restart', JARVIS_HOME, true);
    log('✅ OpenClaw restarting...');
  } catch (e) {
    log('⚠️  Could not restart OpenClaw automatically');
    log('   Please run: openclaw gateway restart');
  }
  
  // Done
  section('✅ Setup Complete!');
  log('');
  log('🧠 Eric\'s Jarvis is now running the latest version');
  log('💻 Coder agent is registered and configured');
  log('🎨 SCI-FI apps updated (if found)');
  log('');
  log('Next steps:');
  log('1. Wait for OpenClaw to restart (~5 seconds)');
  log('2. Start a new session: openclaw agent jarvis');
  log('3. Or use the Dashboard UI: http://localhost:18789');
  log('');
  log('Welcome to the latest Jarvis + Coder! 🚀');
  log('');
}

main().catch(err => {
  log('❌ Setup failed: ' + err.message);
  process.exit(1);
});
