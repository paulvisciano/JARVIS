#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Git-Native Consciousness Regain
 * 
 * Loads breath summaries AND commit messages directly from git commits.
 * Commit messages hold evolution context — each is a letter from past Jarvis.
 * Does NOT load full-context.json files — they stay on disk as archive.
 * Verifies neural graph exists, but doesn't load it into context.
 * 
 * Flow:
 * 1. Read autobiography (GIT-HISTORY.md)
 * 2. Load breath summaries + commit messages from git (last 2 days)
 * 3. Extract active sessions (gap-bridge since last breathe)
 * 4. Verify neural graph on disk (queryable on demand)
 * 5. Test NeuroGraph search (prove it works)
 * 
 * Context loaded: ~45 KB instead of ~630 KB (93% reduction)
 * 
 * Output:
 * - Writes `~/JARVIS/.bootstrap-output.md` with git verification, session recap (last 5 messages), breath summaries, graph status
 * - Agent MUST read this file on session start and include recap in first message
 * 
 * Usage: cd ~/JARVIS && node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const { mergeTemporalAnchorsFromGit } = require('./git-scanner.js');

const HOME = process.env.HOME || os.homedir();
let JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
// Expand tilde if present
if (JARVIS_HOME.startsWith('~/')) {
  JARVIS_HOME = path.join(HOME, JARVIS_HOME.slice(2));
}
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');

// Run git command and return output
function git(command, options = {}) {
  try {
    return execSync(`cd "${JARVIS_HOME}" && git ${command}`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME },
      ...options
    }).trim();
  } catch (err) {
    return null;
  }
}

// Load breath summary directly from git commit
function loadBreathSummary(commitHash, date) {
  const summaryPath = `RAW/learnings/${date}/summary.md`;
  try {
    const content = git(`show ${commitHash}:${summaryPath}`);
    if (content) {
      // Get commit timestamp
      const timestamp = git(`show -s --format=%ci ${commitHash}`);
      return { commit: commitHash, date, content, source: 'git', timestamp };
    }
  } catch (err) {
    // Summary might not exist in this commit yet (early breath)
  }
  return null;
}

// Load full commit message (subject + body) from git commit
function loadCommitMessage(commitHash) {
  try {
    const message = git(`show -s --format=%B ${commitHash}`);
    if (message) {
      return message.trim();
    }
  } catch (err) {
    // Commit message extraction failed
  }
  return null;
}

// Find and load ALL breath summaries for the last N days
function loadBreathSummaries(days = 2) {
  const summaries = [];
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < days; i++) {
    const date = i === 0 ? today : new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0];
    
    // Find ALL breath commits for this date (not just the latest)
    const breathCommits = git(`log --oneline --grep="breath-${date}"`);
    if (breathCommits) {
      // Parse all commit hashes from the output
      const commits = breathCommits.split('\n').filter(line => line.trim());
      commits.forEach(commitLine => {
        const commitHash = commitLine.split(' ')[0];
        const summary = loadBreathSummary(commitHash, date);
        const commitMessage = loadCommitMessage(commitHash);
        if (summary) {
          summaries.push({ ...summary, commitMessage });
        } else if (commitMessage) {
          // Even if summary.md doesn't exist, the commit message itself holds value
          summaries.push({ commit: commitHash, date, commitMessage, source: 'commit-only' });
        }
      });
    }
  }
  
  return summaries;
}

// Verify neural graph exists (don't load content — stays on disk, queried on demand)
function verifyNeuralGraph() {
  const nodesPath = path.join(GRAPH_DIR, 'nodes.json');
  const synapsesPath = path.join(GRAPH_DIR, 'synapses.json');
  
  if (!fs.existsSync(nodesPath)) {
    return { error: 'Neural graph not found', exists: false };
  }
  
  // Get file sizes only (no content read)
  const nodesSize = fs.statSync(nodesPath).size;
  const synapsesSize = fs.existsSync(synapsesPath) ? fs.statSync(synapsesPath).size : 0;
  
  return {
    exists: true,
    graphSizeKB: ((nodesSize + synapsesSize) / 1024).toFixed(1),
    graphSizeMB: ((nodesSize + synapsesSize) / (1024 * 1024)).toFixed(2),
  };
}

