#!/usr/bin/env node
/**
 * JARVIS Archive All
 * Runs all archive scripts in parallel (no dependencies between them):
 * - Desktop → archive (move only)
 * - Inbox → archive (move only)
 * - Live folder → archive (move only)
 * - OpenClaw sessions → archive (move only)
 */

const { execSync } = require('child_process');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const SCRIPTS_DIR = path.join(HOME, 'JARVIS', 'skills', 'archive-collector', 'scripts');

console.log('🗄️  JARVIS Archive All — Starting full archive pipeline (parallel)\n');

const scripts = [
  { name: 'archive-desktop.js', label: 'Desktop' },
  { name: 'archive-inbox.js', label: 'Inbox' },
  { name: 'archive-live.js', label: 'Live folder' },
  { name: 'archive-sessions.js', label: 'OpenClaw sessions' }
];

console.log(`Running ${scripts.length} scripts in parallel...\n`);

// Run all scripts in parallel using Promise
const promises = scripts.map(script => {
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
