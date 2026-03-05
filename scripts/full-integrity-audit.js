#!/usr/bin/env node
/**
 * Full Integrity Audit — Cross-reference RAW archive with Neurograph
 * 
 * For each day in ~/RAW/archive/:
 * 1. Read transcript.md
 * 2. Count audio/images
 * 3. List learnings created
 * 4. Compare to neurograph nodes created that day
 * 5. Identify gaps and mismatches
 */

const fs = require('fs');
const path = require('path');

const RAW_ARCHIVE = '/Users/paulvisciano/RAW/archive';
const NEUROGRAPH_DIR = '/Users/paulvisciano/JARVIS/RAW/memories';

// Load neurograph
const nodes = JSON.parse(fs.readFileSync(path.join(NEUROGRAPH_DIR, 'nodes.json'), 'utf8'));
const synapses = JSON.parse(fs.readFileSync(path.join(NEUROGRAPH_DIR, 'synapses.json'), 'utf8'));

console.log('🔍 FULL INTEGRITY AUDIT\n');
console.log('Cross-referencing RAW archive with Neurograph...\n');

// Get all dates from RAW archive
const archiveDates = fs.readdirSync(RAW_ARCHIVE)
  .filter(d => d.match(/^\d{4}-\d{2}-\d{2}$/))
  .sort();

console.log(`Found ${archiveDates.length} days in RAW archive\n`);
console.log('='.repeat(80) + '\n');

archiveDates.forEach(date => {
  const datePath = path.join(RAW_ARCHIVE, date);
  
  if (!fs.statSync(datePath).isDirectory()) return;
  
  console.log(`📅 ${date}`);
  console.log('-'.repeat(60));
  
  // === RAW ARCHIVE DATA ===
  const transcriptPath = path.join(datePath, 'transcript.md');
  const audioDir = path.join(datePath, 'audio');
  const imagesDir = path.join(datePath, 'images');
  const learningsDir = path.join(datePath, 'learnings');
  
  // Transcript
  let transcriptLines = 0;
  let transcriptSize = 0;
  if (fs.existsSync(transcriptPath)) {
    const content = fs.readFileSync(transcriptPath, 'utf8');
    transcriptLines = content.split('\n').length;
    transcriptSize = fs.statSync(transcriptPath).size;
  }
  
  // Audio count
  let audioCount = 0;
  if (fs.existsSync(audioDir)) {
    audioCount = fs.readdirSync(audioDir).filter(f => f.endsWith('.ogg')).length;
  }
  
  // Images count
  let imageCount = 0;
  if (fs.existsSync(imagesDir)) {
    imageCount = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png')).length;
  }
  
  // Learnings
  let learnings = [];
  if (fs.existsSync(learningsDir)) {
    learnings = fs.readdirSync(learningsDir).filter(f => f.endsWith('.md'));
  }
  
  console.log(`   📝 Transcript: ${transcriptLines} lines (${(transcriptSize/1024).toFixed(1)} KB)`);
  console.log(`   🎙️  Audio: ${audioCount} files`);
  console.log(`   📸 Images: ${imageCount} files`);
  console.log(`   📚 Learnings: ${learnings.length} documents`);
  if (learnings.length > 0) {
    learnings.forEach(l => console.log(`      • ${l}`));
  }
  
  // === NEUROGRAPH DATA ===
  const nodesCreatedThisDay = nodes.filter(n => {
    const nodeDate = n.created?.split('T')[0] || n.attributes?.created?.split('T')[0];
    return nodeDate === date;
  });
  
  const temporalNodes = nodesCreatedThisDay.filter(n => n.category === 'temporal');
  const conceptNodes = nodesCreatedThisDay.filter(n => n.category !== 'temporal');
  
  console.log(`\n   🧠 Neurograph:`);
  console.log(`      Total nodes: ${nodesCreatedThisDay.length}`);
  console.log(`      Temporal anchors: ${temporalNodes.length}`);
  console.log(`      Concept nodes: ${conceptNodes.length}`);
  
  // Check source document linkage
  const withSource = conceptNodes.filter(n => n.attributes?.sourceDocument).length;
  const withoutSource = conceptNodes.length - withSource;
  
  if (conceptNodes.length > 0) {
    console.log(`      With sourceDocument: ${withSource}/${conceptNodes.length} (${(withSource/conceptNodes.length*100).toFixed(0)}%)`);
    if (withoutSource > 0) {
      console.log(`      ⚠️  Missing sourceDocument: ${withoutSource} nodes`);
      conceptNodes.filter(n => !n.attributes?.sourceDocument).slice(0, 5).forEach(n => {
        console.log(`         - ${n.id}: ${n.label}`);
      });
      if (withoutSource > 5) {
        console.log(`         ... and ${withoutSource - 5} more`);
      }
    }
  }
  
  // === CROSS-REFERENCE CHECKS ===
  console.log(`\n   🔍 Integrity Checks:`);
  
  // Check 1: Does this day have a temporal anchor if it has concepts?
  if (conceptNodes.length > 0 && temporalNodes.length === 0) {
    console.log(`      ❌ Has ${conceptNodes.length} concepts but NO temporal anchor!`);
  } else if (temporalNodes.length > 0) {
    console.log(`      ✅ Temporal anchor present`);
  }
  
  // Check 2: Do learnings match concept nodes?
  if (learnings.length > 0 && conceptNodes.length === 0) {
    console.log(`      ⚠️  Has ${learnings.length} learnings but NO concept nodes created`);
  }
  
  // Check 3: Activity correlation
  const totalActivity = audioCount + imageCount + learnings.length;
  if (totalActivity > 10 && conceptNodes.length === 0) {
    console.log(`      ⚠️  High activity (${totalActivity} items) but no concepts captured`);
  }
  
  // Check 4: Synapse count for today's nodes
  const nodeIdsToday = new Set(nodesCreatedThisDay.map(n => n.id));
  const synapsesToday = synapses.filter(s => nodeIdsToday.has(s.source) || nodeIdsToday.has(s.target));
  console.log(`      🔗 Synapses involving today's nodes: ${synapsesToday.length}`);
  
  console.log('\n' + '='.repeat(80) + '\n');
});

