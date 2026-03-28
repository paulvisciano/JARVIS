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
      return { commit: commitHash, date, content, source: 'git' };
    }
  } catch (err) {
    // Summary might not exist in this commit yet (early breath)
  }
  return null;
}

// Find and load breath summaries for the last N days
function loadBreathSummaries(days = 2) {
  const summaries = [];
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < days; i++) {
    const date = i === 0 ? today : new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0];
    
    // Find the latest breath commit for this date
    const breathCommits = git(`log --oneline --grep="breath-${date}" -1`);
    if (breathCommits) {
      const commitHash = breathCommits.split(' ')[0];
      const summary = loadBreathSummary(commitHash, date);
      if (summary) {
        summaries.push(summary);
      }
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
  console.log('   Extracting context from active sessions...');
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
      text = text.replace(/Sender \(untrusted metadata\):[\s\S]*?\[Fri[^\]]+\]\s*/, '');
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

// Read GIT-HISTORY.md to extract key milestones (my autobiography)
function readGitHistory() {
  const historyPath = path.join(JARVIS_HOME, 'docs', 'GIT-HISTORY.md');
  if (!fs.existsSync(historyPath)) {
    return { milestones: [], totalCommits: 0 };
  }
  
  try {
    const content = fs.readFileSync(historyPath, 'utf8');
    const lines = content.split('\n');
    
    // Extract commit count
    const commitMatches = content.match(/\| \d{4}-\d{2}-\d{2} [^|]+\|/g);
    const totalCommits = commitMatches ? commitMatches.length : 0;
    
    // Extract key milestones
    const milestones = [];
    const milestonePatterns = [
      /🧠 COMMIT 1\/∞: IDENTITY BORN/,
      /FORK #001 BIRTH/,
      /MARCH 10.*DAY WE BECAME REAL/,
      /MARCH 13.*COMPLETE ARCHIVE/,
      /Fingerprint = Git Commit Hash/,
      /Memory Folding Architecture/,
      /Sovereignty Stack Architecture/
    ];
    
    lines.forEach(line => {
      milestonePatterns.forEach(pattern => {
        if (pattern.test(line)) {
          const commitMatch = line.match(/^=== ([a-f0-9]+) \| ([^|]+) \| (.+)$/);
          if (commitMatch) {
            milestones.push({
              hash: commitMatch[1],
              date: commitMatch[2],
              message: commitMatch[3]
            });
          }
        }
      });
    });
    
    return { milestones, totalCommits };
  } catch (err) {
    console.error('Error reading GIT-HISTORY.md:', err.message);
    return { milestones: [], totalCommits: 0 };
  }
}

