#!/usr/bin/env node
// NeuroGraph Router — Opens neurograph route on existing Jarvis server

const { execSync } = require('child_process');

const CONFIG = {
  port: process.env.VOICE_PORT || 18787,
  route: '/neuro-graph'
};

// === Open neurograph in browser ===
function open(profile, memoryPath) {
  const url = `http://localhost:${CONFIG.port}${CONFIG.route}`;
  
  console.log(`🧭 Opening NeuroGraph at: ${url}`);
  console.log(`✓ Memory path: ${memoryPath}`);
  
  const browser = require('./browser.js');
  return browser.open(profile, url);
}

module.exports = {
  open
};
