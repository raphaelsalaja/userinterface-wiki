---
name: pseudo-elements
description: Guidelines for using modern CSS pseudo-elements beyond ::before and ::after. Use when styling native browser features, implementing view transitions, or reducing JavaScript dependencies. Triggers on tasks involving CSS styling, animations, dialogs, or browser-native UI.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/taking-advantage-of-pseudo-elements/index.mdx
---

# Pseudo Elements

Modern CSS pseudo-elements go far beyond `::before` and `::after`. They provide direct styling hooks into browser-native features—dialogs, popovers, view transitions, form pickers—reducing the need for JavaScript.

## When to Apply

Reference these guidelines when:
- Adding decorative elements without DOM nodes
- Implementing view transitions
- Styling native browser UI components
- Reducing JavaScript for visual effects
- Building hover/focus states

## Core Pseudo-Elements

| Pseudo-Element | Purpose |
|----------------|---------|
| `::before` / `::after` | Decorative layers, icons, hit targets |
| `::view-transition-group` | Control view transition animations |
| `::view-transition-old` | Style the outgoing snapshot |
| `::view-transition-new` | Style the incoming snapshot |
| `::backdrop` | Style dialog/popover backdrops |
| `::placeholder` | Style input placeholders |
| `::selection` | Style selected text |

## ::before & ::after

Create anonymous inline elements as first/last child. Require `content` to render.

### Common Pattern: Hover Effect

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
- Icons and separators
- Expanding hit targets without DOM nodes
- Keeping HTML clean while enabling visual complexity

## View Transitions

Animate between DOM states with `document.startViewTransition()`. The browser captures snapshots and generates pseudo-elements for both states.

### Basic Usage

```css
::view-transition-group(card) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
```

### How It Works

1. Assign `view-transition-name` to source element
2. Call `document.startViewTransition()`
3. Inside callback, move the name to target element
4. Browser morphs between positions, sizes, styles

```javascript
// Before transition
sourceImg.style.viewTransitionName = "card";

document.startViewTransition(() => {
  sourceImg.style.viewTransitionName = "";
  targetImg.style.viewTransitionName = "card";
});
```

### Key Pseudo-Elements

- `::view-transition` - Root container for all transitions
- `::view-transition-group(name)` - Contains both snapshots
- `::view-transition-old(name)` - Outgoing state snapshot
- `::view-transition-new(name)` - Incoming state snapshot

## Key Guidelines

- Prefer pseudo-elements over extra DOM nodes for decorative content
- Use view transitions instead of complex JavaScript animation libraries for page/state transitions
- Check browser support: View Transitions API is modern, use progressive enhancement
- Keep HTML clean: Pseudo-elements reduce markup clutter

## Benefits

- Reduced JavaScript dependencies
- Cleaner, more semantic HTML
- Native browser performance
- Progressive enhancement friendly

## References

- [MDN Pseudo-elements Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
