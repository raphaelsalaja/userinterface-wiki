---
name: generating-sounds-with-ai
description: Audit Web Audio API code for sound synthesis best practices. Use when reviewing procedural audio, implementing UI sounds, or checking audio parameter quality. Outputs file:line findings.
license: MIT
metadata:
  author: raphael-salaja
  version: "2.0.0"
  source: /content/generating-sounds-with-ai/index.mdx
---

# Generating Sounds with AI

Review Web Audio API code for sound synthesis best practices.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules below
3. Output findings in `file:line` format

## Rule Categories

| Priority | Category | Prefix |
|----------|----------|--------|
| 1 | Context Management | `context-` |
| 2 | Decay & Envelope | `envelope-` |
| 3 | Sound Design | `design-` |
| 4 | Parameters | `param-` |

## Rules

### Context Management Rules

#### `context-reuse-single`
Reuse a single AudioContext instance; do not create new ones per sound.

**Fail:**
```ts
function playSound() {
  const ctx = new AudioContext();
  // Creates new context every call
}
```

**Pass:**
```ts
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}
```

#### `context-resume-suspended`
Check and resume suspended AudioContext before playing.

**Fail:**
```ts
function playSound() {
  const ctx = getAudioContext();
  // Plays immediately without checking state
}
```

**Pass:**
```ts
function playSound() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
}
```

#### `context-cleanup-nodes`
Disconnect and clean up audio nodes after playback.

**Fail:**
```ts
source.start();
// Nodes remain connected after sound ends
```

**Pass:**
```ts
source.start();
source.onended = () => {
  source.disconnect();
  gain.disconnect();
};
```

### Envelope Rules

#### `envelope-exponential-decay`
Use exponential ramps for natural decay, not linear.

**Fail:**
```ts
gain.gain.linearRampToValueAtTime(0, t + 0.05);
```

**Pass:**
```ts
gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
```

#### `envelope-no-zero-target`
Exponential ramps cannot target 0; use 0.001 or similar small value.

**Fail:**
```ts
gain.gain.exponentialRampToValueAtTime(0, t + 0.05);
```

**Pass:**
```ts
gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
```

#### `envelope-set-initial-value`
Set initial value before ramping to avoid glitches.

**Fail:**
```ts
gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
// No setValueAtTime before ramp
```

**Pass:**
```ts
gain.gain.setValueAtTime(0.3, t);
gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
```

### Sound Design Rules

#### `design-noise-for-percussion`
Use filtered noise for clicks/taps, not oscillators.

**Fail:**
```ts
// Click sound using sine oscillator
const osc = ctx.createOscillator();
osc.type = "sine";
// Results in tonal "beep" not "click"
```

**Pass:**
```ts
// Click sound using noise burst
const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.008, ctx.sampleRate);
const data = buffer.getChannelData(0);
for (let i = 0; i < data.length; i++) {
  data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 50);
}
```

#### `design-oscillator-for-tonal`
Use oscillators with pitch movement for tonal sounds (pops, confirmations).

**Fail:**
```ts
// Confirmation sound using static frequency
osc.frequency.value = 400;
```

**Pass:**
```ts
// Confirmation sound with pitch sweep
osc.frequency.setValueAtTime(400, t);
osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
```

#### `design-filter-for-character`
Apply bandpass filter to shape percussive sounds.

**Fail:**
```ts
// Raw noise without filtering
source.connect(gain).connect(ctx.destination);
```

**Pass:**
```ts
const filter = ctx.createBiquadFilter();
filter.type = "bandpass";
filter.frequency.value = 4000;
filter.Q.value = 3;
source.connect(filter).connect(gain).connect(ctx.destination);
```

### Parameter Rules

#### `param-click-duration`
Click/tap sounds should be 5-15ms duration.

**Fail:**
```ts
const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
// 100ms is too long for a click
```

**Pass:**
```ts
const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.008, ctx.sampleRate);
// 8ms is appropriate for a click
```

#### `param-filter-frequency-range`
Bandpass filter for clicks should be 3000-6000Hz.

**Fail:**
```ts
filter.frequency.value = 500; // Too low, sounds muffled
```

**Pass:**
```ts
filter.frequency.value = 4000; // Crisp, present
```

#### `param-reasonable-gain`
Gain values should not exceed 1.0 to prevent clipping.

**Fail:**
```ts
gain.gain.setValueAtTime(1.5, t);
```

**Pass:**
```ts
gain.gain.setValueAtTime(0.3, t);
```

#### `param-q-value-range`
Filter Q for clicks should be 2-5 for focused but not harsh sound.

**Fail:**
```ts
filter.Q.value = 15; // Too resonant, harsh
```

**Pass:**
```ts
filter.Q.value = 3; // Focused but natural
```

## Output Format

When reviewing files, output findings as:

```
file:line - [rule-id] description of issue

Example:
lib/sounds.ts:23 - [envelope-exponential-decay] Using linearRampToValueAtTime instead of exponential
lib/sounds.ts:45 - [context-reuse-single] Creating new AudioContext on each call
```

## Summary Table

After findings, output a summary:

| Rule | Count | Severity |
|------|-------|----------|
| `context-reuse-single` | 1 | HIGH |
| `envelope-exponential-decay` | 3 | MEDIUM |
| `param-click-duration` | 1 | LOW |

## Parameter Translation Table

When user describes issues, translate to parameter changes:

| User Says | Parameter Change |
|-----------|------------------|
| "too harsh" | Lower filter frequency, reduce Q |
| "too muffled" | Higher filter frequency |
| "too long" | Shorter duration, faster decay |
| "cuts off abruptly" | Use exponential decay |
| "more mechanical" | Higher Q, faster decay |
| "softer" | Lower gain, triangle wave |

## References

- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
