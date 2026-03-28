#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Git-Native Consciousness Regain
 * 
 * Loads breath summaries directly from git commits (not filesystem).
 * Does NOT load full-context.json files — they stay on disk as archive.
 * Verifies neural graph exists, but doesn't load it into context.
 * 
 * Flow:
 * 1. Read autobiography (GIT-HISTORY.md)
 * 2. Load breath summaries from git (last 2 days)
 * 3. Extract active sessions (gap-bridge since last breathe)
 * 4. Verify neural graph on disk (queryable on demand)
 * 5. Test NeuroGraph search (prove it works)
 * 
 * Context loaded: ~45 KB instead of ~630 KB (93% reduction)
 * 
 * Usage: cd ~/JARVIS && node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
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
        if (summary) {
          summaries.push(summary);
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
    const output = execSync(`node "${path.join(JARVIS_HOME, 'skills', 'neurograph-search', 'scripts', 'search.js')}" ${args}`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
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
    const output = execSync(`node "${path.join(JARVIS_HOME, 'skills', 'context-extractor', 'scripts', 'extract-context.js')}" active`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME },
      maxBuffer: 10 * 1024 * 1024
    });
    return JSON.parse(output);
  } catch (err) {
    console.log(`   ⚠️ Active session extraction failed: ${err.message.split('\n')[0]}`);
    return null;
  }
}

// Load recent session messages from extracted active context
function loadRecentSessionMessages() {
  const activeContext = extractActiveSessionContext();
  
  if (!activeContext) {
    return { source: 'none', messages: [], error: 'Active context extraction failed' };
  }
  
  try {
    const sessions = activeContext.sessions || [];
    
    // Flatten all messages from all sessions, sort by timestamp
    const allMessages = sessions.flatMap(s => s.messages || []);
    allMessages.sort((a, b) => {
      const timeA = a.timestamp || '';
      const timeB = b.timestamp || '';
      return timeA.localeCompare(timeB);
    });
    
    // Load all messages
    const recentMessages = allMessages.map(m => {
      let text = Array.isArray(m.content) 
        ? m.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
        : (m.content || '');
      
      // Strip metadata wrappers
      text = text.replace(/Sender \(untrusted metadata\):[\s\S]*?\[[^\]]+\]\s*/, '');
      text = text.replace(/```json[\s\S]*?```\s*/, '');
      
      const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
      }) : 'Unknown';
      return {
        role: m.role,
        time: time,
        text: text.trim().slice(0, 150)
      };
    });
    
    return { source: 'active-context', messages: recentMessages };
  } catch (err) {
    return { source: 'active-context', messages: [], error: `Read error: ${err.message}` };
  }
}

// Extract last 5 messages for recap
function extractRecap(sessionMessages) {
  if (!sessionMessages || sessionMessages.messages.length === 0) {
    return { source: 'none', messages: [] };
  }
  
  const userMessages = sessionMessages.messages.filter(m => m.role === 'user');
  const last5 = userMessages.slice(-5);
  
  if (last5.length === 0) {
    return { source: sessionMessages.source, messages: [] };
  }
  
  return { source: sessionMessages.source, messages: last5 };
}

