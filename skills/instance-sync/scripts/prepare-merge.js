#!/usr/bin/env node

/**
 * Instance Sync — Prepare Merge
 * 
 * Pre-merge checks before merging paul branch into custom branch (eric, david, bruce)
 * - Verifies RAW/memories/ is gitignored (sovereign)
 * - Verifies target branch exists
 * - Verifies source branch exists (fetched)
 * - Backs up neurograph before merge
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JARVIS_HOME = process.env.JARVIS_HOME || path.join(process.env.HOME, 'JARVIS');

function run(cmd) {
  return execSync(cmd, { cwd: JARVIS_HOME, encoding: 'utf8' }).trim();
}

function log(msg) {
  console.log(msg);
}

function main() {
  const targetBranch = process.argv[2] || 'eric';
  const sourceBranch = process.argv[3] || 'paul';
  
  log(`\n🔄 Instance Sync Prep — ${targetBranch} ← ${sourceBranch}\n`);
  
  let allGood = true;
  
  // 1. Check RAW/memories/ is in .gitignore
  const gitignorePath = path.join(JARVIS_HOME, '.gitignore');
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  const isMemoriesIgnored = gitignore.includes('RAW/memories/');
  
  if (isMemoriesIgnored) {
    log('✅ RAW/memories/ is gitignored (sovereign)');
  } else {
    log('❌ RAW/memories/ is NOT in .gitignore — neurograph will conflict on merge!');
    log('   Fix: echo "RAW/memories/" >> .gitignore');
    allGood = false;
  }
  
  // 2. Check current branch
  let currentBranch;
  try {
    currentBranch = run('git rev-parse --abbrev-ref HEAD');
  } catch (e) {
    log('❌ Not in a git repository');
    process.exit(1);
  }
  
  if (currentBranch === targetBranch) {
    log(`✅ Branch '${targetBranch}' exists (current: ${currentBranch})`);
  } else {
    log(`⚠️  Current branch is '${currentBranch}', not '${targetBranch}'`);
    log(`   Switch with: git checkout ${targetBranch}`);
  }
  
  // 3. Check source branch exists (remote)
  let sourceExists = false;
  try {
    run(`git rev-parse --verify origin/${sourceBranch}`);
    sourceExists = true;
    log(`✅ Branch 'origin/${sourceBranch}' exists (fetched)`);
  } catch (e) {
    // Try local branch
    try {
      run(`git rev-parse --verify ${sourceBranch}`);
      sourceExists = true;
      log(`✅ Branch '${sourceBranch}' exists (local)`);
    } catch (e2) {
      log(`❌ Branch '${sourceBranch}' not found`);
      log('   Fetch first: git fetch origin');
      allGood = false;
    }
  }
  
  // 4. Backup neurograph
  const memoriesDir = path.join(JARVIS_HOME, 'RAW', 'memories');
  const backupDir = path.join(JARVIS_HOME, '.backup', `memories-backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`);
  
  if (fs.existsSync(memoriesDir)) {
    try {
      const mkdirCmd = `mkdir -p "${backupDir}"`;
      const cpCmd = `cp -r "${memoriesDir}"/* "${backupDir}/" 2>/dev/null || true`;
      run(mkdirCmd);
      run(cpCmd);
      log(`✅ Neurograph backed up to: ${backupDir}/`);
    } catch (e) {
      log('⚠️  Could not backup neurograph (may not exist yet)');
    }
  } else {
    log('ℹ️  No neurograph found (first-time setup — will be created on first breathe)');
  }
  
  // 5. Check for uncommitted changes
  try {
    const status = run('git status --porcelain');
    if (status) {
      log('⚠️  You have uncommitted changes:');
      status.split('\n').slice(0, 5).forEach(line => log(`   ${line}`));
      log('   Commit or stash before merging');
    } else {
      log('✅ Working tree clean');
    }
  } catch (e) {
    // No changes
  }
  
  log('');
  
  if (allGood) {
    log(`🟢 Ready to merge: git merge origin/${sourceBranch}`);
    log('');
    process.exit(0);
  } else {
    log('🔴 Not ready — fix issues above before merging');
    log('');
    process.exit(1);
  }
}

main();
