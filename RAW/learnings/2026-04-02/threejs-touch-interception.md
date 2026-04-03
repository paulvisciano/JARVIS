# Three.js Touch Event Interception

**Date:** 2026-04-02
**Type:** insight
**Status:** extracted

Mobile tap failures on Three.js nodes were caused by OrbitControls (r128) attaching to touchstart before custom pointerdown handlers. On mobile, touchstart fires first and initiates rotation gestures, interpreting taps as orbit movements.

**Solution:** Implement a capture-phase touchstart handler that runs before OrbitControls to intercept taps. Understanding event flow and timing conflicts is critical for mobile 3D interactions.