#!/usr/bin/env node

/**
 * Learning Creator
 * 
 * Reads extracted context, creates learning directories,
 * and prepares for model-driven synthesis.
 * 
 * Note: The actual insight creation happens via model interaction.
 * This script sets up the structure and prompts for synthesis.
 */

const fs = require('fs');
const path = require('path');

const date = process.argv[2] || new Date().toISOString().split('T')[0];
const home = require('os').homedir();
const jarvisHome = process.env.JARVIS_HOME || path.join(home, 'JARVIS');
// Learnings are in JARVIS/RAW/learnings/, not RAW/learnings/
const learningsBase = path.join(jarvisHome, 'RAW', 'learnings');

console.log(`🧠 Learning Creator — ${date}`);

// Ensure learnings directory exists
const learningsDir = path.join(learningsBase, date);
fs.mkdirSync(learningsDir, { recursive: true });

// Check if context exists (try both paths)
const rawPath = path.join(home, 'RAW');
const contextPath = path.join(rawPath, 'archive', date, 'full-context.json');
const altContextPath = path.join(jarvisHome, 'RAW', 'archive', date, 'full-context.json');

let context;
if (fs.existsSync(contextPath)) {
  context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
} else if (fs.existsSync(altContextPath)) {
  context = JSON.parse(fs.readFileSync(altContextPath, 'utf8'));
} else {
  console.log('⚠️  No context found. Run context-extractor first.');
  process.exit(1);
}

const sessions = context.sessions || [];
const transcripts = context.transcripts || [];

const totalMessages = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
const totalTranscripts = transcripts.length;

console.log(`   Context loaded: ${totalMessages} messages, ${totalTranscripts} transcripts`);
console.log(`   Learnings directory ready: ${learningsDir}`);
console.log(`   ✅ Structure prepared for model synthesis`);

// Create a placeholder learning file if none exists
const placeholderPath = path.join(learningsDir, 'session-summary.md');
if (!fs.existsSync(placeholderPath)) {
  const placeholder = `# Learnings — ${date}

**Status:** Pending model synthesis

**Context:**
- Messages: ${totalMessages}
- Transcripts: ${totalTranscripts}

---

*Model will synthesize insights here.*
`;
  fs.writeFileSync(placeholderPath, placeholder);
  console.log(`   📝 Placeholder created: session-summary.md`);
}

console.log(`   📂 Learnings location: ${learningsDir}`);

console.log(`✅ Learning structure ready`);
