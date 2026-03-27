# Task: Ollama Usage Stats in Jarvis UI

**Date:** 2026-03-27
**Complexity:** 🟡 Medium (auth flow, web scraping, UI integration)
**Expected Time:** 45-90 minutes

---

## Vision

**"Ollama usage stats visible in Jarvis UI — no tab switching needed."**

Currently:
1. Open browser → navigate to ollama.com
2. Log in manually
3. Check usage page (session %, weekly %)
4. Switch back to Jarvis

**Goal:**
- Embed Ollama usage stats directly in Jarvis vitals panel
- Auto-refresh every few minutes
- Show session usage + weekly usage + reset times
- Visual indicators (green/yellow/red based on usage level)

---

## Requirements

### 1. **Authentication Flow**

**Challenge:** Ollama.com requires login to view usage.

**Options:**

**Option A: Cookie-based auth (simplest)**
```javascript
// User logs into ollama.com manually once
// Copies session cookie to Jarvis config
// Jarvis uses cookie for API requests

// Config: ~/JARVIS/.ollama-auth.json (gitignored)
{
  "sessionCookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "paulviscianodev",
  "expiresAt": "2026-04-27T00:00:00Z"
}
```

**Option B: OAuth flow (more secure, complex)**
```javascript
// Jarvis initiates OAuth flow
// User approves in browser
// Jarvis receives access token
// Token stored securely, refreshed automatically
```

**Option C: Environment variable (for advanced users)**
```bash
export OLLAMA_API_KEY="sk-xxx"
export OLLAMA_USER_ID="paulviscianodev"
```

**Recommended: Option A (Cookie-based)**
- Simple to set up (copy-paste once)
- Works immediately
- Can be refreshed manually when expired
- Good enough for personal use

**Setup instructions for user:**
1. Log into ollama.com in browser
2. Open DevTools → Application → Cookies → ollama.com
3. Copy `session` or `auth` cookie value
4. Paste into `~/JARVIS/.ollama-auth.json`
5. Run setup script to verify

---

### 2. **Usage Data Scraping**

**Backend (jarvis-server.js):**

**Endpoint:** `GET /api/ollama-usage`

**Method A: Scrape usage page HTML**
```javascript
async function getOllamaUsage() {
  const cookie = config.ollamaAuth.sessionCookie;
  
  const response = await fetch('https://ollama.com/settings/billing', {
    headers: {
      'Cookie': `session=${cookie}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
    }
  });
  
  const html = await response.text();
  
  // Parse HTML for usage stats
  const sessionMatch = html.match(/Session usage[\s\S]*?(\d+\.?\d*)%/);
  const weeklyMatch = html.match(/Weekly usage[\s\S]*?(\d+\.?\d*)%/);
  const sessionReset = html.match(/Resets in[\s\S]*?(\d+ hours?)/);
  const weeklyReset = html.match(/Resets in[\s\S]*?(\d+ days?)/);
  
  return {
    sessionUsage: parseFloat(sessionMatch[1]),
    weeklyUsage: parseFloat(weeklyMatch[1]),
    sessionResetIn: sessionReset[1],
    weeklyResetIn: weeklyReset[1],
    lastUpdated: new Date().toISOString()
  };
}
```

**Method B: Use browser automation (more reliable)**
```javascript
// Use puppeteer or playwright to load page with auth
// Extract data from rendered DOM
// More reliable than HTML parsing, but heavier
```

**Method C: Official API (if available)**
```javascript
// Check if Ollama has a public API for usage
// GET https://ollama.com/api/v1/usage
// Would be ideal, but may not exist
```

**Recommended: Method A (HTML scraping)**
- Lightweight (no browser automation)
- Works with existing auth
- Can add retry logic for resilience

---

### 3. **UI Integration**

**Location:** Vitals panel (alongside other system stats)

**Design:**
```
┌─────────────────────────────────────────────────┐
│  OLLAMA USAGE                                   │
│  ─────────────                                  │
│  Session:  6.3%  ████████░░░░░░░░░░░░  (2h)     │
│  Weekly:   32.4% ████████░░░░░░░░░░░░  (2d)     │
│                                                 │
│  Status: ✅ Healthy (under 50% threshold)       │
└─────────────────────────────────────────────────┘
```

**Visual states:**
- ✅ **Green (0-50%):** Healthy usage
- ⚠️ **Yellow (50-80%):** Getting close to limit
- 🔴 **Red (80-100%):** Near limit, consider slowing down
- ❌ **Gray (error):** Can't fetch usage (auth expired?)

**Progress bars:**
- Visual indicator of usage level
- Color-coded (green → yellow → red)
- Shows reset countdown

**Click to refresh:**
- Click usage section → force refresh
- Shows loading spinner while fetching
- Updates timestamp on success

---

### 4. **Auto-Refresh**

**Polling interval:** Every 5 minutes (balances freshness + API load)

```javascript
// In jarvis-server.js
let ollamaUsageCache = null;
let ollamaUsageLastFetch = 0;

async function getOllamaUsageCached() {
  const now = Date.now();
  
  // Return cached if < 5 minutes old
  if (ollamaUsageCache && (now - ollamaUsageLastFetch) < 300000) {
    return ollamaUsageCache;
  }
  
  // Fetch fresh data
  ollamaUsageCache = await fetchOllamaUsage();
  ollamaUsageLastFetch = now;
  
  return ollamaUsageCache;
}

