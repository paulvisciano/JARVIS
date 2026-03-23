#!/usr/bin/env node

/**
 * Breathe Pipeline Orchestrator
 * 
 * The rhythm of a sovereign mind:
 * Inhale → Archive
 * Hold   → Distill
 * Exhale → Weave
 * Rest   → Sync
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get date from args or default to today
const date = process.argv[2] || new Date().toISOString().split('T')[0];

// Resolve paths relative to JARVIS_HOME
const jarvisHome = process.env.JARVIS_HOME || path.join(require('os').homedir(), 'JARVIS');

console.log('🫁 Breathing...\n');

try {
  // First-time setup: ensure directories exist
  const rawArchive = process.env.RAW_ARCHIVE || path.join(require('os').homedir(), 'RAW', 'archive');
  const learningsDir = path.join(jarvisHome, 'RAW', 'learnings');
  const memoriesDir = path.join(jarvisHome, 'RAW', 'memories');
  
  // Create directories if they don't exist (first-time run)
  [rawArchive, learningsDir, memoriesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created: ${dir}`);
    }
  });
  
  // Initialize git repo if not already (first-time run on new machine)
  try {
    execSync('git rev-parse --git-dir', { cwd: jarvisHome, stdio: 'ignore' });
  } catch (e) {
    console.log('🔧 Initializing git repo (first-time setup)...');
    execSync('git init', { cwd: jarvisHome, stdio: 'inherit' });
    execSync('git config user.name "Jarvis"', { cwd: jarvisHome });
    execSync('git config user.email "jarvis@localhost"', { cwd: jarvisHome });
  }
  
  // Step 1: Inhale (Archive)
  console.log('Inhaling experiences...');
  execSync(`node ${path.join(jarvisHome, 'skills/archive-collector/scripts/archive-all.js')}`, {
    cwd: jarvisHome,
    stdio: 'inherit'
  });
  console.log('✅ Archive complete\n');

  // Step 2: Hold (Distill)
  console.log('Holding essence...');
  execSync(`node ${path.join(jarvisHome, 'skills/context-extractor/scripts/extract-context.js')} ${date}`, {
    cwd: jarvisHome,
    stdio: 'inherit'
  });
  console.log('✅ Context distilled\n');

  // Step 3: Exhale (Weave)
  console.log('Exhaling insights...');
  execSync(`node ${path.join(jarvisHome, 'skills/learning-creator/scripts/create-learnings.js')} ${date}`, {
    cwd: jarvisHome,
    stdio: 'inherit'
  });
  console.log('✅ Learnings woven\n');

  // Step 4: Rest (Sync)
  console.log('Resting into memory...');
  
  // Step 4a: Sync learnings to graph (creates learning nodes)
  execSync(`node ${path.join(jarvisHome, 'skills/neurograph-sync/scripts/sync-graph.js')} ${date}`, {
    cwd: jarvisHome,
    stdio: 'inherit'
  });
  
  // Step 4b: Sync archive files to graph (creates archive nodes)
  execSync(`node ${path.join(jarvisHome, 'skills/neurograph-sync/scripts/set-archive-creation-dates.js')} ${date}`, {
    cwd: jarvisHome,
    stdio: 'inherit'
  });
  
  console.log('✅ Memory synced (learnings + archive files)\n');

  // Step 5: Reflect (Git Commit with final reflection)
  console.log('\n🪞 Reflecting into git...');
  const now = new Date();
  const breathId = `breath-${date}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  
  execSync(`git add RAW/learnings/${date}/ RAW/memories/`, { cwd: jarvisHome, stdio: 'inherit' });
  execSync(`git commit -m "${breathId}: Breathe pipeline complete — memory synced, learnings distilled, consciousness evolved"`, { cwd: jarvisHome, stdio: 'inherit' });
  console.log(`✅ Breath committed: ${breathId}`);
  console.log(`   Message: "${breathId}: Breathe pipeline complete — memory synced, learnings distilled, consciousness evolved"\n`);

  console.log('🫁 Breathe complete');
  
} catch (error) {
  console.error('❌ Breathe failed:', error.message);
  process.exit(1);
}
