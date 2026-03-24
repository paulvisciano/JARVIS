# Server Should Bump Version on Changes

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

## Current Issue
Coder restarted local server but didn't bump version numbers.

## Required Behavior
- Bump server version if server-side changes
- Bump client version if client-side changes
- Server restart is acceptable (user can keep talking)

## Why Version Bumping Matters
- Tracks what code is running
- Helps debug issues ("what version was this on?")
- Git commits track changes, version numbers track runtime state

## Screenshot Evidence
SERVER: V2.9.5 - PID 49325 - 53 MB visible in UI