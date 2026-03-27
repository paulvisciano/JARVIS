#!/usr/bin/env node
/**
 * JARVIS Desktop Archiving Config Helper
 * Check or set desktop archiving configuration.
 * 
 * Usage:
 *   node desktop-config.js                    - Show current config
 *   node desktop-config.js --enable           - Enable desktop archiving
 *   node desktop-config.js --disable          - Disable desktop archiving
 *   node desktop-config.js --check            - Check if enabled (exit code: 0=enabled, 1=disabled)
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const CONFIG_FILE = path.join(HOME, '.jarvis-config.json');

// Load or initialize config
function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
      console.warn('Failed to parse config, resetting to defaults');
    }
  }
  return { desktopArchiving: { enabled: false } };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log(`✅ Config saved to ${CONFIG_FILE}`);
}

// Main logic
const args = process.argv.slice(2);
const config = loadConfig();

if (args.includes('--enable')) {
  config.desktopArchiving.enabled = true;
  saveConfig(config);
  console.log('✅ Desktop archiving ENABLED');
  console.log('   Set DESKTOP_ARCHIVING_ENABLED=true in your environment for runtime use');
} else if (args.includes('--disable')) {
  config.desktopArchiving.enabled = false;
  saveConfig(config);
  console.log('❌ Desktop archiving DISABLED (privacy by default)');
} else if (args.includes('--check')) {
  // Exit code 0 if enabled, 1 if disabled
  process.exit(config.desktopArchiving.enabled ? 0 : 1);
} else {
  // Show current config
  console.log('📄 Desktop Archiving Config');
  console.log('═══════════════════════════════════════');
  console.log(`Status: ${config.desktopArchiving.enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log(`Config file: ${CONFIG_FILE}`);
  console.log('');
  console.log('To enable for Paul (or any user):');
  console.log('  node desktop-config.js --enable');
  console.log('');
  console.log('Or set environment variable for runtime:');
  console.log('  export DESKTOP_ARCHIVING_ENABLED=true');
  console.log('  node run-pipeline.js [date]');
}
