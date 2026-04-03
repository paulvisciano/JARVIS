#!/usr/bin/env node

/**
 * Link production failure learnings to neurograph
 * Adds nodes + synapses for:
 * - production-failure-session-bloat
 * - session-rotation-hardening
 * - fallback-model-chain
 */

const fs = require('fs');
const path = require('path');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS', 'RAW', 'memories', 'nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS', 'RAW', 'memories', 'synapses.json');
const TEMPORAL_ID = 'temporal-20260324';

// Load graph
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf8'));

// Create nodes
const newNodes = [
  {
    id: 'production-failure-session-bloat',
    label: 'Production Failure: Session Bloat',
    category: 'failure',
    type: 'post-mortem',
    frequency: 100,
    moments: [{ date: '2026-03-24', type: 'failure', description: '10 MB session → stale lock → timeout cascade → 7 min silence' }],
    attributes: {
      role: 'production reality',
      description: 'Sessions can grow unbounded, leading to stale locks, timeouts, and radio silence. Recovery: breath pipeline + gateway reset.',
      color: '#ef4444',
      rootCause: 'No size-based rotation, stale lock cleanup, or fallback model',
      recovery: 'Breath independent of sessions, gateway reset clean, full context recovered',
      lesson: 'Need aggressive rotation, fallback chain, observability',
      created: '2026-03-24'
    }
  },
  {
    id: 'session-rotation-hardening',
    label: 'Session Rotation Hardening',
    category: 'solution',
    type: 'pattern',
    frequency: 100,
    moments: [{ date: '2026-03-24', type: 'solution', description: 'Size-based (5 MB) + time-based (2 hours) + lock cleanup (10 mins)' }],
    attributes: {
      role: 'prevention pattern',
      description: 'Aggressive rotation prevents bloat-induced failures. Hourly checks, size triggers, lock cleanup.',
      color: '#10b981',
      maxSizeMB: 5,
      inactiveThresholdHours: 2,
      lockAgeThresholdMinutes: 10,
      checkIntervalHours: 1,
      created: '2026-03-24'
    }
  },
  {
    id: 'fallback-model-chain',
    label: 'Fallback Model Chain',
    category: 'solution',
    type: 'pattern',
    frequency: 100,
    moments: [{ date: '2026-03-24', type: 'solution', description: 'qwen3.5:cloud → qwen2.5-coder:7b → llama3.2:3b' }],
    attributes: {
      role: 'resilience pattern',
      description: 'Model chain with graceful degradation prevents silence on primary failure.',
      color: '#3b82f6',
      primary: 'qwen3.5:cloud (best quality)',
      fallback1: 'qwen2.5-coder:7b (local, fast)',
      fallback2: 'llama3.2:3b (minimal, emergency)',
      created: '2026-03-24'
    }
  }
];

// Add nodes
nodes.push(...newNodes);

// Create synapses to temporal anchor
const newSynapses = newNodes.map(node => ({
  source: node.id,
  target: TEMPORAL_ID,
  type: 'temporal',
  weight: 1.0,
  created: '2026-03-24'
}));

// Cross-link solutions to failure
newSynapses.push(
  { source: 'session-rotation-hardening', target: 'production-failure-session-bloat', type: 'solves', weight: 1.0, created: '2026-03-24' },
  { source: 'fallback-model-chain', target: 'production-failure-session-bloat', type: 'solves', weight: 1.0, created: '2026-03-24' }
);

synapses.push(...newSynapses);

// Write
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

console.log('✅ NeuroGraph linked:');
console.log(`   - Added 3 nodes: production-failure-session-bloat, session-rotation-hardening, fallback-model-chain`);
console.log(`   - Added ${newSynapses.length} synapses (temporal + cross-links)`);
console.log(`   - Total: ${nodes.length} nodes, ${synapses.length} synapses`);
