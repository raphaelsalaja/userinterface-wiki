---
name: sounds-on-the-web
description: Guidelines for implementing audio feedback in web interfaces. Use when adding sound to interactions, reviewing audio UX, or designing notification systems. Triggers on tasks involving user feedback, confirmations, error states, or multi-sensory design.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/sounds-on-the-web/index.mdx
---

# Sounds on The Web

Sound is the forgotten sense in web design. Used well, it adds feedback, personality, and presence that visuals alone cannot achieve. The auditory cortex processes sound in ~25ms—nearly 10x faster than visual processing.

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
- Confirmations: Major actions like payments, uploads, form submissions
- Errors and warnings: States that can't be overlooked
- State changes: Transitions that reinforce what happened
- Notifications: Interruptions that don't require visual attention

### Poor Candidates
- High-frequency interactions (typing, keyboard navigation)
- Decorative moments with no informational value
- Any action where sound would feel punishing

## Implementation Guidelines

### Respect User Preferences
```css
/* Use as proxy for audio preference */
@media (prefers-reduced-motion: reduce) {
  /* Disable or reduce audio */
}
```

- Provide explicit toggle in settings
- Allow volume adjustment independent of system volume
- Default to subtle, not loud

### Technical Approach
- Basic `Audio` objects cover most cases
- Web Audio API for complex needs
- Keep audio files small and preloaded
- Match sound weight to action weight

## Counter-Arguments Addressed

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

- Match weight: Sound should reflect the importance of the action
- Be informative: Sound should communicate, not punish
- Stay optional: Always provide a way to disable
- Learn from games: They've perfected audio feedback for decades

## References

- [Video Game Sound Design - Stryxo](https://www.youtube.com/watch?v=89_WG5PiTpo)
- Web Audio API documentation
- `prefers-reduced-motion` media query
