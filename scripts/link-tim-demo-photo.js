#!/usr/bin/env node
// Link Tim demo photo to Tim Live Demo learning node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';
const IMAGE_DIR = path.join(process.env.HOME, 'RAW/archive', TODAY, 'images');

console.log('🔗 Linking Tim demo photo...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find Tim Live Demo learning node
const timNode = nodes.find(n => n.id === 'tim-live-demo-march-12');
if (!timNode) {
  console.error('❌ Tim Live Demo node not found');
  process.exit(1);
}

// Find the photo file (use readdir to get exact filename)
const files = fs.readdirSync(IMAGE_DIR);
const photoFile = files.find(f => f.includes('162954') && f.includes('Photo') && f.endsWith('.jpg'));

if (!photoFile) {
  console.error('❌ Photo file not found');
  process.exit(1);
}

console.log(`Found photo: ${photoFile}`);

const fullPath = path.join(IMAGE_DIR, photoFile);
const stats = fs.statSync(fullPath);

// Create file node
const photoNode = {
  id: 'tim-demo-photo',
  label: 'Tim Demo Photo (16:26)',
  category: 'file',
  frequency: 1,
  moments: ['tim-demo', 'spectator', 'validation'],
  attributes: {
    type: 'file',
    fileType: 'image',
    description: 'Photo from Tim demo session',
    created: TODAY,
    filePath: `RAW/archive/${TODAY}/images/${photoFile}`,
    fileSize: stats.size,
    relatedLearning: 'tim-live-demo-march-12'
  }
};

nodes.push(photoNode);
console.log(`✅ Created file node: ${photoNode.label} (image, ${(stats.size/1024).toFixed(0)} KB)`);

// Create synapse: photo → Tim learning node (captured-in)
synapses.push({
  source: photoNode.id,
  target: timNode.id,
  weight: 1,
  type: 'captured-in'
});

console.log('✅ Created 1 synapse (captured-in)');

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
execSync(`git commit -m "🔗 MARCH 12: Linked Tim demo photo"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
