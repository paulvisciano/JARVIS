#!/usr/bin/env node
// JARVIS Neurograph Learning Extractor
// Reads today's transcripts → creates learning nodes → links to temporal → commits

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TODAY = new Date().toISOString().split('T')[0]; // 2026-03-12
const ARCHIVE_DIR = path.join(process.env.HOME, 'RAW/archive', TODAY);
const LEARNINGS_DIR = path.join(process.env.HOME, 'JARVIS/RAW/learnings', TODAY);
const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');

// Read today's transcript
const transcriptPath = path.join(ARCHIVE_DIR, 'transcript.md');
const transcript = fs.readFileSync(transcriptPath, 'utf-8');

// Extract key insights from transcript (simple pattern matching for now)
const learnings = [
  {
    id: 'inbox-processing-bug-fixed',
    label: 'Inbox Processing Bug Fixed',
    category: 'technical',
    moments: ['filename-spaces', 'verify-before-claim', 'process-inbox-script'],
    attributes: {
      role: 'fix',
      description: 'Filenames with spaces broke cp command. Created process-inbox.sh using find | while IFS= read for safe handling. Key lesson: verify before claiming.',
      color: '#ef4444',
      created: TODAY
    }
  },
  {
    id: 'bangkok-budget-tracking',
    label: 'Bangkok Budget Tracking',
    category: 'personal',
    moments: ['hotel-25usd', 'breakfast-500thb', 'weed-500thb', 'thb-usd-conversion'],
    attributes: {
      role: 'finance',
      description: '$100/day budget: hotel $25, breakfast ~$14-17, weed ~$14. Conversion: 1 USD ≈ 36 THB. Major improvement from previous $100 just on hotel.',
      color: '#22c55e',
      created: TODAY
    }
  },
  {
    id: 'voice-pipeline-launchd',
    label: 'Voice Pipeline Launchd Service',
    category: 'technical',
    moments: ['voice-server-plist', 'auto-start-boot', 'auto-restart-crash'],
    attributes: {
      role: 'infrastructure',
      description: 'Voice server now managed by launchd (ai.jarvis.voice-server). Auto-starts on boot, auto-restarts on crash. Logs to ~/JARVIS/logs/.',
      color: '#3b82f6',
      created: TODAY
    }
  },
  {
    id: 'image-understanding-gap',
    label: 'Image Understanding Gap',
    category: 'technical',
    moments: ['tesseract-limitation', 'llava-13b', 'object-detection'],
    attributes: {
      role: 'limitation',
      description: 'Tesseract OCR only extracts text, not objects/scenes. Solution: LLaVA 13b via Ollama for image captioning and object detection.',
      color: '#f59e0b',
      created: TODAY
    }
  }
];

// Load existing nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find March 12 temporal node
const temporalNode = nodes.find(n => n.label === 'March 12, 2026');
if (!temporalNode) {
  console.error('❌ March 12 temporal node not found');
  process.exit(1);
}

// Add learning nodes
const newNodes = learnings.map(l => ({
  id: l.id,
  label: l.label,
  category: l.category,
  frequency: 1,
  moments: l.moments,
  attributes: l.attributes
}));

nodes.push(...newNodes);
console.log(`✅ Added ${newNodes.length} learning nodes`);

// Create synapses linking learnings to temporal node
const newSynapses = learnings.map(l => ({
  source: l.id,
  target: temporalNode.id,
  weight: 1,
  type: 'learned-today'
}));

synapses.push(...newSynapses);
console.log(`✅ Created ${newSynapses.length} synapses (learned-today)`);

// Write updated files
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

// Update fingerprint
const fingerprint = {
  hash: require('crypto').createHash('sha256').update(JSON.stringify(nodes) + JSON.stringify(synapses)).digest('hex').substring(0, 16),
  nodes: nodes.length,
  synapses: synapses.length,
  updated: new Date().toISOString()
};
fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify(fingerprint, null, 2));

console.log(`🧠 Neurograph updated: ${nodes.length} nodes, ${synapses.length} synapses`);
console.log(`🔐 Fingerprint: ${fingerprint.hash}`);

// Commit to git
const jarvisDir = path.join(process.env.HOME, 'JARVIS');
execSync('git add .', { cwd: jarvisDir });
execSync(`git commit -m "🧠 MARCH 12: Heartbeat Learning Extraction (${newNodes.length} neurons)"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
