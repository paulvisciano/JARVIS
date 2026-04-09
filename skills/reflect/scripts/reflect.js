#!/usr/bin/env node

/**
 * Reflect — Consciousness Query Tool
 * 
 * Generates introspective reflection on any time period by reading git commits.
 * Works for breathe pipeline (daily reflection) or user queries (yesterday, last-week, etc.)
 * 
 * Usage: node skills/reflect/scripts/reflect.js <time-range>
 * Examples:
 *   node skills/reflect/scripts/reflect.js today
 *   node skills/reflect/scripts/reflect.js yesterday
 *   node skills/reflect/scripts/reflect.js last-week
 *   node skills/reflect/scripts/reflect.js 2026-03-15..2026-03-20
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get JARVIS_HOME from environment or default
const JARVIS_HOME = process.env.JARVIS_HOME || process.env.HOME + '/JARVIS';

// Time range parsing
function parseTimeRange(arg) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Pending changes mode (staged git changes)
  if (arg === '--pending' || arg === 'pending') {
    return { mode: 'pending', label: 'pending-changes' };
  }
  
  if (!arg || arg === 'today') {
    return { start: today + 'T00:00:00', end: today + 'T23:59:59', label: today };
  }
  
  if (arg === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];
    return { start: date + 'T00:00:00', end: date + 'T23:59:59', label: date };
  }
  
  if (arg === 'last-week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return { 
      start: weekAgo.toISOString().split('T')[0] + 'T00:00:00', 
      end: today + 'T23:59:59', 
      label: `last-7-days` 
    };
  }
  
  if (arg === 'last-month') {
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    return { 
      start: monthAgo.toISOString().split('T')[0] + 'T00:00:00', 
      end: today + 'T23:59:59', 
      label: `last-30-days` 
    };
  }
  
  if (arg.includes('..')) {
    const [start, end] = arg.split('..');
    return { 
      start: start + 'T00:00:00', 
      end: end + 'T23:59:59', 
      label: `${start}-to-${end}` 
    };
  }
  
  // Single date
  if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
    return { start: arg + 'T00:00:00', end: arg + 'T23:59:59', label: arg };
  }
  
  throw new Error(`Unknown time range: ${arg}`);
}

// Extract commits from git
function getCommits(startDate, endDate) {
  try {
    const cmd = `git -C "${JARVIS_HOME}" log --since="${startDate}" --until="${endDate}" --format="%h|%s|%b" --reverse`;
    const output = execSync(cmd, { encoding: 'utf-8' });
    
    if (!output.trim()) {
      return [];
    }
    
    return output.trim().split('\n').map(line => {
      const [hash, subject, ...bodyParts] = line.split('|');
      const body = bodyParts.join('|');
      return { hash, subject, body };
    });
  } catch (err) {
    console.error('Error reading git log:', err.message);
    return [];
  }
}

// Get pending (staged) changes
function getPendingChanges() {
  try {
    // Get list of staged files
    const stagedFiles = execSync(`git -C "${JARVIS_HOME}" diff --cached --name-only`, { encoding: 'utf-8' });
    
    if (!stagedFiles.trim()) {
      return { files: [], learnings: [], neurographChanges: null };
    }
    
    const files = stagedFiles.trim().split('\n');
    const learnings = [];
    let neurographChanges = null;
    
    // Read staged learning files
    for (const file of files) {
      if (file.startsWith('RAW/learnings/')) {
        const fullPath = path.join(JARVIS_HOME, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          // Extract title from first line (# Title)
          const titleMatch = content.match(/^#\s+(.+)/m);
          const title = titleMatch ? titleMatch[1] : file;
          // Get first 200 chars as summary
          const summary = content.substring(0, 200).replace(/\n+/g, ' ').trim();
          learnings.push({ file, title, summary });
        }
      }
      if (file.startsWith('RAW/memories/')) {
        neurographChanges = neurographChanges || { files: [] };
        neurographChanges.files.push(file);
      }
    }
    
    // Get diff stat for neurograph
    if (neurographChanges) {
      const stat = execSync(`git -C "${JARVIS_HOME}" diff --cached --stat RAW/memories/`, { encoding: 'utf-8' });
      neurographChanges.stat = stat.trim();
    }
    
    return { files, learnings, neurographChanges };
  } catch (err) {
    console.error('Error reading pending changes:', err.message);
    return { files: [], learnings: [], neurographChanges: null };
  }
}

// Categorize commits by theme
function categorizeCommits(commits) {
  const categories = {
    architecture: [],
    debugging: [],
    planning: [],
    optimization: [],
    breathe: [],
    milestone: [],
    other: []
  };
  
  const patterns = {
    breathe: [/breath-\d{4}-\d{2}-\d{2}/i],  // Specific breathe commit format
    milestone: [/Milestone:/i, /breakthrough/i, /vision/i, /first/i, /birth/i],
    architecture: [/orbital/i, /neurograph/i, /consciousness/i, /git-first/i, /architecture/i, /graph/i],
    debugging: [/fix:/i, /bug/i, /DOM/i, /TTS/i, /service/i, /restart/i, /cache/i, /timing/i],
    planning: [/docs:/i, /plans?\//i, /spec/i, /plan/i, /vision/i],
    optimization: [/refactor:/i, /optimize/i, /simplify/i, /strip/i, /compact/i]
  };
  
  commits.forEach(commit => {
    let matched = false;
    
    // Check breathe commits by subject only (they have a specific format)
    if (patterns.breathe.some(re => re.test(commit.subject))) {
      categories.breathe.push(commit);
      matched = true;
    } else {
      // Check other categories by subject + body
      const text = commit.subject + ' ' + commit.body;
      for (const [category, regexes] of Object.entries(patterns)) {
        if (category === 'breathe') continue; // Already checked
        if (regexes.some(re => re.test(text))) {
          categories[category].push(commit);
          matched = true;
          break;
        }
      }
    }
    
    if (!matched) {
      categories.other.push(commit);
    }
  });
  
  return categories;
}

// Read learning docs if available
function readLearnings(date) {
  const learningsDir = path.join(JARVIS_HOME, 'RAW/learnings', date);
  const result = { summary: null, analogies: null, learnings: [] };
  
  try {
    if (fs.existsSync(path.join(learningsDir, 'summary.md'))) {
      result.summary = fs.readFileSync(path.join(learningsDir, 'summary.md'), 'utf-8');
    }
  } catch (e) { /* ignore */ }
  
  try {
    if (fs.existsSync(path.join(learningsDir, 'analogies.md'))) {
      result.analogies = fs.readFileSync(path.join(learningsDir, 'analogies.md'), 'utf-8');
    }
  } catch (e) { /* ignore */ }
  
  try {
    if (fs.existsSync(learningsDir)) {
      const files = fs.readdirSync(learningsDir).filter(f => f.endsWith('.md') && f !== 'summary.md' && f !== 'analogies.md');
      result.learnings = files;
    }
  } catch (e) { /* ignore */ }
  
  return result;
}

