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

  // Post to current chat channel via message send
  try {
    execSync(`openclaw message send --message "${chatMessage.replace(/"/g, '\\"')}"`, {
      cwd: jarvisHome,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log(`💬 Posted reflection request to chat\n`);
    
    // Wait for Jarvis to reply (poll session transcript)
    console.log('⏳ Waiting for reflection...');
    let reflection = null;
    let attempts = 0;
    const maxAttempts = 60; // 30 seconds (500ms * 60)
    
    while (attempts < maxAttempts && !reflection) {
      try {
        // Get last messages from jarvis:main session
        const sessionsJson = execSync('openclaw sessions --agent jarvis --json --last 3', { encoding: 'utf-8' });
        const sessions = JSON.parse(sessionsJson);
        const mainSession = sessions.sessions.find(s => s.key === 'agent:jarvis:main');
        
        if (mainSession && mainSession.lastMessages && mainSession.lastMessages.length > 0) {
          // Find last assistant message (our reflection request was user, so next assistant msg is the reply)
          for (let i = mainSession.lastMessages.length - 1; i >= 0; i--) {
            const msg = mainSession.lastMessages[i];
            if (msg.role === 'assistant' && msg.content && msg.content.length > 50) {
              reflection = msg.content.trim();
              break;
            }
          }
        }
      } catch (e) { /* ignore, keep polling */ }
      
      if (!reflection) {
        attempts++;
        require('child_process').execSync('sleep 0.5', { stdio: 'ignore' });
      }
    }
    
    if (reflection) {
      console.log(`🪞 Received reflection: ${reflection.substring(0, 80)}${reflection.length > 80 ? '...' : ''}\n`);
      
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
      console.log('⚠️  No reflection received (timeout), commit not amended\n');
    }
  } catch (e) {
    console.error('⚠️  Could not post to chat:', e.message);
  }

  console.log('🫁 Breathe complete');
  console.log(`✅ Git commit: ${breathId}`);
  
} catch (error) {
  console.error('❌ Breathe failed:', error.message);
  process.exit(1);
}
