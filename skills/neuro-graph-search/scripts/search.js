#!/usr/bin/env node
/**
 * NeuroGraph Search — Query nodes.json + synapses.json
 * Usage: node skills/neuro-graph-search/scripts/search.js [query]
 */

const fs = require('fs');
const path = require('path');

const query = process.argv[2] || '';
const neurographPath = process.env.NEUROGRAPH_PATH || path.join(process.env.HOME, 'JARVIS', 'RAW', 'memories');
const nodesFile = path.join(neurographPath, 'nodes.json');
const synapsesFile = path.join(neurographPath, 'synapses.json');

if (!fs.existsSync(nodesFile)) {
  console.error(`❌ nodes.json not found at ${nodesFile}`);
  process.exit(1);
}

const nodes = JSON.parse(fs.readFileSync(nodesFile, 'utf8'));
const synapses = fs.existsSync(synapsesFile) ? JSON.parse(fs.readFileSync(synapsesFile, 'utf8')) : [];

console.log(`🧠 NeuroGraph Search — "${query}"`);
console.log(`   Source: ${neurographPath}`);
console.log(`   Nodes: ${nodes.length}`);
console.log(`   Synapses: ${synapses.length}`);
console.log();

if (!query) {
  // No query — show graph summary
  const categories = {};
  nodes.forEach(n => {
    const cat = n.category || 'uncategorized';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  
  console.log('📊 Category breakdown:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
  console.log();
  
  // Show 3 random questions only Jarvis would know
  const people = nodes.filter(n => n.category === 'person');
  const temporal = nodes.filter(n => n.category === 'temporal');
  const learnings = nodes.filter(n => n.category === 'learning');
  
  console.log('🧠 3 questions only Jarvis would know:');
  console.log(`   ❓ "How many people?" → ${people.length} people nodes`);
  const march20 = nodes.filter(n => n.label && n.label.includes('2026-03-20'));
  console.log(`   ❓ "March 20 work?" → ${march20.length} nodes from March 20, 2026`);
  const lastLearning = learnings.sort((a, b) => b.createdAt - a.createdAt)[0];
  console.log(`   ❓ "Last topic?" → "${lastLearning ? lastLearning.label : 'none'}"`);
  console.log();
  process.exit(0);
}

// Search query
const queryLower = query.toLowerCase();
const results = nodes.filter(n => 
  n.id.toLowerCase().includes(queryLower) ||
  (n.label && n.label.toLowerCase().includes(queryLower)) ||
  (n.attributes && n.attributes.description && n.attributes.description.toLowerCase().includes(queryLower))
);

if (results.length === 0) {
  console.log(`   No nodes found for "${query}"`);
  process.exit(0);
}

console.log(`✅ Found ${results.length} nodes:`);
console.log();

results.forEach(r => {
  console.log(`   ${r.id}: ${r.label || 'no label'}`);
  console.log(`      Category: ${r.category || 'N/A'}`);
  console.log(`      Type: ${r.type || 'N/A'}`);
  if (r.attributes && r.attributes.description) {
    console.log(`      Description: ${r.attributes.description.slice(0, 200)}`);
  }
  if (r.attributes && r.attributes.frequency) {
    console.log(`      Frequency: ${r.attributes.frequency}`);
  }
  
  // Show connections
  const connected = synapses.filter(s => 
    s.source === r.id || s.target === r.id
  );
  if (connected.length > 0) {
    console.log(`      Connections: ${connected.length} synapses`);
    connected.slice(0, 5).forEach(s => {
      const otherId = s.source === r.id ? s.target : s.source;
      const otherNode = nodes.find(n => n.id === otherId);
      console.log(`        → ${otherId}: ${otherNode ? otherNode.label : 'unknown'} (${s.type || 'link'})`);
    });
  }
  console.log();
});
