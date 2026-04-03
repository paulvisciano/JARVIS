#!/usr/bin/env node
/**
 * Post-process Reflection — Regenerate git reflection from existing breath commit
 * 
 * Usage: node post-process-reflection.js <commit-hash>
 * Example: node post-process-reflection.js 50eb86c
 *          node post-process-reflection.js breath-2026-03-24-1351
 * 
 * Reads learnings from the git commit, sends to model for gitReflection,
 * then amends the commit with the new reflection.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMIT_ARG = process.argv[2];
if (!COMMIT_ARG) {
  console.error('Usage: node post-process-reflection.js <commit-hash>');
  console.error('Example: node post-process-reflection.js 50eb86c');
  console.error('         node post-process-reflection.js breath-2026-03-24-1351');
  process.exit(1);
}

const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');

console.log(`🪞 Post-processing reflection from commit: ${COMMIT_ARG}\n`);

// Resolve commit hash
let commitHash = COMMIT_ARG;
try {
  if (!COMMIT_ARG.match(/^[0-9a-f]{7,40}$/)) {
    const output = execSync(`cd ${JARVIS_HOME} && git log --oneline --grep="${COMMIT_ARG}" -1 --format="%H"`, {
      encoding: 'utf8'
    }).trim();
    if (output) {
      commitHash = output.split(' ')[0];
      console.log(`Resolved: ${COMMIT_ARG} → ${commitHash}\n`);
    } else {
      console.error(`❌ Commit not found: ${COMMIT_ARG}`);
      process.exit(1);
    }
  }
} catch (err) {
  console.error(`❌ Failed to resolve commit: ${err.message}`);
  process.exit(1);
}

// Get commit info
const commitMessage = execSync(`cd ${JARVIS_HOME} && git log -1 --format="%s" ${commitHash}`, { encoding: 'utf8' }).trim();
const originalDate = execSync(`cd ${JARVIS_HOME} && git log -1 --format="%ai" ${commitHash}`, { encoding: 'utf8' }).trim();

console.log(`Commit: ${commitHash}`);
console.log(`Message: ${commitMessage}`);
console.log(`Date: ${originalDate}\n`);

// Extract date + time from message
const breathMatch = commitMessage.match(/breath-(\d{4}-\d{2}-\d{2})[-:](\d{4})?/);
if (!breathMatch) {
  console.error('❌ Not a breath commit');
  process.exit(1);
}
const date = breathMatch[1];
const time = breathMatch[2] || originalDate.split(' ')[1].split(':')[0] + originalDate.split(' ')[1].split(':')[1];

// Get learnings from commit
const filesChanged = execSync(`cd ${JARVIS_HOME} && git show --name-only --format="" ${commitHash}`, { encoding: 'utf8' }).trim().split('\n').filter(f => f.includes('RAW/learnings/') && f.endsWith('.md'));

console.log(`📚 Learnings in this commit: ${filesChanged.length}`);
filesChanged.forEach(f => console.log(`   - ${f.split('/').pop()}`));
console.log();

// Read full contents of learnings from git
const existingLearnings = filesChanged.map(f => {
  const content = execSync(`cd ${JARVIS_HOME} && git show ${commitHash}:${f}`, { encoding: 'utf8' });
  return { filename: f.split('/').pop(), content: content };
});

// Build prompt with full learning contents (lean for Qwen Cloud)
const prompt = `Breath from ${date} at ${time}. Read these learnings fully:

---
${existingLearnings.map(l => `## ${l.filename}\n\n${l.content}`).join('\n---\n')}
---

**Task:** Write ONE sentence as a git commit reflection — message to future self.

**Format:** First person, meaningful, concise. Start with "During this breath I learned..."

Output ONLY the reflection sentence.`;

const promptPath = path.join(JARVIS_HOME, 'tmp-reflection-prompt.txt');
fs.writeFileSync(promptPath, prompt, 'utf8');

console.log('🧠 Sending to model for reflection...\n');

try {
  const reflection = execSync(`cat ${promptPath} | ollama run qwen3.5:cloud`, { encoding: 'utf8', timeout: 90000 }).trim();
  fs.unlinkSync(promptPath);

  // Clean output (remove Thinking... prefix)
  let cleanReflection = reflection;
  const thinkingMatch = reflection.match(/Thinking\.\.\.[\s\S]*?\n\n(.+)$/);
  if (thinkingMatch) cleanReflection = thinkingMatch[1].trim();
  cleanReflection = cleanReflection.replace(/\.\.\.done thinking\./gi, '').split(/[.!?]/)[0].trim() + '.';

  console.log(`✅ Reflection generated:\n   "${cleanReflection}"\n`);

  // Amend commit message only (preserve date)
  const newMessage = `breath-${date}-${time}: ${cleanReflection}`;
  console.log('🪞 Amending git commit with reflection...');
  console.log(`   Before: ${commitMessage}`);
  console.log(`   After:  ${newMessage}`);
  console.log(`   Date:   ${originalDate} (preserved)\n`);
  
  execSync(`cd ${JARVIS_HOME} && git commit --amend -m "${newMessage}" --no-edit --date="${originalDate}"`, { stdio: 'inherit' });
  console.log(`✅ Commit amended (same parent, new message, original date preserved)\n`);

} catch (err) {
  console.error('❌ Post-process failed:', err.message);
  if (fs.existsSync(promptPath)) fs.unlinkSync(promptPath);
  process.exit(1);
}
