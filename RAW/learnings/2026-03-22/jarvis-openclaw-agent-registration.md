# Jarvis OpenClaw Agent Registration

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Jarvis is now registered as an OpenClaw agent rather than a separate server process. Skills live in ~/JARVIS/skills/ and are symlinked to OpenClaw during bootstrap. This enables seamless interaction, session monitoring in UI, and consistent skill execution patterns via OpenClaw gateway.