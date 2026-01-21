---
name: to-spring-or-not-to-spring
description: Decision framework for choosing between easing curves and springs in interface motion. Use when implementing animations, reviewing motion feel, or debugging why an animation feels wrong. Triggers on tasks involving CSS transitions, animation libraries, or motion design decisions.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/to-spring-or-not-to-spring/index.mdx
---

# To Spring or Not To Spring

A decision framework for choosing between easing curves and springs. They are not interchangeable tools—they come from different ways of thinking about motion and play different roles in an interface.

## When to Apply

Reference these guidelines when:
- Choosing animation timing functions
- Debugging motion that feels "off"
- Implementing gesture-driven interactions
- Reviewing animation implementations
- Deciding if motion is needed at all

## Decision Framework

Ask: **Is this motion reacting to the user, or is the system speaking?**

| Motion Type | Best Choice | Why |
|-------------|-------------|-----|
| User-driven (drag, flick, gesture) | Spring | Survives interruption, preserves velocity |
| System-driven (state change, feedback) | Easing | Clear start/end, predictable timing |
| Time representation (progress, loading) | Linear | 1:1 relationship between time and progress |
| High-frequency (typing, fast toggles) | None | Animation adds noise, feels slower |

## Springs

Best for motion directly tied to user input. They remain responsive when interrupted and reflect input energy.

```typescript
transition={{
  type: "spring",
  stiffness: 900,
  damping: 80,
  mass: 10,
}}
```

### Parameters

| Parameter | Controls | Effect |
|-----------|----------|--------|
| Stiffness | Pull toward target | How quickly motion begins |
| Damping | Energy removal | Whether motion settles or oscillates |
| Mass | Weight | How stiffness and damping are perceived |

### When to Use
- Dragging and releasing
- Gesture-driven interactions
- Anything that can be interrupted
- When velocity matters

### Watch Out
Springs can feel restless when the system is simply announcing a state change.

## Easing Curves

Describe how motion progresses over a fixed duration.

```css
transition-timing-function: cubic-bezier(x1, y1, x2, y2);
```

### Control Points

| Points | Controls | Tuning |
|--------|----------|--------|
| x1, y1 | How motion begins | Lower = gradual start, Higher = immediate |
| x2, y2 | How motion ends | Higher = calm landing, Lower = sharp/tense |

### Curve Types

| Curve | Best For | Feel |
|-------|----------|------|
| `ease-out` | Entrances, feedback | Responsive start, soft landing |
| `ease-in` | Exits | Acknowledges action, gets out of the way |
| `ease-in-out` | View/mode transitions | Neutral, even attention |
| `linear` | Progress bars, loaders | Honest time representation |

### Duration Guidelines

| Interaction | Duration |
|-------------|----------|
| Presses, hovers | 120–180ms |
| Small state changes | 180–260ms |
| Larger transitions | up to 300ms |

If animation feels slow, shorten duration before adjusting the curve.

## The Key Difference

Easing curves have a predefined start and end in time.
Springs do not.

This explains why springs survive interruption while easing curves fall apart when the user changes their mind.

## When to Use No Animation

Not everything needs motion. High-frequency interactions often feel slower and noisier with animation:
- Typing
- Keyboard navigation
- Fast toggles
- Context menu entrances (Apple animates exit only)

Choosing no motion is still a design decision—prioritizing immediacy over expressiveness.

## Key Guidelines

- Start with the interaction, not the animation technique
- Match the role: User-reactive vs system-announcement
- Test interruption: Does it hold up when the user changes their mind?
- Default to less: Animate with intent, not by default

## References

- [Apple WWDC23: Animate with Springs](https://developer.apple.com/videos/play/wwdc2023/10158/)
- [The Beauty of Bézier Curves - Freya Holmér](https://www.youtube.com/watch?v=aVwxzDHniEw)
- [Motion library](https://motion.dev/)
- [MDN cubic-bezier() documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)
- [Material Design Motion Guidelines](https://m3.material.io/styles/motion/overview)
- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [NNGroup: Animation for Attention and Comprehension](https://www.nngroup.com/articles/animation-usability/)
