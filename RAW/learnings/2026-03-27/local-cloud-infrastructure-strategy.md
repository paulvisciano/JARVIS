# Local vs Cloud Model Infrastructure Strategy

**Date:** 2026-03-27
**Type:** decision
**Status:** extracted

## Context
Attempted to run local models via Ollama for the Jarvis system, but encountered communication failures between OpenClaw and Ollama. Additionally, current hardware is insufficient for well-performing local models.

## Decision
- **Current State:** Revert to cloud models for coding and planning tasks.
- **Rationale:** Cloud models are stable and token usage is manageable with proper planning. Local integration issues (OpenClaw <-> Ollama) and hardware limitations (need Mac Studio) make local execution impractical at this time.
- **Future Plan:** Re-evaluate local model deployment once hardware is upgraded (Mac Studio acquisition).
- **Insight:** Token burn is not inherently high with cloud models if planning is disciplined; the perceived need for local models was partly due to integration bugs rather than cost necessity.