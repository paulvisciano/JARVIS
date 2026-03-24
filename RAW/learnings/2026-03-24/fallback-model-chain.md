# Fallback Model Chain

**Problem:** When primary model times out or fails, there's no fallback — complete radio silence.

**Solution:** Model chain with graceful degradation.

## Current Pattern (Single Model)

```json
{
  "agent": {
    "provider": "ollama",
    "model": "qwen3.5:cloud"
  }
}
```

**Failure mode:** If `qwen3.5:cloud` times out → no fallback → user silence.

## Fallback Chain Pattern

```json
{
  "agent": {
    "modelChain": [
      {
        "provider": "ollama",
        "model": "qwen3.5:cloud",
        "priority": 1,
        "timeoutSeconds": 120,
        "description": "Primary: best quality for complex reasoning"
      },
      {
        "provider": "ollama",
        "model": "qwen2.5-coder:7b",
        "priority": 2,
        "timeoutSeconds": 60,
        "description": "Fallback 1: local, always available, fast"
      },
      {
        "provider": "ollama",
        "model": "llama3.2:3b",
        "priority": 3,
        "timeoutSeconds": 30,
        "description": "Fallback 2: minimal, JSON-clean, emergency"
      }
    ],
    "fallbackBehavior": {
      "onTimeout": "tryNext",
      "onError": "tryNext",
      "maxRetries": 1,
      "notifyUser": true
    }
  }
}
```

## Why This Chain

**qwen3.5:cloud** (Primary):
- Best reasoning quality
- Handles complex tasks
- Cloud-based (can timeout, rate limits)

**qwen2.5-coder:7b** (Fallback 1):
- Local (always available)
- Good for code + structured output
- Fast (7B params)
- No token limits

**llama3.2:3b** (Fallback 2):
- Minimal footprint
- JSON-clean (no Thinking... prefix)
- Emergency mode (keep responding, even if quality drops)

## Implementation

**Gateway enhancement:**
- Try models in priority order
- On timeout/error → try next
- Notify user when falling back
- Log fallback chain for debugging

**Skill pattern:**
```javascript
async function runWithFallback(message, modelChain) {
  for (const model of modelChain) {
    try {
      return await runModel(message, model);
    } catch (err) {
      if (err.code === 'TIMEOUT' || err.code === 'MODEL_ERROR') {
        console.warn(`⚠️ ${model.model} failed, trying next...`);
        continue;
      }
      throw err; // Unknown error, don't fallback
    }
  }
  throw new Error('All models in chain failed');
}
```

## Why This Matters

**Prevents:**
- Complete radio silence on primary failure
- Single point of failure

**Enables:**
- Graceful degradation (quality → speed → minimal)
- User awareness (notify on fallback)
- Debugging (log chain for post-mortem)

**Share upstream:** This should be OpenClaw core config pattern or a `model-fallback` skill.
