#!/usr/bin/env node
/**
 * JARVIS Notification Helper
 * Send system notifications for task completion events.
 * 
 * Usage:
 *   node notify.js --complete --task "Task Name"
 *   node notify.js --failure --task "Task Name" --message "Error details"
 *   node notify.js --check                    - Check if notification works
 * 
 * macOS: Uses osascript (built-in)
 * Linux: Uses notify-send (requires notification-daemon)
 * Windows: Uses node-notifier (requires npm install)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const INBOX_DIR = path.join(JARVIS_HOME, 'inbox');
const INBOX_STATUS = path.join(INBOX_DIR, 'coder-status.md');

const args = process.argv.slice(2);

// Parse args
const isComplete = args.includes('--complete');
const isFailure = args.includes('--failure');
const isCheck = args.includes('--check');

const taskMatch = args.find(arg => arg.startsWith('--task='))?.split('=')[1] || '';
const messageMatch = args.find(arg => arg.startsWith('--message='))?.split('=')[1] || '';

// Get inbox contents for context
function getInboxContext() {
  if (fs.existsSync(INBOX_STATUS)) {
    const content = fs.readFileSync(INBOX_STATUS, 'utf8');
    const lastTask = content.match(/## Current Task|### (.+?)[\n\r]/)?.[1] || 'Unknown Task';
    return lastTask;
  }
  return 'Unknown Task';
}

// Send system notification
function sendNotification(options) {
  const os = require('os').type();
  const taskName = options.task || getInboxContext();
  const message = options.message || `Check ${INBOX_STATUS} for details`;
  const title = 'Jarvis Coder';
  
  console.log(`🔔 Sending notification: "${title}" -> "${message}"`);
  
  if (os === 'Darwin') {
    // macOS: Use osascript (built-in)
    const command = `osascript -e 'display notification "${message}" with title "${title}"'`;
    try {
      execSync(command, { stdio: 'inherit' });
      console.log('✅ macOS notification sent');
      return true;
    } catch (e) {
      console.warn('⚠️  macOS notification failed:', e.message);
      return false;
    }
  } else if (os === 'Linux') {
    // Linux: Use notify-send (requires notification-daemon)
    try {
      execSync(`notify-send "${title}" "${message}"`, { stdio: 'inherit' });
      console.log('✅ Linux notification sent');
      return true;
    } catch (e) {
      console.warn('⚠️  Linux notification failed (notify-send not available):', e.message);
      return false;
    }
  } else {
    // Windows or other: Try node-notifier
    try {
      const notifier = require('node-notifier');
      notifier.notify({
        title: title,
        message: message,
        icon: path.join(JARVIS_HOME, 'skills', 'jarvis-ui', 'sci-fi', 'apps', 'JARVIS', 'public', 'icon.png')
      });
      console.log('✅ Windows notification sent');
      return true;
    } catch (e) {
      console.warn('⚠️  Windows notification failed (node-notifier not available):', e.message);
      return false;
    }
  }
}

// Check if notification works
function checkNotification() {
  console.log('🔍 Checking notification configuration...\n');
  
  const os = require('os').type();
  console.log(`OS: ${os}`);
  console.log(`JARVIS_HOME: ${JARVIS_HOME}`);
  console.log(`INBOX_STATUS: ${INBOX_STATUS}`);
  console.log(`Inbox exists: ${fs.existsSync(INBOX_STATUS) ? '✅' : '❌'}`);
  
  if (os === 'Darwin') {
    console.log('\nmacOS: osascript available ✅');
  } else if (os === 'Linux') {
    console.log('\nLinux: notify-send available (requires notification-daemon)');
  } else {
    console.log('\nOther OS: node-notifier required (npm install node-notifier)');
  }
  
  console.log('\nTest notification:');
  sendNotification({ task: 'Test', message: 'If you see this, notifications are working!' });
}

// Send completion notification
function sendCompleteNotification() {
  const taskName = taskMatch || getInboxContext();
  sendNotification({
    task: taskName,
    message: `✅ Task complete. Check ${INBOX_STATUS} for details.`
  });
}

// Send failure notification
function sendFailureNotification() {
  const taskName = taskMatch || getInboxContext();
  sendNotification({
    task: taskName,
    message: `❌ Task failed. Check ${INBOX_STATUS} for details.\n\n${messageMatch}`
  });
}

// Main
if (isCheck) {
  checkNotification();
} else if (isComplete) {
  sendCompleteNotification();
} else if (isFailure) {
  sendFailureNotification();
} else {
  console.log('Usage: node notify.js --complete --task "Task Name"');
  console.log('       node notify.js --failure --task "Task Name" --message "Error details"');
  console.log('       node notify.js --check');
}
