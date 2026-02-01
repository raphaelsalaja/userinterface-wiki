---
name: pseudo-elements
description: Audit CSS for pseudo-element best practices and View Transitions API usage. Use when reviewing hover effects, decorative layers, or page transitions. Outputs file:line findings.
license: MIT
metadata:
  author: raphael-salaja
  version: "2.0.0"
  source: /content/taking-advantage-of-pseudo-elements/index.mdx
---

# Pseudo Elements

Review CSS and JavaScript for pseudo-element best practices and View Transitions API usage.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules below
3. Output findings in `file:line` format

## Rule Categories

| Priority | Category | Prefix |
|----------|----------|--------|
| 1 | Before/After | `pseudo-` |
| 2 | View Transitions | `transition-` |
| 3 | Native Styling | `native-` |

## Rules

### Before/After Rules

#### `pseudo-content-required`
::before and ::after require content property to render.

**Fail:**
```css
.button::before {
  position: absolute;
  background: var(--gray-3);
}
```

**Pass:**
```css
.button::before {
  content: "";
  position: absolute;
  background: var(--gray-3);
}
```

#### `pseudo-over-dom-node`
Use pseudo-elements for decorative content instead of extra DOM nodes.

**Fail:**
```tsx
<button className={styles.button}>
  <span className={styles.background} /> {/* Unnecessary DOM node */}
  Click me
</button>
```

**Pass:**
```tsx
<button className={styles.button}>
  Click me
</button>
```
```css
.button::before {
  content: "";
  /* decorative background */
}
```

#### `pseudo-position-relative-parent`
Parent must have position: relative for absolute pseudo-elements.

**Fail:**
```css
.button::before {
  content: "";
  position: absolute;
  inset: 0;
}
/* .button has no position */
```

**Pass:**
```css
.button {
  position: relative;
}

.button::before {
  content: "";
  position: absolute;
  inset: 0;
}
```

#### `pseudo-z-index-layering`
Pseudo-elements need z-index to layer correctly with content.

**Fail:**
```css
.button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gray-3);
}
/* Covers button text */
```

**Pass:**
```css
.button {
  position: relative;
  z-index: 1;
}

.button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gray-3);
  z-index: -1;
}
```

#### `pseudo-hit-target-expansion`
Use negative inset values to expand hit targets without extra markup.

**Fail:**
```tsx
<div className={styles.wrapper}> {/* Extra wrapper for hit target */}
  <a className={styles.link}>Link</a>
</div>
```

**Pass:**
```css
.link {
  position: relative;
}

.link::before {
  content: "";
  position: absolute;
  inset: -8px -12px;
}
```

### View Transitions Rules

#### `transition-name-required`
Elements participating in view transitions need view-transition-name.

**Fail:**
```ts
document.startViewTransition(() => {
  // No view-transition-name assigned
  targetImg.src = newSrc;
});
```

**Pass:**
```ts
sourceImg.style.viewTransitionName = "card";
document.startViewTransition(() => {
  sourceImg.style.viewTransitionName = "";
  targetImg.style.viewTransitionName = "card";
});
```

#### `transition-name-unique`
Each view-transition-name must be unique on the page during transition.

**Fail:**
```css
.card {
  view-transition-name: card;
}
/* Multiple cards with same name */
```

**Pass:**
```ts
// Assign unique name only to transitioning element
element.style.viewTransitionName = `card-${id}`;
```

#### `transition-name-cleanup`
Remove view-transition-name after transition completes.

**Fail:**
```ts
sourceImg.style.viewTransitionName = "card";
document.startViewTransition(() => {
  targetImg.style.viewTransitionName = "card";
});
// sourceImg still has name, causes conflict on next transition
```

**Pass:**
```ts
sourceImg.style.viewTransitionName = "card";
document.startViewTransition(() => {
  sourceImg.style.viewTransitionName = "";
  targetImg.style.viewTransitionName = "card";
});
```

#### `transition-over-js-library`
Prefer View Transitions API over JavaScript animation libraries for page transitions.

**Fail:**
```tsx
import { motion } from "motion/react";

function ImageLightbox() {
  return (
    <motion.img layoutId="hero" /> // JS-based shared element transition
  );
}
```

**Pass:**
```ts
function openLightbox(img: HTMLImageElement) {
  img.style.viewTransitionName = "hero";
  document.startViewTransition(() => {
    // Native browser transition
  });
}
```

#### `transition-style-pseudo-elements`
Style view transition pseudo-elements for custom animations.

**Fail:**
```ts
document.startViewTransition(() => { /* ... */ });
// Uses default crossfade
```

**Pass:**
```css
::view-transition-group(card) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
```

### Native Styling Rules

#### `native-backdrop-styling`
Use ::backdrop pseudo-element for dialog/popover backgrounds.

**Fail:**
```tsx
<>
  <div className={styles.overlay} onClick={close} />
  <dialog className={styles.dialog}>{children}</dialog>
</>
```

**Pass:**
```css
dialog::backdrop {
  background: var(--black-a6);
  backdrop-filter: blur(4px);
}
```

#### `native-placeholder-styling`
Use ::placeholder for input placeholder styling, not wrapper elements.

**Fail:**
```tsx
<div className={styles.inputWrapper}>
  {!value && <span className={styles.placeholder}>Enter text...</span>}
  <input value={value} />
</div>
```

**Pass:**
```css
input::placeholder {
  color: var(--gray-9);
  opacity: 1;
}
```

#### `native-selection-styling`
Use ::selection for text selection styling.

**Pass:**
```css
::selection {
  background: var(--blue-a5);
  color: var(--gray-12);
}
```

## Output Format

When reviewing files, output findings as:

```
file:line - [rule-id] description of issue

Example:
components/button/styles.module.css:12 - [pseudo-content-required] ::before missing content property
components/lightbox/index.tsx:45 - [transition-over-js-library] Using motion layoutId instead of View Transitions API
```

## Summary Table

After findings, output a summary:

| Rule | Count | Severity |
|------|-------|----------|
| `pseudo-content-required` | 2 | HIGH |
| `pseudo-over-dom-node` | 1 | MEDIUM |
| `transition-name-cleanup` | 1 | MEDIUM |

## References

- [MDN Pseudo-elements Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
