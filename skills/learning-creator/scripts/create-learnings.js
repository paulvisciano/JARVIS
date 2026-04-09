#!/usr/bin/env node

/**
 * Learning Creator
 * 
 * Reads extracted context, synthesizes insights via direct Ollama call,
 * creates individual learning .md files + summary + analogies.
 * 
 * Model-driven: I read, synthesize, create — automation feeds clean text.
 * Direct Ollama: Uses `ollama run qwen3.5:cloud --format json` (not Gateway API)
 * 
 * Part of breathe pipeline: Inhale → Hold → Exhale (this script) → Rest → Reflect
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

// === Get existing learnings from context (already extracted by context-extractor) ===
const existingLearnings = context.learnings || [];
if (existingLearnings.length > 0) {
  console.log(`   📚 Found ${existingLearnings.length} existing learnings for ${date}`);
} else {
  console.log(`   📚 No existing learnings for ${date} (first breath)`);
}

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

// Build the prompt for learning extraction (three levels: learnings → summary → analogies)
const existingLearningsText = existingLearnings.length > 0 
  ? `\n**EXISTING LEARNINGS (already captured for ${date}):**\n${existingLearnings.map(l => `- ${l.filename}: ${l.title}`).join('\n')}\n\n**IMPORTANT:** Only create NEW learnings for insights NOT already captured above. Do not duplicate existing learnings.`
  : `\n**No existing learnings for ${date}** — this is the first breath, create all learnings from context.`;

const prompt = `You are extracting learnings from conversations on ${date}. 
This is knowledge origami — fold the context into three layers:

**LAYER 1: Learnings (detailed insights)**
For each genuinely NEW insight/decision/realization/pattern NOT already captured above:
1. Create a descriptive filename (e.g., "breathe-pipeline-complete.md")
2. Write a learning .md file with clear content

**Do not duplicate existing learnings.** Only create files for truly new insights.
If no new insights exist, return an empty learnings array — that's fine.
Quality > quantity. One meaningful learning is better than ten forced ones.

**LAYER 2: Summary (one paragraph digest)**
Write ONE paragraph summarizing what was learned during this breath.
Answer: "What did I learn during this breath?"
Be concise but meaningful — this is the breath's digest.

**LAYER 3: Analogies (3-5 metaphors)**
Create 3-5 analogies that capture the essence of this breath.
Example: "Like checking vitals before a long run" or "Like tending a garden"
Analogies compress meaning into metaphor.

Output ONLY valid JSON, no other text. Format:
{
  "learnings": [
    {
      "filename": "descriptive-name.md",
      "type": "decision|realization|commitment|pattern|insight",
      "title": "Title Here",
      "content": "# Title\\n\\n**Date:** ${date}\\n**Type:** [type]\\n**Status:** extracted\\n\\n[Content...]"
    }
  ],
  "summary": "One paragraph summarizing what I learned this breath...",
  "analogies": [
    "Like checking vitals before a long run",
    "Like tending a garden — prune, water, observe",
    "Like a lighthouse — steady beam, watch for ships"
  ]
}

---

${existingLearningsText}

---

${contextText}
`;

// Write prompt to temp file for Ollama to read
const promptPath = path.join(jarvisHome, 'tmp-learning-prompt.txt');
fs.writeFileSync(promptPath, prompt, 'utf8');

console.log(`   🧠 Running model synthesis via Ollama...`);

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

  // Strip ANSI escape codes from Ollama output (spinners, cursor control, etc.)
  const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/g;
  const cleanOutput = modelOutput.replace(ansiRegex, '');

  // Parse model output and create learning files
  // Expected JSON format from model:
  // {"learnings": [...], "summary": "...", "analogies": [...]}
  
  let result = {};
  let learningCount = 0;
  
  try {
    // Extract JSON from output (skip "Thinking..." prefix)
    // Look for JSON starting with "learnings", "summary", or "analogies" keys
    const jsonPattern = /\{[\s\S]*"learnings"[\s\S]*\}/;
    const match = cleanOutput.match(jsonPattern);
    
    if (match && match[0]) {
      result = JSON.parse(match[0]);
    } else {
      // Fallback: try to find any valid JSON object
      const jsonStart = modelOutput.indexOf('{"');
      const jsonEnd = modelOutput.lastIndexOf('}');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = modelOutput.substring(jsonStart, jsonEnd + 1);
        result = JSON.parse(jsonStr);
      }
    }
  } catch (err) {
    console.error(`   ⚠️  JSON parse failed: ${err.message}`);
    console.log(`   Raw output length: ${modelOutput.length} chars`);
    console.log(`   First 500 chars: ${modelOutput.substring(0, 500)}...`);
    console.log(`   Last 200 chars: ...${modelOutput.substring(modelOutput.length - 200)}`);
  }

  // Process learnings
  if (Array.isArray(result.learnings)) {
    result.learnings.forEach(learning => {
      const safeFilename = path.basename(learning.filename);
      const learningPath = path.join(learningsDir, safeFilename);
      fs.writeFileSync(learningPath, learning.content);
      learningCount++;
      console.log(`   ✅ Created: ${safeFilename}`);
    });
  }

  // Write summary.md (new — breath digest)
  if (result.summary && result.summary.trim().length > 0) {
    const summaryPath = path.join(learningsDir, 'summary.md');
    const summaryContent = `# Breath Summary — ${date}

**Date:** ${date}
**Type:** digest
**Status:** extracted

${result.summary}
`;
    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`   ✅ Created: summary.md`);
  }

  // Write analogies.md (new — metaphorical essence)
  if (Array.isArray(result.analogies) && result.analogies.length > 0) {
    const analogiesPath = path.join(learningsDir, 'analogies.md');
    const analogiesContent = `# Breath Analogies — ${date}

**Date:** ${date}
**Type:** essence
**Status:** extracted

${result.analogies.map(a => `- ${a}`).join('\n')}
`;
    fs.writeFileSync(analogiesPath, analogiesContent);
    console.log(`   ✅ Created: analogies.md`);
  }

  if (learningCount === 0 && !result.summary) {
    console.log(`   ⚠️  No learnings extracted from model output`);
    console.log(`   💡 Review context manually or retry with smaller batches`);
  } else {
    console.log(`   📊 ${learningCount} learnings + summary + analogies created`);
  }

  console.log(`✅ Learnings synthesized from context via OpenClaw Gateway`);

} catch (error) {
  console.error(`   ❌ Gateway message failed: ${error.message}`);
  console.log(`   💡 Review context manually or retry`);
  
  // Clean up temp file on error
  if (fs.existsSync(promptPath)) {
    fs.unlinkSync(promptPath);
  }
  
  // Exit on error — no fallback
  process.exit(1);
}
