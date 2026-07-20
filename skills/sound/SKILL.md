---
name: userinterface-wiki-sound
description: "UI audio best practices: when sound is appropriate, accessibility requirements, and Web Audio API synthesis patterns. Use when adding audio feedback or procedural sound to interfaces."
license: MIT
metadata:
  author: raphael-salaja
  source: https://github.com/raphaelsalaja/userinterface-wiki
---

# User Interface Wiki — Sound

27 focused rules extracted from the unified userinterface-wiki skill. See AGENTS.md in this directory for every rule expanded with code examples.

## Audio Feedback — MEDIUM

- `a11y-reduced-motion-check` — Respect prefers-reduced-motion as proxy for sound sensitivity.
- `a11y-toggle-setting` — Provide explicit toggle to disable sounds in settings.
- `a11y-visual-equivalent` — Every audio cue must have a visual equivalent; sound never replaces visual feedback.
- `a11y-volume-control` — Allow volume adjustment independent of system volume.
- `appropriate-confirmations-only` — Sound is appropriate for confirmations: payments, uploads, form submissions.
- `appropriate-errors-warnings` — Sound is appropriate for errors and warnings that can't be overlooked.
- `appropriate-no-decorative` — Do not add sound to decorative moments with no informational value.
- `appropriate-no-high-frequency` — Do not add sound to high-frequency interactions (typing, keyboard navigation).
- `appropriate-no-punishing` — Sound should inform, not punish; avoid harsh sounds for user mistakes.
- `impl-default-subtle` — Default volume should be subtle, not loud.
- `impl-preload-audio` — Preload audio files to avoid playback delay.
- `impl-reset-current-time` — Reset audio currentTime before replay to allow rapid triggering.
- `weight-duration-matches-action` — Sound duration should match action duration.
- `weight-match-action` — Sound weight should match action importance.

## Sound Synthesis — MEDIUM

- `context-cleanup-nodes` — Disconnect and clean up audio nodes after playback.
- `context-resume-suspended` — Check and resume suspended AudioContext before playing.
- `context-reuse-single` — Reuse a single AudioContext instance; do not create new ones per sound.
- `design-filter-for-character` — Apply bandpass filter to shape percussive sounds.
- `design-noise-for-percussion` — Use filtered noise for clicks/taps, not oscillators.
- `design-oscillator-for-tonal` — Use oscillators with pitch movement for tonal sounds (pops, confirmations).
- `envelope-exponential-decay` — Use exponential ramps for natural decay, not linear.
- `envelope-no-zero-target` — Exponential ramps cannot target 0; use 0.001 or similar small value.
- `envelope-set-initial-value` — Set initial value before ramping to avoid glitches.
- `param-click-duration` — Click/tap sounds should be 5-15ms duration.
- `param-filter-frequency-range` — Bandpass filter for clicks should be 3000-6000Hz.
- `param-q-value-range` — Filter Q for clicks should be 2-5 for focused but not harsh sound.
- `param-reasonable-gain` — Gain values should not exceed 1.0 to prevent clipping.