// Auto-refresh every 5 minutes
setInterval(() => {
  getOllamaUsageCached(); // Refresh cache
}, 300000);
```

**Manual refresh:**
- Button in UI: "↻ Refresh"
- Calls API immediately, bypasses cache
- Shows spinner during fetch

---

### 5. **Error Handling**

**Common errors:**
- **Auth expired:** "Session expired — update cookie in .ollama-auth.json"
- **Network error:** "Can't reach ollama.com — check connection"
- **Parse error:** "Usage page format changed — update scraper"
- **Rate limit:** "Too many requests — try again later"

**UI fallback:**
```
┌─────────────────────────────────────────────────┐
│  OLLAMA USAGE                                   │
│  ─────────────                                  │
│  ⚠️ Unable to fetch usage                       │
│                                                 │
│  Last successful: 15 minutes ago                │
│  [Retry] [Setup Instructions]                   │
└─────────────────────────────────────────────────┘
```

---

### 6. **Setup Script**

**Create:** `scripts/setup-ollama-usage.js`

```javascript
#!/usr/bin/env node

// Interactive setup for Ollama usage tracking

console.log('🔑 Ollama Usage Setup\n');
console.log('Step 1: Log into ollama.com in your browser');
console.log('Step 2: Open DevTools (Cmd+Option+I)');
console.log('Step 3: Go to Application → Cookies → ollama.com');
console.log('Step 4: Copy the "session" cookie value\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste session cookie: ', (cookie) => {
  const config = {
    sessionCookie: cookie,
    userId: 'paulviscianodev', // or extract from cookie
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
  
  fs.writeFileSync(
    path.join(JARVIS_HOME, '.ollama-auth.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('\n✅ Auth saved to ~/.ollama-auth.json');
  console.log('Testing connection...\n');
  
  // Test fetch
  testOllamaUsage().then(result => {
    if (result) {
      console.log('✅ Connection successful!');
      console.log(`   Session: ${result.sessionUsage}%`);
      console.log(`   Weekly: ${result.weeklyUsage}%`);
    } else {
      console.log('❌ Connection failed — check cookie value');
    }
    rl.close();
  });
});
```

**User runs:**
```bash
node scripts/setup-ollama-usage.js
```

---

## Testing Checklist

- [ ] Run setup script, enter cookie
- [ ] Verify `.ollama-auth.json` created (gitignored)
- [ ] Test API endpoint: `curl http://localhost:18787/api/ollama-usage`
- [ ] Verify response has sessionUsage, weeklyUsage, reset times
- [ ] Open Jarvis UI, navigate to vitals panel
- [ ] Verify Ollama usage section shows
- [ ] Verify progress bars display correctly
- [ ] Verify colors match usage levels (green/yellow/red)
- [ ] Wait 5 minutes, verify auto-refresh works
- [ ] Click refresh button, verify manual refresh works
- [ ] Test error case (expire cookie), verify error UI shows
- [ ] Console: no errors
- [ ] Screenshot: vitals panel with Ollama usage visible

---

## Version Bumps

- `jarvis-server.js`: VERSION = '2.11.0', BUILD_DATE = '2026-03-27'
- `app.js`: CLIENT_VERSION = '2.11.0'
- `index.html`: Add Ollama usage section to vitals panel

---

## Deliverables

1. **Backend changes:**
   - `.ollama-auth.json` config file (gitignored template in `.gitignore`)
   - `GET /api/ollama-usage` endpoint
   - HTML scraper for ollama.com billing page
   - 5-minute auto-refresh cache
   - Setup script (`setup-ollama-usage.js`)

2. **Frontend changes:**
   - Ollama usage section in vitals panel
   - Progress bars (session + weekly)
   - Color-coded status (green/yellow/red)
   - Refresh button + loading state
   - Error handling UI

3. **Documentation:**
   - Setup instructions in README or inline UI
   - `.gitignore` entry for `.ollama-auth.json`

4. **Testing:**
   - Screenshot of vitals panel with Ollama usage
   - Confirmation: auto-refresh works, manual refresh works
   - Console: no errors

5. **Auto-report:**
   - Update `inbox/coder-status.md` with completion
   - Send system notification
   - Include screenshot path + commit hash

---

## Design Notes

**Color thresholds:**
```javascript
function getUsageColor(percentage) {
  if (percentage < 50) return '#22c55e'; // Green
  if (percentage < 80) return '#eab308'; // Yellow
  return '#ef4444'; // Red
}
```

**Progress bar SVG:**
```svg
<svg width="200" height="8">
  <rect width="200" height="8" fill="#374151" rx="4"/>
  <rect width="126" height="8" fill="#22c55e" rx="4"/> <!-- 63% of 200 -->
</svg>
```

**Layout:**
- Add as new section in vitals panel (after System Resources or before)
- Consistent with existing vitals styling (dark background, white text)
- Compact but readable (don't overwhelm the panel)

---

## Security Notes

- `.ollama-auth.json` must be in `.gitignore` (contains session cookie)
- Never log cookie values to console
- Cookie expires after ~30 days — user needs to re-run setup
- Consider encrypting cookie at rest (optional, advanced)

---

## Complexity Notes

**🟡 Medium because:**
- Auth flow requires user setup (cookie copy-paste)
- HTML scraping can break if Ollama changes their page
- Need to handle auth expiration gracefully
- UI integration with existing vitals panel

**Not complex because:**
- No new infrastructure (just API endpoint + UI)
- Scraping logic is straightforward
- Vitals panel already exists, just adding a section
- Setup script is one-time user action

---

## Future Enhancements (Not in Scope)

- Official Ollama API integration (if they release one)
- Usage alerts (notify when approaching 80%)
- Historical usage graph (trend over time)
- Multi-account support (for teams)

---

**Ready to build?** Read this plan, then:
1. Create setup script + auth config
2. Build backend scraper endpoint
3. Add UI section to vitals panel
4. Test with Paul's ollama.com account
5. Report back with screenshot + commit hash

Let's make usage visibility seamless. 📊
