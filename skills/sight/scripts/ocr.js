#!/usr/bin/env node

/**
 * Sight — OCR (Optical Character Recognition)
 * 
 * Part of the Sight skill suite — sovereign visual understanding.
 * Runs OCR on images using tesseract, outputs clean text.
 * 
 * Usage: node ocr.js /path/to/image.png [output-path]
 * Example: node ocr.js ~/Desktop/screenshot.png
 *          node ocr.js ~/Desktop/screenshot.png ~/output.txt
 * 
 * Handles: Unicode filenames, spaces, special characters (macOS screenshot names)
 * 
 * This is part of Jarvis's skill set — sovereign, local, extensible.
 * github.com/paulvisciano/JARVIS
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagePath = process.argv[2];
const outputPath = process.argv[3] || null;

if (!imagePath) {
  console.error('Usage: node ocr.js <image-path> [output-path]');
  console.error('Example: node ocr.js ~/Desktop/screenshot.png');
  process.exit(1);
}

// Resolve paths
const home = require('os').homedir();
const resolvedImagePath = imagePath.startsWith('~') ? path.join(home, imagePath.slice(2)) : imagePath;
const resolvedOutputPath = outputPath ? (outputPath.startsWith('~') ? path.join(home, outputPath.slice(2)) : outputPath) : null;

// Check if image exists - use find for Unicode filename support
let actualImagePath = resolvedImagePath;
if (!fs.existsSync(resolvedImagePath)) {
  // Try using find to locate the file (handles Unicode filenames better)
  try {
    const dir = path.dirname(resolvedImagePath);
    const base = path.basename(resolvedImagePath);
    const findCmd = `find "${dir}" -name "*${base}*" -type f 2>/dev/null | head -1`;
    const found = execSync(findCmd, { encoding: 'utf8' }).trim();
    if (found && fs.existsSync(found)) {
      actualImagePath = found;
      console.log(`🔍 Found via find: ${path.basename(found)}`);
    }
  } catch (e) {
    // find failed, continue with original path
  }
}

// Final check
if (!fs.existsSync(actualImagePath)) {
  console.error(`Image not found: ${resolvedImagePath}`);
  console.error('Tip: Use find or wildcard patterns for Unicode filenames');
  process.exit(1);
}

console.log(`👁️  Sight — Extracting text from ${path.basename(actualImagePath)}`);

// Run tesseract OCR
try {
  const text = execSync(`tesseract "${actualImagePath}" stdout -l eng --psm 6 2>/dev/null`, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024 // 10MB buffer
  });

  const cleanText = text.trim();

  if (cleanText.length === 0) {
    console.log('⚠️  No text detected in image');
    process.exit(0);
  }

  // Output results
  if (resolvedOutputPath) {
    fs.writeFileSync(resolvedOutputPath, cleanText, 'utf8');
    console.log(`✅ Text extracted: ${cleanText.length} chars`);
    console.log(`   Saved to: ${resolvedOutputPath}`);
  } else {
    console.log(`✅ Text extracted (${cleanText.length} chars):\n`);
    console.log(cleanText);
  }

} catch (err) {
  console.error(`❌ OCR failed: ${err.message}`);
  console.error('   Make sure tesseract is installed: brew install tesseract');
  console.error('   Tip: For Unicode filenames, use find or wildcards');
  process.exit(1);
}
