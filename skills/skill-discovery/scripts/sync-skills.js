#!/usr/bin/env node
/**
 * Skill Discovery — Sync Jarvis skills to OpenClaw workspace
 * 
 * Usage: node sync-skills.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const WORKSPACE_SKILLS = path.join(HOME, '.openclaw', 'workspace', 'skills');
const JARVIS_SKILLS = path.join(JARVIS_HOME, 'skills');

function syncSkills() {
  console.log('🔗 Skill Discovery — Syncing Jarvis skills to workspace\n');
  
  // Step 1: Scan Jarvis skills
  const jarvisSkillFolders = fs.readdirSync(JARVIS_SKILLS).filter(f => 
    fs.statSync(path.join(JARVIS_SKILLS, f)).isDirectory()
  );
  console.log(`   Jarvis skills: ${jarvisSkillFolders.length} folders`);
  
  // Step 2: Remove existing symlinks
  const existingLinks = fs.readdirSync(WORKSPACE_SKILLS).filter(f => {
    const fullPath = path.join(WORKSPACE_SKILLS, f);
    return fs.lstatSync(fullPath).isSymbolicLink();
  });
  existingLinks.forEach(link => {
    fs.unlinkSync(path.join(WORKSPACE_SKILLS, link));
  });
  if (existingLinks.length > 0) {
    console.log(`   Removed ${existingLinks.length} existing symlinks`);
  }
  
  // Step 3: Create new symlinks
  let created = 0;
  let broken = 0;
  jarvisSkillFolders.forEach(skill => {
    const linkPath = path.join(WORKSPACE_SKILLS, skill);
    const targetPath = path.join(JARVIS_SKILLS, skill);
    try {
      fs.symlinkSync(targetPath, linkPath);
      created++;
    } catch (err) {
      console.error(`   ❌ Failed to create symlink for ${skill}: ${err.message}`);
      broken++;
    }
  });
  
  // Step 4: Verify symlinks
  const brokenLinks = [];
  fs.readdirSync(WORKSPACE_SKILLS).forEach(f => {
    const fullPath = path.join(WORKSPACE_SKILLS, f);
    if (fs.lstatSync(fullPath).isSymbolicLink()) {
      try {
        fs.realpathSync(fullPath); // Throws if broken
      } catch (err) {
        brokenLinks.push(f);
      }
    }
  });
  
  if (brokenLinks.length > 0) {
    console.log(`   ⚠️ Broken symlinks: ${brokenLinks.length}`);
    brokenLinks.forEach(f => console.log(`      - ${f}`));
  }
  
  // Step 5: Report
  console.log('\n✅ Skill Discovery Complete');
  console.log(`   Jarvis skills: ${jarvisSkillFolders.length} folders`);
  console.log(`   Workspace symlinks: ${created} created`);
  console.log(`   Broken removed: ${brokenLinks.length}`);
  console.log(`   Status: ${brokenLinks.length === 0 ? 'synced' : 'needs-fix'}`);
  
  if (jarvisSkillFolders.length <= 20) {
    console.log('\nSkills synced:');
    jarvisSkillFolders.forEach(skill => console.log(`  - ${skill}`));
  }
}

syncSkills();
