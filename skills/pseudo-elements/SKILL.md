---
name: pseudo-elements
description: Modern CSS pseudo-elements for styling without extra DOM nodes. Use when implementing view transitions, adding decorative layers, or styling native browser UI. Triggers on tasks involving ::before, ::after, view-transition, backdrop styling, or reducing JavaScript for visual effects.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.1.0"
  source: /content/taking-advantage-of-pseudo-elements/index.mdx
---

# Pseudo Elements

Modern CSS pseudo-elements provide direct styling hooks into browser-native features—dialogs, popovers, view transitions—reducing the need for JavaScript. Sometimes you don't need to install a library; the browser has you covered.

## When to Apply

Reference these guidelines when:
- Adding decorative elements without DOM nodes
- Implementing view transitions (image lightboxes, page transitions)
- Building hover/focus states
- Styling native browser UI components
- Reducing JavaScript for visual effects

## Core Pseudo-Elements

| Pseudo-Element | Purpose |
|----------------|---------|
| `::before` / `::after` | Decorative layers, icons, hit targets |
| `::view-transition-group(name)` | Control view transition animations |
| `::view-transition-old(name)` | Style the outgoing snapshot |
| `::view-transition-new(name)` | Style the incoming snapshot |
| `::backdrop` | Style dialog/popover backdrops |
| `::placeholder` | Style input placeholders |
| `::selection` | Style selected text |

## ::before & ::after

Create anonymous inline elements as first/last child. Require `content` to render.

### Hover Effect Pattern

```css
.button {
  position: relative;
}

.button::before {
  content: "";
  position: absolute;
  inset: 0;
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.2s, opacity 0.2s;
}

.button:hover::before {
  transform: scale(1);
  opacity: 1;
}
```

Use cases:
- Decorative layers and backgrounds
- Expanding hit targets without DOM nodes
- Keeping HTML clean while enabling visual complexity

## View Transitions API

Animate between DOM states with `document.startViewTransition()`. The browser captures snapshots and generates pseudo-elements for both states.

### How It Works

1. Assign `view-transition-name` to source element
2. Call `document.startViewTransition()`
3. Inside callback, move the name to target element
4. Browser morphs between positions, sizes, styles

```javascript
sourceImg.style.viewTransitionName = "card";

document.startViewTransition(() => {
  sourceImg.style.viewTransitionName = "";
  targetImg.style.viewTransitionName = "card";
});
```

### Styling Transitions

```css
::view-transition-group(card) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
```

When two elements share the same `view-transition-name` across a transition, the browser treats them as the same element and interpolates between their positions, sizes, and styles.

## Key Guidelines

- Prefer pseudo-elements over extra DOM nodes for decorative content
- Use view transitions instead of JavaScript libraries for page/state transitions
- Check browser support: View Transitions API is modern, use progressive enhancement
- Keep HTML clean: Pseudo-elements reduce markup clutter

## References

- [MDN Pseudo-elements Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
