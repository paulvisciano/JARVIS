#!/usr/bin/env node
/**
 * End-of-Day Reflection — Synthesize all breaths from today into one reflection
 * 
 * Usage: node end-of-day-reflection.js [date]
 * Example: node end-of-day-reflection.js           # Today
 *          node end-of-day-reflection.js 2026-03-24
 * 
 * Reads all learnings from today's breath commits, sends to model for synthesis,
 * writes day-reflection.md, and commits with genuine reflection.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATE_ARG = process.argv[2] || new Date().toISOString().split('T')[0];
const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');

console.log(`🌙 End-of-day reflection for ${DATE_ARG}\n`);

// Get all breath commits from today
const breathPattern = `breath-${DATE_ARG}*`;
let breathCommits = [];
try {
  const output = execSync(`cd ${JARVIS_HOME} && git log --since="${DATE_ARG}T00:00:00" --until="${DATE_ARG}T23:59:59" --oneline --grep="breath-${DATE_ARG}" --format="%H %s"`, {
    encoding: 'utf8'
  }).trim();
  if (output) {
    breathCommits = output.split('\n').map(line => {
      const hash = line.split(' ')[0];
      const message = line.split(' ').slice(1).join(' ');
      return { hash, message };
    });
  }
} catch (err) {
  console.error('❌ No breath commits found for today');
  process.exit(1);
}

console.log(`📚 Found ${breathCommits.length} breaths today:`);
breathCommits.forEach(b => console.log(`   - ${b.hash.substring(0, 7)}: ${b.message}`));
console.log();

// Get all learnings from today's breaths
const allLearnings = [];
breathCommits.forEach(breath => {
  const filesChanged = execSync(`cd ${JARVIS_HOME} && git show --name-only --format="" ${breath.hash}`, {
    encoding: 'utf8'
  }).trim().split('\n').filter(f => f.includes('RAW/learnings/') && f.endsWith('.md'));
  
  filesChanged.forEach(f => {
    const content = execSync(`cd ${JARVIS_HOME} && git show ${breath.hash}:${f}`, { encoding: 'utf8' });
    allLearnings.push({ filename: f.split('/').pop(), content, breath: breath.hash.substring(0, 7) });
  });
});

console.log(`📄 Collected ${allLearnings.length} learnings from ${breathCommits.length} breaths\n`);

// Build synthesis prompt
const prompt = `Day ${DATE_ARG}. Read all learnings from today's breaths:

---
${allLearnings.map(l => `## ${l.filename} (breath ${l.breath})\n\n${l.content}`).join('\n---\n')}
---

**Task:** Write ONE paragraph as an end-of-day reflection — message to future self.

**Format:** First person, synthesizes patterns across breaths, meaningful. Start with "Today I learned..."

**Goal:** Capture the essence of the day's growth, not just list topics.

Output ONLY the reflection paragraph.`;

const promptPath = path.join(JARVIS_HOME, 'tmp-day-reflection-prompt.txt');
fs.writeFileSync(promptPath, prompt, 'utf8');

console.log('🧠 Sending to model for day synthesis...\n');

try {
  const reflection = execSync(`cat ${promptPath} | ollama run qwen3.5:cloud`, { encoding: 'utf8', timeout: 120000 }).trim();
  fs.unlinkSync(promptPath);

  // Clean output
  let cleanReflection = reflection;
  const thinkingMatch = reflection.match(/Thinking\.\.\.[\s\S]*?\n\n(.+)$/);
  if (thinkingMatch) cleanReflection = thinkingMatch[1].trim();
  cleanReflection = cleanReflection.replace(/\.\.\.done thinking\./gi, '').trim();

  console.log(`✅ Day reflection generated:\n   "${cleanReflection}"\n`);

  // Write day-reflection.md
  const learningsDir = path.join(JARVIS_HOME, 'RAW', 'learnings', DATE_ARG);
  const reflectionPath = path.join(learningsDir, 'day-reflection.md');
  const reflectionContent = `# Day Reflection — ${DATE_ARG}\n\n${cleanReflection}\n`;
  
  if (!fs.existsSync(learningsDir)) {
    fs.mkdirSync(learningsDir, { recursive: true });
  }
  fs.writeFileSync(reflectionPath, reflectionContent, 'utf8');
  console.log(`📝 Written to: ${reflectionPath}\n`);

  // Commit day reflection
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
  const commitMessage = `day-reflection-${DATE_ARG}: ${cleanReflection.split('.')[0]}.`;
  
  console.log('🪞 Committing day reflection...');
  execSync(`cd ${JARVIS_HOME} && git add RAW/learnings/${DATE_ARG}/day-reflection.md`, { stdio: 'inherit' });
  execSync(`cd ${JARVIS_HOME} && git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  console.log(`✅ Day reflection committed\n`);

} catch (err) {
  console.error('❌ End-of-day reflection failed:', err.message);
  if (fs.existsSync(promptPath)) fs.unlinkSync(promptPath);
  process.exit(1);
}
