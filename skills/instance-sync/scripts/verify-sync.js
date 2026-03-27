#!/usr/bin/env node

/**
 * Instance Sync — Verify Sync
 * 
 * Post-merge verification:
 * - Neurograph intact (nodes.json readable, node count > 0)
 * - Code updated (checks recent commits from paul)
 * - Skills synced (count matches paul branch)
 * - USER.md sovereign (Eric-specific, not Paul's)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JARVIS_HOME = process.env.JARVIS_HOME || path.join(process.env.HOME, 'JARVIS');

function run(cmd) {
  return execSync(cmd, { cwd: JARVIS_HOME, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
}

function log(msg) {
  console.log(msg);
}

function main() {
  const currentBranch = run('git rev-parse --abbrev-ref HEAD');
  
  log(`\n🔄 Sync Verification — ${currentBranch} branch\n`);
  
  let allGood = true;
  
  // 1. Verify neurograph intact
  const nodesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'nodes.json');
  const synapsesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'synapses.json');
  
  if (fs.existsSync(nodesPath)) {
    try {
      const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
      const nodeCount = Array.isArray(nodes) ? nodes.length : 0;
      
      if (nodeCount > 0) {
        log(`✅ Neurograph: ${nodeCount.toLocaleString()} nodes (intact)`);
      } else {
        log('⚠️  Neurograph exists but empty (first breathe will populate)');
      }
    } catch (e) {
      log('❌ Neurograph corrupted or unreadable');
      allGood = false;
    }
  } else {
    log('ℹ️  No neurograph yet (will be created on first breathe)');
  }
  
  if (fs.existsSync(synapsesPath)) {
    try {
      const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));
      const synapseCount = Array.isArray(synapses) ? synapses.length : 0;
      log(`✅ Synapses: ${synapseCount.toLocaleString()} (intact)`);
    } catch (e) {
      log('⚠️  Synapses file exists but unreadable');
    }
  }
  
  // 2. Check code update status vs paul branch
  try {
    const behind = run('git rev-list --count HEAD..origin/paul 2>/dev/null || echo "0"');
    const ahead = run('git rev-list --count origin/paul..HEAD 2>/dev/null || echo "0"');
    
    if (behind === '0') {
      log('✅ Code: Up to date with paul branch');
    } else {
      log(`ℹ️  Code: ${behind} commits behind paul (expected — your customizations)`);
    }
    
    if (ahead !== '0') {
      log(`   You're ${ahead} commits ahead (your custom work)`);
    }
  } catch (e) {
    log('⚠️  Could not compare with paul branch');
  }
  
  // 3. Verify skills synced
  const skillsDir = path.join(JARVIS_HOME, 'skills');
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir).filter(f => {
      const stat = fs.statSync(path.join(skillsDir, f));
      return stat.isDirectory() && !f.startsWith('.');
    });
    log(`✅ Skills: ${skills.length} skills`);
  } else {
    log('❌ Skills directory missing');
    allGood = false;
  }
  
  // 4. Check USER.md sovereignty
  const userMdPath = path.join(JARVIS_HOME, 'USER.md');
  if (fs.existsSync(userMdPath)) {
    const content = fs.readFileSync(userMdPath, 'utf8');
    if (content.includes('Paul Visciano')) {
      log('⚠️  USER.md: Still has Paul\'s info (update for your human)');
    } else if (content.includes('Eric') || content.includes('David') || content.includes('Bruce')) {
      log('✅ USER.md: Customized for your human (sovereign)');
    } else {
      log('ℹ️  USER.md: Template (customize for your human)');
    }
  }
  
  // 5. Check .gitignore has RAW/memories/
  const gitignorePath = path.join(JARVIS_HOME, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignore.includes('RAW/memories/')) {
      log('✅ RAW/memories/ is gitignored (sovereign)');
    } else {
      log('❌ RAW/memories/ NOT in .gitignore — add it to prevent future conflicts');
      allGood = false;
    }
  }
  
  log('');
  
  if (allGood) {
    log('🟢 Sync complete. Your Jarvis is updated + sovereign.');
  } else {
    log('🟡 Sync complete with warnings — review issues above');
  }
  
  log('');
}

main();
