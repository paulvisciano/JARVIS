#!/usr/bin/env node
/**
 * Auto-Open Jarvis UI
 * 
 * Called on incoming messages. Checks config and opens UI if:
 * - autoOpen: true is set in .jarvis-config.json
 * - Message is conversational (not a slash command)
 * 
 * Usage: node auto-open-ui.js [message-text]
 * Exit codes: 0 = opened, 1 = skipped (autoOpen false or command)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const CONFIG_PATH = path.join(JARVIS_HOME, '.jarvis-config.json');
const UI_SCRIPT = path.join(JARVIS_HOME, 'skills', 'jarvis-ui', 'scripts', 'jarvis-ui.js');

// Load config
function loadConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return config;
  } catch (err) {
    return {};
  }
}

// Check if message is a command (starts with /)
function isCommand(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.startsWith('/') || trimmed.startsWith('!');
}

// Check if message is conversational
function isConversational(text) {
  if (!text) return false;
  if (isCommand(text)) return false;
  
  // Skip system messages, heartbeats, metadata
  const lower = text.toLowerCase();
  if (lower.includes('sender (untrusted metadata)')) return false;
  if (lower.includes('heartbeat')) return false;
  if (lower.startsWith('[') && lower.includes('GMT')) return false;
  
  return true;
}

// Open UI
function openUI() {
  try {
    execSync(`node "${UI_SCRIPT}" "open jarvis ui"`, {
      stdio: 'ignore',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return true;
  } catch (err) {
    // Silently fail - UI might already be open or server not running
    return false;
  }
}

// Main
const message = process.argv.slice(2).join(' ');
const config = loadConfig();

if (!config.autoOpen) {
  process.exit(1); // Skip - autoOpen not enabled
}

if (!isConversational(message)) {
  process.exit(1); // Skip - not a conversational message
}

// Open UI
const opened = openUI();
process.exit(opened ? 0 : 1);
