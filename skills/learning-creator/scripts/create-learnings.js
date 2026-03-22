#!/usr/bin/env node

/**
 * Learning Creator
 * 
 * Reads extracted context, synthesizes insights via model through OpenClaw Gateway,
 * creates individual learning .md files with descriptive names.
 * 
 * Model-driven: I read, synthesize, create — automation feeds clean text.
 * Uses OpenClaw Gateway for model calls (works with any provider: Ollama, Claude, etc.)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const date = process.argv[2] || new Date().toISOString().split('T')[0];
const home = require('os').homedir();
const jarvisHome = process.env.JARVIS_HOME || path.join(home, 'JARVIS');
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
const ocrTexts = context.ocrTexts || [];

const totalMessages = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
const totalTranscripts = transcripts.length;
const totalOCR = ocrTexts.length;

console.log(`   Context loaded: ${totalMessages} messages, ${totalTranscripts} transcripts, ${totalOCR} OCR`);
console.log(`   Learnings directory: ${learningsDir}`);

// Build context text for model synthesis
let contextText = `# Context for ${date}\n\n`;
contextText += `## Sessions (${totalMessages} messages)\n`;
sessions.forEach((s, i) => {
  if (s.messages) {
    s.messages.forEach((m, j) => {
      if (m.role === 'user' || m.role === 'assistant') {
        const text = Array.isArray(m.content) 
          ? m.content.filter(c => c.type === 'text').map(c => c.text).join('\n')
          : m.content;
        if (text && text.trim().length > 0) {
          contextText += `\n[${m.role}] ${text.substring(0, 500)}\n`;
        }
      }
    });
  }
});

contextText += `\n## Audio Transcripts (${totalTranscripts} files)\n`;
transcripts.forEach((t, i) => {
  if (t.text && t.text.trim().length > 0) {
    contextText += `\n[${t.file || 'transcript-' + i}] ${t.text.substring(0, 500)}\n`;
  }
});

contextText += `\n## OCR Text (${totalOCR} images)\n`;
ocrTexts.forEach((o, i) => {
  if (o.text && o.text.trim().length > 0) {
    contextText += `\n[${o.file || 'ocr-' + i}] ${o.text.substring(0, 500)}\n`;
  }
});

// Build the prompt for learning extraction
const prompt = `You are extracting learnings from conversations on ${date}. 
Read the context below and create individual learning files with descriptive names.

For each distinct insight/decision/realization/pattern:
1. Create a descriptive filename (e.g., "breathe-pipeline-complete.md", not "session-summary.md")
2. Write a learning .md file with:
   - Title (descriptive)
   - Date in frontmatter
   - Type (decision/realization/commitment/pattern/insight)
   - Status (extracted)
   - Clear content explaining the learning

Create 3-10 individual learning files based on the actual insights in the context.
DO NOT create a generic "session-summary.md" file.

Output ONLY valid JSON array, no other text. Format:
[
  {
    "filename": "descriptive-name.md",
    "type": "decision|realization|commitment|pattern|insight",
    "title": "Title Here",
    "content": "# Title\\n\\n**Date:** ${date}\\n**Type:** [type]\\n**Status:** extracted\\n\\n[Content...]"
  }
]

---

${contextText}
`;

// Write prompt to temp file for OpenClaw to read
const promptPath = path.join(jarvisHome, 'tmp-learning-prompt.txt');
fs.writeFileSync(promptPath, prompt, 'utf8');

console.log(`   🧠 Sending to OpenClaw Gateway for model synthesis...`);

try {
  // Use Ollama directly with --format json for structured output
  // This is the most reliable approach for batch learning extraction
  // The prompt is piped to ollama run which returns JSON array of learnings
  const ollamaCmd = `cat ${promptPath} | ollama run qwen3.5:cloud --format json`;
  
  console.log('   📤 Running via Ollama (JSON format)...');
  console.log('   Model: qwen3.5:cloud (configured in OpenClaw models.json)');
  
  const modelOutput = execSync(ollamaCmd, {
    cwd: jarvisHome,
    encoding: 'utf8',
    timeout: 300000, // 5 minute timeout
    maxBuffer: 10 * 1024 * 1024 // 10MB buffer
  });

  // Clean up temp file
  fs.unlinkSync(promptPath);

  // Parse model output and create learning files
  // Expected JSON format from model:
  // [{"filename": "name.md", "type": "decision", "title": "...", "content": "..."}]
  
  let learnings = [];
  let learningCount = 0;
  
  try {
    // Extract JSON from output (skip "Thinking..." prefix)
    const jsonStart = modelOutput.indexOf('[');
    const jsonEnd = modelOutput.lastIndexOf(']');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = modelOutput.substring(jsonStart, jsonEnd + 1);
      learnings = JSON.parse(jsonStr);
    }
  } catch (err) {
    console.error(`   ⚠️  JSON parse failed: ${err.message}`);
    console.log(`   Raw output preview: ${modelOutput.substring(0, 800)}...`);
  }

  if (Array.isArray(learnings)) {
    learnings.forEach(learning => {
      const safeFilename = path.basename(learning.filename);
      const learningPath = path.join(learningsDir, safeFilename);
      fs.writeFileSync(learningPath, learning.content);
      learningCount++;
      console.log(`   ✅ Created: ${safeFilename}`);
    });
  }

  if (learningCount === 0) {
    console.log(`   ⚠️  No learnings extracted from model output`);
    // Fallback: create a minimal learning from context summary
    const fallbackPath = path.join(learningsDir, 'session-summary.md');
    const fallbackContent = `# Session Summary — ${date}

**Date:** ${date}
**Type:** insight
**Status:** extracted

**Summary:**
- Messages: ${totalMessages}
- Transcripts: ${totalTranscripts}
- OCR: ${totalOCR}

*Note: Model synthesis failed to extract individual learnings. Review full context manually.*
`;
    fs.writeFileSync(fallbackPath, fallbackContent);
    console.log(`   📝 Created fallback: session-summary.md`);
  } else {
    console.log(`   📊 ${learningCount} learnings created`);
  }

  console.log(`✅ Learnings synthesized from context via OpenClaw Gateway`);

} catch (error) {
  console.error(`   ❌ Gateway message failed: ${error.message}`);
  console.log(`   ⚠️  Creating fallback learning (context preserved)`);
  
  // Clean up temp file on error
  if (fs.existsSync(promptPath)) {
    fs.unlinkSync(promptPath);
  }
  
  // Create fallback on error
  const fallbackPath = path.join(learningsDir, 'session-summary.md');
  const fallbackContent = `# Session Summary — ${date}

**Date:** ${date}
**Type:** insight
**Status:** extracted

**Context:**
- Messages: ${totalMessages}
- Transcripts: ${totalTranscripts}
- OCR: ${totalOCR}

*Note: Learning extraction via Gateway failed. Review full context manually.*
`;
  fs.writeFileSync(fallbackPath, fallbackContent);
  console.log(`   📝 Fallback created: session-summary.md`);
}