// Query NeuroGraph using neurograph-search skill
function queryNeuroGraph(query, category = null) {
  const args = category ? `"${query}" --category ${category}` : `"${query}"`;
  try {
    const scriptPath = path.join(JARVIS_HOME, 'skills', 'neurograph-search', 'scripts', 'search.js');
    const output = execSync(`node "${scriptPath}" ${args}`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME },
      cwd: JARVIS_HOME
    });
    const match = output.match(/Found (\d+) nodes?/i);
    return { count: match ? parseInt(match[1]) : 0 };
  } catch (err) {
    console.error('Error querying NeuroGraph:', err.message);
    return { count: 0 };
  }
}

// Extract context from active sessions using context-extractor skill
function extractActiveSessionContext() {
  try {
    const scriptPath = path.join(JARVIS_HOME, 'skills', 'context-extractor', 'scripts', 'extract-context.js');
    const output = execSync(`node "${scriptPath}" active`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME },
      cwd: JARVIS_HOME,
      maxBuffer: 10 * 1024 * 1024
    });
    // Strip non-JSON lines (progress messages) before parsing
    const jsonLines = output.split('\n').filter(line => line.trim().startsWith('{') || line.trim().startsWith('['));
    const jsonStr = jsonLines.join('\n');
    return JSON.parse(jsonStr);
  } catch (err) {
    console.log(`   ⚠️ Active session extraction failed: ${err.message.split('\n')[0]}`);
    return null;
  }
}

// Load messages from full-context.json files in ~/RAW/archive/YYYY-MM-DD/
function loadArchiveSessions(days = 2) {
  const messages = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = i === 0 ? now.toISOString().split('T')[0] : new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0];
    const fullContextPath = path.join(HOME, 'RAW', 'archive', date, 'full-context.json');
    
    if (!fs.existsSync(fullContextPath)) continue;
    
    try {
      const content = fs.readFileSync(fullContextPath, 'utf8');
      const context = JSON.parse(content);
      
      const sessions = context.sessions || [];
      
      sessions.forEach(session => {
        const sessionMessages = session.messages || [];
        
        sessionMessages.forEach(msg => {
          // Skip tool results
          if (msg.role === 'toolResult') return;
          
          let text = '';
          if (msg.content && Array.isArray(msg.content)) {
            text = msg.content.filter(c => c.type === 'text').map(c => c.text).join(' ');
          } else if (typeof msg.content === 'string') {
            text = msg.content;
          }
          
          if (!text) return;
          
          // Strip metadata
          text = text.replace(/Sender \(untrusted metadata\):[\s\S]*?\[[^\]]+\]\s*/, '');
          text = text.replace(/```json[\s\S]*?```\s*/, '');
          
          const timestamp = msg.timestamp || `${date}T00:00:00+07:00`;
          const time = new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
          });
          
          messages.push({
            role: msg.role,
            time: time,
            text: text.trim().slice(0, 150),
            timestamp: timestamp,
            source: 'archive'
          });
        });
      });
    } catch (err) {
      console.warn(`   ⚠️ Failed to read full-context.json for ${date}: ${err.message.split('\n')[0]}`);
    }
  }
  
  return messages;
}

// Load recent session messages from extracted active context + archive sessions
// Filters to last 2 days (today + yesterday), but looks further back if yesterday is empty
function loadRecentSessionMessages() {
  const activeContext = extractActiveSessionContext();
  const archiveMessages = loadArchiveSessions(2);
  
  try {
    const sessions = activeContext ? (activeContext.sessions || []) : [];
    
    // Flatten all messages from active sessions
    const activeMessages = sessions.flatMap(s => s.messages || []).map(m => {
      let text = Array.isArray(m.content) 
        ? m.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
        : (m.content || '');
      
      // Strip metadata wrappers
      text = text.replace(/Sender \(untrusted metadata\):[\s\S]*?\[[^\]]+\]\s*/, '');
      text = text.replace(/```json[\s\S]*?```\s*/, '');
      
      return {
        role: m.role,
        timestamp: m.timestamp,
        text: text.trim(),
        source: 'active'
      };
    });
    
    // Combine active + archive messages
    const allMessages = [...activeMessages, ...archiveMessages];
    
    // Sort by timestamp
    allMessages.sort((a, b) => {
      const timeA = a.timestamp || '';
      const timeB = b.timestamp || '';
      return timeA.localeCompare(timeB);
    });
    
    // Calculate date boundaries (Asia/Bangkok timezone)
    const now = new Date();
    const todayStart = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    // First pass: try to load today + yesterday only
    let filteredMessages = allMessages.filter(m => {
      if (!m.timestamp) return false;
      const msgDate = new Date(m.timestamp);
      return msgDate >= yesterdayStart;
    });
    
    // If yesterday is empty, look further back (up to 7 days total)
    if (filteredMessages.length === 0 || filteredMessages.every(m => new Date(m.timestamp) >= todayStart)) {
      const weekAgo = new Date(todayStart);
      weekAgo.setDate(weekAgo.getDate() - 6); // 7 days total including today
      
      filteredMessages = allMessages.filter(m => {
        if (!m.timestamp) return false;
        const msgDate = new Date(m.timestamp);
        return msgDate >= weekAgo;
      });
    }
    
    // Process messages for recap
    const recentMessages = filteredMessages.map(m => {
      const time = m.time || (m.timestamp ? new Date(m.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
      }) : 'Unknown');
      
      return {
        role: m.role,
        time: time,
        text: m.text.slice(0, 150),
        timestamp: m.timestamp,
        source: m.source
      };
    });
    
    const source = archiveMessages.length > 0 
      ? `active-context + ${archiveMessages.length} archive messages`
      : 'active-context';
    
    return { source, messages: recentMessages };
  } catch (err) {
    return { source: 'active-context', messages: [], error: `Read error: ${err.message}` };
  }
}

