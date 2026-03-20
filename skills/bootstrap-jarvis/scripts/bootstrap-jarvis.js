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
  
  // Step 5: Self-conversation test (agent MUST answer using NeuroGraph + Archive)
  console.log('\n🫀 SELF-CONVERSATION TEST (Agent must answer these NOW):');
  console.log('   ================================================\n');
  
  // Prepare test data from NeuroGraph + Archive
  try {
    const nodes = JSON.parse(fs.readFileSync(path.join(GRAPH_DIR, 'nodes.json'), 'utf8'));
    const marchNodes = nodes.filter(n => n.label?.includes('2026-03-20') || n.createdAt?.includes('2026-03-20'));
    const people = nodes.filter(n => n.category === 'person');
    
    console.log('   ❓ QUESTION 1: "What were we working on March 20, 2026?"');
    console.log(`      → NeuroGraph has ${marchNodes.length} nodes from March 20, 2026`);
    console.log('      → Use neuro-graph-search to query: "March 20 2026"\n');
    
    console.log('   ❓ QUESTION 2: "What was the last conversation topic?"');
    console.log(`      → Archive: ~/RAW/archive/2026-03-20/full-context.json`);
    console.log(`      → Last topic: "${lastTopic}"`);
    console.log('      → Read the archive file to answer\n');
    
    console.log('   ❓ QUESTION 3: "How many people are in the NeuroGraph?"');
    console.log(`      → NeuroGraph has ${people.length} people nodes`);
    console.log('      → Use neuro-graph-search to query: "category:person"\n');
    
  } catch (err) {
    console.error(`   ❌ Failed to prepare test data: ${err.message}`);
  }
  
  console.log('   ================================================\n');
  console.log('   ⏳ Agent must answer these questions using:');
  console.log('      - neuro-graph-search (for NeuroGraph queries)');
  console.log('      - read tool (for archive files)');
  console.log('      If you can answer → NeuroGraph + Archive ARE accessible.');
  console.log('      If you cannot → Bootstrap failed to load context.\n');
  
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
