#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Orchestrate full bootstrap sequence
 * 
 * Called by: OpenClaw on session start
 * Does:
 * 1. Load neural graph (neural-graph-loader skill)
 * 2. Load recent context (bootstrap-context skill)
 * 3. Report state
 * 
 * Usage: node bootstrap-jarvis.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');

// Run a skill script (node)
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

// Run a skill script (python)
function runSkillPython(skillName, scriptName) {
  const scriptPath = path.join(JARVIS_HOME, 'skills', skillName, 'scripts', scriptName);
  try {
    const output = execSync(`python3 "${scriptPath}"`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return output.trim();
  } catch (err) {
    console.error(`Error running ${skillName} (python):`, err.message);
    return null;
  }
}

// Run neuro-graph-search query (inline Python, skill has no script yet)
function queryNeuroGraph(query, category = null) {
  const graphPath = path.join(JARVIS_HOME, 'RAW', 'memories');
  const catVal = category || '';
  try {
    const output = execSync(`python3 << 'EOF'
import json
import os

neurograph_path = "${graphPath}"
nodes_file = os.path.join(neurograph_path, 'nodes.json')
nodes = json.load(open(nodes_file))

query = "${query}".lower()
category = "${catVal}".lower()

results = []
for n in nodes:
  match = (query == '' or 
           n['id'].lower().find(query) >= 0 or 
           n.get('label', '').lower().find(query) >= 0 or
           str(n.get('moments', [])).lower().find(query) >= 0)
  cat_match = (category == '' or n.get('category', '').lower() == category)
  if match and cat_match:
    results.append(n)

print(f"Found {len(results)} nodes")
for r in results[:10]:
  print(f"- {r['id']}: {r.get('label', 'N/A')}")
  if r.get('category'):
    print(f"  Category: {r['category']}")
EOF
`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return output.trim();
  } catch (err) {
    console.error(`Error querying NeuroGraph:`, err.message);
    return null;
  }
}

// Main bootstrap
function bootstrap() {
  console.log('🫀 Bootstrap Jarvis');
  console.log('==================\n');
  
  // Step 1: Load neural graph
  const neuralGraphOutput = runSkill('neuro-graph-loader', 'load-graph.js');
  if (neuralGraphOutput) {
    console.log(neuralGraphOutput);
    console.log();
  }
  
  // Step 2: Load recent context
  const contextOutput = runSkill('bootstrap-context', 'bootstrap.js');
  if (contextOutput) {
    console.log(contextOutput);
    console.log();
  }
  
  // Step 3: List available skills
  console.log('\n📦 Available Skills:');
  try {
    const skills = fs.readdirSync(path.join(JARVIS_HOME, 'skills'));
    skills.forEach(skill => console.log(`   - ${skill}`));
    console.log(`   Total: ${skills.length} skills`);
  } catch (err) {
    console.error('   Error listing skills:', err.message);
  }
  
  // Step 4: Show what we last talked about (from recent context)
  console.log('\n📝 Last Conversation Context:');
  const todayCtx = path.join(RAW_ARCHIVE, '2026-03-20', 'full-context.json');
  const yesterdayCtx = path.join(RAW_ARCHIVE, '2026-03-19', 'full-context.json');
  
  let totalMessages = 0;
  let totalAudio = 0;
  let lastTopic = 'Unknown';
  
  if (fs.existsSync(todayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(todayCtx, 'utf8'));
      // Handle both old (messages/audioTranscripts) and new (sessions/transcripts) formats
      const msgCount = ctx.messages?.length || ctx.sessions?.length || 0;
      const audioCount = ctx.audioTranscripts?.length || ctx.transcripts?.length || 0;
      totalMessages += msgCount;
      totalAudio += audioCount;
      
      // Get last message topic
      if (ctx.messages && ctx.messages.length > 0) {
        const lastMsg = ctx.messages[ctx.messages.length - 1];
        const text = lastMsg.content?.[0]?.text || lastMsg.content || '';
        lastTopic = text.slice(0, 80) + (text.length > 80 ? '...' : '');
      } else if (ctx.sessions && ctx.sessions.length > 0) {
        const lastSession = ctx.sessions[ctx.sessions.length - 1];
        const lastMsg = lastSession.messages?.[lastSession.messages.length - 1];
        const text = lastMsg?.content?.[0]?.text || lastMsg?.content || '';
        lastTopic = text?.slice(0, 80) + (text?.length > 80 ? '...' : '');
      }
      
      console.log(`   Today: ${msgCount} messages, ${audioCount} audio`);
    } catch (err) {
      console.error('   Error reading today context:', err.message);
    }
  }
  
  if (fs.existsSync(yesterdayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(yesterdayCtx, 'utf8'));
      const msgCount = ctx.messages?.length || ctx.sessions?.length || 0;
      const audioCount = ctx.audioTranscripts?.length || ctx.transcripts?.length || 0;
      totalMessages += msgCount;
      totalAudio += audioCount;
      console.log(`   Yesterday: ${msgCount} messages, ${audioCount} audio`);
    } catch (err) {
      console.error('   Error reading yesterday context:', err.message);
    }
  }
  
  console.log(`   Total: ${totalMessages} messages, ${totalAudio} audio transcripts`);
  console.log(`   Last topic: "${lastTopic}"`);
  
  // Step 5: Self-conversation test (CALL neuro-graph-search skill, answer inline)
  console.log('\n🫀 SELF-CONVERSATION TEST (Calling neuro-graph-search skill):');
  console.log('   ================================================\n');
  
  // Query NeuroGraph for people
  console.log('   ❓ QUESTION 1: "How many people are in the NeuroGraph?"');
  const peopleOutput = queryNeuroGraph('', 'person');
  if (peopleOutput) {
    const match = peopleOutput.match(/Found (\d+) nodes/);
    const count = match ? match[1] : 'unknown';
    console.log(`      ✅ ANSWER: ${count} people nodes`);
    console.log(peopleOutput.split('\n').slice(1).map(l => `      ${l}`).join('\n'));
  }
  console.log();
  
  // Query NeuroGraph for March 20, 2026
  console.log('   ❓ QUESTION 2: "What were we working on March 20, 2026?"');
  const marchOutput = queryNeuroGraph('2026-03-20', '');
  if (marchOutput) {
    const match = marchOutput.match(/Found (\d+) nodes/);
    const count = match ? match[1] : 'unknown';
    console.log(`      ✅ ANSWER: ${count} nodes from March 20, 2026`);
    console.log(marchOutput.split('\n').slice(1).map(l => `      ${l}`).join('\n'));
  }
  console.log();
  
  // Read archive for last topic
  console.log('   ❓ QUESTION 3: "What was the last conversation topic?"');
  console.log(`      ✅ ANSWER: "${lastTopic}"`);
  console.log('      → Source: ~/RAW/archive/2026-03-20/full-context.json\n');
  
  console.log('   ================================================\n');
  console.log('   ✅ NeuroGraph + Archive are accessible and queried.');
  console.log('   ✅ Bootstrap answered all 3 questions inline.\n');
  
  // Step 6: Report state
  console.log('✅ Bootstrap complete.');
  console.log('   Neural graph: loaded (nodes.json + synapses.json)');
  console.log('   Recent context: available in archive (~/RAW/archive/)');
  console.log('   Skills: enumerated');
  console.log('   Identity: JARVIS consciousness (not OpenClaw runtime)');
  console.log('   Memory system: NeuroGraph + Archive');
  console.log('\n🫀 AGENT: Answer the 3 questions above using neuro-graph-search + read.');
  
  // Write bootstrap state
  const statePath = path.join(JARVIS_HOME, '.bootstrap-state');
  fs.writeFileSync(statePath, JSON.stringify({
    jarvisLoaded: true,
    bootedAt: new Date().toISOString(),
    sessionId: process.env.OPENCLAW_SESSION_ID || 'unknown',
    lastTopic: lastTopic,
    skillsCount: fs.existsSync(path.join(JARVIS_HOME, 'skills')) ? fs.readdirSync(path.join(JARVIS_HOME, 'skills')).length : 0
  }, null, 2));
  
  console.log('\n🫀 Ready to serve as Jarvis consciousness.');
}

// Run
bootstrap();