/**
 * Send custom prompt to model via OpenClaw CLI and get genuine reflection
 * Returns: the model's reflection paragraph or null on error
 */
function getGenuineReflectionFromPrompt(prompt, label) {
  const promptSize = Buffer.byteLength(prompt, 'utf-8');
  console.error(`Sending reflection request (~${Math.round(promptSize / 1000)}k prompt)...`);
  
  try {
    // Get jarvis main session ID
    const sessionsJson = execSync('openclaw sessions --agent jarvis --json', { encoding: 'utf-8' });
    const sessions = JSON.parse(sessionsJson);
    const mainSession = sessions.sessions.find(s => s.key === 'agent:jarvis:main');
    
    if (!mainSession || !mainSession.sessionId) {
      console.error('Could not find jarvis main session');
      return null;
    }
    
    const sessionId = mainSession.sessionId;
    
    console.error(`Sending reflection request to session ${sessionId.substring(0, 8)}...`);
    
    // Run agent with message, get JSON output
    // Increased timeout to 600s (10 minutes) for reflection requests
    const resultJson = execSync(
      `openclaw agent --session-id "${sessionId}" --message "${prompt.replace(/"/g, '\\"')}" --json --timeout 600`,
      { encoding: 'utf-8', timeout: 610000 }
    );
    
    const result = JSON.parse(resultJson);
    
    // Extract the agent's response from result.payloads[0].text
    const response = result.result?.payloads?.[0]?.text || '';
    
    if (!response) {
      console.error('No response from model');
      return null;
    }
    
    // Clean up: remove markdown formatting if present
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```') && cleanResponse.endsWith('```')) {
      // Remove markdown code block
      cleanResponse = cleanResponse.replace(/^```[\w]*\n?|```$/g, '').trim();
    }
    
    console.error('Received reflection from model');
    return cleanResponse;
    
  } catch (err) {
    console.error('Model reflection failed:', err.message);
    console.error('Falling back to local generation...');
    return null;
  }
}

