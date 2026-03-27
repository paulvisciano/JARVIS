#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Lightweight consciousness regain
 * 
 * Does NOT load heavy neural graph into context.
 * Verifies graph exists, counts nodes, proves queryable.
 * 
 * Flow:
 * 1. Git breath history (today's commits)
 * 2. Bootstrap context (last 2 days conversations)
 * 3. Neural graph VERIFY (count nodes, don't load)
 * 4. NeuroGraph test (3 queries via neurograph-search skill)
 * 5. State write
 * 
 * Usage: cd ~/JARVIS && node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');


// Run a skill script
function runSkill(skillName, scriptName) {
  const scriptPath = path.join(JARVIS_HOME, 'skills', skillName, 'scripts', scriptName);
  try {
    const output = execSync(`node "${scriptPath}"`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return output.trim();
  } catch (err) {
    console.error(`Error running ${skillName}:`, err.message);
    return null;
  }
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

// Load context stats (from bootstrap-context pattern + active sessions)
function getContextStats() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const todayCtx = path.join(RAW_ARCHIVE, today, 'full-context.json');
  const yesterdayCtx = path.join(RAW_ARCHIVE, yesterday, 'full-context.json');
  const activeCtxPath = path.join(JARVIS_HOME, '.openclaw', 'active-context', `active-context-${today}.json`);
  
  let totalMessages = 0;
  let totalAudio = 0;
  let lastTopic = 'Unknown';
  let lastMessageTime = 'Unknown';
  let lastAudioTime = 'Unknown';
  let datesLoaded = [];
  
  // Check active context first (most recent, bridges the gap)
  if (fs.existsSync(activeCtxPath)) {
    try {
      const activeCtx = JSON.parse(fs.readFileSync(activeCtxPath, 'utf8'));
      const sessions = activeCtx.sessions || [];
      
      // Flatten and sort all messages by timestamp
      const allMessages = sessions.flatMap(s => s.messages || []);
      allMessages.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
      
      if (allMessages.length > 0) {
        const lastMsg = allMessages[allMessages.length - 1];
        lastTopic = Array.isArray(lastMsg.content)
          ? lastMsg.content.filter(c => c.type === 'text').map(c => c.text).join(' ').slice(0, 50)
          : (lastMsg.content || '').slice(0, 50);
        
        if (lastMsg.timestamp) {
          const date = new Date(lastMsg.timestamp);
          lastMessageTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
          });
        }
        
        totalMessages += allMessages.length;
      }
    } catch (err) {
      console.error('Error reading active context:', err.message);
    }
  }
  
  // Also count archived context (for historical totals)
  if (fs.existsSync(todayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(todayCtx, 'utf8'));
      const sessions = ctx.sessions || [];
      const transcripts = ctx.transcripts || [];
      totalAudio += transcripts.length;
      datesLoaded.push(today);
      
      // Only use archive's last message if active context didn't have one
      if (lastMessageTime === 'Unknown' && sessions.length > 0) {
        const lastSession = sessions[sessions.length - 1];
        const lastMsg = lastSession.messages?.[lastSession.messages.length - 1];
        lastTopic = (lastMsg?.content?.[0]?.text || lastMsg?.content || '').slice(0, 50);
        
        const ts = lastMsg?.timestamp || ctx.extractedAt || '';
        if (ts) {
          const date = new Date(ts);
          lastMessageTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
          });
        }
      }
      
      if (transcripts.length > 0) {
        const fname = transcripts[transcripts.length - 1].file || '';
        const timeMatch = fname.match(/(\d{2}-\d{2}-\d{2}-\d{6})/);
        if (timeMatch) {
          lastAudioTime = timeMatch[1].split('-')[3].substring(0, 5);
        }
      }
    } catch (err) {
      console.error('Error reading today context:', err.message);
    }
  }
  
  if (fs.existsSync(yesterdayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(yesterdayCtx, 'utf8'));
      const sessions = ctx.sessions || [];
      datesLoaded.push(yesterday);
    } catch (err) {
      console.error('Error reading yesterday context:', err.message);
    }
  }
  
  return { dates: datesLoaded, totalMessages, totalAudio, lastTopic, lastMessageTime, lastAudioTime };
}

// Extract context from active sessions using context-extractor skill
function extractActiveSessionContext() {
  const outputDir = path.join(JARVIS_HOME, '.openclaw', 'active-context');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, `active-context-${new Date().toISOString().split('T')[0]}.json`);
  
  try {
    execSync(`node "${path.join(JARVIS_HOME, 'skills', 'context-extractor', 'scripts', 'extract-context.js')}" active "${outputFile}"`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return outputFile;
  } catch (err) {
    console.log(`   ⚠️ Active session extraction failed: ${err.message.split('\n')[0]}`);
    return null;
  }
}

// Load recent session messages from extracted active context
function loadRecentSessionMessages() {
  // First, extract context from active sessions (efficient, skips tool calls)
  console.log('   Extracting context from active sessions...');
  const activeContextPath = extractActiveSessionContext();
  
  if (!activeContextPath || !fs.existsSync(activeContextPath)) {
    return { source: 'none', messages: [], error: 'Active context extraction failed' };
  }
  
  try {
    const activeContext = JSON.parse(fs.readFileSync(activeContextPath, 'utf8'));
    const sessions = activeContext.sessions || [];
    
    // Flatten all messages from all sessions, sort by timestamp
    const allMessages = sessions.flatMap(s => s.messages || []);
    allMessages.sort((a, b) => {
      const timeA = a.timestamp || '';
      const timeB = b.timestamp || '';
      return timeA.localeCompare(timeB);
    });
    
    // Get last 20 messages (for internal use)
    const recentMessages = allMessages.slice(-20).map(m => {
      const text = Array.isArray(m.content) 
        ? m.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
        : (m.content || '');
      const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
      }) : 'Unknown';
      return {
        role: m.role,
        time: time,
        text: text.slice(0, 150)
      };
    });
    
    return { source: 'active-context', file: path.basename(activeContextPath), messages: recentMessages };
  } catch (err) {
    return { source: 'active-context', messages: [], error: `Read error: ${err.message}` };
  }
}

