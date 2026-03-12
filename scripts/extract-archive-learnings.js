#!/usr/bin/env node
// JARVIS Archive Learning Extractor - March 12, 2026
// Reads today's archive → creates transcript + learning + file nodes → links to temporal → commits

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const TODAY = '2026-03-12';
const ARCHIVE_DIR = path.join(process.env.HOME, 'RAW/archive', TODAY);
const TRANSCRIPT_PATH = path.join(ARCHIVE_DIR, 'transcript.md');
const AUDIO_DIR = path.join(ARCHIVE_DIR, 'audio');
const IMAGE_DIR = path.join(ARCHIVE_DIR, 'images');
const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');

console.log('🧠 Extracting learnings from March 12 archive...');

// Read transcript
const transcript = fs.readFileSync(TRANSCRIPT_PATH, 'utf-8');

// Extract key learnings from transcript
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
      created: TODAY,
      sourceDocument: `RAW/archive/${TODAY}/transcript.md`
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
      created: TODAY,
      sourceDocument: `RAW/archive/${TODAY}/transcript.md`
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
      created: TODAY,
      sourceDocument: `RAW/archive/${TODAY}/transcript.md`
    }
  },
  {
    id: 'desktop-screenshot-auto-archive',
    label: 'Desktop Screenshot Auto-Archive',
    category: 'technical',
    moments: ['mac-screenshots', 'inbox-polling', 'ocr-pipeline'],
    attributes: {
      role: 'automation',
      description: 'Mac screenshots auto-saved to Desktop → pulled to inbox on heartbeat → archived + OCRd. 29 screenshots processed March 12.',
      color: '#f59e0b',
      created: TODAY,
      sourceDocument: `RAW/archive/${TODAY}/transcript.md`
    }
  },
  {
    id: 'neurograph-cleanup-march-12',
    label: 'Neurograph Cleanup March 12',
    category: 'technical',
    moments: ['circular-symlink', 'timeline-json-archive', 'duplicate-nodes'],
    attributes: {
      role: 'maintenance',
      description: 'Removed circular symlink from memories folder. Archived timeline.json (git is canonical). Fixed duplicate learning nodes. Neurograph: 1210 nodes, 2239 synapses.',
      color: '#8b5cf6',
      created: TODAY,
      sourceDocument: `RAW/archive/${TODAY}/transcript.md`
    }
  }
];

// Load existing nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find March 12 temporal node
let temporalNode = nodes.find(n => n.label === 'March 12, 2026');
if (!temporalNode) {
  // Create temporal node if missing
  temporalNode = {
    id: 'march-12-2026',
    label: 'March 12, 2026',
    category: 'temporal',
    frequency: 1,
    moments: [],
    attributes: {
      role: 'temporal',
      description: 'Daily anchor for March 12, 2026 learnings and files',
      color: '#fbbf24',
      created: TODAY
    }
  };
  nodes.push(temporalNode);
  console.log('✅ Created March 12 temporal node');
}

// Create transcript node (most important - source of all learnings)
const transcriptNode = {
  id: `transcript-${TODAY}`,
  label: `Transcript ${TODAY}`,
  category: 'archive',
  frequency: 1,
  moments: ['conversation', 'dialogue', 'learnings-source'],
  attributes: {
    role: 'transcript',
    description: `Primary conversation record for ${TODAY}. Source of all learning extraction.`,
    color: '#ec4899',
    created: TODAY,
    filePath: `RAW/archive/${TODAY}/transcript.md`,
    fileSize: fs.statSync(TRANSCRIPT_PATH).size
  }
};
nodes.push(transcriptNode);
console.log('✅ Created transcript node');

// Add learning nodes (check for duplicates first)
const newNodes = [];
learnings.forEach(l => {
  const existing = nodes.find(n => n.id === l.id);
  if (!existing) {
    const node = {
      id: l.id,
      label: l.label,
      category: l.category,
      frequency: 1,
      moments: l.moments,
      attributes: l.attributes
    };
    nodes.push(node);
    newNodes.push(node);
  }
});
console.log(`✅ Added ${newNodes.length} new learning nodes`);

// Create file nodes for audio files
const audioFiles = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.webm'));
const fileNodes = [];
audioFiles.forEach((file, idx) => {
  const stats = fs.statSync(path.join(AUDIO_DIR, file));
  const fileNode = {
    id: `audio-${TODAY}-${idx}`,
    label: file.replace('.webm', ''),
    category: 'archive',
    frequency: 1,
    moments: ['voice', 'audio', 'transcribed'],
    attributes: {
      role: 'file',
      description: `Audio recording from ${TODAY}`,
      color: '#06b6d4',
      created: TODAY,
      filePath: `RAW/archive/${TODAY}/audio/${file}`,
      fileSize: stats.size,
      fileType: 'audio'
    }
  };
  nodes.push(fileNode);
  fileNodes.push(fileNode);
});
console.log(`✅ Created ${fileNodes.length} audio file nodes`);

// Create file nodes for images
const imageFiles = fs.readdirSync(IMAGE_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
imageFiles.forEach((file, idx) => {
  const stats = fs.statSync(path.join(IMAGE_DIR, file));
  const fileNode = {
    id: `image-${TODAY}-${idx}`,
    label: file.replace(/\.(png|jpg)/i, ''),
    category: 'archive',
    frequency: 1,
    moments: ['screenshot', 'photo', 'visual'],
    attributes: {
      role: 'file',
      description: `Image from ${TODAY}`,
      color: '#10b981',
      created: TODAY,
      filePath: `RAW/archive/${TODAY}/images/${file}`,
      fileSize: stats.size,
      fileType: 'image'
    }
  };
  nodes.push(fileNode);
  fileNodes.push(fileNode);
});
console.log(`✅ Created ${imageFiles.length} image file nodes`);

// Create synapses: temporal → transcript
const transcriptSynapse = {
  source: transcriptNode.id,
  target: temporalNode.id,
  weight: 2,
  type: 'recorded-today'
};
synapses.push(transcriptSynapse);

// Create synapses: transcript → learnings
newNodes.forEach(l => {
  synapses.push({
    source: l.id,
    target: transcriptNode.id,
    weight: 1,
    type: 'extracted-from'
  });
});

// Create synapses: learnings → temporal
newNodes.forEach(l => {
  synapses.push({
    source: l.id,
    target: temporalNode.id,
    weight: 1,
    type: 'learned-today'
  });
});

// Create synapses: files → transcript
fileNodes.forEach(f => {
  synapses.push({
    source: f.id,
    target: transcriptNode.id,
    weight: 1,
    type: 'archived-in'
  });
});

console.log(`✅ Created ${synapses.length - 3} new synapses`);

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
execSync(`git commit -m "🧠 MARCH 12: Archive Learning Extraction (${newNodes.length + 1} neurons, ${fileNodes.length} files)"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
