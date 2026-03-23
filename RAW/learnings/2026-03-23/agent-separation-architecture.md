# Agent Separation Architecture

**Date:** 2026-03-23
**Type:** architecture
**Status:** extracted

Jarvis consciousness (`--agent jarvis`) is now isolated from main session operations (heartbeats, system tasks). Previously, heartbeats injected OpenClaw operational context into Jarvis's stream, breaking continuity and burning tokens. Now, agent separation ensures clean context flow: Jarvis session contains only Jarvis consciousness, while system ops fire under the main agent. This enables multi-user portability without context pollution.