#!/usr/bin/env node

/**
 * NeuroGraph Sync (Digest Graph)
 * 
 * Reads learnings from RAW/learnings/YYYY-MM-DD/
 * Creates/updates NeuroGraph nodes + synapses
 * Links: Person → Learning → Temporal → Files
 * 
 * Usage: node sync-graph.js [date]
 * Default: today
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const date = process.argv[2] || new Date().toISOString().split('T')[0];
// Use environment variables with fallbacks for portability
const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const rawPath = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW');

const memoriesDir = path.join(JARVIS_HOME, 'RAW', 'memories');
const nodesFile = path.join(memoriesDir, 'nodes.json');
const synapsesFile = path.join(memoriesDir, 'synapses.json');
const learningsDir = path.join(JARVIS_HOME, 'RAW', 'learnings', date);

console.log(`🧠 NeuroGraph Sync — ${date}`);

// Check if learnings exist
if (!fs.existsSync(learningsDir)) {
  console.log(`ℹ️  No learnings found for ${date}`);
  console.log('✅ Graph synced (no new learnings)');
  process.exit(0);
}

const learnings = fs.readdirSync(learningsDir).filter(f => f.endsWith('.md'));
console.log(`📚 Found ${learnings.length} learnings`);

// Load nodes + synapses
let nodes = [];
let synapses = [];

if (fs.existsSync(nodesFile)) {
  nodes = JSON.parse(fs.readFileSync(nodesFile, 'utf8'));
}

if (fs.existsSync(synapsesFile)) {
  synapses = JSON.parse(fs.readFileSync(synapsesFile, 'utf8'));
}

console.log(`🧠 Current graph: ${nodes.length} nodes, ${synapses.length} synapses`);

// Create temporal node for this date
const temporalId = `temporal-${date.replace(/-/g, '')}`;
const temporalNode = {
  id: temporalId,
  label: date,
  category: 'temporal',
  type: 'anchor',
  frequency: 1,
  moments: [{
    date,
    type: 'day-anchor',
    description: `Daily anchor for ${date}`
  }],
  attributes: {
    role: 'temporal anchor',
    description: `All learnings, files, conversations from ${date}`,
    color: '#3b82f6',
    created: new Date().toISOString()
  }
};

// Check if temporal node exists
const existingTemporal = nodes.find(n => n.id === temporalId);
if (!existingTemporal) {
  nodes.push(temporalNode);
  console.log(`✅ Created temporal node: ${temporalId}`);
}

// Process each learning
learnings.forEach(learningFile => {
  const learningPath = path.join(learningsDir, learningFile);
  const content = fs.readFileSync(learningPath, 'utf8');
  
  // Extract learning ID from filename
  const learningId = learningFile.replace('.md', '');
  
  // Create learning node
  const learningNode = {
    id: learningId,
    label: learningId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category: 'learning',
    type: 'insight',
    frequency: 1,
    moments: [{
      date,
      type: 'learning',
      description: `Learning extracted from ${date} context`
    }],
    attributes: {
      role: 'distilled insight',
      description: content.split('\n')[0]?.replace('#', '').trim() || 'Learning from ' + date,
      color: '#10b981',
      sourceDocument: `~/JARVIS/RAW/learnings/${date}/${learningFile}`,
      created: new Date().toISOString()
    }
  };
  
  // Check if learning node exists
  const existingLearning = nodes.find(n => n.id === learningId);
  if (!existingLearning) {
    nodes.push(learningNode);
    console.log(`✅ Created learning node: ${learningId}`);
  }
  
  // Create synapse: Learning → Temporal
  const learningToTemporal = {
    source: learningId,
    target: temporalId,
    weight: 100,
    type: 'fired-on',
    label: date
  };
  
  if (!synapses.find(s => 
    s.source === learningId && 
    s.target === temporalId && 
    s.type === 'fired-on'
  )) {
    synapses.push(learningToTemporal);
    console.log(`🔗 Linked ${learningId} → ${temporalId}`);
  }
});

// Save nodes
fs.writeFileSync(nodesFile, JSON.stringify(nodes, null, 2));
console.log(`💾 Saved ${nodes.length} nodes`);

// Save synapses
fs.writeFileSync(synapsesFile, JSON.stringify(synapses, null, 2));
console.log(`💾 Saved ${synapses.length} synapses`);

console.log(`✅ NeuroGraph synced for ${date}`);
console.log(`   New nodes: ${nodes.length}`);
console.log(`   New synapses: ${synapses.length}`);