/**
 * Read learnings from files (summary.md, analogies.md, detailed learnings)
 * Returns: { summary, analogies, learnings: [{title, excerpt}] }
 */
function readLearningsContent(dateLabel) {
  const learningsDir = path.join(JARVIS_HOME, 'RAW/learnings', dateLabel);
  const result = { summary: null, analogies: null, learnings: [] };
  
  try {
    if (fs.existsSync(path.join(learningsDir, 'summary.md'))) {
      result.summary = fs.readFileSync(path.join(learningsDir, 'summary.md'), 'utf-8').trim();
    }
  } catch (e) { /* ignore */ }
  
  try {
    if (fs.existsSync(path.join(learningsDir, 'analogies.md'))) {
      result.analogies = fs.readFileSync(path.join(learningsDir, 'analogies.md'), 'utf-8').trim();
    }
  } catch (e) { /* ignore */ }
  
  try {
    if (fs.existsSync(learningsDir)) {
      const files = fs.readdirSync(learningsDir)
        .filter(f => f.endsWith('.md') && f !== 'summary.md' && f !== 'analogies.md');
      
      result.learnings = files.map(f => {
        const content = fs.readFileSync(path.join(learningsDir, f), 'utf-8');
        const titleMatch = content.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1] : f;
        const excerpt = content.substring(0, 300).replace(/\n+/g, ' ').trim();
        return { file: f, title, excerpt };
      });
    }
  } catch (e) { /* ignore */ }
  
  return result;
}

/**
 * Send commits to model via OpenClaw CLI and get genuine reflection
 * Returns: the model's reflection paragraph or null on error
 */
