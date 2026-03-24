#!/usr/bin/env node
// Web Learn — Subagent Wrapper
// Spawns web-learn in isolated subagent, reports progress to main session

const { execSync } = require('child_process');
const path = require('path');

const URL = process.argv[2];
if (!URL) {
  console.error('Usage: node web-learn-subagent.js <url>');
  console.error('Example: node web-learn-subagent.js https://git-scm.com/');
  process.exit(1);
}

const HOME = process.env.HOME || require('os').homedir();

console.log(`🌐 Web Learn — Spawning subagent...\n`);
console.log(`   URL: ${URL}`);
console.log(`   Mode: Isolated subagent (non-blocking)\n`);

// Spawn subagent via OpenClaw sessions_spawn
// The subagent will:
// 1. Screenshot the URL (browser tool)
// 2. OCR the screenshot
// 3. Create learnings
// 4. Link neurograph
// 5. Report completion to parent

const task = `Learn from ${URL} using web-learn skill:
1. Screenshot the page (browser tool)
2. OCR the screenshot (tesseract)
3. Create learnings (model synthesis)
4. Link neurograph (nodes + synapses)
5. Save source metadata (JSON)
6. Report completion to parent session

Run: node ${HOME}/JARVIS/skills/web-learn/scripts/web-learn.js ${URL}`;

try {
  // Spawn subagent
  const spawnOutput = execSync(`openclaw sessions_spawn --runtime subagent --task "${task}" --label web-learn-${URL.split('/')[2]}`, { encoding: 'utf8' });
  
  console.log('✓ Subagent spawned\n');
  console.log('The subagent will:');
  console.log('  1. Screenshot the page');
  console.log('  2. OCR the screenshot');
  console.log('  3. Create learnings');
  console.log('  4. Link neurograph');
  console.log('  5. Report completion\n');
  
  console.log('Progress will appear in chat as the subagent works.');
  console.log('Completion is push-based — it will auto-announce when done.\n');
  
  console.log('Subagent output:');
  console.log(spawnOutput);
  
} catch (err) {
  console.error('❌ Subagent spawn failed:', err.message);
  process.exit(1);
}
