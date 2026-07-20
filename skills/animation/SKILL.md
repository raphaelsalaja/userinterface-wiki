---
name: userinterface-wiki-animation
description: "Web animation best practices: Disney's principles, timing functions, exit animations, morphing icons, and container animation. Use when writing or reviewing motion code (CSS transitions, Motion/Framer Motion)."
license: MIT
metadata:
  author: raphael-salaja
  source: https://github.com/raphaelsalaja/userinterface-wiki
---

# User Interface Wiki — Animation

56 focused rules extracted from the unified userinterface-wiki skill. See AGENTS.md in this directory for every rule expanded with code examples.

## Animation Principles — CRITICAL

- `physics-active-state` — Interactive elements must have active/pressed state with scale transform.
- `physics-no-excessive-stagger` — Stagger delays must not exceed 50ms per item.
- `physics-spring-for-overshoot` — Use springs (not easing) when overshoot-and-settle is needed.
- `physics-subtle-deformation` — Squash/stretch deformation must be subtle (0.95-1.05 range).
- `staging-dim-background` — Modal/dialog backgrounds should dim to direct focus.
- `staging-one-focal-point` — Only one element should animate prominently at a time.
- `staging-z-index-hierarchy` — Animated elements must respect z-index layering.
- `timing-consistent` — Similar elements must use identical timing values.
- `timing-no-entrance-context-menu` — Context menus should not animate on entrance (exit only).
- `timing-under-300ms` — User-initiated animations must complete within 300ms.

## Timing Functions — HIGH

- `duration-max-300ms` — User-initiated animations must not exceed 300ms.
- `duration-press-hover` — Press and hover interactions should use 120-180ms duration.
- `duration-shorten-before-curve` — If animation feels slow, shorten duration before adjusting curve.
- `duration-small-state` — Small state changes should use 180-260ms duration.
- `easing-entrance-ease-out` — Entrances must use ease-out (arrive fast, settle gently).
- `easing-exit-ease-in` — Exits must use ease-in (build momentum before departure).
- `easing-for-state-change` — System-initiated state changes should use easing curves.
- `easing-linear-only-progress` — Linear easing only for progress bars and time representation.
- `easing-natural-decay` — Use exponential ramps, not linear, for natural decay.
- `easing-no-linear-motion` — Linear easing should only be used for progress indicators, not motion.
- `easing-transition-ease-in-out` — View/mode transitions use ease-in-out for neutral attention.
- `none-context-menu-entrance` — Context menus should not animate on entrance (exit only).
- `none-high-frequency` — High-frequency interactions should have no animation.
- `none-keyboard-navigation` — Keyboard navigation should be instant, no animation.
- `spring-for-gestures` — Gesture-driven motion (drag, flick, swipe) must use springs.
- `spring-for-interruptible` — Motion that can be interrupted must use springs.
- `spring-params-balanced` — Spring parameters must be balanced; avoid excessive oscillation.
- `spring-preserves-velocity` — When velocity matters, use springs to preserve input energy.

## Exit Animations — HIGH

- `exit-key-required` — Dynamic lists inside AnimatePresence must have unique keys.
- `exit-matches-initial` — Exit animation should mirror initial for symmetry.
- `exit-prop-required` — Elements inside AnimatePresence should have exit prop defined.
- `exit-requires-wrapper` — Conditional motion elements must be wrapped in AnimatePresence.
- `mode-pop-layout-for-lists` — Use popLayout mode for list reordering animations.
- `mode-sync-layout-conflict` — Mode "sync" causes layout conflicts; position exiting elements absolutely.
- `mode-wait-doubles-duration` — Mode "wait" nearly doubles animation duration; adjust timing accordingly.
- `nested-consistent-timing` — Parent and child exit durations should be coordinated.
- `nested-propagate-required` — Nested AnimatePresence must use propagate prop for coordinated exits.
- `presence-disable-interactions` — Disable interactions on exiting elements using isPresent.
- `presence-hook-in-child` — useIsPresent must be called from child of AnimatePresence, not parent.
- `presence-safe-to-remove` — When using usePresence, always call safeToRemove after async work.

## Morphing Icons — LOW

- `morphing-aria-hidden` — Icon SVGs should be aria-hidden since they're decorative.
- `morphing-consistent-viewbox` — All icons must use the same viewBox (14x14 recommended).
- `morphing-group-variants` — Icons that are rotational variants MUST share the same group and base lines.
- `morphing-jump-non-grouped` — When transitioning between icons NOT in the same group, rotation should jump instantly.
- `morphing-reduced-motion` — Respect prefers-reduced-motion by disabling animations.
- `morphing-spring-rotation` — Rotation between grouped icons should use spring physics for natural motion.
- `morphing-strokelinecap-round` — Lines should use strokeLinecap="round" for polished endpoints.
- `morphing-three-lines` — Every icon MUST use exactly 3 lines. No more, no fewer.
- `morphing-use-collapsed` — Unused lines must use the collapsed constant, not omission or null.

## Container Animation — MEDIUM

- `container-callback-ref` — Use a callback ref (not useRef) for measurement hooks so the observer attaches when the DOM node is ready.
- `container-guard-initial-zero` — On initial render, measured bounds are 0. Guard against this to prevent animating from 0 to actual size.
- `container-no-excessive-use` — Animated bounds is a subtle effect. Use it for buttons, accordions, and interactive elements — not everywhere.
- `container-overflow-hidden` — Set overflow: hidden on the animated outer container to clip content during size transitions.
- `container-transition-delay` — Add a small delay to container size animations so the transition feels like it's catching up to the content.
- `container-two-div-pattern` — Use an outer animated div and an inner measured div. Never measure and animate the same element.
- `container-use-resize-observer` — Use ResizeObserver to track element dimensions. It fires on resize without causing layout thrashing.
