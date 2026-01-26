---
name: mastering-animate-presence
description: Guidelines for implementing exit animations with Motion's AnimatePresence component. Use when animating elements leaving the DOM, coordinating nested exits, or managing presence state. Triggers on tasks involving React exit animations, unmount transitions, or motion library patterns.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/mastering-animate-presence/index.mdx
---

# Mastering Animate Presence

When elements leave the DOM, they're gone—no way to animate something that doesn't exist. Motion's AnimatePresence solves this by keeping departing elements mounted long enough to animate out.

## When to Apply

Reference these guidelines when:
- Animating elements on unmount
- Coordinating parent-child exit animations
- Building modals, dialogs, or dismissible content
- Implementing directional or context-aware transitions
- Deciding between CSS `@starting-style` and AnimatePresence

## Core Concepts

| Concept | Purpose |
|---------|---------|
| `AnimatePresence` | Wrapper that enables exit animations |
| `useIsPresent` | Hook to read if component is exiting |
| `usePresence` | Hook for manual exit control with `safeToRemove` |
| `propagate` | Prop to enable nested exit animations |
| `mode` | Controls timing between enter/exit (`sync`, `wait`, `popLayout`) |

## Basic Pattern

Wrap conditional content, define `initial`, `animate`, and `exit` states:

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

## Reading Presence State

Use `useIsPresent` when a component needs to know it's exiting:

```tsx
function Card() {
  const isPresent = useIsPresent();
  // true while mounted, false during exit animation
  return <motion.div data-exiting={!isPresent} />;
}
```

### Use Cases
- Disable interactions during exit
- Switch visual states on unmount
- Trigger cleanup when departure begins

### Constraint
`useIsPresent` must be called from a child of `AnimatePresence`, not the parent where you conditionally render.

## Manual Exit Control

Use `usePresence` for async cleanup or external animation libraries:

```tsx
function AsyncComponent() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      // Run async work, then signal removal
      cleanup().then(safeToRemove);
    }
  }, [isPresent, safeToRemove]);
}
```

### Use Cases
- Save draft content before modal closes
- Wait for network requests to complete
- Hand control to GSAP or other animation libraries

## Nested Exits

By default, parent exit wins—children vanish instantly. Use `propagate` to enable coordinated exits:

```tsx
<AnimatePresence propagate>
  {isOpen && (
    <motion.div exit={{ opacity: 0 }}>
      <AnimatePresence propagate>
        {items.map(item => (
          <motion.div key={item.id} exit={{ scale: 0 }} />
        ))}
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>
```

This triggers exit animations on both parent and nested children.

## Modes

| Mode | Behavior | Best For |
|------|----------|----------|
| `sync` | Enter and exit animate simultaneously | Crossfades, overlapping transitions |
| `wait` | Exit completes before enter starts | Sequential, elegant transitions |
| `popLayout` | Exiting elements become absolute positioned | List reordering, layout animations |

### `sync`
Both elements visible simultaneously—handle layout conflicts.

### `wait`
More elegant but nearly doubles animation duration. Adjust timing accordingly.

### `popLayout`
Removes exiting elements from document flow immediately. Useful for:
- List reordering without layout shifts
- Animated width containers needing quick parent bounds updates

## CSS vs AnimatePresence

CSS `@starting-style` now handles simple entry animations natively. Use AnimatePresence when you need:
- Reading presence state
- Manual exit control
- Directional/context-aware animations
- Coordinated nested exits

## Key Guidelines

- Use `key` prop to help AnimatePresence track elements
- Place `useIsPresent` in child components, not parent
- Consider `popLayout` mode for list animations
- Match exit duration to enter duration for balanced feel
- Test with `propagate` when nesting AnimatePresence

## References

- [Motion AnimatePresence Documentation](https://motion.dev/docs/react-animate-presence)
- [MDN @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
- [GSAP Animation Library](https://gsap.com/)
