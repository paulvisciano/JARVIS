#!/usr/bin/env node
// Jarvis Server Lifecycle — Start/stop/status

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

const CONFIG = {
  uiPath: process.env.JARVIS_UI_PATH || path.join(process.env.HOME, 'SCI-FI', 'apps', 'JARVIS'),
  serverScript: 'jarvis-server.js',
  port: process.env.VOICE_PORT || 18787,
  pidFile: path.join(process.env.HOME, '.jarvis-server.pid')
};

// === Check if server is running ===
function isRunning() {
  if (!fs.existsSync(CONFIG.pidFile)) return false;
  
  const pid = parseInt(fs.readFileSync(CONFIG.pidFile, 'utf8').trim());
  
  try {
    process.kill(pid, 0); // Check if process exists
    return true;
  } catch (err) {
    // Process doesn't exist, clean up pid file
    fs.unlinkSync(CONFIG.pidFile);
    return false;
  }
}

// === Start server ===
function start(port) {
  const portToUse = port || CONFIG.port;
  
  if (isRunning()) {
    console.log(`✓ Server already running on port ${CONFIG.port}`);
    return true;
  }
  
  console.log(`🚀 Starting Jarvis server on port ${portToUse}...`);
  
  const serverPath = path.join(CONFIG.uiPath, CONFIG.serverScript);
  
  if (!fs.existsSync(serverPath)) {
    console.error(`❌ Server script not found: ${serverPath}`);
    return false;
  }
  
  const env = {
    ...process.env,
    VOICE_PORT: portToUse.toString()
  };
  
  const proc = spawn('node', [serverPath], {
    cwd: CONFIG.uiPath,
    env,
    detached: true,
    stdio: 'ignore'
  });
  
  proc.unref();
  
  // Write PID file
  fs.writeFileSync(CONFIG.pidFile, proc.pid.toString());
  
  console.log(`✓ Server started (PID: ${proc.pid})`);
  console.log(`✓ PID file: ${CONFIG.pidFile}`);
  
  return true;
}

// === Stop server ===
function stop() {
  if (!isRunning()) {
    console.log('ℹ️  Server not running');
    return true;
  }
  
  const pid = parseInt(fs.readFileSync(CONFIG.pidFile, 'utf8').trim());
  
  console.log(`🛑 Stopping server (PID: ${pid})...`);
  
  try {
    process.kill(pid, 'SIGTERM');
    console.log('✓ Server stopped');
    
    // Clean up pid file
    if (fs.existsSync(CONFIG.pidFile)) {
      fs.unlinkSync(CONFIG.pidFile);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Stop failed:', err.message);
    return false;
  }
}

// === Get status ===
function status() {
  if (isRunning()) {
    const pid = parseInt(fs.readFileSync(CONFIG.pidFile, 'utf8').trim());
    console.log(`✓ Server running (PID: ${pid})`);
    console.log(`✓ Port: ${CONFIG.port}`);
    console.log(`✓ PID file: ${CONFIG.pidFile}`);
    return true;
  } else {
    console.log('ℹ️  Server not running');
    return false;
  }
}

module.exports = {
  isRunning,
  start,
  stop,
  status
};
