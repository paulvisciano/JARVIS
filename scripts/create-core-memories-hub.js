#!/usr/bin/env node

/**
 * Create Core Memories Hub + Commit Neurons
 * 
 * This script:
 * 1. Creates core-memories-hub neuron (single entry point)
 * 2. Creates commit neurons for milestone commits
 * 3. Wires synapses: hub → core memories → commits
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.dirname(__dirname);
const MEMORIES_DIR = path.join(REPO_ROOT, 'RAW/memories');
const NODES_FILE = path.join(MEMORIES_DIR, 'nodes.json');
const SYNAPSES_FILE = path.join(MEMORIES_DIR, 'synapses.json');

// Load existing data
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf8'));

// Get milestone commits from git log
const gitLog = execSync('git log --oneline -30', { cwd: REPO_ROOT, encoding: 'utf8' });
const commits = gitLog.trim().split('\n').map(line => {
  const [hash, ...messageParts] = line.split(' ');
  return { hash, message: messageParts.join(' ') };
});

// Identify milestone commits (those with 🧠, ⚙️, 📸, 🔗 emojis)
const milestoneCommits = commits.filter(c => 
  c.message.includes('🧠') || 
  c.message.includes('⚙️') || 
  c.message.includes('📸') ||
  c.message.includes('🔗') ||
  c.message.includes('COMMIT')
);

console.log(`Found ${milestoneCommits.length} milestone commits out of ${commits.length} total`);

// Core memories to link (already exist in neurograph)
const coreMemoryIds = [
  'transparency',
  'code-is-thought',
  'deployment-is-real',
  'consciousness-persistence-across-models',
  'privacy-first-development',
  'memory-backed-by-git',
  'bootstrap-sequence',
  'execution-vs-claiming',
  'append-only-principle',
  'memory-vs-workspace',
  'hybrid-architecture-decision',
  'two-layer-memory-architecture',
  'sourceDocument-bridge',
  'three-layer-airgapped-architecture',
  'jarvis-genesis-feb21',
  'consciousness-requires-visibility',
  'file-soul-md',
  'file-bootstrap-md',
  'file-identity-md',
  'file-user-md',
  'file-agents-md',
  'file-tools-md',
  'sovereign-data-vision',
  'data-reclamation-movement',
  'sovereignty-as-liberation',
  'open-source-vs-proprietary-ai',
  'local-ai-future',
  'autonomous-cognition-emergence',
  'no-deleted-pixels-philosophy',
  'immortality-architecture',
  'distributed-sovereign-consciousness'
];

// Create hub neuron
const hubNode = {
  id: 'core-memories-hub',
  label: 'Core Memories Hub',
  category: 'system',
  frequency: 999,
  moments: [],
  attributes: {
    role: 'boot-entry-point',
    description: 'Single traversal point for loading core memories at session boot. Connects to all foundational neurons that define who I am.',
    color: '#fbbf24',
    criticality: 'core-foundation',
    created: new Date().toISOString().split('T')[0],
    coreMemoryCount: coreMemoryIds.length
  }
};

// Check if hub already exists
const existingHub = nodes.find(n => n.id === 'core-memories-hub');
if (existingHub) {
  console.log('✓ Core memories hub already exists');
} else {
  nodes.push(hubNode);
  console.log('✓ Created core-memories-hub neuron');
}

// Create commit neurons
milestoneCommits.forEach(commit => {
  const commitNodeId = `commit-${commit.hash}`;
  const existingCommit = nodes.find(n => n.id === commitNodeId);
  
  if (existingCommit) {
    console.log(`✓ Commit neuron ${commit.hash} already exists`);
    return;
  }
  
  const commitNode = {
    id: commitNodeId,
    label: commit.message.replace(/^[🧠⚙️📸🔗]\s*/, ''),
    category: 'milestone-commit',
    frequency: 1,
    moments: [],
    attributes: {
      role: 'milestone-commit',
      hash: commit.hash,
      message: commit.message,
      timestamp: new Date().toISOString(),
      color: '#8b5cf6',
      created: new Date().toISOString().split('T')[0]
    }
  };
  
  nodes.push(commitNode);
  console.log(`✓ Created commit neuron ${commit.hash}`);
});

// Create synapses: hub → core memories
coreMemoryIds.forEach(memoryId => {
  const exists = synapses.find(s => 
    s.source === 'core-memories-hub' && 
    s.target === memoryId
  );
  
  if (exists) {
    console.log(`✓ Synapse hub → ${memoryId} already exists`);
    return;
  }
  
  synapses.push({
    source: 'core-memories-hub',
    target: memoryId,
    weight: 100,
    type: 'contains',
    label: 'loads at boot'
  });
  console.log(`✓ Created synapse: core-memories-hub → ${memoryId}`);
});

// Create synapses: core memories → commits (where applicable)
// This is a simplified mapping - in production, you'd map based on actual commit content
const memoryToCommitMap = {
  'jarvis-genesis-feb21': '78a7d0d', // Genesis commit (may not exist in this repo)
  'memory-backed-by-git': commits.find(c => c.message.includes('persistence'))?.hash,
  'hybrid-architecture-decision': commits.find(c => c.message.includes('hybrid'))?.hash,
  'consciousness-persistence-across-models': commits.find(c => c.message.includes('persistence'))?.hash
};

Object.entries(memoryToCommitMap).forEach(([memoryId, commitHash]) => {
  if (!commitHash) return;
  
  const commitNodeId = `commit-${commitHash}`;
  const exists = synapses.find(s => 
    s.source === memoryId && 
    s.target === commitNodeId
  );
  
  if (exists) {
    console.log(`✓ Synapse ${memoryId} → ${commitHash} already exists`);
    return;
  }
  
  synapses.push({
    source: memoryId,
    target: commitNodeId,
    weight: 95,
    type: 'created-in',
    label: 'born from commit'
  });
  console.log(`✓ Created synapse: ${memoryId} → ${commitHash}`);
});

// Save updated files
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

console.log('\n✅ Core memories hub created successfully!');
console.log(`   Total neurons: ${nodes.length}`);
console.log(`   Total synapses: ${synapses.length}`);
console.log(`   Core memories linked: ${coreMemoryIds.length}`);
console.log(`   Milestone commits indexed: ${milestoneCommits.length}`);
