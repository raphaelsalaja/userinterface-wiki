---
name: sounds-on-the-web
description: Audio feedback guidelines for web interfaces. Use when adding sound to interactions, designing confirmations or error states, building notifications, or reviewing audio UX. Triggers on tasks involving user feedback sounds, Web Audio API, or multi-sensory design patterns.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.1.0"
  source: /content/sounds-on-the-web/index.mdx
---

# Sounds on The Web

Sound is the forgotten sense in web design. The auditory cortex processes sound in ~25ms—nearly 10x faster than visual processing. A button that clicks feels faster than one that doesn't, even when visual feedback is identical.

## When to Apply

Reference these guidelines when:
- Adding audio feedback to interactions
- Designing confirmation or error states
- Building notification systems
- Creating immersive or game-like experiences
- Reviewing audio UX for appropriateness

## Core Principles

| Principle | Description |
|-----------|-------------|
| Speed | Sound reaches the brain faster than visuals (~25ms vs ~250ms) |
| Presence | Audio crosses the boundary between device and environment |
| Emotion | A single tone communicates success, error, tension, or playfulness |
| Complement | Sound should enhance, never replace visual feedback |

## When to Use Sound

### Good Candidates
- **Confirmations**: Payments, uploads, form submissions
- **Errors and warnings**: States that can't be overlooked
- **State changes**: Transitions that reinforce what happened
- **Notifications**: Interruptions that don't require visual attention

### Poor Candidates
- High-frequency interactions (typing, keyboard navigation)
- Decorative moments with no informational value
- Any action where sound would feel punishing

## Respecting User Preferences

```css
/* Use prefers-reduced-motion as proxy */
@media (prefers-reduced-motion: reduce) {
  /* Disable or reduce audio */
}
```

- Provide explicit toggle in settings
- Allow volume adjustment independent of system volume
- Default to subtle, not loud

## Technical Implementation

- Basic `Audio` objects cover most cases
- Web Audio API for complex needs
- Keep audio files small and preloaded
- Match sound weight to action weight

## Counter-Arguments

| Objection | Response |
|-----------|----------|
| "Users will hate it" | Only if done poorly. Subtle, appropriate, optional sounds are not intrusive. |
| "It's inaccessible" | Sound complements, never replaces. Every audio cue needs a visual equivalent. |
| "It's technically complicated" | Basic audio playback is straightforward. Implementation burden is low. |
| "It's not professional" | Native apps use sound constantly. Web silence is historical accident, not design principle. |

## Getting Started

1. Pick a single interaction that feels flat
2. Add a subtle sound
3. Make it optional
4. See how it changes the feeling
5. Build vocabulary gradually

## Key Guidelines

- **Match weight**: Sound should reflect the importance of the action
- **Be informative**: Sound should communicate, not punish
- **Stay optional**: Always provide a way to disable
- **Learn from games**: They've perfected audio feedback for decades

## References

- [Video Game Sound Design - Stryxo](https://www.youtube.com/watch?v=89_WG5PiTpo)
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
