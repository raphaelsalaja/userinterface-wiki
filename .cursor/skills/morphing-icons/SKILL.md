---
name: morphing-icons
description: Build icon components where any icon morphs into any other through SVG line transformation. Use when asked to "create morphing icons", "build icon transitions", "animate between icons", or "transform icons".
metadata:
  author: raphael-salaja
  version: "1.0.0"
  argument-hint: <icon-names>
---

# Morphing Icons

Build icon components where every icon can smoothly morph into any other through actual shape transformation—not crossfades or opacity tricks.

## Core Architecture

### The Three-Line Constraint

Every icon uses exactly **three SVG lines**, regardless of visual complexity:

```tsx
interface IconLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
}

interface IconDefinition {
  lines: [IconLine, IconLine, IconLine];
  rotation?: number;
  group?: string;
}
```

**Why three lines?**
- Ensures any icon can morph into any other (same underlying structure)
- Simple enough to animate smoothly
- Complex enough to represent common UI icons

### Collapsed Lines

Icons that need fewer than three lines collapse extras to invisible center points:

```tsx
// A collapsed line (invisible point at center)
const collapsedLine: IconLine = {
  x1: 7,
  y1: 7,
  x2: 7,
  y2: 7,
  opacity: 0
};
```

## Icon Definitions

### Basic Icons

| Icon | Line 1 | Line 2 | Line 3 | Notes |
|------|--------|--------|--------|-------|
| Menu | Top bar | Middle bar | Bottom bar | Three horizontal lines |
| Plus | Vertical | Horizontal | Collapsed | Two perpendicular lines |
| Cross | Diagonal ↘ | Diagonal ↗ | Collapsed | Plus rotated 45° |
| Minus | Horizontal | Collapsed | Collapsed | Single line |
| Check | Short leg | Long leg | Collapsed | Two angled lines |
| Play | Top edge | Bottom edge | Right edge | Triangle with shared endpoints |
| Pause | Left bar | Right bar | Collapsed | Two vertical parallel lines |

### Arrow Icons

Arrows share the same shape, differing only by rotation:

```tsx
const arrowRight: IconDefinition = {
  lines: [
    { x1: 2, y1: 7, x2: 12, y2: 7 },      // Shaft
    { x1: 8, y1: 3, x2: 12, y2: 7 },      // Top chevron
    { x1: 8, y1: 11, x2: 12, y2: 7 }      // Bottom chevron
  ],
  rotation: 0,
  group: "arrow"
};

const arrowDown: IconDefinition = {
  ...arrowRight,
  rotation: 90,
  group: "arrow"
};
```

## Rotation Groups

Icons in the same **rotation group** share coordinates and differ only by rotation. Transitions within a group should **rotate**, not morph coordinates.

| Group | Members | Rotation Increments |
|-------|---------|---------------------|
| `arrow` | arrow-right, arrow-down, arrow-left, arrow-up | 90° |
| `chevron` | chev-right, chev-down, chev-left, chev-up | 90° |
| `plus-cross` | plus, cross | 45° |

### Why Rotation Matters

**Bad:** Morphing coordinates between arrow-right and arrow-down causes lines to bend and warp awkwardly.

**Good:** Rotating 90° creates a smooth, natural transition because the shapes are identical.

```tsx
function getTransition(from: IconDefinition, to: IconDefinition) {
  // Same rotation group = rotate
  if (from.group && from.group === to.group) {
    return {
      type: "rotate",
      degrees: to.rotation - from.rotation
    };
  }
  
  // Different groups = morph coordinates
  return { type: "morph" };
}
```

## Implementation

### React Component Structure

```tsx
"use client";

import { motion } from "motion/react";

interface MorphingIconProps {
  icon: string;
  size?: number;
}

function MorphingIcon({ icon, size = 14 }: MorphingIconProps) {
  const definition = icons[icon];
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.g
        animate={{ rotate: definition.rotation ?? 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformOrigin: "center" }}
      >
        {definition.lines.map((line, i) => (
          <motion.line
            key={i}
            animate={{
              x1: line.x1,
              y1: line.y1,
              x2: line.x2,
              y2: line.y2,
              opacity: line.opacity ?? 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
```

### Animation Guidelines

| Transition Type | Method | Easing |
|-----------------|--------|--------|
| Same rotation group | Rotate | Spring (stiffness: 200, damping: 20) |
| Different groups | Morph coordinates | Spring (stiffness: 200, damping: 20) |
| Collapsed lines | Opacity + position | Spring with slight delay |

### CSS Considerations

```css
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon svg {
  overflow: visible; /* Allow rotation without clipping */
}
```

## Testing Transitions

Build a sequencer to test icon pairs:

1. Create a grid showing all icons
2. Click to select start and end icons
3. Preview the transition
4. Note any awkward intermediate states

**Common issues to watch for:**
- Lines bending when they should rotate
- Overshoot on rotations
- Collapsed lines appearing briefly during morph
- Unnatural paths through coordinate space

## Extending with New Icons

When adding a new icon:

1. **Define using exactly 3 lines** (collapse unused lines)
2. **Check for rotation siblings** (same shape, different orientation)
3. **Assign to rotation group** if applicable
4. **Test transitions** to all existing icons
5. **Iterate on awkward morphs**

## Example Prompt

Use this as a starting point:

> Build an icon component where any icon can smoothly morph into any other. Every icon should use exactly three SVG lines. Icons that need fewer lines collapse the extras to invisible center points. For icons that are the same shape at different rotations (like arrows), use rotation instead of coordinate morphing.

## Key Insight

The AI will optimize for "working" rather than "feeling right." You need to:

1. **Watch the transitions** yourself
2. **Describe what feels off** (e.g., "arrows should rotate, not morph")
3. **Iterate** until it feels considered

The architecture is sound once established—three lines, rotation groups, coordinate morphing. The craft is in the details.
