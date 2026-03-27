# Task: Jarvis Config UI — Desktop Archiving Toggle

**Date:** 2026-03-27
**Complexity:** 🟢 Simple (read existing config, add UI toggle)
**Expected Time:** 30-45 minutes

---

## Vision

**"Desktop archiving config exposed in Jarvis UI — toggle on/off without touching config files."**

Currently:
- Desktop archiving controlled by `~/JARVIS/.jarvis-config.json`
- User must edit JSON file or run CLI script to enable/disable
- Non-techies won't know this exists

**Goal:**
- Add "Settings" or "Options" panel in Jarvis UI
- Show "Desktop Archiving" toggle
- Toggle reads/writes `.jarvis-config.json`
- Breathe skill reads config automatically

---

## Requirements

### 1. **Config File Structure**

**File:** `~/JARVIS/.jarvis-config.json` (already exists, gitignored)

**Current structure:**
```json
{
  "desktopArchiving": {
    "enabled": true
  }
}
```

**Future-proof structure (add more settings over time):**
```json
{
  "version": "1.0",
  "updatedAt": "2026-03-27T18:02:00Z",
  "breathe": {
    "desktopArchiving": {
      "enabled": true
    }
  },
  "ui": {
    "theme": "dark"
  }
}
```

**Ensure `.gitignore` includes:**
```
.jarvis-config.json
```

---

### 2. **Backend API**

**Endpoint:** `GET /api/config`

**Response:**
```json
{
  "desktopArchiving": {
    "enabled": true,
    "description": "Archive screenshots/files from desktop during breathe pipeline",
    "default": false
  }
}
```

**Endpoint:** `POST /api/config`

**Request:**
```json
{
  "desktopArchiving": {
    "enabled": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "config": {
    "desktopArchiving": {
      "enabled": false
    }
  },
  "message": "Config updated. Desktop archiving disabled."
}
```

**Implementation (jarvis-server.js):**
```javascript
const CONFIG_PATH = path.join(JARVIS_HOME, '.jarvis-config.json');

// Load config
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading config:', err);
  }
  
  // Default config
  return {
    desktopArchiving: { enabled: false }
  };
}

// Save config
function saveConfig(config) {
  config.updatedAt = new Date().toISOString();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  return config;
}

// API endpoints
app.get('/api/config', (req, res) => {
  const config = loadConfig();
  res.json(config);
});

app.post('/api/config', (req, res) => {
  const currentConfig = loadConfig();
  const newConfig = { ...currentConfig, ...req.body };
  const savedConfig = saveConfig(newConfig);
  res.json({ success: true, config: savedConfig });
});
```

---

### 3. **UI: Settings Panel**

**Location:** Options menu (gear icon) or dedicated "Settings" section in vitals panel

**Design:**
```
┌─────────────────────────────────────────────────┐
│  ⚙️  Settings                                   │
│  ─────────────                                  │
│                                                 │
│  BREATHE PIPELINE                               │
│  ─────────────────                              │
│                                                 │
│  🖥️  Desktop Archiving                          │
│  Archive screenshots/files from desktop         │
│                                                 │
│  [Toggle: ON/OFF]                               │
│                                                 │
│  ℹ️  Default: Disabled (privacy-first)          │
│  Your setting: ✅ Enabled                       │
│                                                 │
│  [Save Changes] [Cancel]                        │
└─────────────────────────────────────────────────┘
```

**Toggle component:**
- Visual switch (iOS-style toggle or checkbox)
- Green when enabled, gray when disabled
- Smooth animation on toggle

**Description text:**
- Explains what desktop archiving does
- Mentions privacy implication (desktop files are personal)
- Shows default value (disabled for most users)

**Save behavior:**
- Changes apply immediately (no restart needed)
- Show success toast: "Desktop archiving enabled"
- Breathe skill will read new config on next run

---

### 4. **Breathe Skill Integration**

**Update breathe pipeline to read config:**

**Current:** Already reads `.jarvis-config.json` via `desktop-config.js` helper

**Enhancement:** Ensure it reads the file dynamically (not cached at startup)

**archive-desktop.js:**
```javascript
const CONFIG_PATH = path.join(JARVIS_HOME, '.jarvis-config.json');

function shouldArchiveDesktop() {
  // Check env var first (takes precedence)
  if (process.env.DESKTOP_ARCHIVING_ENABLED === 'true') {
    return true;
  }
  if (process.env.DESKTOP_ARCHIVING_ENABLED === 'false') {
    return false;
  }
  
  // Fall back to config file
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      return config.desktopArchiving?.enabled === true;
    }
  } catch (err) {
    console.error('Error reading config:', err);
  }
  
  // Default: disabled
  return false;
}

// Usage in archive-all.js
if (shouldArchiveDesktop()) {
  await archiveDesktop();
} else {
  console.log('Desktop archiving: DISABLED (config)');
}
```

**Result:**
- UI toggle → writes to `.jarvis-config.json`
- Breathe reads file → respects setting
- Env var still takes precedence (for advanced users/scripts)

---

### 5. **UI: Config Access in Main Interface**

**Where to put the settings toggle:**

