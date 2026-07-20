# User Interface Wiki — Animation

> Generated from `skills/rules/` — do not edit by hand.
> 56 rules. Part of [userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki).

## Animation Principles

**Impact:** CRITICAL

### Active State Scale Transform

Interactive elements must have active/pressed state with scale transform.

**Incorrect (no active state):**

```css
.button:hover { background: var(--gray-3); }
/* Missing :active state */
```

**Correct (active state present):**

```css
.button:active { transform: scale(0.98); }
```

### Stagger Under 50ms Per Item

Stagger delays must not exceed 50ms per item.

**Incorrect (excessive stagger):**

```tsx
transition={{ staggerChildren: 0.15 }}
```

**Correct (reasonable stagger):**

```tsx
transition={{ staggerChildren: 0.03 }}
```

### Springs for Overshoot and Settle

Use springs (not easing) when overshoot-and-settle is needed.

**Incorrect (easing for bounce):**

```tsx
<motion.div transition={{ duration: 0.3, ease: "easeOut" }} />
// When element should bounce/settle
```

**Correct (spring physics):**

```tsx
<motion.div transition={{ type: "spring", stiffness: 500, damping: 30 }} />
```

### Subtle Squash and Stretch

Squash/stretch deformation must be subtle (0.95-1.05 range).

**Incorrect (excessive deformation):**

```tsx
<motion.div whileTap={{ scale: 0.8 }} />
```

**Correct (subtle deformation):**

```tsx
<motion.div whileTap={{ scale: 0.98 }} />
```

### Dim Background for Focus

Modal/dialog backgrounds should dim to direct focus.

**Incorrect (transparent overlay):**

```css
.overlay { background: transparent; }
```

**Correct (dimmed overlay):**

```css
.overlay { background: var(--black-a6); }
```

### Single Focal Point

Only one element should animate prominently at a time.

**Incorrect (competing animations):**

```tsx
<motion.div animate={{ scale: 1.1 }} />
<motion.div animate={{ scale: 1.1 }} />
```

**Correct (single focal point):**

```tsx
<motion.div animate={{ scale: 1.1 }} />
<motion.div animate={{ scale: 1 }} />
```

### Z-Index Layering for Animated Elements

Animated elements must respect z-index layering.

**Incorrect (no z-index):**

```css
.tooltip { /* No z-index, may render behind other elements */ }
```

**Correct (explicit z-index):**

```css
.tooltip { z-index: 50; }
```

### Consistent Timing for Similar Elements

Similar elements must use identical timing values.

**Incorrect (inconsistent timing):**

```css
.button-primary { transition: 200ms; }
.button-secondary { transition: 150ms; }
```

**Correct (consistent timing):**

```css
.button-primary { transition: 200ms; }
.button-secondary { transition: 200ms; }
```

### No Entrance Animation on Context Menus

Context menus should not animate on entrance (exit only).

**Incorrect (animates entrance):**

```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

**Correct (exit only):**

```tsx
<motion.div exit={{ opacity: 0 }} />
```

### User Animations Under 300ms

User-initiated animations must complete within 300ms.

**Incorrect (exceeds 300ms limit):**

```css
.button { transition: transform 400ms; }
```

**Correct (within 300ms):**

```css
.button { transition: transform 200ms; }
```

## Timing Functions

**Impact:** HIGH

### Max 300ms for User Actions

User-initiated animations must not exceed 300ms.

**Incorrect (exceeds limit):**

```tsx
<motion.div transition={{ duration: 0.5 }} />
```

**Correct (within limit):**

```tsx
<motion.div transition={{ duration: 0.25 }} />
```

### Press and Hover 120-180ms

Press and hover interactions should use 120-180ms duration.

**Incorrect (too slow):**

```css
.button:hover { transition: background-color 400ms; }
```

**Correct (appropriate duration):**

```css
.button:hover { transition: background-color 150ms; }
```

### Shorten Duration Before Adjusting Curve

If animation feels slow, shorten duration before adjusting curve.

**Incorrect (adjusting curve instead):**

```css
.element { transition: 400ms cubic-bezier(0, 0.9, 0.1, 1); }
```

**Correct (shorter duration):**

```css
.element { transition: 200ms ease-out; }
```

### Small State Changes 180-260ms

Small state changes should use 180-260ms duration.

**Correct:**

```css
.toggle { transition: transform 200ms ease; }
```

### Ease-Out for Entrances

Entrances must use ease-out (arrive fast, settle gently).

**Incorrect (ease-in for entrance):**

```css
.modal-enter { animation-timing-function: ease-in; }
```

**Correct (ease-out for entrance):**

```css
.modal-enter { animation-timing-function: ease-out; }
```

### Ease-In for Exits

Exits must use ease-in (build momentum before departure).

**Incorrect (ease-out for exit):**

```css
.modal-exit { animation-timing-function: ease-out; }
```

**Correct (ease-in for exit):**

```css
.modal-exit { animation-timing-function: ease-in; }
```

### Easing for System State Changes

System-initiated state changes should use easing curves.

**Incorrect (spring for announcement):**

```tsx
<motion.div
  animate={{ y: 0 }}
  transition={{ type: "spring" }}
