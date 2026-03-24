#!/usr/bin/env node
// Web Learn — Screenshot-based knowledge capture from websites
// Called via: node web-learn.js <url>
// Browser tool calls are made by the parent OpenClaw session

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// === Step 1: Use OpenClaw browser tool to screenshot ===
console.log('📸 Using OpenClaw browser tool to screenshot...');
const domain = URL.split('/')[2].replace('www.', '').replace(/\./g, '-');

try {
  // Use OpenClaw browser tool (native tool, not skill)
  console.log('   Running: openclaw browser open "${URL}"');
  const browserOutput = execSync(`openclaw browser open "${URL}"`, { encoding: 'utf8', timeout: 30000 });
  
  // Parse targetId from output
  const targetIdMatch = browserOutput.match(/"targetId":\s*"([^"]+)"/);
  if (!targetIdMatch) {
    throw new Error('Could not parse targetId from browser output');
  }
  const targetId = targetIdMatch[1];
  console.log(`   ✓ Opened (targetId: ${targetId})`);
  
  // Take screenshot
  console.log('   Running: openclaw browser screenshot --targetId ${targetId}');
  const screenshotOutput = execSync(`openclaw browser screenshot --targetId "${targetId}"`, { encoding: 'utf8', timeout: 30000 });
  
  // Parse media path
  const mediaMatch = screenshotOutput.match(/MEDIA:([^ \n]+)/);
  if (!mediaMatch) {
    throw new Error('Could not parse media path from browser output');
  }
  const mediaPath = mediaMatch[1].trim();
  console.log(`   ✓ Screenshot: ${mediaPath}`);
  
  // Copy to archive
  const ext = path.extname(mediaPath);
  const filename = `web-${domain}-homepage${ext}`;
  const archivePath = path.join(IMAGES_DIR, filename);
  fs.copyFileSync(mediaPath, archivePath);
  const screenshotFiles = [filename];
  console.log(`   ✓ Saved to archive: ${filename}\n`);
  
} catch (err) {
  console.error('❌ OpenClaw browser tool failed:', err.message);
  process.exit(1);
}

// === Step 2: OCR screenshot ===
console.log('🔍 OCR\'ing screenshot...');

const ocrResults = [];
screenshotFiles.forEach(file => {
  const filepath = path.join(IMAGES_DIR, file);
  const txtPath = filepath.replace(path.extname(file), '.txt');
  
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

// === Step 3: Create learnings ===
console.log('🧠 Creating learnings...');
const combinedText = ocrResults.map(r => r.text).join('\n\n');

// Send to model for synthesis (via ollama)
// Use qwen3.5:cloud (better JSON compliance, no thinking prefix)
const prompt = `Extract 3-5 key learnings from this web content:

${combinedText}

For each learning, output JSON:
{
  "title": "Learning title",
  "summary": "First-person summary",
  "source_url": "${URL}",
  "screenshots": [${screenshotFiles.map(f => `"${f}"`).join(', ')}]
}

CRITICAL: Output ONLY the JSON array. No thinking, no explanation, no markdown. Start with [ and end with ].`;

const promptPath = path.join(ARCHIVE_DIR, 'web-learn-prompt.txt');
fs.writeFileSync(promptPath, prompt);

let learnings;
try {
  console.log('   Sending to model (llama3.2 — better at JSON-only output)...');
  const modelOutput = execSync(`cat "${promptPath}" | ollama run llama3.2`, { encoding: 'utf8', timeout: 90000 });
  fs.unlinkSync(promptPath);
  
  // Parse JSON: find first [ and last ], strip Thinking..., markdown, etc.
  const firstBracket = modelOutput.indexOf('[');
  const lastBracket = modelOutput.lastIndexOf(']');
  if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
    console.error('Raw output:', modelOutput.substring(0, 800));
    throw new Error('No JSON array found in output');
  }
  let jsonStr = modelOutput.substring(firstBracket, lastBracket + 1).trim();
  // Strip markdown code blocks (```json ... ```)
  jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  // Strip any remaining non-JSON prefix (Thinking..., etc.)
  if (!jsonStr.startsWith('[')) {
    const retryFirst = jsonStr.indexOf('[');
    if (retryFirst > -1) {
      jsonStr = jsonStr.substring(retryFirst);
    }
  }
  console.log('   Parsed JSON:', jsonStr.substring(0, 200));
  learnings = JSON.parse(jsonStr);
  
  // Write single consolidated learning document
  const domain = URL.split('/')[2].replace('www.', '').replace(/\./g, '-');
  const filename = `web-learn-${domain}.md`;
  const filepath = path.join(LEARNINGS_DIR, filename);
  
  const content = `# Learnings from ${URL}

**Date:** ${DATE}
**Source:** ${URL}
**Screenshots:** ${screenshotFiles.join(', ')}

---

${learnings.map((l, i) => `## ${l.title}\n\n${l.summary}\n`).join('\n---\n\n')}

## Metadata

- **URL:** ${URL}
- **Domain:** ${domain}
- **Date:** ${DATE}
- **Screenshot files:** ${screenshotFiles.join(', ')}
- **Learning count:** ${learnings.length}
`;
  
  fs.writeFileSync(filepath, content);
  console.log(`   ✓ ${filename} (${learnings.length} learnings consolidated)`);
  
  console.log();
} catch (err) {
  console.error('❌ Model synthesis failed:', err.message);
  if (err.stdout) console.log('Raw output:', err.stdout.substring(0, 500));
  process.exit(1);
}

// === Step 4: Link neurograph ===
console.log('🔗 Linking neurograph...');
try {
  // Read existing nodes
  const nodesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'nodes.json');
  const synapsesPath = path.join(JARVIS_HOME, 'RAW', 'memories', 'synapses.json');
  
  const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
  const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));
  
  // Create single consolidated learning node
  const nodeId = `web-learn-${domain}`;
  nodes.push({
    id: nodeId,
    title: `Learnings from ${URL}`,
    type: 'learning',
    source_url: URL,
    screenshots: screenshotFiles,
    learning_count: learnings.length,
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
  
  // Save
  fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
  fs.writeFileSync(synapsesPath, JSON.stringify(synapses, null, 2));
  
  console.log();
} catch (err) {
  console.error('❌ Neurograph linking failed:', err.message);
}

// === Step 5: Save source metadata ===
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
