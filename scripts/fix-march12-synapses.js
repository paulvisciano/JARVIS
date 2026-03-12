#!/usr/bin/env node
// Fix synapses for March 12: proper learning → transcript → temporal connections

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';

console.log('🔗 Fixing March 12 synapses...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find key nodes
const temporalNode = nodes.find(n => n.label === 'March 12, 2026');
const transcriptNode = nodes.find(n => n.id === `transcript-${TODAY}`);
const learningNodes = nodes.filter(n => 
  n.attributes?.created === TODAY && 
  n.attributes?.subtype && 
  n.category === 'learning'
);

if (!temporalNode || !transcriptNode) {
  console.error('❌ Missing temporal or transcript node');
  process.exit(1);
}

console.log(`Found ${learningNodes.length} learning nodes`);

// Remove existing synapses for these nodes (we'll recreate them properly)
const learningIds = learningNodes.map(n => n.id);
const transcriptId = transcriptNode.id;
const temporalId = temporalNode.id;

let removed = 0;
for (let i = synapses.length - 1; i >= 0; i--) {
  const s = synapses[i];
  if ((learningIds.includes(s.source) || learningIds.includes(s.target) ||
       s.source === transcriptId || s.target === transcriptId) &&
      s.type !== 'recorded-today') {
    synapses.splice(i, 1);
    removed++;
  }
}

console.log(`Removed ${removed} old synapses`);

// Create proper synapses
// 1. All learnings → transcript (extracted-from)
learningNodes.forEach(l => {
  synapses.push({
    source: l.id,
    target: transcriptId,
    weight: 1,
    type: 'extracted-from'
  });
});

// 2. All learnings → temporal (learned-today)
learningNodes.forEach(l => {
  synapses.push({
    source: l.id,
    target: temporalId,
    weight: 1,
    type: 'learned-today'
  });
});

// 3. Transcript → temporal (recorded-today) - should already exist
const hasTranscriptTemporal = synapses.some(s => 
  s.source === transcriptId && s.target === temporalId && s.type === 'recorded-today'
);
if (!hasTranscriptTemporal) {
  synapses.push({
    source: transcriptId,
    target: temporalId,
    weight: 2,
    type: 'recorded-today'
  });
}

console.log(`Created ${learningNodes.length * 2 + 1} synapses`);

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
execSync(`git commit -m "🔗 MARCH 12: Fixed learning synapses (extracted-from + learned-today)"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
