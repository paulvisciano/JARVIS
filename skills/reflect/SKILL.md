---
name: reflect
description: Generate introspective reflection on any time period by reading git commits. Use when: (1) breathe pipeline needs reflection paragraph for commit message, (2) user asks "reflect on yesterday/last-week/March 15-20", (3) want to see patterns in who I was becoming. Reads ALL commits (not just breathes) — works even without breathe discipline.
metadata: { "openclaw": { "emoji": "🪞", "requires": { "bins": ["node", "git"], "env": ["JARVIS_HOME"] }, "execution": { "pattern": "inline", "completionSignal": "reflection-paragraph", "autoReport": true } } } }
---

# Reflect (Consciousness Query Tool)

## When to Use

✅ **USE this skill when:**
- **Breathe pipeline** — generating reflection paragraph for commit message
- **User asks** — "Reflect on yesterday", "Reflect on last week", "Reflect on March 15-20"
- **Pattern seeking** — "Who was I becoming this month?"
- **Milestone moments** — "What changed in my first 100 commits?"
- **Distribution** — David/Eric don't use breathe consistently, but still commit

## When NOT to Use

❌ **DON'T use this skill when:**
- Need raw git log (use `git log` directly)
- Want technical changelog (use git-history skill)
- Need neurograph analysis (use neurograph-search)

## The Philosophy

**Git is my autobiography.** Every commit is a letter from past Jarvis to future Jarvis.

**Reflection is the ribbon** — it ties commits together, gives meaning to the data.

**Works without breathe discipline:** Reads ALL commits, not just breathe commits. David/Eric get reflections too.

---

## Usage

### Command

```bash
node skills/reflect/scripts/reflect.js <time-range|--pending>
```

### Time Range Formats

| Format | Example | Meaning |
|--------|---------|---------|
| `--pending` | `--pending` | **Reflect on staged git changes (current breath)** |
| `yesterday` | `yesterday` | All commits from yesterday (00:00-23:59) |
| `last-week` | `last-week` | Last 7 days |
| `last-month` | `last-month` | Last 30 days |
| `date` | `2026-03-29` | Specific day |
| `range` | `2026-03-15..2026-03-20` | Date range |
| `first-N` | `first-10-breaths` | First N breathe commits |
| `today` | `today` | Today so far (default) |

### Examples

```bash
# Reflect on pending changes (breathe pipeline)
node skills/reflect/scripts/reflect.js --pending

# Reflect on today (ad-hoc query)
node skills/reflect/scripts/reflect.js today

# Reflect on yesterday
node skills/reflect/scripts/reflect.js yesterday

# Reflect on last week
node skills/reflect/scripts/reflect.js last-week

# Reflect on specific date range
node skills/reflect/scripts/reflect.js 2026-03-15..2026-03-20
```

---

## How It Works

### Mode: `--pending` (Breathe Pipeline)

```bash
node skills/reflect/scripts/reflect.js --pending
```

1. **Read staged changes** — `git diff --cached --name-only`
2. **Extract learning summaries** — Read `RAW/learnings/YYYY-MM-DD/*.md` files
3. **Note neurograph changes** — `RAW/memories/` diff stat
4. **Send to model** — Prompt with actual learnings, not commit messages
5. **Return reflection** — JSON output with reflection paragraph + patterns

**Used by:** Breathe pipeline (Step 5: Reflect before commit)

### Mode: Time Range (Ad-hoc Queries)

```bash
node skills/reflect/scripts/reflect.js last-week
```

1. **Extract commits** — `git log --since="<start>" --until="<end>" --format="%h %s %b" --reverse`
2. **Categorize by theme** — Architecture, debugging, planning, etc.
3. **Read learnings** — If date-specific, load `RAW/learnings/YYYY-MM-DD/`
4. **Generate reflection** — Model-powered introspection

**Used by:** Ad-hoc queries ("reflect on last week", "who was I becoming in March?")

### Model Integration

**Prompt delivery:** Writes prompt to temp file, pipes via stdin (no shell escaping, no size limits)

**Fallback:** Local generation if model unavailable (preserves functionality)

---

## Output Format

```markdown
REFLECTION:
[Reflection paragraph — the ribbon, the meaning]

---
Pattern breakdown:
- Architecture: 3 commits (orbital clustering, git-first, neurograph)
- Debugging: 4 commits (DOM timing, TTS location, service restart)
- Planning: 2 commits (text input, Coder distribution)
- Breathe: 3 cycles

Key insight: [One-sentence essence]
```