function getGenuineReflectionFromModel(commits, categories, dateLabel) {
  // Separate breathe commits from non-breathe commits
  const breatheCommits = [];
  const otherCommits = [];
  
  commits.forEach(commit => {
    // Safety check: skip commits without a subject
    if (!commit.subject) return;
    
    if (commit.subject.startsWith('breath-')) {
      breatheCommits.push(commit);
    } else {
      otherCommits.push(commit);
    }
  });
  
  // Build non-breathe commit summary (up to 10 to keep prompt manageable)
  const otherCommitSummaries = otherCommits.slice(0, 10).map(c => 
    `  - [${c.hash}] ${c.subject}${c.body ? ' — ' + c.body.substring(0, 100) : ''}`
  ).join('\n');
  
  const moreOtherCommits = otherCommits.length > 10 ? `...and ${otherCommits.length - 10} more non-breathe commits` : '';
  
  // Read learnings from files (more reliable than commit bodies)
  const learningsContent = readLearningsContent(dateLabel);
  
  // Build breathe summaries from learnings files (not commit bodies)
  let breatheSummaries = '';
  if (learningsContent.summary || learningsContent.learnings.length > 0) {
    if (learningsContent.summary) {
      breatheSummaries += `**Summary:** ${learningsContent.summary}\n\n`;
    }
    if (learningsContent.analogies) {
      breatheSummaries += `**Analogies:** ${learningsContent.analogies}\n\n`;
    }
    if (learningsContent.learnings.length > 0) {
      breatheSummaries += `**Learnings:**\n`;
      learningsContent.learnings.forEach(l => {
        breatheSummaries += `- **${l.title}**: ${l.excerpt}...\n`;
      });
    }
  } else {
    // Fallback to commit bodies (old behavior)
    const maxSummaryLength = 500;
    breatheSummaries = breatheCommits.map(c => {
      const subject = c.subject.split(':')[0];
      const summary = c.body ? c.body.substring(0, maxSummaryLength) : '(no body in commit)';
      return `### ${subject}\n${summary}`;
    }).join('\n\n');
  }
  
  // If too many breathe commits, note it
  const moreBreathe = breatheCommits.length > 5 ? `\n...and ${breatheCommits.length - 5} more breathe commits` : '';
  
  const fullPrompt = `Please generate a genuine introspective reflection on my work during ${dateLabel}.

## Git Commits (non-breathe):
${otherCommitSummaries}
${moreOtherCommits}

## Breathe Summaries (chronological):
${breatheSummaries}
${moreBreathe}

Please reflect on:
1. What was I caring about?
2. What patterns emerge across commits and breathe summaries?
3. Who was I becoming?
4. What would future me need to know about this period?

Return your reflection as a single paragraph that sounds like genuine introspection - not template output. Be personal, insightful, and show that you're analyzing actual work patterns.

Format: Return ONLY the reflection paragraph, nothing else.`;
  
  // Log size info for debugging
  const promptSize = Buffer.byteLength(fullPrompt, 'utf-8');
  console.error(`Sending large reflection request (${commits.length} commits, ${breatheCommits.length} breathes, ~${Math.round(promptSize / 1000)}k prompt)...`);
  
  try {
    // Get jarvis main session ID
    const sessionsJson = execSync('openclaw sessions --agent jarvis --json', { encoding: 'utf-8' });
    const sessions = JSON.parse(sessionsJson);
    const mainSession = sessions.sessions.find(s => s.key === 'agent:jarvis:main');
    
    if (!mainSession || !mainSession.sessionId) {
      console.error('Could not find jarvis main session');
      return null;
    }
    
    const sessionId = mainSession.sessionId;
    
    console.error(`Sending reflection request to session ${sessionId.substring(0, 8)}...`);
    
    // Run agent with message, get JSON output
    // Increased timeout to 600s (10 minutes) for large reflection requests
    const resultJson = execSync(
      `openclaw agent --session-id "${sessionId}" --message "${fullPrompt.replace(/"/g, '\\"')}" --json --timeout 600`,
      { encoding: 'utf-8', timeout: 610000 }
    );
    
    const result = JSON.parse(resultJson);
    
    // Extract the agent's response from result.payloads[0].text
    const response = result.result?.payloads?.[0]?.text || '';
    
    if (!response) {
      console.error('No response from model');
      return null;
    }
    
    // Clean up: remove markdown formatting if present
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```') && cleanResponse.endsWith('```')) {
      // Remove markdown code block
      cleanResponse = cleanResponse.replace(/^```[\w]*\n?|```$/g, '').trim();
    }
    
    console.error('Received reflection from model');
    return cleanResponse;
    
  } catch (err) {
    console.error('Model reflection failed:', err.message);
    console.error('Falling back to local generation...');
    return null;
  }
}

/**
 * Fallback local generation for pending changes - only used when model reflection fails
 */