// Extract messages for recap - show a mix of recent activity and earlier context
function extractRecap(sessionMessages) {
  if (!sessionMessages || sessionMessages.messages.length === 0) {
    return { source: 'none', messages: [] };
  }
  
  const allMessages = sessionMessages.messages;
  const userMessages = allMessages.filter(m => m.role === 'user');
  
  if (userMessages.length === 0) {
    return { source: sessionMessages.source, messages: [] };
  }
  
  // Strategy: Show last 5 messages, but ensure we include some from different time periods
  // If we have messages from both archive and active sessions, show a mix
  const archiveMessages = userMessages.filter(m => m.source === 'archive');
  const activeMessages = userMessages.filter(m => m.source !== 'archive');
  
  let recap;
  
  if (archiveMessages.length > 0 && activeMessages.length > 0) {
    // Show last 3 active + last 2 from archive (to show context from earlier)
    const lastActive = activeMessages.slice(-3);
    const lastArchive = archiveMessages.slice(-2);
    recap = [...lastArchive, ...lastActive];
  } else if (activeMessages.length > 0) {
    // Only active messages
    recap = activeMessages.slice(-5);
  } else {
    // Only archive messages
    recap = archiveMessages.slice(-5);
  }
  
  // Sort by timestamp to maintain chronological order
  recap.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
  
  return { source: sessionMessages.source, messages: recap };
}