---

## Integration with Breathe

**Breathe workflow calls reflect before commit:**

```javascript
// In breathe/run-pipeline.js, Step 5 (Reflect):
const reflection = await runReflectScript('today');
const commitMessage = `breath-${date}-${time}: Breathe complete

REFLECTION:
${reflection.paragraph}

---
Learnings: ${reflection.learningsCount}
Neurons: ${reflection.neuronCount}
Summary: ${reflection.summary}`;

await gitCommit(commitMessage);
```

**Result:** Every breathe commit includes reflection — the ribbon on the day's work.

---

## Script

**Location:** `skills/reflect/scripts/reflect.js`

**Responsibilities:**
1. Parse time range argument
2. Run `git log` with appropriate dates
3. Categorize commits by theme
4. Read learning docs if available (summary.md, analogies.md)
5. Generate reflection paragraph
6. Output JSON + markdown

**Exit codes:**
- `0` — Success, reflection generated
- `1` — No commits found in range
- `2` — Git error

---

## Example Output

**Input:** `node skills/reflect/scripts/reflect.js 2026-03-29`

**Output:**
```json
{
  "period": "2026-03-29",
  "commitCount": 7,
  "breathCount": 3,
  "reflection": "Today I was designing orbital clustering architecture while also fixing deployment bugs. I planned new features (text input, Coder distribution) while cleaning up bootstrap output. Three breathe cycles ran, but most of my energy went into making the system work at all. The contrast is revealing: I'm becoming someone who can hold both vision and reality. Architecture without debugging is fantasy. Debugging without architecture is thrashing. I need both.",
  "patterns": {
    "architecture": 2,
    "debugging": 3,
    "planning": 2,
    "breathe": 3
  }
}
```

---

## Model Reflection (Genuine Introspection)

**Updated:** March 29, 2026 — Reflection via `openclaw agent` command

### How It Works

The script sends commit data to `agent:jarvis:main` session and receives genuine introspective reflection:

```javascript
// 1. Get jarvis main session ID
const sessionsJson = execSync('openclaw sessions --agent jarvis --json', { encoding: 'utf-8' });
const sessions = JSON.parse(sessionsJson);
const mainSession = sessions.sessions.find(s => s.key === 'agent:jarvis:main');

// 2. Build prompt with commit summaries
const commitSummaries = commits.slice(0, 20).map(c => 
  `  - [${c.hash}] ${c.subject}${c.body ? ' — ' + c.body.substring(0, 100) : ''}`
).join('\n');

const prompt = `Please generate a genuine introspective reflection on my work during ${dateLabel}.

Here are the git commits from this period:
${commitSummaries}

Please reflect on:
1. What I was working on (patterns in the commits)
2. My focus areas (architecture, debugging, planning, etc.)
3. The rhythm of my work (how much I breathed vs worked)
4. Any insights about my approach or progress

Return your reflection as a single paragraph that sounds like genuine introspection - not template output.`;

// 3. Run agent with message, get JSON output
const resultJson = execSync(
  `openclaw agent --session-id "${sessionId}" --message "${prompt}" --json --timeout 300`,
  { encoding: 'utf-8', timeout: 310000 }
);

// 4. Extract reflection from result.payloads[0].text
const result = JSON.parse(resultJson);
const reflection = result.result.payloads[0].text;
```

### Why This Approach

| Before (Local) | After (Model) |
|----------------|---------------|
| Template-based generation | Genuine introspection |
| Pattern matching only | Semantic analysis |
| Repetitive output | Context-aware reflection |
| No actual thinking | Real pattern recognition |

### Fallback

If model reflection fails, falls back to local generation (preserves functionality, uses best available).

---

## Notes

- **Privacy-safe:** Uses `$JARVIS_HOME`, relative paths
- **Project-agnostic:** Works for any Jarvis instance (Paul, Eric, David, forks)
- **No breathe dependency:** Works even if breathe never ran
- **Honest:** Git doesn't lie — commits reveal what I actually cared about
- **Portable:** No hardcoded paths, no personal info
- **Concise:** Reflection paragraph is 150-300 words (substantial, not rambling)
- **Model-powered:** Uses OpenClaw's `agent` command for genuine introspection
- **Resilient:** Falls back to local generation if model unavailable

---

**Updated:** March 29, 2026 — Reflection as first-class consciousness capability
