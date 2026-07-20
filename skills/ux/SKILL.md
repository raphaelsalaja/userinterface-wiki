---
name: userinterface-wiki-ux
description: "Psychology-backed UX rules: Laws of UX (Fitts, Hick, Miller, Doherty, Postel) and predictive prefetching. Use when designing interactions, reviewing flows, or optimizing perceived performance."
license: MIT
metadata:
  author: raphael-salaja
  source: https://github.com/raphaelsalaja/userinterface-wiki
---

# User Interface Wiki — UX

29 focused rules extracted from the unified userinterface-wiki skill. See AGENTS.md in this directory for every rule expanded with code examples.

## Laws of UX — HIGH

- `ux-aesthetic-usability` — Users perceive aesthetically pleasing design as more usable. Small visual details compound into trust.
- `ux-cognitive-load-reduce` — Remove anything that doesn't help the user complete their task. Decoration, redundant labels, and unnecessary options all add load.
- `ux-common-region-boundaries` — Elements sharing a clearly defined boundary are perceived as a group.
- `ux-doherty-perceived-speed` — If you can't make something fast, make it feel fast with optimistic UI, skeletons, or progress indicators.
- `ux-doherty-under-400ms` — Interactions must respond within 400ms to feel instant. Above this threshold, users notice delay.
- `ux-fitts-hit-area` — Use pseudo-elements or invisible padding to expand clickable areas beyond visible bounds.
- `ux-fitts-target-size` — The bigger something is, the easier it is to click. Make interactive elements large enough to hit comfortably.
- `ux-goal-gradient-progress` — People accelerate behavior as they approach a goal. Show how close they are to finishing.
- `ux-hicks-minimize-choices` — Decision time increases logarithmically with the number of choices. Use progressive disclosure.
- `ux-jakobs-familiar-patterns` — Users spend most of their time on other sites. They expect yours to work the same way (Jakob's Law).
- `ux-millers-chunking` — Working memory holds about 7 items. Group and chunk large data sets so they're scannable.
- `ux-pareto-prioritize-features` — 80% of users use 20% of features (Pareto Principle). Optimize the critical path first.
- `ux-peak-end-finish-strong` — People judge experiences by their peak moment and their end. Invest in success and completion states.
- `ux-postels-accept-messy-input` — Inputs should accept messy human data and normalize it. Validate generously, format strictly.
- `ux-pragnanz-simplify` — People interpret complex visuals as the simplest form possible. Reduce visual noise to aid comprehension.
- `ux-progressive-disclosure` — Don't overwhelm users with everything at once. Reveal complexity incrementally as needed.
- `ux-proximity-grouping` — Elements near each other are perceived as related. Use spacing to create visual groups.
- `ux-serial-position` — Users best remember the first and last items in a sequence. Place the most important actions at these positions.
- `ux-similarity-consistency` — Elements that function the same should look the same. Visual consistency signals functional consistency.
- `ux-teslers-complexity` — Every system has irreducible complexity. The question is who handles it — the user or the system.
- `ux-uniform-connectedness` — Elements that are visually connected (by lines, color, or frames) are perceived as more related.
- `ux-von-restorff-emphasis` — When multiple similar elements are present, the one that differs is most likely to be remembered.
- `ux-zeigarnik-show-incomplete` — People remember incomplete tasks better than completed ones. Use this to drive engagement.

## Predictive Prefetching — MEDIUM

- `prefetch-hit-slop` — Expand the invisible prediction area around elements with hitSlop to start loading sooner.
- `prefetch-keyboard-tab` — Monitor focus changes and prefetch when the user is a few tab stops away from a registered element.
- `prefetch-not-everything` — Don't prefetch everything visible in the viewport. Prefetch based on user intent to avoid wasted bandwidth.
- `prefetch-touch-fallback` — Touch devices have no cursor. Fall back to viewport or touch-start strategies automatically.
- `prefetch-trajectory-over-hover` — Hover prefetching starts too late. Trajectory prediction fires while the cursor is still in motion, reclaiming 100-200ms.
- `prefetch-use-selectively` — Predictive prefetching doesn't belong in every project. Use it where navigation latency is noticeable.
