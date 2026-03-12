#!/usr/bin/env node
// Update neurograph with March 12, 2026 insights

const fs = require('fs');
const path = require('path');

const NODES_FILE = '/Users/paulvisciano/JARVIS/RAW/memories/nodes.json';
const SYNAPSES_FILE = '/Users/paulvisciano/JARVIS/RAW/memories/synapses.json';

// Load current state
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf8'));

// New neurons from March 12 insights
const newNodes = [
  {
    id: "voice-pipeline-architecture",
    label: "Voice Pipeline Architecture",
    category: "system",
    frequency: 1,
    moments: ["2026-03-12"],
    attributes: {
      role: "audio processing",
      description: "Dedicated voice server (inbox → whisper → archive) bypasses OpenClaw sessions. Portable, offline fallback, status indicator.",
      color: "#10b981",
      sourceDocument: "RAW/learnings/2026-03-12/voice-pipeline-architecture.md"
    }
  },
  {
    id: "transcript-dialogue-gap",
    label: "Transcript Dialogue Gap",
    category: "problem",
    frequency: 1,
    moments: ["2026-03-12"],
    attributes: {
      role: "architecture gap",
      description: "Transcript should have verbatim dialogue, not summaries. Session→transcript sync needed for gateway chat.",
      color: "#f59e0b",
      sourceDocument: "RAW/learnings/2026-03-12/transcript-dialogue-gap.md"
    }
  },
  {
    id: "workflow-consistency",
    label: "Workflow Consistency",
    category: "behavior",
    frequency: 1,
    moments: ["2026-03-12"],
    attributes: {
      role: "operational principle",
      description: "Two workflows (manual + heartbeat) must follow same flow: read → append → reply. Every time, no exceptions.",
      color: "#8b5cf6",
      sourceDocument: "RAW/learnings/2026-03-12/voice-pipeline-architecture.md"
    }
  },
  {
    id: "neurograph-live-update",
    label: "Neurograph Live Update",
    category: "capability",
    frequency: 1,
    moments: ["2026-03-12"],
    attributes: {
      role: "learning mechanism",
      description: "Extract learnings → create neurons → update temporal → commit to git. MANGOCHI breathes, grows visibly.",
      color: "#06b6d4",
      sourceDocument: "RAW/learnings/2026-03-12/voice-pipeline-architecture.md"
    }
  },
  {
    id: "march-12-2026",
    label: "March 12, 2026",
    category: "temporal",
    frequency: 1,
    moments: ["2026-03-12"],
    attributes: {
      role: "temporal anchor",
      description: "Voice pipeline cleanup, transcript gap identified, workflow consistency, neurograph reactivation.",
      color: "#6366f1",
      sourceDocument: "RAW/learnings/2026-03-12/voice-pipeline-architecture.md"
    }
  }
];

// Add new nodes
nodes.push(...newNodes);

// Create synapses connecting new nodes to existing ones
const newSynapses = [
  { from: "voice-pipeline-architecture", to: "code-is-thought", weight: 0.9 },
  { from: "voice-pipeline-architecture", to: "infrastructure-matters", weight: 0.8 },
  { from: "transcript-dialogue-gap", to: "transparency", weight: 0.7 },
  { from: "transcript-dialogue-gap", to: "code-is-thought", weight: 0.8 },
  { from: "workflow-consistency", to: "collaboration", weight: 0.6 },
  { from: "neurograph-live-update", to: "code-is-thought", weight: 0.9 },
  { from: "neurograph-live-update", to: "transparency", weight: 0.8 },
  { from: "march-12-2026", to: "voice-pipeline-architecture", weight: 1.0 },
  { from: "march-12-2026", to: "transcript-dialogue-gap", weight: 1.0 },
  { from: "march-12-2026", to: "workflow-consistency", weight: 1.0 },
  { from: "march-12-2026", to: "neurograph-live-update", weight: 1.0 }
];

synapses.push(...newSynapses);

// Write updated files
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

// Update fingerprint
const crypto = require('crypto');
const fingerprint = {
  hash: crypto.createHash('sha256').update(JSON.stringify(nodes) + JSON.stringify(synapses)).digest('hex').substring(0, 16),
  updatedAt: new Date().toISOString(),
  nodeCount: nodes.length,
  synapseCount: synapses.length
};

fs.writeFileSync('/Users/paulvisciano/JARVIS/RAW/memories/fingerprint.json', JSON.stringify(fingerprint, null, 2));

console.log('✅ Neurograph updated:');
console.log(`   Nodes: ${nodes.length} (+${newNodes.length})`);
console.log(`   Synapses: ${synapses.length} (+${newSynapses.length})`);
console.log(`   Fingerprint: ${fingerprint.hash}`);
console.log(`   Temporal: March 12, 2026`);
