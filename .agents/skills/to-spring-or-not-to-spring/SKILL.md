---
name: to-spring-or-not-to-spring
description: Audit animation code for correct timing function selection. Use when reviewing motion implementations, debugging animations that feel wrong, or choosing between springs and easing. Outputs file:line findings.
license: MIT
metadata:
  author: raphael-salaja
  version: "2.0.0"
  source: /content/to-spring-or-not-to-spring/index.mdx
---

# To Spring or Not To Spring

Review animation code for correct timing function selection based on interaction type.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules below
3. Output findings in `file:line` format

## Rule Categories

| Priority | Category | Prefix |
|----------|----------|--------|
| 1 | Spring Selection | `spring-` |
| 2 | Easing Selection | `easing-` |
| 3 | Duration | `duration-` |
| 4 | No Animation | `none-` |

## Decision Framework

Ask: **Is this motion reacting to the user, or is the system speaking?**

| Motion Type | Best Choice | Why |
|-------------|-------------|-----|
| User-driven (drag, flick, gesture) | Spring | Survives interruption, preserves velocity |
| System-driven (state change, feedback) | Easing | Clear start/end, predictable timing |
| Time representation (progress, loading) | Linear | 1:1 relationship between time and progress |
| High-frequency (typing, fast toggles) | None | Animation adds noise, feels slower |

## Rules

### Spring Selection Rules

#### `spring-for-gestures`
Gesture-driven motion (drag, flick, swipe) must use springs.

**Fail:**
```tsx
<motion.div
  drag="x"
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

**Pass:**
```tsx
<motion.div
  drag="x"
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

#### `spring-for-interruptible`
Motion that can be interrupted must use springs.

**Fail:**
```tsx
// User can click again mid-animation
<motion.div
  animate={{ x: isOpen ? 200 : 0 }}
  transition={{ duration: 0.3 }}
/>
```

**Pass:**
```tsx
<motion.div
  animate={{ x: isOpen ? 200 : 0 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>
```

#### `spring-preserves-velocity`
When velocity matters, use springs to preserve input energy.

**Fail:**
```tsx
// Fast flick and slow flick animate identically
onDragEnd={(e, info) => {
  animate(target, { x: 0 }, { duration: 0.3 });
}}
```

**Pass:**
```tsx
// Fast flick moves faster than slow flick
onDragEnd={(e, info) => {
  animate(target, { x: 0 }, {
    type: "spring",
    velocity: info.velocity.x,
  });
}}
```

#### `spring-params-balanced`
Spring parameters must be balanced; avoid excessive oscillation.

**Fail:**
```tsx
transition={{
  type: "spring",
  stiffness: 1000,
  damping: 5, // Too low - excessive bounce
}}
```

**Pass:**
```tsx
transition={{
  type: "spring",
  stiffness: 500,
  damping: 30, // Balanced - settles quickly
}}
```

### Easing Selection Rules

#### `easing-for-state-change`
System-initiated state changes should use easing curves.

**Fail:**
```tsx
// Toast notification using spring
<motion.div
  animate={{ y: 0 }}
  transition={{ type: "spring" }}
/>
// Feels restless for a simple announcement
```

**Pass:**
```tsx
<motion.div
  animate={{ y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
/>
```

#### `easing-entrance-ease-out`
Entrances must use ease-out (arrive fast, settle gently).

**Fail:**
```css
.modal-enter {
  animation-timing-function: ease-in;
}
```

**Pass:**
```css
.modal-enter {
  animation-timing-function: ease-out;
}
```

#### `easing-exit-ease-in`
Exits must use ease-in (build momentum before departure).

**Fail:**
```css
.modal-exit {
  animation-timing-function: ease-out;
}
```

**Pass:**
```css
.modal-exit {
  animation-timing-function: ease-in;
}
```

#### `easing-transition-ease-in-out`
View/mode transitions use ease-in-out for neutral attention.

**Pass:**
```css
.page-transition {
  animation-timing-function: ease-in-out;
}
```

#### `easing-linear-only-progress`
Linear easing only for progress bars and time representation.

**Fail:**
```css
.card-slide {
  transition: transform 200ms linear; /* Mechanical feel */
}
```

**Pass:**
```css
.progress-bar {
  transition: width 100ms linear; /* Honest time representation */
}
```

### Duration Rules

#### `duration-press-hover`
Press and hover interactions: 120-180ms.

**Fail:**
```css
.button:hover {
  transition: background-color 400ms;
}
```

**Pass:**
```css
.button:hover {
  transition: background-color 150ms;
}
```

#### `duration-small-state`
Small state changes: 180-260ms.

**Pass:**
```css
.toggle {
  transition: transform 200ms ease;
}
```

#### `duration-max-300ms`
User-initiated animations must not exceed 300ms.

**Fail:**
```tsx
<motion.div transition={{ duration: 0.5 }} />
```

**Pass:**
```tsx
<motion.div transition={{ duration: 0.25 }} />
```

#### `duration-shorten-before-curve`
If animation feels slow, shorten duration before adjusting curve.

**Fail (common mistake):**
```css
/* Trying to fix slowness with sharper curve */
.element {
  transition: 400ms cubic-bezier(0, 0.9, 0.1, 1);
}
```

**Pass:**
```css
/* Fix slowness with shorter duration */
.element {
  transition: 200ms ease-out;
}
```

### No Animation Rules

#### `none-high-frequency`
High-frequency interactions should have no animation.

**Fail:**
```tsx
// Animated on every keystroke
function SearchInput() {
  return (
    <motion.div animate={{ scale: [1, 1.02, 1] }}>
      <input onChange={handleSearch} />
    </motion.div>
  );
}
```

**Pass:**
```tsx
function SearchInput() {
  return <input onChange={handleSearch} />;
}
```

#### `none-keyboard-navigation`
Keyboard navigation should be instant, no animation.

**Fail:**
```tsx
function Menu() {
  return items.map(item => (
    <motion.li
      whileFocus={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    />
  ));
}
```

**Pass:**
```tsx
function Menu() {
  return items.map(item => (
    <li className={styles.menuItem} /> // CSS :focus-visible only
  ));
}
```

#### `none-context-menu-entrance`
Context menus should not animate on entrance (exit only).

**Fail:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0 }}
/>
```

**Pass:**
```tsx
<motion.div exit={{ opacity: 0, scale: 0.95 }} />
```

## Output Format

When reviewing files, output findings as:

```
file:line - [rule-id] description of issue

Example:
components/drawer/index.tsx:45 - [spring-for-gestures] Drag interaction using easing instead of spring
components/modal/styles.module.css:23 - [easing-entrance-ease-out] Modal entrance using ease-in
```

## Summary Table

After findings, output a summary:

| Rule | Count | Severity |
|------|-------|----------|
| `spring-for-gestures` | 2 | HIGH |
| `easing-entrance-ease-out` | 1 | MEDIUM |
| `duration-max-300ms` | 3 | MEDIUM |

## Quick Reference

| Interaction | Timing | Type |
|-------------|--------|------|
| Drag release | Spring | `stiffness: 500, damping: 30` |
| Button press | 150ms | `ease` |
| Modal enter | 200ms | `ease-out` |
| Modal exit | 150ms | `ease-in` |
| Page transition | 250ms | `ease-in-out` |
| Progress bar | varies | `linear` |
| Typing feedback | 0ms | none |

## References

- [Apple WWDC23: Animate with Springs](https://developer.apple.com/videos/play/wwdc2023/10158/)
- [The Beauty of Bézier Curves - Freya Holmér](https://www.youtube.com/watch?v=aVwxzDHniEw)
- [Motion library](https://motion.dev/)
