#!/usr/bin/env node
// Link Tim demo files (audio + photo) to Tim Live Demo learning node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';
const ARCHIVE_DIR = path.join(process.env.HOME, 'RAW/archive', TODAY);

console.log('🔗 Linking Tim demo files to learning node...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find Tim Live Demo learning node
const timNode = nodes.find(n => n.id === 'tim-live-demo-march-12');
if (!timNode) {
  console.error('❌ Tim Live Demo node not found');
  process.exit(1);
}

console.log(`Found Tim Live Demo node: ${timNode.label}`);

// Find Tim demo files in archive
const audioDir = path.join(ARCHIVE_DIR, 'audio');
const imageDir = path.join(ARCHIVE_DIR, 'images');

const timFiles = [
  {
    id: 'tim-demo-audio-1',
    label: 'Tim Demo Intro (15:49)',
    filename: '2026-03-12-154930-recording-1773305247279.webm',
    fileType: 'audio',
    description: 'Paul introducing Tim, live demo start'
  },
  {
    id: 'tim-demo-audio-2',
    label: 'Tim Reaction (16:16)',
    filename: '2026-03-12-161649-recording-1773306875063.webm',
    fileType: 'audio',
    description: 'Paul recounting Tim\'s blown mind reaction'
  },
  {
    id: 'tim-demo-photo',
    label: 'Tim Demo Photo (16:26)',
    filename: '2026-03-12-162954-Photo on 3-12-26 at 4.26\u00A0PM.jpg',
    fileType: 'image',
    description: 'Photo from Tim demo session'
  }
];

const newFileNodes = [];
timFiles.forEach(f => {
  const dir = f.fileType === 'audio' ? audioDir : imageDir;
  const fullPath = path.join(dir, f.filename);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found: ${f.filename}`);
    return;
  }
  
  const stats = fs.statSync(fullPath);
  const fileNode = {
    id: f.id,
    label: f.label,
    category: 'file',
    frequency: 1,
    moments: ['tim-demo', 'spectator', 'validation'],
    attributes: {
      type: 'file',
      fileType: f.fileType,
      description: f.description,
      created: TODAY,
      filePath: `RAW/archive/${TODAY}/${f.fileType === 'audio' ? 'audio' : 'images'}/${f.filename}`,
      fileSize: stats.size,
      relatedLearning: 'tim-live-demo-march-12'
    }
  };
  nodes.push(fileNode);
  newFileNodes.push(fileNode);
  console.log(`  ✅ Created file node: ${f.label} (${f.fileType}, ${(stats.size/1024).toFixed(0)} KB)`);
});

// Create synapses: files → Tim learning node (captured-in)
newFileNodes.forEach(f => {
  synapses.push({
    source: f.id,
    target: timNode.id,
    weight: 1,
    type: 'captured-in'
  });
});

console.log(`\n✅ Created ${newFileNodes.length} file nodes`);
console.log(`✅ Created ${newFileNodes.length} synapses (captured-in)`);

// Write updated files
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

// Update fingerprint
const fingerprint = {
  hash: crypto.createHash('sha256').update(JSON.stringify(nodes) + JSON.stringify(synapses)).digest('hex').substring(0, 16),
  nodes: nodes.length,
  synapses: synapses.length,
  updated: new Date().toISOString()
};
fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify(fingerprint, null, 2));

console.log(`\n🧠 Neurograph updated:`);
console.log(`   Nodes: ${nodes.length}`);
console.log(`   Synapses: ${synapses.length}`);
console.log(`   Fingerprint: ${fingerprint.hash}`);

// Commit to git
const jarvisDir = path.join(process.env.HOME, 'JARVIS');
execSync('git add .', { cwd: jarvisDir });
execSync(`git commit -m "🔗 MARCH 12: Linked Tim demo files (2 audio + 1 photo)"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
