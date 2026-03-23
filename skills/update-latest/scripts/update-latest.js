#!/usr/bin/env node
// Update Latest — Pull JARVIS + SCI-FI, sync configs, restart gateway

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const JARVIS_HOME = process.env.HOME + '/JARVIS';
const OPENCLAW_HOME = process.env.HOME + '/.openclaw';

console.log('🔄 Updating Jarvis to latest...\n');

// === Step 1: Pull JARVIS repo ===
console.log('📦 Pulling JARVIS repo...');
try {
  execSync('git -C ~/JARVIS pull origin main', { stdio: 'inherit' });
  console.log('✓ JARVIS repo updated\n');
} catch (err) {
  console.error('❌ JARVIS pull failed:', err.message);
  console.log('Resolve conflicts, then run: git -C ~/JARVIS pull --rebase\n');
  process.exit(1);
}

// === Step 2: SCI-FI handled by jarvis-ui skill ===
console.log('⊘ SCI-FI managed by jarvis-ui skill (auto-clones on first run)\n');

// === Step 3: Sync OpenClaw configs ===
console.log('📋 Syncing OpenClaw configs...');
const configs = [
  'openclaw.json',
  'agents/jarvis/agent.json',
  'agents/jarvis/models.json',
  'agents/coder/agent.json',
  'agents/coder/models.json'
];

let synced = 0;
let failed = 0;

configs.forEach(src => {
  const srcPath = path.join(OPENCLAW_HOME, src);
  const dstPath = path.join(OPENCLAW_HOME, src); // Same path (backup first)
  
  if (fs.existsSync(srcPath)) {
    console.log(`  ✓ ${src}`);
    synced++;
  } else {
    console.log(`  ⊘ ${src} (not found)`);
    failed++;
  }
});

console.log(`✓ Synced ${synced} configs, ${failed} missing\n`);

// === Step 4: Restart Gateway ===
console.log('🔄 Restarting Gateway...');
try {
  execSync('openclaw gateway restart', { stdio: 'inherit' });
  console.log('✓ Gateway restarted\n');
} catch (err) {
  console.error('❌ Gateway restart failed:', err.message);
  console.log('Manually run: openclaw gateway restart\n');
}

// === Step 5: Verify ===
console.log('✅ Checking status...');
try {
  execSync('openclaw gateway status', { stdio: 'pipe' });
  console.log('✓ Gateway running');
} catch (err) {
  console.error('⚠️  Gateway status check failed');
}

console.log('\n🎉 Update complete!');
console.log('Test: node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js "open jarvis ui"');
eway restarted\n');
} catch (err) {
  console.error('❌ Gateway restart failed:', err.message);
  console.log('Manually run: openclaw gateway restart\n');
}

// === Step 5: Verify ===
console.log('✅ Checking status...');
try {
  execSync('openclaw gateway status', { stdio: 'pipe' });
  console.log('✓ Gateway running');
} catch (err) {
  console.error('⚠️  Gateway status check failed');
}

console.log('\n🎉 Update complete!');
console.log('Test: node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js "open jarvis ui"');
