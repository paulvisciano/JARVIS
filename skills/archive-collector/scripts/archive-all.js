#!/usr/bin/env node
/**
 * JARVIS Archive All
 * Runs all archive scripts in parallel (no dependencies between them):
 * - Desktop → archive (move only, optional via .jarvis-config.json or DESKTOP_ARCHIVING_ENABLED)
 * - Inbox → archive (move only)
 * - Live folder → archive (move only)
 * - OpenClaw sessions → archive (move only)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const HOME = process.env.HOME || require('os').homedir();
const SCRIPTS_DIR = path.join(HOME, 'JARVIS', 'skills', 'archive-collector', 'scripts');

// Check if desktop archiving is enabled
// Priority: env var > config file > default (disabled)
let desktopEnabled = false;
try {
  const jarvisHome = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
  const CONFIG_FILE = path.join(jarvisHome, '.jarvis-config.json');
  if (fs.existsSync(CONFIG_FILE)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    desktopEnabled = config.desktopArchiving?.enabled === true;
  }
} catch (e) {
  // Config file doesn't exist or is invalid - use default (disabled)
}

// Environment variable takes precedence
if (process.env.DESKTOP_ARCHIVING_ENABLED === 'true' || process.env.DESKTOP_ARCHIVING_ENABLED === '1') {
  desktopEnabled = true;
}

console.log(`Desktop archiving: ${desktopEnabled ? 'ENABLED' : 'DISABLED (default)'}`);

const scripts = [
  { name: 'archive-desktop.js', label: 'Desktop', enabled: desktopEnabled },
  { name: 'archive-inbox.js', label: 'Inbox', enabled: true },
  { name: 'archive-live.js', label: 'Live folder', enabled: true },
  { name: 'archive-sessions.js', label: 'OpenClaw sessions', enabled: true }
];

console.log(`Running ${scripts.filter(s => s.enabled).length} active scripts in parallel...\n`);

// Run all enabled scripts in parallel using Promise
const promises = scripts.filter(s => s.enabled).map(script => {
  const scriptPath = path.join(SCRIPTS_DIR, script.name);
  return new Promise((resolve, reject) => {
    try {
      execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
      resolve({ name: script.name, label: script.label, success: true });
    } catch (e) {
      reject({ name: script.name, label: script.label, error: e.message });
    }
  });
});

Promise.allSettled(promises).then(results => {
  console.log('\n═══════════════════════════════════════');
  console.log('🏁 Archive All Complete');
  console.log('═══════════════════════════════════════');
  
  const errors = results.filter(r => r.status === 'rejected');
  
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} script(s) failed:`);
    errors.forEach(e => console.log(`   - ${e.reason.label}: ${e.reason.error}`));
    process.exit(1);
  } else {
    console.log('✅ All archives processed successfully');
  }
});