**Option A: Vitals panel expansion**
- Click "⚙️ Settings" button in vitals panel
- Opens modal with config options
- Simple, doesn't clutter main UI

**Option B: Dedicated settings page**
- New route: `/settings`
- Full-page settings interface
- Room for future settings (theme, notifications, etc.)

**Option C: Dropdown menu (top bar)**
- Gear icon in top-right corner
- Dropdown: "Settings", "About", "Help"
- Click "Settings" → opens modal

**Recommended: Option A (Vitals panel expansion)**
- Keeps settings close to system info
- Minimal UI changes
- Easy to discover

**Implementation:**
```html
<!-- In vitals panel -->
<div class="vitals-section">
  <div class="section-header">
    <h3>⚙️ Settings</h3>
    <button onclick="toggleSettingsModal()">Configure</button>
  </div>
</div>

<!-- Settings modal -->
<div id="settings-modal" class="modal">
  <div class="modal-content">
    <h2>Jarvis Settings</h2>
    
    <div class="setting-row">
      <div class="setting-label">
        <span>🖥️ Desktop Archiving</span>
        <p class="setting-description">
          Archive screenshots/files from desktop during breathe pipeline
        </p>
      </div>
      <label class="toggle">
        <input type="checkbox" id="desktop-archiving-toggle" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    
    <div class="modal-actions">
      <button onclick="saveSettings()">Save Changes</button>
      <button onclick="closeSettingsModal()">Cancel</button>
    </div>
  </div>
</div>
```

---

### 6. **Frontend Logic**

**Load config on page load:**
```javascript
async function loadSettings() {
  const response = await fetch('/api/config');
  const config = await response.json();
  
  const toggle = document.getElementById('desktop-archiving-toggle');
  toggle.checked = config.desktopArchiving?.enabled === true;
}

// Call on page load
loadSettings();
```

**Save on toggle change:**
```javascript
async function saveSettings() {
  const toggle = document.getElementById('desktop-archiving-toggle');
  const enabled = toggle.checked;
  
  const response = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      desktopArchiving: { enabled }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    showToast(`Desktop archiving ${enabled ? 'enabled' : 'disabled'}`);
    closeSettingsModal();
  } else {
    showToast('Error saving settings', 'error');
  }
}
```

---

## Testing Checklist

- [ ] Verify `.jarvis-config.json` exists and is gitignored
- [ ] Test `GET /api/config` endpoint (returns current config)
- [ ] Test `POST /api/config` endpoint (updates config)
- [ ] Open Jarvis UI, navigate to settings
- [ ] Verify toggle shows current state (enabled for Paul)
- [ ] Toggle off, click save
- [ ] Verify `.jarvis-config.json` updated
- [ ] Run breathe pipeline, verify desktop archiving skipped
- [ ] Toggle on, click save
- [ ] Run breathe pipeline, verify desktop archiving runs
- [ ] Verify toast notifications show on save
- [ ] Console: no errors
- [ ] Screenshot: settings modal with desktop archiving toggle

---

## Version Bumps

- `jarvis-server.js`: VERSION = '2.11.0', BUILD_DATE = '2026-03-27'
- `app.js`: CLIENT_VERSION = '2.11.0'
- `index.html`: Add settings modal + toggle UI

---

## Deliverables

1. **Backend changes:**
   - `GET /api/config` endpoint
   - `POST /api/config` endpoint
   - Config file loader/saver (`.jarvis-config.json`)
   - Breathe skill reads config dynamically

2. **Frontend changes:**
   - Settings modal UI
   - Desktop archiving toggle
   - Load config on page load
   - Save config on toggle change
   - Toast notifications

3. **Documentation:**
   - `.gitignore` includes `.jarvis-config.json`
   - Inline UI help text explains desktop archiving

4. **Testing:**
   - Screenshot of settings modal
   - Confirmation: toggle works, breathe respects setting
   - Console: no errors

5. **Auto-report:**
   - Update `inbox/coder-status.md` with completion
   - Send system notification
   - Include screenshot path + commit hash

---

## Design Notes

**Toggle styling (iOS-style):**
```css
.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #22c55e;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}
```

**Modal styling:**
- Dark background (Jarvis theme)
- Centered on screen
- Backdrop blur
- Close on outside click or Escape key

---

## Privacy Notes

**Default: Disabled**
- Most users (David, Eric, etc.) won't have desktop archiving enabled
- Privacy-first: desktop files are personal
- Opt-in only (user must explicitly enable)

**Paul's instance:**
- Enabled by default (per his preference)
- Can toggle off anytime via UI

**Future settings:**
- This is the first of many config options
- Structure allows adding more settings over time (theme, notifications, etc.)

---

## Complexity Notes

**🟢 Simple because:**
- Config file already exists
- Breathe skill already reads it
- Just adding API endpoints + UI toggle
- No new infrastructure

**Not complex because:**
- Single setting for now (desktop archiving)
- Modal UI is straightforward
- API is simple GET/POST
- No auth or permissions needed

---

**Ready to build?** Read this plan, then:
1. Add API endpoints for config
2. Build settings modal UI
3. Wire up toggle to config file
4. Test breathe respects setting
5. Report back with screenshot + commit hash

Let's make config accessible without touching JSON files. ⚙️