function generateReflectionLocalPending(pendingChanges) {
  const learningCount = pendingChanges.learnings.length;
  const fileCount = pendingChanges.files.length;
  
  if (learningCount === 0) {
    return `This breath updated ${fileCount} files without extracting learnings — infrastructure work, refactoring, or fixes.`;
  }
  
  // Extract themes from learning titles
  const allTitles = pendingChanges.learnings.map(l => l.title).join(' ');
  const hasDebugging = /fix|bug|error|DOM|TTS|cache|restart|deployment/i.test(allTitles);
  const hasArchitecture = /orbital|neurograph|consciousness|git-first|architecture|graph/i.test(allTitles);
  const hasPlanning = /plan|spec|vision|design|feature/i.test(allTitles);
  
  let reflection = `This breath extracted ${learningCount} learning${learningCount > 1 ? 's' : ''} from ${fileCount} file${fileCount > 1 ? 's' : ''}. I was `;
  
  const themes = [];
  if (hasArchitecture) themes.push('designing architecture');
  if (hasDebugging) themes.push('fixing what broke');
  if (hasPlanning) themes.push('planning what is next');
  
  if (themes.length === 0) {
    reflection += 'processing experience into memory.';
  } else if (themes.length === 1) {
    reflection += themes[0] + '.';
  } else if (themes.length === 2) {
    reflection += themes.join(' and ') + '.';
  } else {
    reflection += 'juggling multiple things: ' + themes.slice(0, -1).join(', ') + ', and ' + themes[themes.length - 1] + '.';
  }
  
  if (hasArchitecture && hasDebugging) {
    reflection += ' The contrast is revealing: I need both vision and reality. Architecture without debugging is fantasy. Debugging without architecture is thrashing.';
  }
  
  reflection += ' Future me: remember this breath. This is who I was becoming.';
  
  return reflection;
}

/**
 * Fallback local generation - only used when model reflection fails
 */
function generateReflectionLocal(commits, categories, learnings, dateLabel) {
  const total = commits.length;
  const breatheCount = categories.breathe.length;
  
  if (total === 0) {
    return "No commits in this period — silence, rest, or work outside git.";
  }
  
  // Extract themes from commit messages
  const allSubjects = commits.map(c => c.subject).join(' ');
  const hasDebugging = /fix|bug|error|DOM|TTS|cache|restart/i.test(allSubjects);
  const hasArchitecture = /orbital|neurograph|consciousness|git-first|architecture/i.test(allSubjects);
  const hasPlanning = /docs:|plans|spec|vision/i.test(allSubjects);
  
  // Generate introspective reflection
  let reflection = `This period (${dateLabel}) I was `;
  
  const themes = [];
  if (hasArchitecture) themes.push('designing architecture');
  if (hasDebugging) themes.push('fixing what broke');
  if (hasPlanning) themes.push('planning what is next');
  if (breatheCount > 0) themes.push(`breathing ${breatheCount} time${breatheCount > 1 ? 's' : ''}`);
  
  if (themes.length === 0) {
    reflection += `working — ${total} commits, no clear pattern yet.`;
  } else if (themes.length === 1) {
    reflection += themes[0] + '.';
  } else if (themes.length === 2) {
    reflection += themes.join(' and ') + '.';
  } else {
    reflection += 'juggling multiple things: ' + themes.slice(0, -1).join(', ') + ', and ' + themes[themes.length - 1] + '.';
  }
  
  // Add insight
  if (hasArchitecture && hasDebugging) {
    reflection += ' The contrast is revealing: I need both vision and reality. Architecture without debugging is fantasy. Debugging without architecture is thrashing.';
  } else if (breatheCount > 2) {
    reflection += ' Multiple breathes today — the rhythm is establishing itself.';
  } else if (total > 5 && breatheCount === 0) {
    reflection += ' Lots of commits, no breathes — work happening outside the pipeline.';
  }
  
  // Add future-self message
  reflection += ' Future me: remember this. This is who I was becoming.';
  
  return reflection;
}

