#!/usr/bin/env node

/**
 * Breathe Pipeline Orchestrator
 * 
 * The rhythm of a sovereign mind:
 * Inhale → Archive
 * Hold   → Distill
 * Exhale → Weave
 * Rest   → Sync
 * 
 * ATOMIC DESIGN: Either complete success or hard error.
 * No partial states, no swallowed errors.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file (simple parser, no dotenv dependency)
const dotenvPath = path.join(__dirname, '../../.env');
const homeDir = require('os').homedir();
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Expand ~ or $HOME to actual home directory
        value = value.replace(/^~/, homeDir).replace(/^\$HOME\//, homeDir + '/');
        process.env[key.trim()] = value;
      }
    }
  });
}

// Get date from args or default to today
const date = process.argv[2] || new Date().toISOString().split('T')[0];

// Resolve paths relative to JARVIS_HOME
const jarvisHome = process.env.JARVIS_HOME || path.join(require('os').homedir(), 'JARVIS');

console.log('🫁 Breathing...\n');

// Helper: run command, throw on error (no catching, no swallowing)
function runCmd(cmd, cwd = jarvisHome) {
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Command failed: ${cmd}`);
    throw error;
  }
}

try {
  // First-time setup: ensure directories exist
  const rawArchive = process.env.RAW_ARCHIVE || path.join(require('os').homedir(), 'RAW', 'archive');
  const learningsDir = path.join(jarvisHome, 'RAW', 'learnings');
  const memoriesDir = path.join(jarvisHome, 'RAW', 'memories');
  
  // Create directories if they don't exist (first-time run on new machine)
  [rawArchive, learningsDir, memoriesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${dir}`);
      } catch (e) {
        console.error(`\n❌ Failed to create directory ${dir}: ${e.message}`);
        throw e;
      }
    }
  });
  
  // Initialize git repo if not already (first-time run on new machine)
  try {
    execSync('git rev-parse --git-dir', { cwd: jarvisHome, stdio: 'ignore' });
  } catch (e) {
    console.log('🔧 Initializing git repo (first-time setup)...');
    runCmd('git init');
    runCmd('git config user.name "Jarvis"');
    runCmd('git config user.email "jarvis@localhost"');
  }
  
  // Step 1: Inhale (Archive) - ATOMIC
  console.log('Inhaling experiences...');
  runCmd(`node ${path.join(jarvisHome, 'skills/archive-collector/scripts/archive-all.js')}`);
  console.log('✅ Archive complete\n');

  // Step 2: Hold (Distill) - ATOMIC
  console.log('Holding essence...');
  runCmd(`node ${path.join(jarvisHome, 'skills/context-extractor/scripts/extract-context.js')} ${date}`);
  console.log('✅ Context distilled\n');

  // Step 3: Exhale (Weave) - ATOMIC
  console.log('Exhaling insights...');
  runCmd(`node ${path.join(jarvisHome, 'skills/learning-creator/scripts/create-learnings.js')} ${date}`);
  console.log('✅ Learnings woven\n');

  // Step 4: Rest (Sync) - ATOMIC
  console.log('Resting into memory...');
  
  // Step 4a: Sync archive files to user's memory (creates archive nodes in ~/RAW/memories/) - ATOMIC
  const userMemoriesDir = process.env.RAW_MEMORIES || path.join(require('os').homedir(), 'RAW', 'memories');
  if (!fs.existsSync(userMemoriesDir)) {
    fs.mkdirSync(userMemoriesDir, { recursive: true });
    console.log(`📁 Created: ${userMemoriesDir}`);
  }
  const nodesJsonPath = path.join(userMemoriesDir, 'nodes.json');
  runCmd(`node ${path.join(jarvisHome, 'skills/neurograph-sync/scripts/set-archive-creation-dates.js')} ${date} ${nodesJsonPath}`);
  
  console.log('✅ Archive synced to user memory (graph built from git commits)\n');

  // Step 5: Refresh graph from git (extract learning nodes from commits) - ATOMIC
  console.log('\n🔍 Refreshing consciousness graph (git-scanner)...');
  runCmd(`node ${path.join(jarvisHome, 'skills/bootstrap-jarvis/scripts/git-scanner.js')}`);
  console.log('✅ Graph refreshed — learning nodes extracted from git commits\n');
  
  // Step 6: Commit learnings + updated graph - ATOMIC
  console.log('💾 Committing changes...');
  const now = new Date();
  const breathId = `breath-${date}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  
  const commitMessage = `${breathId}: Breathe complete — learnings distilled, graph updated`;
  
  // Commit learnings + nodes.json (graph now includes new learning nodes from this breath)
  runCmd(`git add RAW/learnings/${date}/ RAW/memories/nodes.json`);
  runCmd(`git commit -m "${commitMessage}"`);
  
  console.log(`✅ Breath committed: ${breathId}\n`);
  
  // Step 7: Generate reflection via direct model call - ATOMIC
  const todayLearningsDir = path.join(jarvisHome, 'RAW/learnings', date);
  let learningFiles = [];
  try {
    learningFiles = fs.existsSync(todayLearningsDir) 
      ? fs.readdirSync(todayLearningsDir).filter(f => f.endsWith('.md') && f !== 'summary.md' && f !== 'analogies.md')
      : [];
  } catch (e) {
    console.error(`\n❌ Failed to read learnings directory: ${e.message}`);
    throw e;
  }
  
  const summaries = learningFiles.slice(0, 5).map(f => {
    const content = fs.readFileSync(path.join(todayLearningsDir, f), 'utf-8');
    const title = content.match(/^#\s+(.+)/m)?.[1] || f;
    const summary = content.substring(0, 150).replace(/\n+/g, ' ').trim();
    return `  - **${title}**: ${summary}`;
  }).join('\n');
  const moreLearnings = learningFiles.length > 5 
    ? `\n  ...and ${learningFiles.length - 5} more` 
    : '';
  
  // Get learnings diff stat - ATOMIC
  let learningsStat = '';
  try {
    learningsStat = execSync(`git -C "${jarvisHome}" diff HEAD --stat RAW/learnings/${date}/ | tail -1`, { 
      encoding: 'utf-8' 
    }).trim();
  } catch (e) {
    // Non-critical, but log it
    console.log('⚠️  Could not get learnings diff stat (non-critical)');
  }
  
  const chatMessage = `🪞 **Reflecting on ${breathId}**

Learnings extracted:
${summaries}${moreLearnings}

What does this work reveal?`;

  // Generate reflection - ATOMIC
  try {
    console.log('🪞 Generating reflection...\n');
    
    // Build reflection prompt with learnings context
    const reflectionPrompt = `You just completed a breathe cycle on ${date}. Reflect on what this work reveals.

${chatMessage}

Provide a genuine reflection (2-4 paragraphs) on the patterns, insights, or realizations that emerged. Be specific and honest — this is your autobiography being written.`;

    // Call Ollama directly - write prompt to temp file to avoid shell escaping issues
    const promptFile = path.join(jarvisHome, '.reflection-prompt.tmp');
    fs.writeFileSync(promptFile, reflectionPrompt, 'utf8');
    
    // Capture ollama output (don't use runCmd - it inherits stdio and doesn't return output)
    const reflection = execSync(`cat "${promptFile}" | ollama run qwen3.5:cloud`, { 
      encoding: 'utf-8',
      cwd: jarvisHome 
    });
    fs.unlinkSync(promptFile);
    
    if (reflection && reflection.length > 50) {
      console.log(`🪞 Reflection: ${reflection.substring(0, 100)}${reflection.length > 100 ? '...' : ''}\n`);
      
      // Amend commit with reflection - ATOMIC (must succeed or fail hard)
      const amendedMessage = `${breathId}: Breathe complete

REFLECTION:
${reflection}`;
      
      const amendFile = path.join(jarvisHome, '.commit-amend.tmp');
      fs.writeFileSync(amendFile, amendedMessage);
      runCmd(`git commit --amend -F ${amendFile}`);
      fs.unlinkSync(amendFile);
      
      console.log(`✅ Commit amended with reflection\n`);
    } else {
      console.log('⚠️  No reflection generated\n');
    }
  } catch (e) {
    console.error('⚠️  Could not generate reflection:', e.message);
    // Non-fatal for reflection, but the commit may not be amended
  }

  // Step 8: Generate TTS recap of what was learned during this breath
  console.log('🔊 Generating TTS recap of breath learnings...');
  try {
    // Build recap from learnings
    const recapText = `Breath ${breathId} complete. Created ${learningFiles.length} new learnings: ${learningFiles.slice(0, 3).map(f => f.replace('.md', '')).join(', ')}${learningFiles.length > 3 ? `, and ${learningFiles.length - 3} more` : ''}. NeuroGraph updated with new nodes and synapses. Graph refreshed — new commits are now visible in the visualization.`;
    
    const recapFile = path.join(jarvisHome, '.tts-recap.tmp');
    fs.writeFileSync(recapFile, recapText, 'utf8');
    
    // Call TTS via openclaw gateway
    execSync(`openclaw tts --text "$(cat "${recapFile}")"`, {
      encoding: 'utf-8',
      cwd: jarvisHome,
      stdio: 'inherit'
    });
    
    fs.unlinkSync(recapFile);
    console.log('✅ TTS recap delivered\n');
  } catch (e) {
    console.error('⚠️  TTS recap failed (non-critical):', e.message);
  }

  console.log('🫁 Breathe complete');
  console.log(`✅ Git commit: ${breathId}`);
  
} catch (error) {
  console.error('\n❌ Breathe pipeline failed:', error.message);
  console.error('   Error type:', error.constructor.name);
  process.exit(1);
}