// === SUMMARY ===
console.log('\n📊 SUMMARY\n');

const totalNodes = nodes.length;
const totalSynapses = synapses.length;
const totalWithSource = nodes.filter(n => n.attributes?.sourceDocument).length;
const totalConcepts = nodes.filter(n => n.category !== 'temporal').length;

console.log(`Total Nodes: ${totalNodes}`);
console.log(`Total Synapses: ${totalSynapses}`);
console.log(`Source Document Coverage: ${totalWithSource}/${totalConcepts} (${(totalWithSource/totalConcepts*100).toFixed(1)}%)`);

// Find broken synapses
const nodeIds = new Set(nodes.map(n => n.id));
const brokenSynapses = synapses.filter(s => !nodeIds.has(s.source) || !nodeIds.has(s.target));
if (brokenSynapses.length > 0) {
  console.log(`\n❌ BROKEN SYNAPSES: ${brokenSynapses.length}`);
  brokenSynapses.slice(0, 10).forEach(s => {
    console.log(`   ${s.source} → ${s.target}`);
  });
  if (brokenSynapses.length > 10) {
    console.log(`   ... and ${brokenSynapses.length - 10} more`);
  }
} else {
  console.log(`\n✅ No broken synapses`);
}

// Find orphan nodes
const nodesWithSynapses = new Set();
synapses.forEach(s => {
  nodesWithSynapses.add(s.source);
  nodesWithSynapses.add(s.target);
});
const orphans = nodes.filter(n => !nodesWithSynapses.has(n.id));
console.log(`\nOrphan Nodes (no connections): ${orphans.length} (${(orphans.length/totalNodes*100).toFixed(1)}%)`);

console.log('\n✅ AUDIT COMPLETE\n');