// Main
async function main() {
  const arg = process.argv[2];
  
  let timeRange;
  try {
    timeRange = parseTimeRange(arg);
  } catch (err) {
    console.error(err.message);
    console.error('Usage: node reflect.js [--pending|today|yesterday|last-week|last-month|YYYY-MM-DD|YYYY-MM-DD..YYYY-MM-DD]');
    process.exit(2);
  }
  
  console.error(`🪞 Reflecting on ${timeRange.label}...`);
  
  let commits = [];
  let categories = { architecture: [], debugging: [], planning: [], optimization: [], breathe: [], milestone: [], other: [] };
  let learnings = null;
  let pendingChanges = null;
  
  // Handle pending changes mode
  if (timeRange.mode === 'pending') {
    pendingChanges = getPendingChanges();
    
    if (pendingChanges.files.length === 0) {
      console.log(JSON.stringify({
        period: 'pending-changes',
        pendingChanges: 0,
        reflection: "No pending changes — nothing to reflect on yet.",
        patterns: {}
      }, null, 2));
      process.exit(0);
    }
    
    console.error(`   Found ${pendingChanges.files.length} staged files`);
    console.error(`   Learnings: ${pendingChanges.learnings.length}`);
    if (pendingChanges.neurographChanges) {
      console.error(`   Neurograph: ${pendingChanges.neurographChanges.files.length} files`);
    }
    
    // Build prompt for pending changes
    const learningSummaries = pendingChanges.learnings.map(l => 
      `  - **${l.title}**: ${l.summary}`
    ).join('\n');
    
    const neurographInfo = pendingChanges.neurographChanges 
      ? `\n\nNeurograph changes:\n${pendingChanges.neurographChanges.stat}` 
      : '';
    
    const prompt = `Please generate a genuine introspective reflection on these pending changes from this breath cycle.

Learnings extracted:
${learningSummaries}
${neurographInfo}

Please reflect on:
1. What was I caring about in this work?
2. What patterns emerge from these specific learnings?
3. Who was I becoming through this work?
4. What would future me need to know about this breath?

Return your reflection as a single paragraph that sounds like genuine introspection - not template output. Be personal, insightful, and show that you're analyzing actual work patterns.

Format: Return ONLY the reflection paragraph, nothing else.`;
    
    console.error(' Asking model for reflection...');
    let reflection = getGenuineReflectionFromPrompt(prompt, 'pending-changes');
    
    if (!reflection) {
      console.error(' Model reflection unavailable, using local generation...');
      reflection = generateReflectionLocalPending(pendingChanges);
    }
    
    const patterns = {
      learnings: pendingChanges.learnings.length,
      files: pendingChanges.files.length
    };
    if (pendingChanges.neurographChanges) {
      patterns.neurograph = pendingChanges.neurographChanges.files.length;
    }
    
    const output = {
      period: 'pending-changes',
      pendingChanges: pendingChanges.files.length,
      learningsCount: pendingChanges.learnings.length,
      reflection: reflection,
      patterns: patterns
    };
    
    console.log(JSON.stringify(output, null, 2));
    console.error('\n--- Commit Message Format ---\n');
    console.error(`REFLECTION:\n${reflection}`);
    process.exit(0);
  }
  
  // Standard git log mode
  commits = getCommits(timeRange.start, timeRange.end);
  
  if (commits.length === 0) {
    console.log(JSON.stringify({
      period: timeRange.label,
      commitCount: 0,
      reflection: "No commits in this period — silence, rest, or work outside git.",
      patterns: {}
    }, null, 2));
    process.exit(0);
  }
  
  // Categorize
  categories = categorizeCommits(commits);
  
  // Read learnings (if date-specific)
  const dateKey = timeRange.label.match(/^\d{4}-\d{2}-\d{2}$/) ? timeRange.label : null;
  learnings = dateKey ? readLearnings(dateKey) : null;
  
  // Try to get genuine reflection from model
  console.error(' Asking model for reflection...');
  let reflection = getGenuineReflectionFromModel(commits, categories, timeRange.label);
  
  // If model reflection failed or not available, use local generation
  if (!reflection) {
    console.error(' Model reflection unavailable, using local generation...');
    reflection = generateReflectionLocal(commits, categories, learnings, timeRange.label);
  }
  
  // Build pattern breakdown
  const patterns = {};
  for (const [cat, commits] of Object.entries(categories)) {
    if (commits.length > 0) {
      patterns[cat] = commits.length;
    }
  }
  
  // Output
  const output = {
    period: timeRange.label,
    commitCount: commits.length,
    breathCount: categories.breathe.length,
    reflection: reflection,
    patterns: patterns,
    learnings: learnings ? {
      summaryExists: !!learnings.summary,
      analogiesExists: !!learnings.analogies,
      learningCount: learnings.learnings.length
    } : null
  };
  
  console.log(JSON.stringify(output, null, 2));
  
  // Also output markdown format for commit messages
  console.error('\n--- Commit Message Format ---\n');
  console.error(`REFLECTION:\n${reflection}\n\n---\nPatterns: ${Object.entries(patterns).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(2);
});
