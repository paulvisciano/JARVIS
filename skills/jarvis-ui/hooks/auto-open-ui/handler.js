#!/usr/bin/env node
/**
 * Auto-Open Jarvis UI Hook
 * 
 * Listens for inbound messages and opens the Jarvis UI when:
 * - autoOpen: true is set in ~/.jarvis-config.json
 * - Message is conversational (not a command or system event)
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const HOME = homedir();
const JARVIS_HOME = join(HOME, 'JARVIS');
const CONFIG_PATH = join(HOME, '.jarvis-config.json');
const UI_SCRIPT = join(JARVIS_HOME, 'skills', 'jarvis-ui', 'scripts', 'jarvis-ui.js');

/**
 * Load Jarvis config
 */
function loadConfig() {
  try {
    if (!existsSync(CONFIG_PATH)) return {};
    const content = readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

/**
 * Check if message is conversational (not a command or system event)
 */
function isConversational(message) {
  if (!message || typeof message !== 'string') return false;
  
  const trimmed = message.trim();
  
  // Skip commands
  if (trimmed.startsWith('/') || trimmed.startsWith('!')) return false;
  
  // Skip system/metadata messages
  const lower = trimmed.toLowerCase();
  if (lower.includes('sender (untrusted metadata)')) return false;
  if (lower.includes('heartbeat')) return false;
  if (lower.startsWith('[') && lower.includes('GMT')) return false;
  
  return true;
}

/**
 * Open Jarvis UI
 */
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

/**
 * Hook handler for inbound messages
 */
const handleMessage = async (event) => {
  // Only handle inbound messages
  if (event.type !== 'message:inbound') return;
  
  const config = loadConfig();
  
  // Skip if autoOpen not enabled
  if (!config.autoOpen) return;
  
  // Extract message text
  const messageText = event.message?.content || event.message?.text || '';
  
  // Skip if not conversational
  if (!isConversational(messageText)) return;
  
  // Open UI
  openUI();
};

export default handleMessage;