/>
```

**Correct (easing for announcement):**

```tsx
<motion.div
  animate={{ y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
/>
```

### Linear Easing Only for Progress

Linear easing only for progress bars and time representation.

**Incorrect (linear for motion):**

```css
.card-slide { transition: transform 200ms linear; }
```

**Correct (linear for progress):**

```css
.progress-bar { transition: width 100ms linear; }
```

### Exponential Ramps for Natural Decay

Use exponential ramps, not linear, for natural decay.

**Incorrect (linear ramp):**

```ts
gain.gain.linearRampToValueAtTime(0, t + 0.05);
```

**Correct (exponential ramp):**

```ts
gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
```

### No Linear Easing for Motion

Linear easing should only be used for progress indicators, not motion.

**Incorrect (linear for motion):**

```css
.card { transition: transform 200ms linear; }
```

**Correct (linear for progress only):**

```css
.progress-bar { transition: width 100ms linear; }
```

### Ease-In-Out for View Transitions

View/mode transitions use ease-in-out for neutral attention.

**Correct:**

```css
.page-transition { animation-timing-function: ease-in-out; }
```

### No Entrance Animation for Context Menus

Context menus should not animate on entrance (exit only).

**Incorrect (entrance animation):**

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0 }}
/>
```

**Correct (exit only):**

```tsx
<motion.div exit={{ opacity: 0, scale: 0.95 }} />
```

### No Animation for High-Frequency Interactions

High-frequency interactions should have no animation.

**Incorrect (animated on every keystroke):**

```tsx
function SearchInput() {
  return (
    <motion.div animate={{ scale: [1, 1.02, 1] }}>
      <input onChange={handleSearch} />
    </motion.div>
  );
}
```

**Correct (no animation):**

```tsx
function SearchInput() {
  return <input onChange={handleSearch} />;
}
```

### No Animation for Keyboard Navigation

Keyboard navigation should be instant, no animation.

**Incorrect (animated focus):**

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

**Correct (CSS focus-visible only):**

```tsx
function Menu() {
  return items.map(item => (
    <li className={styles.menuItem} />
  ));
}
```

### Springs for Gesture-Driven Motion

Gesture-driven motion (drag, flick, swipe) must use springs.

**Incorrect (easing for drag):**

```tsx
<motion.div
  drag="x"
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

**Correct (spring for drag):**

```tsx
<motion.div
  drag="x"
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

### Springs for Interruptible Motion

Motion that can be interrupted must use springs.

**Incorrect (easing for interruptible):**

```tsx
<motion.div
  animate={{ x: isOpen ? 200 : 0 }}
  transition={{ duration: 0.3 }}
/>
```

**Correct (spring for interruptible):**

```tsx
<motion.div
  animate={{ x: isOpen ? 200 : 0 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>
```

### Balanced Spring Parameters

Spring parameters must be balanced; avoid excessive oscillation.

**Incorrect (too bouncy):**

```tsx
transition={{
  type: "spring",
  stiffness: 1000,
  damping: 5,
}}
```

**Correct (balanced):**

```tsx
transition={{
  type: "spring",
  stiffness: 500,
  damping: 30,
}}
```

### Springs Preserve Input Velocity

When velocity matters, use springs to preserve input energy.

**Incorrect (velocity ignored):**

```tsx
onDragEnd={(e, info) => {
  animate(target, { x: 0 }, { duration: 0.3 });
}}
```

**Correct (velocity preserved):**

```tsx
onDragEnd={(e, info) => {
  animate(target, { x: 0 }, {
    type: "spring",
    velocity: info.velocity.x,
  });
}}
```

## Exit Animations

**Impact:** HIGH

### Unique Keys in AnimatePresence Lists

Dynamic lists inside AnimatePresence must have unique keys.

**Incorrect (index as key):**

```tsx
<AnimatePresence>
  {items.map((item, index) => (
    <motion.div key={index} exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

**Correct (stable unique key):**

```tsx
<AnimatePresence>
  {items.map((item) => (
    <motion.div key={item.id} exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

### Exit Mirrors Initial for Symmetry

Exit animation should mirror initial for symmetry.

**Incorrect (asymmetric exit):**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ scale: 0 }}
/>
```

**Correct (symmetric exit):**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
/>
```

### Exit Prop Required Inside AnimatePresence

Elements inside AnimatePresence should have exit prop defined.

**Incorrect (missing exit):**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
  )}
</AnimatePresence>
```

**Correct (exit defined):**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### AnimatePresence Wrapper Required

Conditional motion elements must be wrapped in AnimatePresence.

**Incorrect (no wrapper):**

```tsx
{isVisible && (
  <motion.div exit={{ opacity: 0 }} />
)}
```

**Correct (wrapped):**

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

### popLayout for List Reordering

Use popLayout mode for list reordering animations.

**Incorrect (default mode causes shifts):**

```tsx
<AnimatePresence>
  {items.map(item => <ListItem key={item.id} />)}
</AnimatePresence>
```

**Correct (popLayout prevents shifts):**

```tsx
<AnimatePresence mode="popLayout">
  {items.map(item => <ListItem key={item.id} />)}
</AnimatePresence>
```

### Mode "sync" Causes Layout Conflicts

Mode "sync" causes layout conflicts; position exiting elements absolutely.

**Incorrect (sync with layout competition):**

```tsx
<AnimatePresence mode="sync">
  {items.map(item => (
    <motion.div exit={{ opacity: 0 }}>{item}</motion.div>
  ))}
</AnimatePresence>
```

**Correct (popLayout instead):**

```tsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.div exit={{ opacity: 0 }}>{item}</motion.div>
  ))}
