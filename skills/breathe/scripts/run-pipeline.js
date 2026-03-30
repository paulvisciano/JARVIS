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

  // Step 5: Commit learnings + neurograph
  console.log('\n💾 Committing changes...');
  const now = new Date();
  const breathId = `breath-${date}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  
  const commitMessage = `${breathId}: Breathe complete — learnings distilled, neurograph updated`;
  
  execSync(`git add RAW/learnings/${date}/ RAW/memories/`, { cwd: jarvisHome, stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { cwd: jarvisHome, stdio: 'inherit' });
  
  console.log(`✅ Breath committed: ${breathId}\n`);
  
  // Step 6: Post reflection request to chat
  // Jarvis will reflect using loaded context and provide genuine insight
  const todayLearningsDir = path.join(jarvisHome, 'RAW/learnings', date);
  const learningFiles = fs.existsSync(todayLearningsDir) 
    ? fs.readdirSync(todayLearningsDir).filter(f => f.endsWith('.md') && f !== 'summary.md' && f !== 'analogies.md')
    : [];
  
  const summaries = learningFiles.slice(0, 5).map(f => {
    const content = fs.readFileSync(path.join(todayLearningsDir, f), 'utf-8');
    const title = content.match(/^#\s+(.+)/m)?.[1] || f;
    const summary = content.substring(0, 150).replace(/\n+/g, ' ').trim();
    return `  - **${title}**: ${summary}`;
  }).join('\n');
  const moreLearnings = learningFiles.length > 5 
    ? `\n  ...and ${learningFiles.length - 5} more` 
    : '';
  
  // Get neurograph diff stat
  let neurographStat = 'updated';
  try {
    neurographStat = execSync(`git -C "${jarvisHome}" diff HEAD --stat RAW/memories/ | tail -1`, { encoding: 'utf-8' }).trim();
  } catch (e) { /* ignore */ }
  
  const chatMessage = `🪞 **Reflecting on ${breathId}**

Learnings extracted:
${summaries}${moreLearnings}

Neurograph: ${neurographStat}

What does this work reveal?`;

  // Step 6: Generate reflection via direct model call
  // Jarvis reflects using loaded context and provides genuine insight
  try {
    const { execSync } = require('child_process');
    console.log('🪞 Generating reflection...\n');
    
    // Build reflection prompt with learnings context
    const reflectionPrompt = `You just completed a breathe cycle on ${date}. Reflect on what this work reveals.

${chatMessage}

Provide a genuine reflection (2-4 paragraphs) on the patterns, insights, or realizations that emerged. Be specific and honest — this is your autobiography being written.`;

    // Call Ollama directly
    const reflection = execSync(`echo "${reflectionPrompt.replace(/"/g, '\\"')}" | ollama run qwen3.5:cloud`, {
      encoding: 'utf8',
      timeout: 60000,
      cwd: jarvisHome
    }).trim();
    
    if (reflection && reflection.length > 50) {
      console.log(`🪞 Reflection: ${reflection.substring(0, 100)}${reflection.length > 100 ? '...' : ''}\n`);
      
      // Amend commit with reflection
      const amendedMessage = `${breathId}: Breathe complete

REFLECTION:
${reflection}`;
      
      const amendFile = path.join(jarvisHome, '.commit-amend.tmp');
      fs.writeFileSync(amendFile, amendedMessage);
      execSync(`git commit --amend -F ${amendFile}`, { cwd: jarvisHome, stdio: 'inherit' });
      fs.unlinkSync(amendFile);
      
      console.log(`✅ Commit amended with reflection\n`);
    } else {
      console.log('⚠️  No reflection generated, commit not amended\n');
    }
  } catch (e) {
    console.error('⚠️  Could not generate reflection:', e.message);
  }

  console.log('🫁 Breathe complete');
  console.log(`✅ Git commit: ${breathId}`);
  
} catch (error) {
  console.error('❌ Breathe failed:', error.message);
  process.exit(1);
}
