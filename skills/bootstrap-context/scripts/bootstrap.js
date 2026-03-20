#!/usr/bin/env node
/**
 * Bootstrap Context Loader
 * 
 * Runs on session start to load recent context from archive.
 * Executes context-extractor for today + yesterday, then presents summary.
 * 
 * Usage: node bootstrap.js
 * Called by: bootstrap-context skill (auto-run on session start)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use environment variables for portability
const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');

const CONTEXT_EXTRACTOR = path.join(JARVIS_HOME, 'skills', 'context-extractor', 'scripts', 'extract-context.js');

// Get today and yesterday dates
function getDates() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return {
    today: today.toISOString().slice(0, 10),
    yesterday: yesterday.toISOString().slice(0, 10)
  };
}

// Run context extractor for a date
function extractContext(date) {
  const archivePath = path.join(RAW_ARCHIVE, date);
  if (!fs.existsSync(archivePath)) {
    return null;
  }
  
  try {
    execSync(`node "${CONTEXT_EXTRACTOR}" ${date}`, { 
      stdio: 'pipe',
      env: { ...process.env, HOME, JARVIS_HOME, RAW_ARCHIVE }
    });
    
    const outputPath = path.join(archivePath, 'full-context.json');
    if (fs.existsSync(outputPath)) {
      return JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error extracting context for ${date}:`, err.message);
  }
  
  return null;
}

// Generate summary from extracted context
function summarize(context, date) {
  if (!context) return null;
  
  const stats = context.stats || {};
  const recentTranscripts = context.transcripts.slice(-10).map(t => {
    const firstLine = t.text.split('\n')[0];
    return {
      file: t.file,
      preview: firstLine.length > 100 ? firstLine.slice(0, 100) + '...' : firstLine
    };
  });
  
  return {
    date,
    sessions: stats.sessionFiles || 0,
    messages: stats.totalMessages || 0,
    transcripts: stats.transcriptFiles || 0,
    recentTranscripts
  };
}

// Main bootstrap
function bootstrap() {
  const { today, yesterday } = getDates();
  
  console.log('🫀 Bootstrap Context Loader');
  console.log('==========================\n');
  
  const todayContext = extractContext(today);
  const yesterdayContext = extractContext(yesterday);
  
  const todaySummary = summarize(todayContext, today);
  const yesterdaySummary = summarize(yesterdayContext, yesterday);
  
  // Build presentation
  const output = {
    bootstrappedAt: new Date().toISOString(),
    dates: { today, yesterday },
    today: todaySummary,
    yesterday: yesterdaySummary,
    combinedStats: {
      totalSessions: (todaySummary?.sessions || 0) + (yesterdaySummary?.sessions || 0),
      totalMessages: (todaySummary?.messages || 0) + (yesterdaySummary?.messages || 0),
      totalTranscripts: (todaySummary?.transcripts || 0) + (yesterdaySummary?.transcripts || 0)
    }
  };
  
  // Write bootstrap state
  const statePath = path.join(HOME, '.openclaw', 'workspace', '.bootstrap-context.json');
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(output, null, 2), 'utf8');
  
  // Print summary
  console.log(`✅ Context loaded: ${today} + ${yesterday}`);
  console.log(`   Sessions: ${output.combinedStats.totalSessions} files`);
  console.log(`   Messages: ${output.combinedStats.totalMessages}`);
  console.log(`   Audio: ${output.combinedStats.totalTranscripts} transcripts`);
  console.log(`   State: ${statePath}`);
  
  if (todaySummary && todaySummary.recentTranscripts.length > 0) {
    console.log('\n📝 Recent audio (today):');
    todaySummary.recentTranscripts.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.file.split('-').slice(3).join(' ').replace('.txt', '')}`);
      console.log(`      "${t.preview}"`);
    });
  }
  
  return output;
}

// Run
bootstrap();
