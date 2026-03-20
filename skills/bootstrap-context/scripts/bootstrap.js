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

// Load context from archive (or extract if missing)
function loadContext(date) {
  const archivePath = path.join(RAW_ARCHIVE, date);
  if (!fs.existsSync(archivePath)) {
    return null;
  }
  
  const outputPath = path.join(archivePath, 'full-context.json');
  
  // If full-context.json exists, load it directly
  if (fs.existsSync(outputPath)) {
    return JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  }
  
  // Otherwise, run context-extractor to create it
  try {
    execSync(`node "${CONTEXT_EXTRACTOR}" ${date}`, { 
      stdio: 'pipe',
      env: { ...process.env, HOME, JARVIS_HOME, RAW_ARCHIVE }
    });
    
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
  const sessions = context.sessions || [];
  const transcripts = context.transcripts || [];
  
  // Get time span from audio transcripts (extract HH:MM from filename)
  const sortedTranscripts = [...transcripts].sort((a, b) => a.file.localeCompare(b.file));
  
  function extractTime(filename) {
    // Filename format: convo-jarvis-2026-03-20-083225.wav.txt
    // Extract HHMMSS and format as HH:MM
    const match = filename.match(/-(\d{2})(\d{2})(\d{2})\./);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return null;
  }
  
  const firstTime = sortedTranscripts.length ? extractTime(sortedTranscripts[0].file) : null;
  const lastTime = sortedTranscripts.length ? extractTime(sortedTranscripts[sortedTranscripts.length - 1].file) : null;
  
  // Get last activity (audio or session, whichever is more recent)
  let lastActivity = null;
  if (sortedTranscripts.length > 0) {
    const last = sortedTranscripts[sortedTranscripts.length - 1];
    lastActivity = {
      type: 'audio',
      time: extractTime(last.file),
      text: last.text.split('\n')[0]
    };
  } else if (sessions.length > 0) {
    const lastSession = sessions[sessions.length - 1];
    const lastMsg = lastSession.messages?.[lastSession.messages.length - 1];
    lastActivity = {
      type: 'session',
      text: lastMsg?.content?.[0]?.text || lastMsg?.content || ''
    };
  }
  
  // Recent transcripts (last 10)
  const recentTranscripts = sortedTranscripts.slice(-10).map(t => {
    const firstLine = t.text.split('\n')[0];
    return {
      file: t.file,
      time: extractTime(t.file),
      preview: firstLine.length > 100 ? firstLine.slice(0, 100) + '...' : firstLine
    };
  });
  
  return {
    date,
    sessions: stats.sessionFiles || 0,
    messages: stats.totalMessages || 0,
    transcripts: stats.transcriptFiles || 0,
    totalItems: (stats.sessionFiles || 0) + (stats.transcriptFiles || 0),
    timeSpan: { first: firstTime, last: lastTime },
    lastActivity,
    recentTranscripts
  };
}

// Main bootstrap
function bootstrap() {
  const { today, yesterday } = getDates();
  
  console.log('🫀 Bootstrap Context Loader');
  console.log('==========================\n');
  
  const todayContext = loadContext(today);
  const yesterdayContext = loadContext(yesterday);
  
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
  
  // Print summary (no write - archive is source of truth)
  console.log(`✅ Context loaded: ${today} + ${yesterday}`);
  console.log(`   Source: ${RAW_ARCHIVE}`);
  console.log();
  
  // Full context summary (sessions + audio)
  const totalItems = (todaySummary?.totalItems || 0) + (yesterdaySummary?.totalItems || 0);
  console.log(`📊 FULL CONTEXT SUMMARY:`);
  console.log(`   Session files:    ${output.combinedStats.totalSessions}`);
  console.log(`   Session messages: ${output.combinedStats.totalMessages}`);
  console.log(`   Audio transcripts: ${output.combinedStats.totalTranscripts}`);
  console.log(`   Total items:      ${totalItems}`);
  console.log();
  
  // Time span from audio
  if (todaySummary?.timeSpan?.first) {
    console.log(`⏰ Conversation timeline:`);
    console.log(`   Today: ${todaySummary.timeSpan.first} → ${todaySummary.timeSpan.last}`);
    if (yesterdaySummary?.timeSpan?.first) {
      console.log(`   Yesterday: ${yesterdaySummary.timeSpan.first} → ${yesterdaySummary.timeSpan.last}`);
    }
    console.log();
  }
  
  // Last activity
  if (todaySummary?.lastActivity) {
    console.log(`💬 Last activity (${todaySummary.lastActivity.type}):`);
    console.log(`   Time: ${todaySummary.lastActivity.time || 'N/A'}`);
    console.log(`   "${todaySummary.lastActivity.text}"`);
    console.log();
  }
  
  // Recent audio transcripts
  if (todaySummary && todaySummary.recentTranscripts.length > 0) {
    console.log('📝 Recent audio (last 10):');
    todaySummary.recentTranscripts.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.time} — ${t.preview}`);
    });
  }
  
  return output;
}

// Run
bootstrap();