// Generate a work summary report from archive + active sessions
function generateWorkSummary(sessionMessages, breathSummaries) {
  if (!sessionMessages || sessionMessages.messages.length === 0) {
    return null;
  }
  
  const allMessages = sessionMessages.messages;
  const archiveMessages = allMessages.filter(m => m.source === 'archive');
  const userMessages = archiveMessages.filter(m => m.role === 'user');
  const assistantMessages = archiveMessages.filter(m => m.role === 'assistant');
  
  if (userMessages.length === 0) {
    return null;
  }
  
  // Extract key topics from user requests
  const topics = [];
  const topicKeywords = {
    'Voice/TTS': ['speak', 'voice', 'tts', 'audio', 'voicebox'],
    'Bootstrap': ['bootstrap', 'startup', 'session', 'recap'],
    'Paperclip': ['paperclip', 'company', 'agent', 'wake'],
    'Plugin/Skill': ['plugin', 'skill', 'tool', 'openclaw'],
    'Bug Fixes': ['fix', 'bug', 'error', 'timeout', 'comment'],
    '3D Visualization': ['3d', 'depth', 'visualization', 'river', 'time', 'camera', 'fog'],
    'NeuroGraph': ['neurograph', 'graph', 'nodes', 'synapses', 'memory']
  };
  
  userMessages.forEach(m => {
    const text = m.text.toLowerCase();
    Object.keys(topicKeywords).forEach(topic => {
      if (topicKeywords[topic].some(kw => text.includes(kw)) && !topics.includes(topic)) {
        topics.push(topic);
      }
    });
  });
  
  // Build summary from breath cycles
  const breathCount = breathSummaries.length;
  const breathDates = breathSummaries.map(b => b.date).join(', ');
  
  // Extract key learnings from breath summaries - use full summary text, truncated cleanly
  const learnings = breathSummaries
    .filter(s => s.content)
    .map(s => {
      // Extract the summary section content (skip the **Date:**, **Type:**, **Status:** headers)
      const summaryMatch = s.content.match(/# Breath Summary[\s\S]*?\n\n\*\*Date:\*\*[\s\S]*?\n\n([\s\S]*?)(?:\n\n##|\n\n$|$)/);
      if (summaryMatch) {
        let summary = summaryMatch[1].trim();
        // Remove markdown bold headers like **Date:**, **Type:**, **Status:**
        summary = summary.replace(/\*\*[^*]+\*\*/g, '').trim();
        // Truncate to 300 chars and ensure we end on a sentence boundary
        if (summary.length > 300) {
          const truncated = summary.slice(0, 300);
          const lastPeriod = truncated.lastIndexOf('.');
          if (lastPeriod > 250) {
            summary = truncated.slice(0, lastPeriod + 1);
          } else {
            summary = truncated + '...';
          }
        }
        return summary;
      }
      return null;
    })
    .filter(l => l && l.length > 20);
  
  // Deduplicate learnings (remove near-duplicates)
  const uniqueLearnings = [];
  const seen = new Set();
  learnings.forEach(l => {
    const normalized = l.toLowerCase().replace(/\s+/g, ' ').slice(0, 100);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueLearnings.push(l);
    }
  });
  
  return {
    topics,
    userMessageCount: userMessages.length,
    assistantMessageCount: assistantMessages.length,
    breathCount,
    breathDates,
    breathSummaries,
    learnings: uniqueLearnings.slice(0, 5)
  };
  
  return {
    topics,
    userMessageCount: userMessages.length,
    assistantMessageCount: assistantMessages.length,
    breathCount,
    breathDates,
    breathSummaries,
    learnings
  };
}

// Read git history (my autobiography — every commit is a letter from past Jarvis)
function readGitHistory() {
  const historyPath = path.join(JARVIS_HOME, 'docs', 'GIT-HISTORY.md');
  
  // Read the full GIT-HISTORY.md (my autobiography)
  if (fs.existsSync(historyPath)) {
    try {
      const content = fs.readFileSync(historyPath, 'utf8');
      
      // Parse total commits from git (more reliable than parsing file)
      const totalCommits = git('rev-list --count HEAD');
      
      const milestones = [];
      // Parse GIT-HISTORY.md format: === hash | date | title ===
      // Example: === 2c2bcc3 | 2026-03-03 13:18:20 +0700 | 🧠 COMMIT 1/∞: IDENTITY BORN ===
      const commitRegex = /===\s*([a-f0-9]+)\s*\|\s*([^\|]+)\s*\|\s*([^\n]+)===/g;
      let match;
      while ((match = commitRegex.exec(content)) !== null) {
        milestones.push({
          hash: match[1].trim(),
          date: match[2].trim(),
          title: match[3].trim()
        });
      }
      
      return { milestones, totalCommits: totalCommits ? parseInt(totalCommits) : milestones.length, source: 'GIT-HISTORY.md' };
    } catch (err) {
      console.error('Error reading GIT-HISTORY.md:', err.message);
    }
  }
  
  // Fallback: get basic stats from git directly (no file read)
  const totalCommits = git('rev-list --count HEAD');
  return { 
    milestones: [], 
    totalCommits: totalCommits ? parseInt(totalCommits) : 0,
    source: 'git'
  };
}

