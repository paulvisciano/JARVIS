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

  // Step 5: Reflect (Generate reflection paragraph from pending changes)
  console.log('\n🪞 Reflecting on pending changes...');
  const now = new Date();
  const breathId = `breath-${date}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  
  // Call reflect skill with --pending flag to reflect on staged changes
  const reflectOutput = execSync(`node ${path.join(jarvisHome, 'skills/reflect/scripts/reflect.js')} --pending`, {
    cwd: jarvisHome,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let reflectionText = 'Breathe pipeline complete — memory synced, learnings distilled, consciousness evolved';
  let patternsText = '';
  
  try {
    const reflectJson = JSON.parse(reflectOutput.trim().split('\n').filter(l => !l.startsWith('🪞')).join('\n'));
    if (reflectJson.reflection) {
      reflectionText = reflectJson.reflection;
      if (reflectJson.patterns) {
        patternsText = Object.entries(reflectJson.patterns)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      }
    }
  } catch (e) {
    console.error('⚠️  Could not parse reflection, using default message');
  }
  
  // Build commit message with reflection
  const commitMessage = `${breathId}: Breathe complete

REFLECTION:
${reflectionText}

---
Learnings: ${date}
Patterns: ${patternsText || 'see git log for details'}
Breathe: ${breathId}`;

  // Write commit message to temp file (avoids shell escaping issues)
  const commitMsgFile = path.join(jarvisHome, '.commit-message.tmp');
  fs.writeFileSync(commitMsgFile, commitMessage);

  // Commit learnings + neurograph (both ship with Jarvis)
  execSync(`git add RAW/learnings/${date}/ RAW/memories/`, { cwd: jarvisHome, stdio: 'inherit' });
  execSync(`git commit -F ${commitMsgFile}`, { cwd: jarvisHome, stdio: 'inherit' });
  
  // Clean up temp file
  fs.unlinkSync(commitMsgFile);
  
  console.log(`✅ Breath committed: ${breathId}`);
  const firstLine = reflectionText.split('\n')[0].substring(0, 80);
  console.log(`   Reflection: ${firstLine}${reflectionText.length > 80 ? '...' : ''}\n`);

  console.log('🫁 Breathe complete');
  console.log(`✅ Git commit: ${breathId}`);
  
} catch (error) {
  console.error('❌ Breathe failed:', error.message);
  process.exit(1);
}