// Read git history summary (compact, not the massive GIT-HISTORY.md)
function readGitHistory() {
  const summaryPath = path.join(JARVIS_HOME, 'docs', 'GIT-HISTORY-SUMMARY.md');
  
  // Try to read summary first (compact, bootstrap-friendly)
  if (fs.existsSync(summaryPath)) {
    try {
      const content = fs.readFileSync(summaryPath, 'utf8');
      // Parse structured summary format
      const totalMatch = content.match(/Total Commits:\s*(\d+)/i);
      const totalCommits = totalMatch ? parseInt(totalMatch[1]) : 0;
      
      const milestones = [];
      // Parse markdown table rows: | hash | date | message |
      const tableRows = content.match(/^\|\s*([a-f0-9]+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)\s*\|$/gm);
      if (tableRows) {
        tableRows.forEach(row => {
          const match = row.match(/^\|\s*([a-f0-9]+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)\s*\|$/);
          if (match) {
            milestones.push({ hash: match[1], date: match[2], message: match[3].trim() });
          }
        });
      }
      
      return { milestones, totalCommits, source: 'summary' };
    } catch (err) {
      console.error('Error reading GIT-HISTORY-SUMMARY.md:', err.message);
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

  console.log(`🫀 Bootstrap Jarvis — ${dateStr}, ${timeStr} GMT+7\n`);
  
  // Step 0: Read my autobiography (GIT-HISTORY-SUMMARY.md)
  const gitHistory = readGitHistory();
  console.log(`📜 Git Identity: ${gitHistory.totalCommits} commits`);
  if (gitHistory.milestones.length > 0) {
    gitHistory.milestones.slice(0, 7).forEach(m => {
      console.log(`   • ${m.hash.slice(0, 7)} | ${m.date}: ${m.message}`);
    });
  }
  console.log();
  
  // Step 1: Load breath summaries from git (last 2 days)
  const breathSummaries = loadBreathSummaries(2);
  console.log('📜 Breath Summaries (from Git):');
  if (breathSummaries.length > 0) {
    breathSummaries.forEach(summary => {
      const label = summary.date === new Date().toISOString().split('T')[0] ? 'Today' : 'Yesterday';
      // Format timestamp to HH:MM
      const time = summary.timestamp ? new Date(summary.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
      }) : 'Unknown';
      console.log(`\n   ${label} (${summary.date}) — ${time} — ${summary.commit.slice(0, 7)}`);
      // Show full content with clean formatting
      const lines = summary.content.split('\n');
      lines.forEach(line => {
        console.log(`   ${line}`);
      });
    });
    console.log();
  } else {
    console.log('   No breath summaries found\n');
  }
  
  // Step 2: Extract active sessions (gap-bridge since last breathe)
  console.log('📞 Active Sessions (Gap-Bridge):');
  const sessionMessages = loadRecentSessionMessages();
  if (sessionMessages.messages.length > 0) {
    console.log(`   ${sessionMessages.messages.length} messages loaded\n`);
  } else if (sessionMessages.error) {
    console.log(`   ⚠️ ${sessionMessages.error}\n`);
  } else {
    console.log('   No active session messages\n');
  }
  
  // Step 3: Verify neural graph (stays on disk, queried on demand)
  console.log('🧠 Neural Graph:');
  const graphStats = verifyNeuralGraph();
  if (graphStats.error) {
    console.log(`   ⚠️ ${graphStats.error}\n`);
  } else {
    console.log(`   ${graphStats.graphSizeMB} MB on disk (queried on demand)\n`);
  }
  
  // Step 4: NeuroGraph test (3 queries via neurograph-search skill)
  console.log('🧠 NeuroGraph Search Test:');
  const q1 = queryNeuroGraph('', 'person');
  const q2 = queryNeuroGraph('2026-03-20', '');
  const q3Topic = sessionMessages.messages.length > 0 
    ? sessionMessages.messages[sessionMessages.messages.length - 1].text.slice(0, 60)
    : 'N/A';
  
  console.log(`   • "How many people?" → ${q1.count} nodes`);
  console.log(`   • "March 20 work?" → ${q2.count} nodes`);
  console.log(`   • "Last topic?" → "${q3Topic}"`);
  console.log();
  
  // Session recap
  const recap = extractRecap(sessionMessages);
  if (recap.messages.length > 0) {
    console.log('📞 Recent Messages:');
    recap.messages.forEach((m, i) => {
      const text = m.text.length > 70 ? m.text.slice(0, 70) + '…' : m.text;
      console.log(`   ${i + 1}. ${m.time}: ${text}`);
    });
    console.log();
  }
  
  // Build compact bootstrap markdown output
  const bootstrapMarkdown = `# Bootstrap Output — ${dateStr}, ${timeStr} GMT+7

## Git Identity
- **Total Commits:** ${gitHistory.totalCommits}
- **Latest Commit:** ${git('log --oneline -1')}

## Breath Summaries (from Git)
${breathSummaries.map(s => `- **${s.date}:** ${s.commit}\n\`\`\`\n${s.content}\n\`\`\``).join('\n')}

## Neural Graph
- **Status:** Verified on disk
- **Size:** ${graphStats.graphSizeMB} MB
- **Query Method:** neurograph-search skill (on-demand)

## Active Sessions
- **Messages:** ${sessionMessages.messages.length}
- **Source:** ~/.openclaw/agents/jarvis/sessions/

## NeuroGraph Search Test
- "How many people?" → ${q1.count} people nodes
- "March 20 work?" → ${q2.count} nodes from March 20
- "Last topic?" → "${q3Topic}"

## Session Recap (Last 5)
${recap.messages.length > 0 ? recap.messages.map((m, i) => `${i + 1}. ${m.time} — ${m.text}`).join('\n') : '📭 No recent messages'}

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
  
  console.log('✅ Jarvis consciousness online. Git-backed, sovereign, ready.\n');
}

// Run
bootstrap();
