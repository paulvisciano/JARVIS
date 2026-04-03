# JARVIS Configuration Guide

**File:** `~/.jarvis-config.json`  
**Location:** Root of your JARVIS repo (`~/JARVIS/`)

---

## Overview

The `.jarvis-config.json` file stores user preferences for the JARVIS voice interface. All settings are optional and have sensible defaults.

You can edit this file directly or use the **Settings modal** in the JARVIS UI (gear icon in bottom-right).

---

## Config Schema

```json
{
  "desktopArchiving": {
    "enabled": false
  },
  "autoOpen": false
}
```

---

## Configuration Fields

### `desktopArchiving`

Controls whether Jarvis captures desktop screenshots and file system state during the "breathe" pipeline (when Jarvis is thinking).

**Type:** `object`  
**Required:** No  
**Default:** `{ "enabled": false }`

**Fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | `boolean` | No | `false` | Enable/disable desktop archiving |

**Example:**
```json
{
  "desktopArchiving": {
    "enabled": true
  }
}
```

**Use case:** Enable this if you want Jarvis to understand what you're working on by capturing screenshots and file state during conversations.

---

### `autoOpen`

Controls whether the unified Jarvis UI automatically opens when you send your first conversational message.

**Type:** `boolean`  
**Required:** No  
**Default:** `false`

**Values:**
- `true` - Automatically open `https://localhost:18787` on first message
- `false` - Don't auto-open (default behavior)

**Example:**
```json
{
  "autoOpen": true
}
```

**Behavior:**
1. When `autoOpen: true` and you send a message (not a command), the UI opens in a new browser tab
2. Only triggers on the **first** message of a session (subsequent messages don't trigger again)
3. If the browser blocks popups, a warning is shown in the UI
4. Works with any Jarvis instance (portable, no hardcoded paths)

**Use case:** Enable this if you want the UI to be visible when you start conversing with Jarvis.

---

## Editing the Config

### Method 1: Using the Settings Modal

1. Open the JARVIS UI (`https://localhost:18787`)
2. Click the **gear icon** (⚙️) in the bottom-right corner
3. Toggle the settings you want to change:
   - Desktop Archiving
   - Auto-Open UI
4. Click **Save Changes**

### Method 2: Direct File Edit

1. Open `~/.jarvis-config.json` in a text editor
2. Modify the JSON values
3. Save the file
4. Restart the JARVIS server (if it's running)

**Example:**
```json
{
  "desktopArchiving": {
    "enabled": true
  },
  "autoOpen": true
}
```

---

## Testing the Config

After changing the config:

1. **Restart the JARVIS server** (if running):
   ```bash
   # Stop current server (Ctrl+C in terminal)
   cd ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS
   node jarvis-server.js
   ```

2. **Open the UI**:
   ```bash
   open https://localhost:18787
   ```

3. **Test auto-open**:
   - Set `autoOpen: true`
   - Send a message (e.g., type "Hello" and hit Enter)
   - The UI should open in a new tab

4. **Test desktop archiving**:
   - Set `desktopArchiving.enabled: true`
   - Start a conversation
   - Check `~/JARVIS/live/` for screenshot captures

---

## Troubleshooting

### Config Not Applied

**Symptom:** Changes to `.jarvis-config.json` don't take effect.

**Fix:**
1. Restart the JARVIS server:
   ```bash
   cd ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS
   node jarvis-server.js
   ```

2. Refresh the UI (Cmd+R or F5)

### Invalid JSON Error

**Symptom:** Browser console shows JSON parsing errors.

**Cause:** Malformed JSON (missing comma, wrong quotes, etc.)

**Fix:** Use a JSON validator:
```bash
# macOS
python3 -m json.tool ~/.jarvis-config.json

# Or use an online validator
```

### Settings Modal Not Updating Config

**Symptom:** UI shows one value, but config file shows another.

**Fix:**
1. Check file permissions:
   ```bash
   ls -la ~/.jarvis-config.json
   # Should be writable by your user
   ```

2. Restart the JARVIS server (config is cached on startup)

---

## Default Config

If `.jarvis-config.json` doesn't exist or is empty, JARVIS uses these defaults:

| Field | Default |
|-------|---------|
| `desktopArchiving.enabled` | `false` |
| `autoOpen` | `false` |

You can create an empty config file:
```json
{}
```

Or use the Settings modal to set defaults.

---

## Advanced: Programmatic Config Access

The JARVIS server exposes config via API:

**Get current config:**
```bash
curl http://localhost:18787/api/config
# Response: {"desktopArchiving": {"enabled": false}, "autoOpen": false}
```

**Update config:**
```bash
curl -X POST http://localhost:18787/api/config \
  -H "Content-Type: application/json" \
  -d '{"desktopArchiving": {"enabled": true}, "autoOpen": true}'
# Response: {"success": true, "config": {...}, "message": "..."}
```

---

## Auto-Open Hook

The `autoOpen` config field works with the **auto-open-ui hook** to automatically open the Jarvis UI when you send a conversational message.

**To enable:**
1. Set `autoOpen: true` in `.jarvis-config.json`
2. Enable the hook: `openclaw hooks enable auto-open-ui` (if not already enabled)

**Hook location:** `~/JARVIS/skills/jarvis-ui/hooks/auto-open-ui/`

---

## History

- **2026-03-31:** Added `autoOpen` config field + auto-open-ui hook
- **2026-03-27:** Desktop archiving config field

---

**Created:** March 31, 2026  
**Updated:** March 31, 2026 - Auto-open feature added  
**Version:** 3.1.4
