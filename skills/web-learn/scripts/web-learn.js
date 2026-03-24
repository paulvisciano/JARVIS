#!/usr/bin/env node
// Web Learn — Screenshot-based knowledge capture from websites

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const URL = process.argv[2];
if (!URL) {
  console.error('Usage: node web-learn.js <url>');
  console.error('Example: node web-learn.js https://git-scm.com/');
  process.exit(1);
}

const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const DATE = new Date().toISOString().split('T')[0];
const ARCHIVE_DIR = path.join(HOME, 'RAW', 'archive', DATE);
const IMAGES_DIR = path.join(ARCHIVE_DIR, 'images');
const WEB_SOURCES_DIR = path.join(ARCHIVE_DIR, 'web-sources');
const LEARNINGS_DIR = path.join(JARVIS_HOME, 'RAW', 'learnings', DATE);

console.log(`🌐 Web Learn — Starting...\n`);
console.log(`   URL: ${URL}`);
console.log(`   Date: ${DATE}`);
console.log(`   Archive: ${ARCHIVE_DIR}\n`);

// Ensure directories exist
[IMAGES_DIR, WEB_SOURCES_DIR, LEARNINGS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// === Step 1: Launch browser + navigate ===
console.log('🌐 Launching browser...');
try {
  execSync(`open "${URL}"`);
  console.log('✓ Browser opened\n');
} catch (err) {
  console.error('❌ Failed to open browser:', err.message);
  process.exit(1);
}

// === Step 2: Screenshot pages ===
console.log('📸 Screenshotting pages...');
const domain = URL.split('/')[2].replace('www.', '');
const pages = ['']; // Start with homepage

pages.forEach((page, i) => {
  const pageUrl = page ? `${URL}${page}` : URL;
  const filename = `web-${domain}-${i}.png`;
  const filepath = path.join(IMAGES_DIR, filename);
  
  try {
    // Wait for page load
    execSync('sleep 2');
    
    // Screenshot (macOS screencapture)
    execSync(`screencapture -x "${filepath}"`);
    console.log(`   ✓ ${page || 'homepage'} (${filename})`);
  } catch (err) {
    console.error(`   ❌ Failed: ${err.message}`);
  }
});

console.log();

// === Step 3: OCR screenshots ===
console.log('🔍 OCR\'ing screenshots...');
const screenshotFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(`web-${domain}`) && f.endsWith('.png'));

const ocrResults = [];
screenshotFiles.forEach(file => {
  const filepath = path.join(IMAGES_DIR, file);
  const txtPath = filepath.replace('.png', '.txt');
  
  try {
    const ocrText = execSync(`tesseract "${filepath}" stdout`, { encoding: 'utf8' });
    fs.writeFileSync(txtPath, ocrText);
    console.log(`   ✓ ${file} (${ocrText.length} chars)`);
    ocrResults.push({ file, txt: txtPath, text: ocrText });
  } catch (err) {
    console.error(`   ❌ OCR failed: ${err.message}`);
  }
});

console.log();

// === Step 4: Create learnings ===
console.log('🧠 Creating learnings...');
const combinedText = ocrResults.map(r => r.text).join('\n\n');

// Send to model for synthesis (via ollama)
const prompt = `Extract 3-5 key learnings from this web content:

${combinedText}

For each learning, output JSON:
{
  "title": "Learning title",
  "summary": "First-person summary",
  "source_url": "${URL}",
  "screenshots": [${screenshotFiles.map(f => `"${f}"`).join(', ')}]
}

Output ONLY JSON array.`;

const promptPath = path.join(ARCHIVE_DIR, 'web-learn-prompt.txt');
fs.writeFileSync(promptPath, prompt);

try {
  const modelOutput = execSync(`cat "${promptPath}" | ollama run qwen3.5:cloud`, { encoding: 'utf8', timeout: 90000 });
  fs.unlinkSync(promptPath);
  
  // Parse JSON
  let learnings;
  try {
    const jsonMatch = modelOutput.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      learnings = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('❌ Failed to parse model output');
    process.exit(1);
  }
  
  // Write learnings
  learnings.forEach((learning, i) => {
    const filename = `web-learn-${i + 1}.md`;
    const filepath = path.join(LEARNINGS_DIR, filename);
    const content = `# ${learning.title}\n\n${learning.summary}\n\n**Source:** ${learning.source_url}\n\n**Screenshots:** ${learning.screenshots.join(', ')}\n`;
    fs.writeFileSync(filepath, content);
    console.log(`   ✓ ${filename} (${learning.title})`);
  });
  
  console.log();
} catch (err) {
  console.error('❌ Model synthesis failed:', err.message);
  process.exit(1);
}

// === Step 5: Link neurograph ===
console.log('🔗 Linking neurograph...');
try {
  // Read existing nodes
  const nodesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'nodes.json');
  const synapsesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'synapses.json');
  
  const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
  const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));
  
  // Create learning nodes
  learnings.forEach((learning, i) => {
    const nodeId = `web-learn-${i + 1}`;
    nodes.push({
      id: nodeId,
      title: learning.title,
      type: 'learning',
      source_url: learning.source_url,
      screenshots: learning.screenshots,
      date: DATE
    });
    
    // Link to temporal anchor
    synapses.push({
      from: nodeId,
      to: `temporal-${DATE}`,
      type: 'temporal'
    });
    
    console.log(`   ✓ Created node: ${nodeId}`);
    console.log(`   ✓ Linked to: temporal-${DATE}`);
  });
  
  // Save
  fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
  fs.writeFileSync(synapsesPath, JSON.stringify(synapses, null, 2));
  
  console.log();
} catch (err) {
  console.error('❌ Neurograph linking failed:', err.message);
}

// === Step 6: Save source metadata ===
console.log('💾 Saving source metadata...');
const sourceMetadata = {
  url: URL,
  domain: domain,
  date: DATE,
  screenshots: screenshotFiles,
  ocr_results: ocrResults.map(r => r.txt),
  learnings_created: learnings.length
};

const metadataPath = path.join(WEB_SOURCES_DIR, `${domain}-${DATE}.json`);
fs.writeFileSync(metadataPath, JSON.stringify(sourceMetadata, null, 2));
console.log(`   ✓ ${metadataPath}\n`);

console.log('✅ Web learn complete');
console.log(`   Learnings: ${learnings.length}`);
console.log(`   Screenshots: ${screenshotFiles.length}`);
console.log(`   Neurograph nodes: ${learnings.length}`);
