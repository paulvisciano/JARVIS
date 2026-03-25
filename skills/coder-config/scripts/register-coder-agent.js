#!/usr/bin/env node

/**
 * Register jarvis-coder agent in OpenClaw config
 * 
 * Usage:
 *   node register-coder-agent.js              # Add coder agent to openclaw.json
 *   node register-coder-agent.js --verify     # Check if coder is registered
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OPENCLAW_CONFIG = path.join(process.env.HOME, '.openclaw', 'openclaw.json');
const CODER_AGENT_DIR = path.join(process.env.HOME, '.openclaw', 'agents', 'jarvis-coder');
const CODER_WORKSPACE = path.join(CODER_AGENT_DIR, 'workspace');

function log(msg, type = 'info') {
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🔧';
  console.log(`${prefix} ${msg}`);
}

function verifyCoder() {
  if (!fs.existsSync(OPENCLAW_CONFIG)) {
    log('openclaw.json not found', 'error');
    return false;
  }
  
  const config = JSON.parse(fs.readFileSync(OPENCLAW_CONFIG, 'utf8'));
  const coderAgent = config.agents?.list?.find(a => a.id === 'jarvis-coder');
  
  if (!coderAgent) {
    log('jarvis-coder agent not registered in openclaw.json', 'error');
    return false;
  }
  
  log('jarvis-coder agent is registered!', 'success');
  return true;
}

function registerAgent() {
  if (!fs.existsSync(OPENCLAW_CONFIG)) {
    log('openclaw.json not found. Run openclaw wizard first?', 'error');
    process.exit(1);
  }
  
  log('Reading openclaw.json...');
  const config = JSON.parse(fs.readFileSync(OPENCLAW_CONFIG, 'utf8'));
  
  // Check if already registered
  const existingIndex = config.agents?.list?.findIndex(a => a.id === 'jarvis-coder');
  if (existingIndex !== -1) {
    log('jarvis-coder already registered, skipping...', 'info');
    return;
  }
  
  // Build portable paths
  const homeDir = process.env.HOME;
  const coderConfig = {
    id: 'jarvis-coder',
    name: 'jarvis-coder',
    workspace: path.join(homeDir, '.openclaw', 'agents', 'jarvis-coder', 'workspace'),
    agentDir: path.join(homeDir, '.openclaw', 'agents', 'jarvis-coder'),
    model: 'ollama/qwen2.5-coder:7b',
    sandbox: {
      mode: 'off'
    }
  };
  
  if (!config.agents) config.agents = {};
  if (!config.agents.list) config.agents.list = [];
  
  config.agents.list.push(coderConfig);
  
  log('Writing updated openclaw.json...');
  fs.writeFileSync(OPENCLAW_CONFIG, JSON.stringify(config, null, 2));
  
  log('Agent registered in openclaw.json', 'success');
  
  // Ensure agent directory exists
  if (!fs.existsSync(CODER_AGENT_DIR)) {
    fs.mkdirSync(CODER_AGENT_DIR, { recursive: true });
    log('Created agent directory', 'info');
  }
  
  if (!fs.existsSync(CODER_WORKSPACE)) {
    fs.mkdirSync(CODER_WORKSPACE, { recursive: true });
    log('Created workspace directory', 'info');
  }
  
  log('Next steps:', 'info');
  log('1. Copy identity files to workspace:', 'info');
  log('   node skills/coder-config/scripts/deploy-coder-config.js', 'info');
  log('2. Restart OpenClaw to pick up new agent:', 'info');
  log('   openclaw gateway restart', 'info');
  log('3. Verify setup:', 'info');
  log('   node skills/coder-config/scripts/register-coder-agent.js --verify', 'info');
}

// Parse arguments
const args = process.argv.slice(2);
const verifyMode = args.includes('--verify');

if (verifyMode) {
  verifyCoder();
  process.exit(0);
}

registerAgent();