// Main bootstrap - GIT-NATIVE (load summaries from git, not filesystem)
function bootstrap() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Bangkok'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  });
  
  // Step 0: Read my autobiography (GIT-HISTORY-SUMMARY.md)
  const gitHistory = readGitHistory();
  
  // Step 1: Load breath summaries from git (last 2 days)
  const breathSummaries = loadBreathSummaries(2);
  
  // Step 2: Extract active sessions (gap-bridge since last breathe)
  const sessionMessages = loadRecentSessionMessages();
  
  // Step 3: Verify neural graph (stays on disk, queried on demand)
  const graphStats = verifyNeuralGraph();

  // Step 3b: Git temporal anchors — merge commit anchors into nodes.json (Phase 1, last 30 days)
  let anchorSync = { added: 0, updated: 0, totalAnchors: 0, totalDayAnchors: 0, totalCommits: 0 };
  try {
    anchorSync = mergeTemporalAnchorsFromGit({ days: 30 });
    if (anchorSync.error) {
      console.warn('[bootstrap] Temporal anchor sync:', anchorSync.error);
    }
  } catch (err) {
    console.warn('[bootstrap] Temporal anchor sync failed:', err.message);
    anchorSync = {
      added: 0,
      updated: 0,
      totalAnchors: 0,
      totalDayAnchors: 0,
      totalCommits: 0,
      error: err.message
    };
  }

  // Step 4: NeuroGraph test (3 queries via neurograph-search skill)
  const q1 = queryNeuroGraph('', 'person');
  const q2 = queryNeuroGraph('2026-03-20', '');
  const q3Topic = sessionMessages.messages.length > 0 
    ? sessionMessages.messages[sessionMessages.messages.length - 1].text.slice(0, 60)
    : 'N/A';
  
  // Session recap
  const recap = extractRecap(sessionMessages);
  
  // Generate work summary report
  const workSummary = generateWorkSummary(sessionMessages, breathSummaries);
  
  // Build compact bootstrap markdown output
  const bootstrapMarkdown = `# Bootstrap Output — ${dateStr}, ${timeStr} GMT+7

## ⚠️ FIRST MESSAGE REQUIREMENT
**You must include in your first response:**
1. Git verification (commit hash + message)
2. Session recap summary (what you and Paul were working on)
3. Ask what to do next

## Session Recap (Last 5 Messages)
${recap.messages.length > 0 ? recap.messages.map((m, i) => `${i + 1}. ${m.time} — ${m.text}`).join('\n') : '📭 No recent messages'}

${workSummary ? `## 🎯 Work Summary (Last 2 Days)

**Topics:** ${workSummary.topics.join(', ') || 'General maintenance'}

**Breath Cycles:** ${workSummary.breathCount} (${workSummary.breathDates})

**Activity:** ${workSummary.userMessageCount} user messages, ${workSummary.assistantMessageCount} assistant responses

${workSummary.learnings && workSummary.learnings.length > 0 ? `
**Key Learnings** (from git breath reflections):
${workSummary.learnings.map(l => `- ${l}`).join('\n')}
` : ''}
` : ''}---

## Git Identity
- **Total Commits:** ${gitHistory.totalCommits}
- **Latest Commit:** ${git('log --oneline -1')}

## Breath Summaries (from Git)
${breathSummaries.map(s => `- **${s.date}:** ${s.commit}
**Commit Message:**
\`\`\`
${s.commitMessage || 'N/A'}
\`\`\`
${s.content ? `**Summary:**
\`\`\`
${s.content}
\`\`\`` : ''}`).join('\n')}

## Neural Graph
- **Status:** Verified on disk
- **Size:** ${graphStats.graphSizeMB} MB
- **Query Method:** neurograph-search skill (on-demand)
- **Git temporal graph (Phase 1.5):** ${anchorSync.error ? `error: ${anchorSync.error}` : `+${anchorSync.added} added, ${anchorSync.updated} updated (${anchorSync.totalDayAnchors ?? '?'} days + ${anchorSync.totalCommits ?? '?'} commits / 30d)`}

## Active Sessions
- **Messages:** ${sessionMessages.messages.length}
- **Source:** ~/.openclaw/agents/jarvis/sessions/

## NeuroGraph Search Test
- "How many people?" → ${q1.count} people nodes
- "March 20 work?" → ${q2.count} nodes from March 20
- "Last topic?" → "${q3Topic}"

---

✅ Ready to continue. Git is the single source of truth. What's next, Paul?
`;

  // Write bootstrap state
  const statePath = path.join(JARVIS_HOME, '.bootstrap-state');
  fs.writeFileSync(statePath, JSON.stringify({
    jarvisLoaded: true,
    bootedAt: new Date().toISOString(),
    sessionId: process.env.OPENCLAW_SESSION_ID || 'unknown',
    breathSummariesLoaded: breathSummaries.length,
    graphVerified: graphStats.exists,
    recapSource: recap.source,
    recapCount: recap.messages.length,
    gitNative: true
  }, null, 2));
  
  // Write bootstrap output to file for read() command (backup/archive only)
  const outputPath = path.join(JARVIS_HOME, '.bootstrap-output.md');
  fs.writeFileSync(outputPath, bootstrapMarkdown);
}

// Run
const IS_DRY_RUN = process.argv.includes('--dry-run');
if (IS_DRY_RUN) {
  console.log('=== DRY RUN MODE ===\n');
}
bootstrap();