</AnimatePresence>
```

### Mode "wait" Doubles Duration

Mode "wait" nearly doubles animation duration; adjust timing accordingly.

**Incorrect (too slow with wait):**

```tsx
<AnimatePresence mode="wait">
  <motion.div transition={{ duration: 0.3 }} />
</AnimatePresence>
```

**Correct (halved timing):**

```tsx
<AnimatePresence mode="wait">
  <motion.div transition={{ duration: 0.15 }} />
</AnimatePresence>
```

### Coordinated Parent-Child Exit Timing

Parent and child exit durations should be coordinated.

**Incorrect (parent too fast):**

```tsx
<motion.div exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
  <motion.div exit={{ scale: 0 }} transition={{ duration: 0.5 }} />
</motion.div>
```

**Correct (coordinated timing):**

```tsx
<motion.div exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
  <motion.div exit={{ scale: 0 }} transition={{ duration: 0.15 }} />
</motion.div>
```

### Propagate Prop for Nested AnimatePresence

Nested AnimatePresence must use propagate prop for coordinated exits.

**Incorrect (children vanish instantly):**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div exit={{ opacity: 0 }}>
      <AnimatePresence>
        {items.map(item => (
          <motion.div key={item.id} exit={{ scale: 0 }} />
        ))}
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>
```

**Correct (propagate on both):**

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

### Disable Interactions on Exiting Elements

Disable interactions on exiting elements using isPresent.

**Incorrect (clickable during exit):**

```tsx
function Card() {
  const isPresent = useIsPresent();
  return <button onClick={handleClick}>Click</button>;
}
```

**Correct (disabled during exit):**

```tsx
function Card() {
  const isPresent = useIsPresent();
  return (
    <button onClick={handleClick} disabled={!isPresent}>
      Click
    </button>
  );
}
```

### useIsPresent in Child Component

useIsPresent must be called from child of AnimatePresence, not parent.

**Incorrect (hook in parent):**

```tsx
function Parent() {
  const isPresent = useIsPresent();
  return (
    <AnimatePresence>
      {show && <Child />}
    </AnimatePresence>
  );
}
```

**Correct (hook in child):**

```tsx
function Child() {
  const isPresent = useIsPresent();
  return <motion.div data-exiting={!isPresent} />;
}
```

