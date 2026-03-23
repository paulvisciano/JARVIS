#!/usr/bin/env node
// Browser Profile Router — User vs OpenClaw based on command

const { execSync } = require('child_process');

// === Profile selection ===
function selectProfile(command) {
  // Commands requiring user interaction (mic, camera, clicks)
  const userCommands = ['open-ui', 'open jarvis', 'voice', 'record'];
  
  // Commands for automation (canvas, nav, no interaction needed)
  const autoCommands = ['open-neurograph', 'open neurograph', 'graph', 'navigate'];
  
  const cmd = command.toLowerCase();
  
  if (userCommands.some(c => cmd.includes(c))) {
    return 'user'; // Requires user browser for mic/camera access
  }
  
  if (autoCommands.some(c => cmd.includes(c))) {
    return 'openclaw'; // Controlled browser for automation
  }
  
  return 'openclaw'; // Default
}

// === Open browser ===
function open(profile, url) {
  console.log(`🧭 Opening browser (profile: ${profile})...`);
  
  const browserArgs = [
    'browser',
    'open',
    '--url', url
  ];
  
  if (profile === 'user') {
    browserArgs.push('--profile', 'user');
    console.log('✓ User profile selected (mic/camera access enabled)');
  } else {
    console.log('✓ OpenClaw profile selected (automation mode)');
  }
  
  try {
    execSync(`openclaw ${browserArgs.join(' ')}`, { stdio: 'inherit' });
    console.log('✓ Browser opened');
    return true;
  } catch (err) {
    console.error('❌ Browser open failed:', err.message);
    return false;
  }
}

// === Navigate existing tab ===
function navigate(tabId, url) {
  console.log(`🧭 Navigating tab ${tabId} to ${url}...`);
  
  try {
    execSync(`openclaw browser navigate --targetId ${tabId} --url ${url}`, { stdio: 'inherit' });
    console.log('✓ Navigation complete');
    return true;
  } catch (err) {
    console.error('❌ Navigate failed:', err.message);
    return false;
  }
}

module.exports = {
  selectProfile,
  open,
  navigate
};
