---
name: mastering-animate-presence
description: Audit Motion/Framer Motion code for AnimatePresence best practices. Use when reviewing exit animations, modals, or presence state. Outputs file:line findings.
license: MIT
metadata:
  author: raphael-salaja
  version: "2.0.0"
  source: /content/mastering-animate-presence/index.mdx
---

# Mastering AnimatePresence

Review Motion code for AnimatePresence and exit animation best practices.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules below
3. Output findings in `file:line` format

## Rule Categories

| Priority | Category | Prefix |
|----------|----------|--------|
| 1 | Exit Animations | `exit-` |
| 2 | Presence Hooks | `presence-` |
| 3 | Mode Selection | `mode-` |
| 4 | Nested Exits | `nested-` |

## Rules

### Exit Animation Rules

#### `exit-requires-wrapper`
Conditional motion elements must be wrapped in AnimatePresence.

**Fail:**
```tsx
{isVisible && (
  <motion.div exit={{ opacity: 0 }} />
)}
```

**Pass:**
```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

#### `exit-prop-required`
Elements inside AnimatePresence should have exit prop defined.

**Fail:**
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
  )}
</AnimatePresence>
```

**Pass:**
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

#### `exit-key-required`
Dynamic lists inside AnimatePresence must have unique keys.

**Fail:**
```tsx
<AnimatePresence>
  {items.map((item, index) => (
    <motion.div key={index} exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

**Pass:**
```tsx
<AnimatePresence>
  {items.map((item) => (
    <motion.div key={item.id} exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

#### `exit-matches-initial`
Exit animation should mirror initial for symmetry.

**Fail:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ scale: 0 }}
/>
```

**Pass:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
/>
```

### Presence Hook Rules

#### `presence-hook-in-child`
useIsPresent must be called from child of AnimatePresence, not parent.

**Fail:**
```tsx
function Parent() {
  const isPresent = useIsPresent(); // Wrong location
  return (
    <AnimatePresence>
      {show && <Child />}
    </AnimatePresence>
  );
}
```

**Pass:**
```tsx
function Child() {
  const isPresent = useIsPresent(); // Correct location
  return <motion.div data-exiting={!isPresent} />;
}
```

#### `presence-safe-to-remove`
When using usePresence, always call safeToRemove after async work.

**Fail:**
```tsx
function AsyncComponent() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      cleanup(); // Never calls safeToRemove
    }
  }, [isPresent]);
}
```

**Pass:**
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

#### `presence-disable-interactions`
Disable interactions on exiting elements using isPresent.

**Fail:**
```tsx
function Card() {
  const isPresent = useIsPresent();
  return <button onClick={handleClick}>Click</button>;
  // Button clickable during exit
}
```

**Pass:**
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

### Mode Selection Rules

#### `mode-wait-doubles-duration`
Mode "wait" nearly doubles animation duration; adjust timing accordingly.

**Fail:**
```tsx
<AnimatePresence mode="wait">
  <motion.div transition={{ duration: 0.3 }} />
</AnimatePresence>
// Total time: ~600ms (too slow)
```

**Pass:**
```tsx
<AnimatePresence mode="wait">
  <motion.div transition={{ duration: 0.15 }} />
</AnimatePresence>
// Total time: ~300ms (acceptable)
```

#### `mode-sync-layout-conflict`
Mode "sync" causes layout conflicts; position exiting elements absolutely.

**Fail:**
```tsx
<AnimatePresence mode="sync">
  {items.map(item => (
    <motion.div exit={{ opacity: 0 }}>{item}</motion.div>
  ))}
</AnimatePresence>
// Exiting and entering elements compete for space
```

**Pass:**
```tsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.div exit={{ opacity: 0 }}>{item}</motion.div>
  ))}
</AnimatePresence>
```

#### `mode-pop-layout-for-lists`
Use popLayout mode for list reordering animations.

**Fail:**
```tsx
<AnimatePresence>
  {items.map(item => <ListItem key={item.id} />)}
</AnimatePresence>
// Layout shifts during exit
```

**Pass:**
```tsx
<AnimatePresence mode="popLayout">
  {items.map(item => <ListItem key={item.id} />)}
</AnimatePresence>
```

### Nested Exit Rules

#### `nested-propagate-required`
Nested AnimatePresence must use propagate prop for coordinated exits.

**Fail:**
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
// Children vanish instantly when parent exits
```

**Pass:**
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

#### `nested-consistent-timing`
Parent and child exit durations should be coordinated.

**Fail:**
```tsx
// Parent exits in 100ms, children in 500ms
<motion.div exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
  <motion.div exit={{ scale: 0 }} transition={{ duration: 0.5 }} />
</motion.div>
```

**Pass:**
```tsx
// Parent waits for children or exits simultaneously
<motion.div exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
  <motion.div exit={{ scale: 0 }} transition={{ duration: 0.15 }} />
</motion.div>
```

## Output Format

When reviewing files, output findings as:

```
file:line - [rule-id] description of issue

Example:
components/modal/index.tsx:23 - [exit-requires-wrapper] Conditional motion.div not wrapped in AnimatePresence
components/modal/index.tsx:45 - [exit-prop-required] Missing exit prop on motion element
```

## Summary Table

After findings, output a summary:

| Rule | Count | Severity |
|------|-------|----------|
| `exit-requires-wrapper` | 2 | HIGH |
| `exit-prop-required` | 3 | HIGH |
| `mode-wait-doubles-duration` | 1 | MEDIUM |

## References

- [Motion AnimatePresence Documentation](https://motion.dev/docs/react-animate-presence)
- [MDN @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
