#!/usr/bin/env node
// Jarvis UI Skill — Main Orchestrator
// Parses commands → routes to setup/server/browser/neurograph

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  uiPath: process.env.JARVIS_UI_PATH || path.join(process.env.HOME, 'SCI-FI', 'apps', 'JARVIS'),
  neurographPath: process.env.NEUROGRAPH_PATH || path.join(process.env.HOME, 'SCI-FI', 'apps', 'neuro-graph'),
  port: process.env.VOICE_PORT || 18787,
  memoryPaths: [
    path.join(process.env.HOME, 'JARVIS', 'RAW', 'memories'),
    path.join(process.env.HOME, 'RAW', 'memories')
  ]
};

// === Command Parsing ===
function parseCommand(input) {
  const cmd = input.toLowerCase().trim();
  
  if (cmd.includes('open') && cmd.includes('jarvis')) return 'open-ui';
  if (cmd.includes('open') && (cmd.includes('neurograph') || cmd.includes('neuro-graph') || cmd.includes('graph'))) return 'open-neurograph';
  if (cmd.includes('start') && cmd.includes('server')) return 'start-server';
  if (cmd.includes('stop') && cmd.includes('server')) return 'stop-server';
  if (cmd.includes('restart') && cmd.includes('server')) return 'restart-server';
  if (cmd.includes('fix') && (cmd.includes('orb') || cmd.includes('ui'))) return 'fix-ui';
  if (cmd.includes('preview') && cmd.includes('ui')) return 'preview-ui';
  
  return 'unknown';
}

// === Memory Scan ===
function findMemoryPath() {
  for (const base of CONFIG.memoryPaths) {
    const nodesPath = path.join(base, 'nodes.json');
    if (fs.existsSync(nodesPath)) {
      console.log(`✓ Found memory at: ${base}`);
      return base;
    }
  }
  
  // Fallback: ask user
  console.log('❌ Memory not found in default locations.');
  console.log('Please set JARVIS_MEMORY_PATH env var or provide path:');
  return null;
}

// === Router ===
function route(command) {
  const action = parseCommand(command);
  
  switch (action) {
    case 'open-ui':
      return handleOpenUI();
    case 'open-neurograph':
      return handleOpenNeurograph();
    case 'start-server':
      return handleStartServer();
    case 'stop-server':
      return handleStopServer();
    case 'restart-server':
      return handleRestartServer();
    case 'fix-ui':
      return handleFixUI();
    case 'preview-ui':
      return handlePreviewUI();
    default:
      console.log('Unknown command. Use: open jarvis ui, open neurograph, start server, stop server, fix the orb');
      return false;
  }
}

// === Handlers (delegates to sub-scripts) ===
function handleOpenUI() {
  console.log('🧭 Opening Jarvis UI...');
  const setup = require('./setup.js');
  const server = require('./server.js');
  const browser = require('./browser.js');
  
  // First-run setup
  if (!setup.checkInstalled()) {
    console.log('📦 First run — setting up UI...');
    setup.cloneAndInstall();
  }
  
  // Start server
  server.start(CONFIG.port);
  
  // Open browser (user profile for mic access)
  browser.open('user', `http://localhost:${CONFIG.port}`);
  
  return true;
}

function handleOpenNeurograph() {
  console.log('🧭 Opening NeuroGraph...');
  const neurograph = require('./neurograph.js');
  const browser = require('./browser.js');
  
  const memoryPath = findMemoryPath();
  if (!memoryPath) {
    console.log('Set JARVIS_MEMORY_PATH and try again.');
    return false;
  }
  
  neurograph.serve(memoryPath);
  browser.open('openclaw', 'http://localhost:18788'); // Controlled browser for automation
  
  return true;
}

function handleStartServer() {
  console.log('🧭 Starting Jarvis server...');
  const server = require('./server.js');
  return server.start(CONFIG.port);
}

function handleStopServer() {
  console.log('🧭 Stopping Jarvis server...');
  const server = require('./server.js');
  return server.stop();
}

function handleRestartServer() {
  console.log('🧭 Restarting Jarvis server...');
  const server = require('./server.js');
  server.stop();
  return server.start(CONFIG.port);
}

function handleFixUI() {
  console.log('🧭 Distributing UI to coder agent...');
  // This will be handled by OpenClaw subagent routing
  console.log('Use: openclaw agent --agent coder --message "Fix the Jarvis UI orb"');
  return true;
}

function handlePreviewUI() {
  console.log('🧭 Starting preview server in coder workspace...');
  // This will be handled by coder agent
  console.log('Coder workspace: ~/.openclaw/agents/coder/workspace/');
  return true;
}

// === Main ===
const args = process.argv.slice(2);
const command = args.join(' ') || process.argv[2];

if (!command) {
  console.log('Usage: node jarvis-ui.js <command>');
  console.log('Commands:');
  console.log('  open jarvis ui     — Open Jarvis UI (voice recording, orb)');
  console.log('  open neurograph    — Open NeuroGraph visualization');
  console.log('  start server       — Start Jarvis server');
  console.log('  stop server        — Stop Jarvis server');
  console.log('  restart server     — Restart Jarvis server');
  console.log('  fix the orb        — Distribute to coder agent');
  console.log('  preview ui         — Preview in coder workspace');
  process.exit(1);
}

const result = route(command);
process.exit(result ? 0 : 1);