### Call safeToRemove After Async Work

When using usePresence, always call safeToRemove after async work.

**Incorrect (missing safeToRemove):**

```tsx
function AsyncComponent() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      cleanup();
    }
  }, [isPresent]);
}
```

**Correct (safeToRemove called):**

```tsx
function AsyncComponent() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      cleanup().then(safeToRemove);
    }
  }, [isPresent, safeToRemove]);
}
```

## Morphing Icons

**Impact:** LOW

### Aria Hidden on Icon SVGs

Icon SVGs should be aria-hidden since they're decorative.

**Incorrect (no aria attribute):**

```tsx
<svg width={size} height={size}>...</svg>
```

**Correct (aria-hidden):**

```tsx
<svg width={size} height={size} aria-hidden="true">...</svg>
```

### Consistent ViewBox Size

All icons must use the same viewBox (14x14 recommended).

**Incorrect (mixed scales):**

```ts
const icon1 = { lines: [{ x1: 2, y1: 7, x2: 12, y2: 7 }, ...] }; // 14x14
const icon2 = { lines: [{ x1: 4, y1: 14, x2: 24, y2: 14 }, ...] }; // 28x28
```

**Correct (consistent scale):**

```ts
const VIEWBOX_SIZE = 14;
const CENTER = 7;
```

### Shared Group for Rotational Variants

Icons that are rotational variants MUST share the same group and base lines.

**Incorrect (different line definitions):**

```ts
const arrowRight = { lines: [{ x1: 2, y1: 7, x2: 12, y2: 7 }, ...] };
const arrowDown = { lines: [{ x1: 7, y1: 2, x2: 7, y2: 12 }, ...] };
```

**Correct (shared base lines):**

```ts
const arrowLines: [IconLine, IconLine, IconLine] = [
  { x1: 2, y1: 7, x2: 12, y2: 7 },
  { x1: 7.5, y1: 2.5, x2: 12, y2: 7 },
  { x1: 7.5, y1: 11.5, x2: 12, y2: 7 },
];

const icons = {
  "arrow-right": { lines: arrowLines, rotation: 0, group: "arrow" },
  "arrow-down": { lines: arrowLines, rotation: 90, group: "arrow" },
  "arrow-left": { lines: arrowLines, rotation: 180, group: "arrow" },
  "arrow-up": { lines: arrowLines, rotation: -90, group: "arrow" },
};
```

### Instant Jump for Non-Grouped Icons

When transitioning between icons NOT in the same group, rotation should jump instantly.

**Incorrect (always animates rotation):**

```tsx
useEffect(() => {
  rotation.set(definition.rotation ?? 0);
}, [definition]);
```

**Correct (jumps when not grouped):**

```tsx
useEffect(() => {
  if (shouldRotate) {
    rotation.set(definition.rotation ?? 0);
  } else {
    rotation.jump(definition.rotation ?? 0);
  }
}, [definition, shouldRotate]);
```

### Reduced Motion Support for Icons

Respect prefers-reduced-motion by disabling animations.

**Incorrect (always animates):**

```tsx
function MorphingIcon({ icon }: Props) {
  return <motion.line animate={...} transition={{ duration: 0.4 }} />;
}
```

**Correct (respects preference):**

```tsx
function MorphingIcon({ icon }: Props) {
  const reducedMotion = useReducedMotion() ?? false;
  const activeTransition = reducedMotion ? { duration: 0 } : transition;
  
  return <motion.line animate={...} transition={activeTransition} />;
}
```

### Spring Physics for Rotation

Rotation between grouped icons should use spring physics for natural motion.

**Incorrect (duration-based rotation):**

```tsx
<motion.g animate={{ rotate: rotation }} transition={{ duration: 0.3 }} />
```

**Correct (spring rotation):**

```tsx
const rotation = useSpring(definition.rotation ?? 0, activeTransition);

<motion.g style={{ rotate: rotation, transformOrigin: "center" }} />
```

### Round Stroke Line Caps

Lines should use strokeLinecap="round" for polished endpoints.

**Incorrect (butt caps):**

```tsx
<motion.line strokeLinecap="butt" />
```

**Correct (round caps):**

```tsx
<motion.line strokeLinecap="round" />
```

### Icons Must Use Exactly Three Lines

Every icon MUST use exactly 3 lines. No more, no fewer.