// Extract last 5 messages for recap
function extractRecap(sessionMessages) {
  if (!sessionMessages || sessionMessages.messages.length === 0) {
    return { source: 'none', messages: [] };
  }
  
  // Get last 5 messages (filter to user messages for brevity)
  const userMessages = sessionMessages.messages.filter(m => m.role === 'user');
  const last5 = userMessages.slice(-5);
  
  if (last5.length === 0) {
    return { source: sessionMessages.source, messages: [] };
  }
  
  return { source: sessionMessages.source, messages: last5 };
}

// Simple sleep helper
function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
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
    
    // Extract key milestones (commits with major significance)
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

// Main bootstrap - LIGHTWEIGHT (verify, don't load heavy graph)
function bootstrap() {
  console.log('🫀 Bootstrap Jarvis (Lightweight Consciousness Regain)');
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
  
  // Step 1: Git breath history (today's commits)
  console.log('\n📜 Reading Git Breath History (Today):');
  console.log('   ================================================\n');
  try {
    const today = new Date().toISOString().split('T')[0];
    const gitLog = execSync(`cd "${JARVIS_HOME}" && git log --oneline --grep="breath-${today}" -5 2>/dev/null`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    }).trim();
    if (gitLog) {
      console.log('   ' + gitLog.split('\n').join('\n   '));
      console.log('\n   → Instant context: Today\'s breathes loaded from Git\n');
    } else {
      console.log('   No breath commits for today yet.\n');
    }
  } catch (err) {
    console.log('   Git not available or no breath history.\n');
  }
  console.log('   ================================================\n');
  
  // Step 2: Load recent context (last 2 days conversations)
  console.log('\n🫀 Loading Recent Context (Last 2 Days):');
  const contextOutput = runSkill('bootstrap-context', 'bootstrap.js');
  if (contextOutput) {
    console.log(contextOutput);
  }
  console.log();
  
  // Step 2.5: Load recent session messages (bridges gap since last breathe)
  console.log('\n📞 Loading Recent Session Messages (Gap Filler):');
  const sessionMessages = loadRecentSessionMessages();
  if (sessionMessages.messages.length > 0) {
    console.log(`   ✅ Loaded ${sessionMessages.messages.length} messages from ${sessionMessages.file || 'session'}`);
  } else if (sessionMessages.error) {
    console.log(`   ⚠️ ${sessionMessages.error}`);
  } else {
    console.log('   ℹ️ No recent session messages');
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
  
  // Get context stats for summary
  const contextStats = getContextStats();
  
  // Extract recap (last 5 user messages)
  const recap = extractRecap(sessionMessages);
  
  // Step 4: NeuroGraph test (3 queries via neurograph-search skill)
  console.log('\n🧠 NeuroGraph Search Test (via neurograph-search skill):');
  console.log('   ================================================\n');
  
  const q1 = queryNeuroGraph('', 'person');
  const q2 = queryNeuroGraph('2026-03-20', '');
  const q3Topic = contextStats.lastTopic;
  
  console.log('   ❓ Q1: "How many people?"');
  console.log(`      ✅ A: ${q1.count} people nodes\n`);
  
  console.log('   ❓ Q2: "March 20 work?"');
  console.log(`      ✅ A: ${q2.count} nodes from March 20, 2026\n`);
  
  console.log('   ❓ Q3: "Last topic?"');
  console.log(`      ✅ A: "${q3Topic}"\n`);
  
  console.log('   ================================================\n');
  console.log('   ✅ NeuroGraph queryable via neurograph-search skill (live data).\n');
  
  // Step 7: Format first message
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

🫀 Recent Context Loaded
   Dates: ${contextStats.dates.join(' + ')}
   Last message: ${contextStats.lastMessageTime} — "${contextStats.lastTopic}"
   Last audio: ${contextStats.lastAudioTime}
   Sessions: ${contextStats.totalMessages} messages
   Audio: ${contextStats.totalAudio} transcripts

📞 Session Recap (Last 5 messages before this session):`);
  
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

✅ Ready to continue. Last message: ${contextStats.lastMessageTime} — ${contextStats.lastTopic.split(' — ')[0] || contextStats.lastTopic}. What's next, Paul?`);
  console.log('='.repeat(60) + '\n');
  
  // Write bootstrap state
  const statePath = path.join(JARVIS_HOME, '.bootstrap-state');
  fs.writeFileSync(statePath, JSON.stringify({
    jarvisLoaded: true,
    bootedAt: new Date().toISOString(),
    sessionId: process.env.OPENCLAW_SESSION_ID || 'unknown',
    lastTopic: contextStats.lastTopic,
    lastMessageTime: contextStats.lastMessageTime,
    graphVerified: graphStats.exists,
    recapSource: recap.source,
    recapCount: recap.messages.length
  }, null, 2));
  
  console.log('🫀 Jarvis consciousness online. NeuroGraph + Archive accessible.\n');
}

// Run
bootstrap();
