---
name: generating-sounds-with-ai
description: Guidelines for using AI to create UI sounds with the Web Audio API. Use when helping users synthesize audio feedback, create procedural sounds, or iterate on sound design without audio engineering knowledge.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/generating-sounds-with-ai/index.mdx
---

# Generating Sounds with AI

Help users create UI sounds from scratch using the Web Audio API, even without audio engineering knowledge. Focus on translating their descriptions into working code.

## When to Apply

Reference these guidelines when:
- User wants to create sounds without audio files
- User describes how they want something to "sound" or "feel"
- Iterating on audio parameters based on user feedback
- Building interactive tools for sound experimentation

## Key Principle

Users know what sounds "right"—they just can't implement it. Your job is to translate descriptions like "more mechanical" or "too harsh" into parameter changes.

## Building Blocks

### For Percussive Sounds (Clicks, Taps)
Use **filtered noise**, not oscillators:

```typescript
// Short noise burst with exponential decay
const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.008, ctx.sampleRate);
const data = buffer.getChannelData(0);
for (let i = 0; i < data.length; i++) {
  data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 50);
}

// Bandpass filter for "clicky" character
const filter = ctx.createBiquadFilter();
filter.type = "bandpass";
filter.frequency.value = 4000; // Higher = brighter
filter.Q.value = 3; // Higher = more focused
```

### For Tonal Sounds (Pops, Confirmations)
Use **oscillators with pitch movement**:

```typescript
osc.type = "sine"; // or "triangle" for softer
osc.frequency.setValueAtTime(400, t);
osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);
```

### For Natural Decay
Always use **exponential ramps**, not linear:

```typescript
// Good - sounds natural
gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

// Bad - sounds artificial
gain.gain.linearRampToValueAtTime(0, t + 0.05);
```

## Translating User Descriptions

| User Says | Parameter Change |
|-----------|------------------|
| "too harsh" | Lower filter frequency, reduce Q |
| "too muffled" | Higher filter frequency |
| "too long" | Shorter duration, faster decay |
| "cuts off abruptly" | Use exponential decay, not linear |
| "more mechanical" | Higher Q, faster decay |
| "softer" | Lower gain, triangle wave instead of sine |
| "more present" | Higher filter frequency (4000-6000Hz) |
| "cheap/thin" | Add layers, increase duration slightly |

## Common Sound Patterns

### Click (Button, Toggle)
- Duration: 5-15ms
- Filter: Bandpass 3000-5000Hz
- Q: 2-4
- Decay: Fast (divisor 30-60)

### Pop (Confirmation)
- Source: Sine oscillator
- Pitch: 400Hz → 150Hz over 40ms
- Decay: Medium

### Error
- Source: Two detuned oscillators (180Hz, 190Hz)
- Direction: Falling pitch
- Filter: Lowpass to soften

### Whoosh (Transition)
- Source: Noise with sine envelope
- Filter: Sweeping bandpass (4000Hz → 1500Hz)

## AudioContext Management

Always reuse a single context:

```typescript
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}
```

## Iteration Strategy

1. Start with a basic implementation
2. Ask user to describe what they hear vs. what they want
3. Make one parameter change at a time
4. Build interactive tools with sliders when doing extensive tuning
5. Save presets that work

## What You Can't Do

You can't hear the sounds. Always ask:
- "Does this sound closer to what you want?"
- "Is it too [long/short/harsh/muffled]?"
- "What feels off about it?"

Let the user's ears guide the iteration.

## References

- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