**Incorrect (only 2 lines):**

```ts
const checkIcon = {
  lines: [
    { x1: 2, y1: 7.5, x2: 5.5, y2: 11 },
    { x1: 5.5, y1: 11, x2: 12, y2: 3 },
  ],
};
```

**Correct (3 lines with collapsed):**

```ts
const checkIcon = {
  lines: [
    { x1: 2, y1: 7.5, x2: 5.5, y2: 11 },
    { x1: 5.5, y1: 11, x2: 12, y2: 3 },
    collapsed,
  ],
};
```

### Use Collapsed Constant for Unused Lines

Unused lines must use the collapsed constant, not omission or null.

**Incorrect (null for unused):**

```ts
const minusIcon = {
  lines: [
    { x1: 2, y1: 7, x2: 12, y2: 7 },
    null,
    null,
  ],
};
```

**Correct (collapsed constant):**

```ts
const minusIcon = {
  lines: [
    { x1: 2, y1: 7, x2: 12, y2: 7 },
    collapsed,
    collapsed,
  ],
};
```

## Container Animation

**Impact:** MEDIUM

### Use Callback Ref for Measurement

Use a callback ref (not useRef) for measurement hooks so the observer attaches when the DOM node is ready.

**Incorrect (useRef may be null on first effect):**

```tsx
const ref = useRef(null);
useEffect(() => {
  if (!ref.current) return;
  observer.observe(ref.current);
}, []);
```

**Correct (callback ref guarantees node):**

```tsx
const [element, setElement] = useState(null);
const ref = useCallback((node) => setElement(node), []);
useEffect(() => {
  if (!element) return;
  observer.observe(element);
  return () => observer.disconnect();
}, [element]);
```

### Guard Against Zero on Initial Render

On initial render, measured bounds are 0. Guard against this to prevent animating from 0 to actual size.

**Incorrect (animates from 0 on mount):**

```tsx
<motion.div animate={{ width: bounds.width }}>
  <div ref={ref}>{children}</div>
</motion.div>
```

**Correct (falls back to auto on first frame):**

```tsx
<motion.div animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}>
  <div ref={ref}>{children}</div>
</motion.div>
```

### Use Animated Bounds Sparingly

Animated bounds is a subtle effect. Use it for buttons, accordions, and interactive elements — not everywhere.

**Good use cases:** loading state buttons, expandable sections, accordions, FAQs, content reveals.

**Bad use cases:** every container on the page, static layouts, elements that don't change size.

### Overflow Hidden on Animated Container

Set overflow: hidden on the animated outer container to clip content during size transitions.

**Incorrect (content overflows during animation):**

```tsx
<motion.div animate={{ height: bounds.height }}>
  <div ref={ref}>{children}</div>
</motion.div>
```

**Correct (clipped during transition):**

```tsx
<motion.div animate={{ height: bounds.height }} style={{ overflow: "hidden" }}>
  <div ref={ref}>{children}</div>
</motion.div>
```

### Add Delay for Natural Container Transitions

Add a small delay to container size animations so the transition feels like it's catching up to the content.

**Correct:**

```tsx
<motion.div
  animate={{ height: bounds.height }}
  transition={{ duration: 0.2, delay: 0.05 }}
  style={{ overflow: "hidden" }}
>
  <div ref={ref}>{children}</div>
</motion.div>
```

### Two-Div Pattern for Animated Bounds

Use an outer animated div and an inner measured div. Never measure and animate the same element.

**Incorrect (measure and animate same element — creates feedback loop):**

```tsx
function AnimatedContainer({ children }) {
  const [ref, bounds] = useMeasure();
  return (
    <motion.div ref={ref} animate={{ height: bounds.height }}>
      {children}
    </motion.div>
  );
}
```

**Correct (separate measure and animate targets):**

```tsx
function AnimatedContainer({ children }) {
  const [ref, bounds] = useMeasure();
  return (
    <motion.div animate={{ height: bounds.height }}>
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}
```

### Use ResizeObserver for Measurement

Use ResizeObserver to track element dimensions. It fires on resize without causing layout thrashing.

**Incorrect (measuring on every render):**

```tsx
function useMeasure(ref) {
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
    }
  });
  return bounds;
}
```

**Correct (ResizeObserver):**

```tsx
function useMeasure() {
  const [element, setElement] = useState(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => setElement(node), []);

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}
```
