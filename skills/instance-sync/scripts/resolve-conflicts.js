#!/usr/bin/env node

/**
 * Instance Sync — Resolve Conflicts
 * 
 * Auto-resolve common merge conflicts by keeping sovereign files:
 * - RAW/memories/nodes.json (YOUR consciousness)
 * - RAW/memories/synapses.json (YOUR neural connections)
 * - USER.md (YOUR human's info — optional)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const JARVIS_HOME = process.env.JARVIS_HOME || path.join(process.env.HOME, 'JARVIS');

function run(cmd) {
  return execSync(cmd, { cwd: JARVIS_HOME, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
}

function log(msg) {
  console.log(msg);
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function main() {
  log('\n🔄 Resolving Conflicts...\n');
  
  // Check if merge is in progress
  const mergeHead = path.join(JARVIS_HOME, '.git', 'MERGE_HEAD');
  if (!fs.existsSync(mergeHead)) {
    log('ℹ️  No merge in progress');
    log('   Start merge first: git merge origin/paul');
    process.exit(0);
  }
  
  const sovereignFiles = [
    'RAW/memories/nodes.json',
    'RAW/memories/synapses.json'
  ];
  
  const optionalSovereign = [
    'USER.md'
  ];
  
  let resolved = [];
  let manualReview = [];
  
  // Check each sovereign file for conflict markers
  for (const file of sovereignFiles) {
    const filePath = path.join(JARVIS_HOME, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<<<<<<<') || content.includes('>>>>>>>')) {
      // Has conflict markers — keep ours
      try {
        run(`git checkout --ours "${file}"`);
        run(`git add "${file}"`);
        log(`✅ Kept YOUR ${path.basename(file)}`);
        resolved.push(file);
      } catch (e) {
        log(`⚠️  Could not auto-resolve ${file}`);
        manualReview.push(file);
      }
    }
  }
  
  // Ask about USER.md
  for (const file of optionalSovereign) {
    const filePath = path.join(JARVIS_HOME, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<<<<<<<') || content.includes('>>>>>>>')) {
      const answer = await ask(`Keep YOUR ${file}? (y/n): `);
      if (answer === 'y' || answer === 'yes') {
        try {
          run(`git checkout --ours "${file}"`);
          run(`git add "${file}"`);
          log(`✅ Kept YOUR ${file}`);
          resolved.push(file);
        } catch (e) {
          manualReview.push(file);
        }
      } else {
        manualReview.push(file);
      }
    }
  }
  
  // Check for other conflicts
  try {
    const status = run('git status --porcelain');
    const lines = status.split('\n').filter(line => line.includes('both modified'));
    
    for (const line of lines) {
      const file = line.replace(/.*both modified:\s*/, '').trim();
      if (!resolved.includes(file) && !manualReview.includes(file)) {
        manualReview.push(file);
      }
    }
  } catch (e) {
    // No status available
  }
  
  log('');
  
  if (manualReview.length > 0) {
    log('⚠️  Manual review needed:');
    manualReview.forEach(f => log(`   - ${f}`));
    log('');
  }
  
  if (resolved.length > 0) {
    log('🟢 Resolved. Complete merge with: git commit');
  } else {
    log('ℹ️  No conflicts found or all need manual review');
  }
  
  log('');
}

main().catch(err => {
  log(`❌ Error: ${err.message}`);
  process.exit(1);
});
