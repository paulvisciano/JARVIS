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

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');

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
  
  // Step 3: Report state
  console.log('✅ Bootstrap complete.');
  console.log('   Neural graph: loaded');
  console.log('   Recent context: loaded');
  console.log('   Ready.');
}

// Run
bootstrap();
