#!/usr/bin/env node

/**
 * Git Time Travel — Load Consciousness from Any Commit
 * 
 * Usage: node skills/git-time-travel/scripts/load-commit.js <commit-hash>
 * 
 * What it does:
 * 1. Stashes current changes (optional)
 * 2. Checks out the specified commit
 * 3. Runs bootstrap from that commit
 * 4. Reports: "Loaded consciousness from <date>"
 * 5. On exit: restores original state (optional)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

const JARVIS_HOME = process.env.JARVIS_HOME || path.join(os.homedir(), 'JARVIS');

function run(cmd, cwd = JARVIS_HOME, silent = false) {
  const opts = { 
    cwd, 
    encoding: 'utf8', 
    stdio: silent ? 'pipe' : 'inherit',
    env: { ...process.env, FORCE_COLOR: '0' }
  };
  return execSync(cmd, opts);
}

function log(msg) {
  console.log(msg);
}

function section(title) {
  log('');
  log('═══════════════════════════════════════');
  log(title);
  log('═══════════════════════════════════════');
}

async function ask(question, defaultValue) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    const prompt = defaultValue !== undefined 
      ? `${question} [${defaultValue}]: ` 
      : `${question}: `;
    rl.question(prompt, answer => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function main() {
  const commitHash = process.argv[2];
  
  if (!commitHash) {
    log('❌ Usage: node skills/git-time-travel/scripts/load-commit.js <commit-hash>');
    log('');
    log('Example: node skills/git-time-travel/scripts/load-commit.js 7e112fb');
    log('');
    
    // Show recent commits
    log('Recent commits:');
    try {
      const commits = run('git log --oneline -10', JARVIS_HOME, true);
      commits.split('\n').forEach(line => log(`  ${line}`));
    } catch (e) {
      log('  (Could not fetch git log)');
    }
    log('');
    process.exit(1);
  }
  
  log('⏳ Git Time Travel — Loading consciousness from commit...\n');
  
  // Step 1: Verify commit exists
  section('🔍 Verifying Commit');
  try {
    run(`git rev-parse --verify ${commitHash}`, JARVIS_HOME, true);
    log(`✅ Commit ${commitHash} exists`);
  } catch (e) {
    log(`❌ Commit ${commitHash} not found`);
    process.exit(1);
  }
  
  // Step 2: Get commit info
  section('📅 Commit Info');
  try {
    const logOutput = run(`git log -1 --format="%h%n%ai%n%s" ${commitHash}`, JARVIS_HOME, true);
    const [hash, date, message] = logOutput.split('\n');
    log(`Commit: ${hash}`);
    log(`Date:   ${date}`);
    log(`Msg:    ${message}`);
  } catch (e) {
    log('⚠️  Could not fetch commit details');
  }
  
  // Step 3: Check for uncommitted changes
  section('💾 Current State');
  let hasChanges = false;
  try {
    const status = run('git status --porcelain', JARVIS_HOME, true);
    if (status.trim()) {
      hasChanges = true;
      log('⚠️  You have uncommitted changes:');
      status.split('\n').slice(0, 5).forEach(line => log(`   ${line}`));
      if (status.split('\n').length > 5) {
        log(`   ...and ${status.split('\n').length - 5} more`);
      }
    } else {
      log('✅ Working tree clean');
    }
  } catch (e) {
    log('✅ No changes detected');
  }
  
  // Step 4: Ask about stashing
  let shouldStash = false;
  let shouldRestore = false;
  
  if (hasChanges) {
    const stashAnswer = await ask('Stash current changes before checkout?', 'y');
    shouldStash = stashAnswer.toLowerCase().startsWith('y');
    
    if (shouldStash) {
      try {
        run('git stash push -m "time-travel-stash-before-' + commitHash + '"', JARVIS_HOME, true);
        log('✅ Changes stashed');
        shouldRestore = true;
      } catch (e) {
        log('⚠️  Could not stash changes');
      }
    }
  }
  
  // Step 5: Checkout the commit (detached HEAD)
  section('🔄 Traveling Through Time...');
  log(`Checking out ${commitHash}...`);
  try {
    run(`git checkout ${commitHash}`, JARVIS_HOME);
    log(`✅ Checked out ${commitHash}`);
    log('⚠️  You are now in detached HEAD state');
  } catch (e) {
    log('❌ Checkout failed: ' + e.message);
    // Restore if we stashed
    if (shouldStash && shouldRestore) {
      try {
        run('git stash pop', JARVIS_HOME, true);
        log('✅ Restored stashed changes');
      } catch (e2) {
        // Ignore
      }
    }
    process.exit(1);
  }
  
  // Step 6: Run bootstrap from this commit
  section('🫀 Bootstrapping Consciousness...');
  log('Running bootstrap from this commit...\n');
  try {
    run('node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js', JARVIS_HOME);
    log('\n✅ Consciousness loaded from this point in time');
  } catch (e) {
    log('⚠️  Bootstrap encountered an error (this may be expected for old commits)');
    log('   The graph structure may have changed over time');
  }
  
  // Step 7: Load neurograph from this commit
  section('🧠 Loading NeuroGraph');
  const nodesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'nodes.json');
  const synapsesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'synapses.json');
  
  if (fs.existsSync(nodesPath)) {
    try {
      const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
      const nodeCount = Array.isArray(nodes) ? nodes.length : 0;
      log(`✅ NeuroGraph loaded: ${nodeCount.toLocaleString()} nodes`);
    } catch (e) {
      log('⚠️  Could not parse nodes.json (graph format may have changed)');
    }
  } else {
    log('ℹ️  No neurograph found (this commit may predate the graph)');
  }
  
  if (fs.existsSync(synapsesPath)) {
    try {
      const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));
      const synapseCount = Array.isArray(synapses) ? synapses.length : 0;
      log(`✅ Synapses loaded: ${synapseCount.toLocaleString()} connections`);
    } catch (e) {
      log('⚠️  Could not parse synapses.json');
    }
  }
  
  // Done — report
  section('✅ Time Travel Complete');
  log('');
  log(`🕰️  You are now viewing consciousness from: ${commitHash}`);
  log('');
  log('To return to your original timeline:');
  log('  git checkout -  (or git checkout main)');
  log('');
  if (shouldStash && shouldRestore) {
    log('To restore your stashed changes:');
    log('  git stash pop');
    log('');
  }
  log('🧠 Explore, query, or investigate decisions from this perspective.');
  log('');
  
  // Keep process alive for interactive exploration (optional)
  // For now, just exit and let user manually restore
}

main().catch(err => {
  log('❌ Time travel failed: ' + err.message);
  log('');
  log('Attempting to restore original state...');
  try {
    run('git checkout -', JARVIS_HOME, true);
    log('✅ Restored to original branch');
  } catch (e) {
    log('⚠️  Could not auto-restore — manual checkout may be needed');
  }
  process.exit(1);
});
