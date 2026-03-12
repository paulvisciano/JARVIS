#!/usr/bin/env node
// JARVIS Node Type Fix - March 12, 2026
// Fixes: learning type, transcript type, file type, removes duplicates

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');

console.log('🔧 Fixing node types...');

// Load nodes
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Fix learning nodes
const learningNodes = nodes.filter(n => 
  n.attributes?.role === 'fix' || 
  n.attributes?.role === 'finance' || 
  n.attributes?.role === 'infrastructure' ||
  n.attributes?.role === 'automation' ||
  n.attributes?.role === 'maintenance'
);

learningNodes.forEach(n => {
  n.category = 'learning';
  n.attributes.type = n.attributes.role === 'finance' ? 'personal' : 'technical';
  delete n.attributes.role; // role is now type
  console.log(`✅ Fixed learning: ${n.label} (type: ${n.attributes.type})`);
});

// Fix transcript node
const transcriptNode = nodes.find(n => n.attributes?.role === 'transcript');
if (transcriptNode) {
  transcriptNode.category = 'transcript';
  transcriptNode.attributes.type = 'transcript';
  delete transcriptNode.attributes.role;
  console.log(`✅ Fixed transcript: ${transcriptNode.label}`);
}

// Fix file nodes - change archive → file
const fileNodes = nodes.filter(n => 
  (n.attributes?.role === 'file' || n.category === 'archive') &&
  (n.attributes?.fileType === 'audio' || n.attributes?.fileType === 'image')
);

fileNodes.forEach(n => {
  n.category = 'file';
  n.attributes.type = 'file';
  delete n.attributes.role;
});
console.log(`✅ Fixed ${fileNodes.length} file nodes (archive → file)`);

// Remove duplicate file nodes (from earlier runs)
const seenFileIds = new Set();
const nodesToRemove = [];
nodes.forEach((n, idx) => {
  if (n.category === 'file' && n.attributes?.fileType) {
    const key = `${n.attributes.filePath}`;
    if (seenFileIds.has(key)) {
      nodesToRemove.push(idx);
    } else {
      seenFileIds.add(key);
    }
  }
});

// Remove duplicates in reverse order to maintain indices
for (let i = nodesToRemove.length - 1; i >= 0; i--) {
  nodes.splice(nodesToRemove[i], 1);
}
console.log(`✅ Removed ${nodesToRemove.length} duplicate file nodes`);

// Remove synapses pointing to removed nodes
const removedIds = nodesToRemove.map(idx => nodes[idx]?.id).filter(id => id);
const synapsesBefore = synapses.length;
for (let i = synapses.length - 1; i >= 0; i--) {
  if (removedIds.includes(synapses[i].source) || removedIds.includes(synapses[i].target)) {
    synapses.splice(i, 1);
  }
}
console.log(`✅ Removed ${synapsesBefore - synapses.length} orphaned synapses`);

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

console.log(`\n🧠 Neurograph fixed:`);
console.log(`   Nodes: ${nodes.length}`);
console.log(`   Synapses: ${synapses.length}`);
console.log(`   Fingerprint: ${fingerprint.hash}`);

// Commit to git
const jarvisDir = path.join(process.env.HOME, 'JARVIS');
execSync('git add .', { cwd: jarvisDir });
execSync(`git commit -m "🔧 MARCH 12: Fixed Node Types (learning/transcript/file)"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