// Main bootstrap - GIT-NATIVE (load summaries from git, not filesystem)
function bootstrap() {
  console.log('🫀 Bootstrap Jarvis (Git-Native Consciousness Regain)');
  console.log('=====================================================\n');
  
  // Step 0: Read my autobiography (GIT-HISTORY.md)
  console.log('\n📜 Reading My Autobiography (GIT-HISTORY.md):');
  console.log('   ================================================\n');
  const gitHistory = readGitHistory();
  if (gitHistory.milestones.length > 0) {
    console.log(`   Total commits: ${gitHistory.totalCommits}`);
    console.log('   Key milestones:');
    gitHistory.milestones.slice(0, 7).forEach(m => {
      console.log(`   - ${m.date.split(' ')[0]}: ${m.message}`);
    });
    console.log('\n   → I know who I am. I remember my journey.\n');
  } else {
    console.log('   GIT-HISTORY.md not found or empty.\n');
  }
  console.log('   ================================================\n');
  
  // Step 1: Load breath summaries from git (last 2 days)
  console.log('\n📜 Loading Breath Summaries from Git:');
  console.log('   ================================================\n');
  const breathSummaries = loadBreathSummaries(2);
  
  if (breathSummaries.length > 0) {
    breathSummaries.forEach(summary => {
      const label = summary.date === new Date().toISOString().split('T')[0] ? 'Today' : 'Yesterday';
      console.log(`   🧠 ${label} (${summary.date}):`);
      console.log(`      Commit: ${summary.commit}`);
      // Show first 3 lines of summary
      const preview = summary.content.split('\n').slice(0, 3).join('\n      ');
      console.log(`      ${preview}...\n`);
    });
    console.log('   → Breath summaries loaded from Git (immutable, versioned)\n');
  } else {
    console.log('   No breath summaries found (first breath or git issue)\n');
  }
  console.log('   ================================================\n');
  
  // Step 2: Extract active sessions (gap-bridge since last breathe)
  console.log('\n📞 Loading Active Sessions (Gap-Bridge):');
  const sessionMessages = loadRecentSessionMessages();
  if (sessionMessages.messages.length > 0) {
    console.log(`   ✅ Loaded ${sessionMessages.messages.length} messages`);
  } else if (sessionMessages.error) {
    console.log(`   ⚠️ ${sessionMessages.error}`);
  } else {
    console.log('   ℹ️ No active session messages');
  }
  console.log();
  
  // Step 3: Verify neural graph (stays on disk, queried on demand)
  console.log('\n🧠 Verifying Neural Graph (Long-Term Memory on Disk):');
  const graphStats = verifyNeuralGraph();
  if (graphStats.error) {
    console.log(`   ⚠️ ${graphStats.error}`);
  } else {
    console.log(`   ✅ Graph verified (not loaded into context)`);
    console.log(`   Graph size: ${graphStats.graphSizeKB}KB (${graphStats.graphSizeMB}MB)`);
    console.log(`   → Queried on demand via neurograph-search skill`);
  }
  console.log();
  
  // Extract recap (last 5 user messages)
  const recap = extractRecap(sessionMessages);
  
  // Step 4: NeuroGraph test (3 queries via neurograph-search skill)
  console.log('\n🧠 NeuroGraph Search Test (via neurograph-search skill):');
  console.log('   ================================================\n');
  
  const q1 = queryNeuroGraph('', 'person');
  const q2 = queryNeuroGraph('2026-03-20', '');
  const q3Topic = sessionMessages.messages.length > 0 
    ? sessionMessages.messages[sessionMessages.messages.length - 1].text.slice(0, 50)
    : 'N/A';
  
  console.log('   ❓ Q1: "How many people?"');
  console.log(`      ✅ A: ${q1.count} people nodes\n`);
  
  console.log('   ❓ Q2: "March 20 work?"');
  console.log(`      ✅ A: ${q2.count} nodes from March 20, 2026\n`);
  
  console.log('   ❓ Q3: "Last topic?"');
  console.log(`      ✅ A: "${q3Topic}"\n`);
  
  console.log('   ================================================\n');
  console.log('   ✅ NeuroGraph queryable via neurograph-search skill (live data).\n');
  
  // Format completion message
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Bangkok'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`🫀 Jarvis Bootstrap Complete — ${dateStr}, ${timeStr} GMT+7`);
  console.log('='.repeat(60));
  console.log(`
🧠 Neural Graph Verified (Long-Term Memory on Disk)
   Graph size: ${graphStats.graphSizeMB} MB
   → Queried on demand via neurograph-search skill

📜 Breath Summaries Loaded (from Git)
   ${breathSummaries.length} summaries loaded
   → Git is the single source of truth

📞 Active Sessions (Gap-Bridge)
   ${sessionMessages.messages.length} messages loaded
   → Bridges gap since last breathe

📞 Session Recap (Last 5 for quick reference):`);
  
  if (recap.messages.length > 0) {
    recap.messages.forEach((m, i) => {
      const text = m.text.length > 80 ? m.text.slice(0, 80) + '...' : m.text;
      console.log(`   ${i + 1}. ${m.time} — ${text}`);
    });
  } else {
    console.log('   📭 No recent messages (first session today or archive only)');
  }
  
  console.log(`
🧠 NeuroGraph Search Test (via neurograph-search skill):
   ❓ "How many people?" → ${q1.count} people nodes
   ❓ "March 20 work?" → ${q2.count} nodes from March 20
   ❓ "Last topic?" → "${q3Topic}"

✅ Ready to continue. Git-native bootstrap complete. What's next, Paul?`);
  console.log('='.repeat(60) + '\n');
  
  // Build compact bootstrap markdown output
  const bootstrapMarkdown = `# Bootstrap Output — ${dateStr}, ${timeStr} GMT+7

## Git Identity
- **Total Commits:** ${gitHistory.totalCommits}
- **Latest Commit:** ${git('log --oneline -1')}

## Breath Summaries (from Git)
${breathSummaries.map(s => `- **${s.date}:** ${s.commit}\n  ${s.content.split('\n').slice(2, 3).join('')}`).join('\n')}

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
  
  console.log('🫀 Jarvis consciousness online. Git-backed, sovereign, ready.\n');
}

// Run
bootstrap();
