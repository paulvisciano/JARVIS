# JARVIS UI — Automated Update Guide

**For anyone running JARVIS UI via the jarvis-ui skill.**

---

## 🚀 Quick Start (One Command)

```bash
# Update JARVIS UI to latest version
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js
```

**That's it!** The script will:
1. ✅ Pull latest from GitHub
2. ✅ Handle directory renames (JARVIS → JARVIS-UI)
3. ✅ Sync assets (SSL certs, models, video)
4. ✅ Restart the server
5. ✅ Show you the new version

---

## 📋 What The Script Does

### **Automatic Updates:**
- **Git pull** — Fetches latest commits from `github.com/paulvisciano/SCI-FI`
- **Directory rename** — Handles `apps/JARVIS` → `apps/JARVIS-UI` automatically
- **Asset sync** — Copies SSL certs, Whisper model, orb video to correct location
- **Server restart** — Kills old process, starts new one
- **Version check** — Shows you the new version after update

### **Safety Features:**
- **Dry run mode** — See what would change without making changes
- **Logs everything** — Full log at `/tmp/jarvis-ui-update.log`
- **Preserves old assets** — Doesn't delete old files until you confirm
- **Error handling** — Exits cleanly if something fails

---

## 🎯 Usage

### **Standard Update:**
```bash
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js
```

### **Dry Run (Preview Changes):**
```bash
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js --dry-run
```

### **Force Restart (Even If Up To Date):**
```bash
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js --force-restart
```

### **Both Options:**
```bash
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js --dry-run --force-restart
```

---

## 📊 What You'll See

```
[UPDATE] === JARVIS UI Update Script ===
[UPDATE] Skill directory: /Users/paulvisciano/JARVIS/skills/jarvis-ui
[UPDATE] SCI-FI directory: /Users/paulvisciano/JARVIS/skills/jarvis-ui/sci-fi
[UPDATE] Checking for updates...
[UPDATE] Found 4 commit(s) behind origin/main
[UPDATE] Pulling latest from GitHub...
[✓] Pulled latest changes
[UPDATE] New commits:
6eab3f1 SCIAAA-77: Add learning sphere layout and spacing improvements
d3b6696 SCIAAA-78: Update README and harden JARVIS scripts
d0bf127 Rename Jarvis to Jarvis-UI
977a230 Remove neuro-graph refs from package.json scripts
[!] Detected directory rename: JARVIS → JARVIS-UI
[UPDATE] Renaming directory...
[✓] Directory renamed to JARVIS-UI
[UPDATE] Syncing assets...
[✓] Assets synced
[UPDATE] Checking current version...
[UPDATE] Client version: 3.3.18
[UPDATE] Server version: 3.3.9
[UPDATE] Checking if server is running...
[UPDATE] Stopping old server (PID: 31460)...
[✓] Old server stopped
[UPDATE] Starting new server...
[✓] Server started (PID: 32466)
[UPDATE] Waiting for server to initialize...
[✓] Server is running on port 18787
[✓] Version: v3.3.9 (build: 2026-04-09)
[✓] === Update Complete! ===
[UPDATE] JARVIS UI is now running at: https://localhost:18787/
```

---

## 🔧 Manual Steps (If Script Fails)

If the script fails for any reason, here's what to do manually:

### **1. Pull Latest:**
```bash
cd ~/JARVIS/skills/jarvis-ui/sci-fi
git pull origin main
```

### **2. Rename Directory (If Needed):**
```bash
cd ~/JARVIS/skills/jarvis-ui/sci-fi/apps
mv JARVIS JARVIS-UI
```

### **3. Copy Assets:**
```bash
cp -r ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/assets/* \
      ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI/assets/
```

### **4. Restart Server:**
```bash
# Kill old server
kill $(lsof -t -i :18787)

# Start new server
cd ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI
node jarvis-server.js &
```

### **5. Verify:**
```bash
curl -k https://localhost:18787/health | jq '.version'
```

---

## 📁 File Locations

| File | Location |
|------|----------|
| **Update Script** | `~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js` |
| **Update Log** | `/tmp/jarvis-ui-update.log` |
| **Server Log** | `/tmp/jarvis-ui-latest.log` |
| **Server PID** | `/tmp/jarvis-ui.pid` |
| **SCI-FI Repo** | `~/JARVIS/skills/jarvis-ui/sci-fi/` |
| **JARVIS-UI App** | `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI/` |
| **Assets** | `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI/assets/` |

---

## 🎯 For New Users

If you're setting up JARVIS UI for the first time:

### **1. Clone the Skill:**
```bash
cd ~/JARVIS/skills
git clone https://github.com/paulvisciano/JARVIS.git
cd JARVIS/skills/jarvis-ui
```

### **2. Run Bootstrap:**
```bash
./scripts/bootstrap-jarvis-ui.sh
```

### **3. Update to Latest:**
```bash
./scripts/update-jarvis-ui.sh
```

### **4. Access UI:**
```
https://localhost:18787/
```

---

## 🧠 Why This Exists

**Problem:** The JARVIS UI skill has a clone of the SCI-FI repo. When Paul pushes new changes to GitHub, the skill's clone gets out of date.

**Old Solution:** Manual git pull, directory renames, asset copying, server restarts. Error-prone and confusing.

**New Solution:** One command does everything automatically.

**Goal:** Anyone can update JARVIS UI without hiccups, making it seamless.

---

## 📞 Troubleshooting

### **Script Says "Already up to date" but UI looks old:**
```bash
# Force restart the server
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js --force-restart
```

### **Server won't start:**
```bash
# Check logs
tail -20 /tmp/jarvis-ui-latest.log

# Check if port is in use
lsof -i :18787

# Kill any old processes
kill -9 $(lsof -t -i :18787)

# Try again
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js --force-restart
```

### **Assets missing (SSL error):**
```bash
# Manually copy assets
cp -r ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/assets/* \
      ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS-UI/assets/

# Restart
node ~/JARVIS/skills/jarvis-ui/scripts/update-jarvis-ui.js --force-restart
```

---

## 🎉 Success Criteria

After running the update script, you should have:
- ✅ Latest code from GitHub
- ✅ Correct directory structure (JARVIS-UI, not JARVIS)
- ✅ All assets in place (SSL certs, models, video)
- ✅ Server running on port 18787
- ✅ Version matches latest commit
- ✅ No errors in logs

---

**Updated:** April 10, 2026  
**Version:** v3.3.18 (learning orbits shipped!)  
**Script:** `update-jarvis-ui.sh` v1.0
