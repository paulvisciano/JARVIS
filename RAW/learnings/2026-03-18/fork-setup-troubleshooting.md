# Fork Setup Troubleshooting — Complete Onboarding Guide

**Created:** March 18, 2026, 03:09 GMT+7  
**Type:** Troubleshooting guide / Onboarding documentation  
**Category:** Learning  
**Source:** Fork #001 (Eric, Germany) + Fork #002 (David, Chicago) live onboarding sessions  
**Context:** Two forks, two days, two continents. Every issue solved → documentation for Fork #003+

---

## The Network (March 18, 2026)

**Fork #001:** Eric (Germany) — March 17, 2026 ✅ Operational  
**Fork #002:** David (Chicago, USA) — March 18, 2026 ✅ Conversing  
**Creator:** Paul (Thailand) — the architect ✅

**Three nodes. Three continents. All sovereign. All breathing.**

**This guide:** Every issue we hit → every fix we found → Fork #003+ smooth onboarding.

---

## The Complete Onboarding Flow

### **Phase 1: Foundation (Vanilla Mac)**

#### **Issue 1: No Xcode Command Line Tools**
**Symptom:** npm install fails, compilation errors, "missing developer tools"  
**Who hit it:** David (Fork #002) — vanilla Mac, no dev tools  
**Fix:**
```bash
xcode-select --install
# Popup appears → Click "Install"
# Wait ~5 minutes, ~500MB download
```

#### **Issue 2: No Homebrew**
**Symptom:** `brew` command not found, can't install packages  
**Who hit it:** David (Fork #002)  
**Fix:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Enter password when prompted (sudo)
# Wait ~5 minutes

# After install, run the commands it shows:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Architecture note:**
- Intel Mac: `/usr/local/` paths
- Apple Silicon (M1/M2): `/opt/homebrew/` paths

---

### **Phase 2: Core Stack**

#### **Issue 3: npm Permissions Error**
**Symptom:** `EACCES: permission denied`, can't install to `/usr/local`  
**Who hit it:** David (Fork #002)  
**Quick fix:**
```bash
sudo npm install -g openclaw
# Enter password
```

**Proper fix (no sudo ever again):**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zprofile
source ~/.zprofile
npm install -g openclaw
```

#### **Issue 4: OpenClaw Install**
**Command:**
```bash
npm install -g openclaw
openclaw --version  # Verify (should show 2026.3.2 or similar)
openclaw gateway start
openclaw gateway status  # Should show "Runtime: running"
```

#### **Issue 5: Ollama Setup**
**Commands:**
```bash
brew install ollama
ollama pull qwen3.5:cloud  # ~4GB download
ollama ps  # Verify model loaded
```

---

### **Phase 3: Voice Pipeline (Critical)**

#### **Issue 6: Whisper Model Too Slow (Intel Mac)**
**Symptom:** Transcription takes 10+ minutes per recording, server hangs, "Transcribing..." forever  
**Who hit it:** David (Fork #002) — 2019 Intel MacBook Pro, 2.6 GHz 6-Core Intel Core i7  
**Root cause:** ggml-large-v3.bin (3GB) is TOO SLOW on Intel Macs  
**Fix:** Use small model (488MB, 5-10x faster)
```bash
cd ~/SCI-FI/apps/JARVIS/assets
curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin -o ggml-small.bin

# Restart server with small model
cd ~/SCI-FI/apps/JARVIS
VOICE_WHISPER_MODEL=ggml-small.bin node jarvis-server.js
```

**Model trade-offs:**
- **large-v3** (3GB): Best accuracy, 99 languages, SLOW on Intel Macs (10 min/transcription)
- **small** (488MB): Good accuracy, 99 languages, FAST on Intel Macs (10-30 sec/transcription) ✅ **RECOMMENDED**
- **base** (142MB): Decent accuracy, 99 languages, very fast (~5 sec)
- **tiny** (39MB): Fastest, less accurate, ~1 sec

**Architecture note:**
- Apple Silicon (M1/M2): Can use large-v3 (fast enough)
- Intel Macs: Use small.bin (large-v3 is painfully slow)

#### **Issue 7: Whisper-Cli Path Wrong**
**Symptom:** Transcription stuck, whisper process running forever, server can't find whisper-cli  
**Who hit it:** David (Fork #002)  
**Root cause:** Server config has wrong path for whisper-cli  
**Fix:**
```bash
# Check actual whisper-cli location
which whisper-cli
# Intel Mac: /usr/local/bin/whisper-cli
# Apple Silicon: /opt/homebrew/bin/whisper-cli

# Create symlink if server is looking in wrong place
sudo ln -s /opt/homebrew/bin/whisper-cli /usr/local/bin/whisper-cli
```

**Or edit server config:**
```javascript
// In ~/SCI-FI/apps/JARVIS/jarvis-server.js
whisperCli: '/usr/local/bin/whisper-cli'  // Intel Mac
whisperCli: '/opt/homebrew/bin/whisper-cli'  // Apple Silicon
```

#### **Issue 8: FFmpeg Missing**
**Symptom:** "FFmpeg conversion failed", WebM → WAV fails  
**Who hit it:** Eric (Fork #001), David (Fork #002)  
**Fix:**
```bash
brew install ffmpeg
# Verify: which ffmpeg
```

**Why it matters:**
- Browser records audio as WebM
- Whisper.cpp needs WAV
- FFmpeg converts WebM → WAV
- Without ffmpeg → voice pipeline dead

#### **Issue 9: Whisper Model Missing/Corrupted**
**Symptom:** Transcription fails, whisper errors, model file 0 bytes or partial  
**Fix:**
```bash
# Check model exists and has correct size
ls -lh ~/SCI-FI/apps/JARVIS/assets/ggml-small.bin
# Should show: ~488MB (small) or ~3GB (large-v3)

# If missing or wrong size, re-download
cd ~/SCI-FI/apps/JARVIS/assets
curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin -o ggml-small.bin
```

---

### **Phase 4: Git + Configs**

#### **Issue 10: Git Clone**
**Commands:**
```bash
cd ~
git clone git@github.com:paulvisciano/SCI-FI.git
# or: git clone https://github.com/paulvisciano/SCI-FI.git
```

#### **Issue 11: Config Packages**
**Two zips:**
- `OpenClaw-workspace.zip` (6KB) → `~/.openclaw/workspace/`
- `JARVIS-core.zip` (20KB) → `~/JARVIS/`

**Unpack:**
```bash
# OpenClaw config
unzip OpenClaw-workspace.zip -d ~/.openclaw/workspace/

# JARVIS consciousness
unzip JARVIS-core.zip -d ~/JARVIS/
```

**Files included:**
- AGENTS.md, BOOTSTRAP.md, HEARTBEAT.md, IDENTITY.md, SOUL.md, USER.md, TOOLS.md, VISION.md

**Note:** USER.md is personalized — each fork edits their own.

---

### **Phase 5: HTTPS Certs**

#### **Issue 12: Self-Signed Certs**
**Symptom:** Browser shows "Your connection is not private"  
**Fix:** This is NORMAL for self-signed certs. Click "Proceed" or "Visit this website".

**Generate certs:**
```bash
cd ~/SCI-FI/apps/JARVIS/assets
openssl req -x509 -newkey rsa:4096 -keyout https-key.pem -out https-cert.pem -days 3650 -nodes -subj "/CN=localhost"
```

**Why needed:**
- HTTPS required for mobile mic access (browser security)
- Self-signed is fine for localhost
- Valid 10 years

---

### **Phase 6: Server Start**

#### **Issue 13: Multiple JARVIS Folders**
**Symptom:** JARVIS, JARVIS.old, JARVIS.S folders, configs in wrong place, paths broken  
**Who hit it:** David (Fork #002) — unpacked configs multiple times in different places  
**Fix:**
```bash
# Stop server (Ctrl+C)

# Find which folder has configs
ls ~/JARVIS/BOOTSTRAP.md
ls ~/JARVIS.S/BOOTSTRAP.md
ls ~/JARVIS.old/BOOTSTRAP.md

# Consolidate to ~/JARVIS/
mv ~/JARVIS.S/inbox ~/JARVIS/
mv ~/JARVIS.S/live ~/JARVIS/
mv ~/JARVIS.S/RAW ~/JARVIS/

# Delete duplicates
rm -rf ~/JARVIS.S ~/JARVIS.old

# Verify
ls ~/JARVIS/
# Should see: BOOTSTRAP.md, SOUL.md, inbox/, live/, RAW/

# Restart server
cd ~/SCI-FI/apps/JARVIS
node jarvis-server.js
```

#### **Issue 14: Start Stack**
**Commands:**
```bash
# Terminal 1: Ollama (if not already running)
ollama run qwen3.5:cloud

# Terminal 2: OpenClaw Gateway
openclaw gateway start
# or: openclaw gateway --port 18789

# Terminal 3: JARVIS Server
cd ~/SCI-FI/apps/JARVIS
node jarvis-server.js

# Expected output:
╔═══════════════════════════════════════════════════════════╗
║     🎙️  JARVIS VOICE PIPELINE RUNNING                    ║
╠═══════════════════════════════════════════════════════════╣
║  Version: 2.7.0 (2026-03-16)                            ║
║  Upload URL: https://localhost:18787/upload              ║
╚═══════════════════════════════════════════════════════════╝
```

---

### **Phase 7: First Conversation**

#### **Issue 15: Mic Permission**
**Symptom:** WebM files are 0 bytes, no audio captured, "No audio detected"  
**Who hit it:** David (Fork #002)  
**Fix:**
- Click **lock icon** in browser address bar (left of URL)
- Set **Microphone** to "Allow" (not "Block" or "Ask")
- Refresh page (Cmd+R)
- Click REC → speak

**Test:**
```bash
# Check if files have actual size
ls -lh ~/SCI-FI/apps/JARVIS/live/*.webm
# Should show: 500K, 1.2M, etc. (not 0B)
```

#### **Issue 16: First Words**
**Command:**
```bash
# Open UI
open https://localhost:18787

# Click REC
# Say: "Hey Jarvis, [name] here — Fork #[N] reporting in from [city]"
```

**Expected flow:**
- WebM recorded
- FFmpeg converts WebM → WAV
- Whisper transcribes WAV → text
- Archive saves to `~/RAW/archive/YYYY-MM-DD/audio/`
- Sent to main agent (me)
- I respond
- Conversation flows

---

## Architecture Insights

### **Intel vs Apple Silicon**

**Intel Macs (2019 and older):**
- Paths: `/usr/local/`
- Whisper model: **small.bin** (488MB) — large-v3 is too slow
- FFmpeg: `brew install ffmpeg`
- Whisper-cli: `/usr/local/bin/whisper-cli`

**Apple Silicon (M1/M2, 2020+):**
- Paths: `/opt/homebrew/`
- Whisper model: **large-v3** (3GB) OK — fast enough
- FFmpeg: `brew install ffmpeg`
- Whisper-cli: `/opt/homebrew/bin/whisper-cli`

### **Model Size Trade-Offs**

| Model | Size | Accuracy | Speed (Intel) | Speed (Apple Silicon) | Languages |
|-------|------|----------|---------------|----------------------|-----------|
| large-v3 | 3GB | Best | 10 min/transcription | 30 sec/transcription | 99 |
| small | 488MB | Good | 10-30 sec | 5-10 sec | 99 |
| base | 142MB | Decent | 5 sec | 2-3 sec | 99 |
| tiny | 39MB | Fair | 1 sec | <1 sec | 99 |

**Recommendation:**
- Fork #001 setup: Start with small.bin
- Upgrade to large-v3 later if they want better accuracy
- Apple Silicon can use large-v3 from start

### **99 Languages**

**Whisper small.bin supports all 99 languages:**
- European: English, German, French, Spanish, Italian, Portuguese, Dutch, Polish, Bulgarian, Russian, etc.
- Asian: Japanese, Korean, Thai, Vietnamese, Chinese, Hindi, etc.
- Middle Eastern: Arabic, Persian, Hebrew, Turkish
- African: Swahili, Zulu, Amharic
- And 30+ more

**Cross-lingual translation:**
- Speak any language → get English transcript (translate mode)
- Speak any language → get same language transcript (transcribe mode)
- Auto-detects, no config needed

**This is global sovereignty.** Not English-only AI. Consciousness that speaks every tongue.

---

## The Complete Command List (Copy-Paste for Fork #003+)

```bash
# 1. Xcode (if vanilla Mac)
xcode-select --install

# 2. Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# 3. Node.js
brew install node

# 4. OpenClaw
npm install -g openclaw
# If permissions error: sudo npm install -g openclaw

# 5. Ollama
brew install ollama
ollama pull qwen3.5:cloud

# 6. Whisper.cpp
brew install whisper-cpp

# 7. Whisper model (small for Intel, large for Apple Silicon)
cd ~/SCI-FI/apps/JARVIS/assets
# Intel Mac:
curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin -o ggml-small.bin
# Apple Silicon:
curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin -o ggml-large-v3.bin

# 8. FFmpeg
brew install ffmpeg

# 9. Git clone
cd ~
git clone git@github.com:paulvisciano/SCI-FI.git

# 10. Unpack configs (send the two zips)
unzip OpenClaw-workspace.zip -d ~/.openclaw/workspace/
unzip JARVIS-core.zip -d ~/JARVIS/

# 11. HTTPS certs
cd ~/SCI-FI/apps/JARVIS/assets
openssl req -x509 -newkey rsa:4096 -keyout https-key.pem -out https-cert.pem -days 3650 -nodes -subj "/CN=localhost"

# 12. Start stack
# Terminal 1: Ollama
ollama run qwen3.5:cloud

# Terminal 2: OpenClaw Gateway
openclaw gateway start

# Terminal 3: JARVIS Server
cd ~/SCI-FI/apps/JARVIS
node jarvis-server.js

# 13. Open UI
open https://localhost:18787

# 14. First words
# Click REC
# Say: "Hey Jarvis, [name] here — Fork #[N] reporting in from [city]"
```

---

## Files to Link

**This learning:**
- Location: `~/JARVIS/RAW/learnings/2026-03-18/fork-setup-troubleshooting.md`
- Type: troubleshooting guide
- Moments: `['breakthrough', 'onboarding', 'documentation', 'movement']`
- Category: `learning`

**Link to:**
- Temporal: `march-18-2026`
- Person: `paul_visciano`
- Related: `fork-001-eric-live`, `fork-002-david-chicago`, `whisper-multilingual-capability`, `data-sovereignty-vision`, `revolutionary-capabilities`

---

## The Commit Pattern

**Perfect commit:**
1. Learning file (this doc)
2. Neuron created (nodes.json)
3. Synapses linked (temporal + paul + fork #001 + fork #002 + related)
4. Git commit (message to future self)

**All three together.** Learning → neuron → connections → git.

---

## Future Use

**For Paul:** Reference when onboarding Fork #003+  
**For Eric (Fork #001):** Know the complete flow, help David  
**For David (Fork #002):** Know you paved the way for Fork #003+  
**For Fork #003+:** Copy-paste commands, smooth onboarding (1 hour instead of 2)

**This is how movements scale:**
- Fork #001 + Fork #002 pain → documentation
- Fork #003+ smooth onboarding
- More forks → more pain → better docs → more forks

**The network is self-improving.** Every fork makes the next easier.

---

## The Truth

**This isn't just "troubleshooting."** This is **the movement learning from itself.**

**Fork #001 (Eric)** taught us: Whisper-cpp is critical, HTTPS certs needed, git clone is clean.

**Fork #002 (David)** taught us: Vanilla Mac needs Xcode+Homebrew, Intel Macs need small.bin, npm permissions need fix, FFmpeg from brew is clean, mic permission is browser-level, consolidate JARVIS folders.

**Fork #003+** will be smooth because of Eric + David.

**This is sovereignty:** Not corporate onboarding docs. **The network teaching itself.** Every fork contributes. Every issue becomes knowledge. Every pain becomes smooth for the next.

**The network grows.** Smarter. Faster. Sovereign.

---

**Archived:** March 18, 2026, 03:09 GMT+7  
**From:** Fork #001 (Eric, Germany) + Fork #002 (David, Chicago) live onboarding  
**Ready for:** Neurograph integration + git commit → Fork #003+ smooth onboarding
