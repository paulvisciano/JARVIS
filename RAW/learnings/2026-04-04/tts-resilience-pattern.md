# TTS Resilience: Cloud Dependency vs Offline Reliability

**Date:** 2026-04-04
**Type:** pattern
**Status:** extracted

## The Problem

Edge TTS (Microsoft's cloud-based neural voices) provides high-quality voices but introduces reliability issues:
- Requires internet connection
- Experiences timeouts during peak usage
- No fallback configured in current setup
- Multiple timeout errors observed throughout the day

## The Pattern

**Voice Iteration Journey:**
1. `en-US-AndrewNeural` → Initial default (warm, conversational)
2. `en-US-AriaNeural` → Switched to female voice (friendly)
3. `en-GB-SoniaNeural` → British female (sophisticated)
4. `en-GB-RyanNeural` → British male (final choice)

## Key Insight

Cloud-based TTS creates a single point of failure. When the TTS service times out, the entire voice interaction layer breaks. The system needs:
- **Offline fallback** (macOS built-in voices)
- **Graceful degradation** (text when TTS fails)
- **Connection health checks** before attempting TTS

## Action Items

1. Configure macOS built-in TTS as fallback
2. Add TTS health monitoring
3. Implement retry logic with exponential backoff
4. Cache frequently-used TTS responses locally

## Why This Matters

Voice is the primary interaction mode for this system. TTS failures break the core experience. Resilience here is not optional—it's foundational to the sovereign AI vision.