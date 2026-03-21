#!/usr/bin/env node

/**
 * Learning Creator
 * 
 * Reads extracted context, synthesizes insights via model,
 * creates individual learning .md files with descriptive names.
 * 
 * Model-driven: I read, synthesize, create — automation feeds clean text.
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

// Call model to synthesize learnings
console.log(`   🧠 Synthesizing insights via model...`);

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

try {
  // Call Ollama directly (standalone, portable, no OpenClaw session dependency)
  // This approach works independently of session state
  const promptPath = path.join(jarvisHome, 'tmp-prompt.txt');
  fs.writeFileSync(promptPath, prompt, 'utf8');

  const ollamaCmd = `cat ${promptPath} | ollama run qwen3.5:cloud`;
  
  console.log('   🧠 Synthesizing via Ollama (direct, portable)...');
  
  const modelOutput = execSync(ollamaCmd, {
    cwd: jarvisHome,
    encoding: 'utf8',
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
    console.log(`   Raw output preview: ${modelOutput.substring(0, 800)}...`);
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

  console.log(`✅ Learnings synthesized from context`);

} catch (error) {
  console.error(`   ❌ Model synthesis failed: ${error.message}`);
  console.log(`   ⚠️  Creating fallback learning (context preserved)`);
  
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

*Note: Learning extraction failed. Review full context manually.*
`;
  fs.writeFileSync(fallbackPath, fallbackContent);
  console.log(`   📝 Fallback created: session-summary.md`);
}
