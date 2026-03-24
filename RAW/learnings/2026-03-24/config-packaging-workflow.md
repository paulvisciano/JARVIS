# Package-Configs Skill for Team Installation

**Date:** 2026-03-24
**Type:** pattern
**Status:** extracted

## Problem Solved
Eric's installation was manual: finding config files, copying, sending, extracting, restarting — lots of back-and-forth.

## Solution: package-configs Skill
Wrapped into jarvis-ui:
1. Zips OpenClaw configs (openclaw.json, agent configs for jarvis/coder/main)
2. Commits + pushes to origin/main
3. Eric pulls JARVIS repo → gets the zip → extracts

## Challenge
Config files had hardcoded paths to username. Required streamlining to work across machines.

## Outcome
Two skills + git workflow replaced manual file copying.