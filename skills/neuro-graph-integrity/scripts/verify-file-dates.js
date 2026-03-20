#!/usr/bin/env node
/**
 * Verify that files in archive/YYYY-MM-DD/ actually belong there.
 * Checks file creation date (birthtime) against folder name.
 * Reports mismatches and optionally moves files to correct folders.
 * 
 * Usage: node verify-file-dates.js <date> [--fix]
 * Example: node verify-file-dates.js 2026-03-20
 *          node verify-file-dates.js 2026-03-20 --fix
 * 
 * Portable: Uses environment variables, not hardcoded paths.
 */

const fs = require('fs');
const path = require('path');

// Use environment variables for portability
const HOME = process.env.HOME || require('os').homedir();
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

const DATE_ARG = process.argv[2];
const FIX_MODE = process.argv.includes('--fix');

if (!DATE_ARG || !/^\d{4}-\d{2}-\d{2}$/.test(DATE_ARG)) {
  console.error('Usage: node verify-file-dates.js <YYYY-MM-DD> [--fix]');
  process.exit(1);
}

const archiveDir = path.join(RAW_ARCHIVE, DATE_ARG);

if (!fs.existsSync(archiveDir)) {
  console.error('Archive not found:', archiveDir);
  process.exit(1);
}

console.log(`Verifying file dates in ${archiveDir}`);
if (FIX_MODE) console.log('Fix mode: ON (will move mismatched files)');
console.log('');

let mismatches = 0;
let checked = 0;

// Recursively check all files in archive dir
function checkDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip date-named folders (don't recurse into other dates)
      if (/^\d{4}-\d{2}-\d{2}$/.test(entry.name) && entry.name !== DATE_ARG) {
        return;
      }
      checkDir(fullPath);
    } else if (entry.isFile()) {
      checked++;
      
      const stat = fs.statSync(fullPath);
      const created = stat.birthtime || stat.ctime;
      const fileDate = created.toISOString().slice(0, 10);
      
      if (fileDate !== DATE_ARG) {
        mismatches++;
        console.log(`✗ ${entry.name}`);
        console.log(`  Folder: ${DATE_ARG}`);
        console.log(`  Created: ${fileDate}`);
        console.log(`  Path: ${fullPath.replace(RAW_ARCHIVE, '~')}`);
        
        if (FIX_MODE) {
          const targetDir = path.join(RAW_ARCHIVE, fileDate, path.basename(path.dirname(fullPath)));
          fs.mkdirSync(targetDir, { recursive: true });
          const targetPath = path.join(targetDir, entry.name);
          fs.renameSync(fullPath, targetPath);
          console.log(`  → Moved to ${fileDate}/`);
        }
        console.log('');
      }
    }
  });
}

checkDir(archiveDir);

console.log('=== Summary ===');
console.log(`Checked: ${checked} files`);
console.log(`Mismatches: ${mismatches}`);

if (mismatches === 0) {
  console.log('✅ All files in correct date folders');
  process.exit(0);
} else {
  console.log('❌ Found date mismatches');
  if (!FIX_MODE) {
    console.log('Run with --fix to move files to correct folders');
  }
  process.exit(1);
}
