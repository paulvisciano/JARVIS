#!/usr/bin/env node
// Sync Configs — Eric's machine: find Paul's package, extract, restart

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JARVIS_HOME = process.env.HOME + '/JARVIS';
const OPENCLAW_HOME = process.env.HOME + '/.openclaw';

console.log('🔄 Syncing OpenClaw configs...\n');

// === Step 1: Find latest package ===
const packagesDir = path.join(JARVIS_HOME, 'packages');
if (!fs.existsSync(packagesDir)) {
  console.error('❌ No packages directory found');
  console.log('Paul needs to run "package configs" first\n');
  process.exit(1);
}

const files = fs.readdirSync(packagesDir).filter(f => f.endsWith('.zip')).sort().reverse();

if (files.length === 0) {
  console.error('❌ No config packages found');
  console.log('Paul needs to run "package configs" first\n');
  process.exit(1);
}

const latestZip = files[0];
const zipPath = path.join(packagesDir, latestZip);

console.log(`📦 Found: ${latestZip}`);
console.log(`   Size: ${fs.statSync(zipPath).size} bytes`);
console.log(`   Created: ${new Date(fs.statSync(zipPath).mtime).toLocaleString()}\n`);

// === Step 2: Extract ===
console.log('🗜️  Extracting...');
try {
  execSync(`unzip -o ${zipPath} -d ${OPENCLAW_HOME}`, { stdio: 'inherit' });
  console.log('✓ Extracted to ~/.openclaw/\n');
} catch (err) {
  console.error('❌ Extract failed:', err.message);
  process.exit(1);
}

// === Step 3: Restart Gateway ===
console.log('🔄 Restarting Gateway...');
try {
  execSync('openclaw gateway restart', { stdio: 'inherit' });
  console.log('✓ Gateway restarted\n');
} catch (err) {
  console.error('⚠️  Gateway restart failed:', err.message);
  console.log('Manually run: openclaw gateway restart\n');
}

// === Step 4: Report ===
console.log('✅ Configs synced!');
console.log(`   Applied: ${latestZip}`);
console.log('   You\'re running Paul\'s latest config\n');

console.log('💡 Next step: Run setup script to configure your paths');
console.log(`   node ~/JARVIS/skills/sync-configs/scripts/setup-paths.js\n`);
console.log('This creates your own Jarvis agent config with your home path.');
console.log('Then you can say "open jarvis ui" to start the UI.\n');
