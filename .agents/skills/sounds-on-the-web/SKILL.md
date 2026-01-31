---
name: sounds-on-the-web
description: Audit UI code for audio feedback best practices. Use when reviewing sound implementation, checking audio UX decisions, or auditing accessibility. Outputs file:line findings.
license: MIT
metadata:
  author: raphael-salaja
  version: "2.0.0"
  source: /content/sounds-on-the-web/index.mdx
---

# Sounds on the Web

Review UI code for audio feedback best practices and accessibility.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules below
3. Output findings in `file:line` format

## Rule Categories

| Priority | Category | Prefix |
|----------|----------|--------|
| 1 | Accessibility | `a11y-` |
| 2 | Appropriateness | `appropriate-` |
| 3 | Implementation | `impl-` |
| 4 | Weight Matching | `weight-` |

## Rules

### Accessibility Rules

#### `a11y-visual-equivalent`
Every audio cue must have a visual equivalent; sound never replaces visual feedback.

**Fail:**
```tsx
function SubmitButton({ onClick }) {
  const handleClick = () => {
    playSound("success");
    onClick(); // No visual confirmation
  };
}
```

**Pass:**
```tsx
function SubmitButton({ onClick }) {
  const [status, setStatus] = useState("idle");
  
  const handleClick = () => {
    playSound("success");
    setStatus("success"); // Visual feedback too
    onClick();
  };
  
  return <button data-status={status}>Submit</button>;
}
```

#### `a11y-toggle-setting`
Provide explicit toggle to disable sounds in settings.

**Fail:**
```tsx
// No way to disable sounds
function App() {
  return <SoundProvider>{children}</SoundProvider>;
}
```

**Pass:**
```tsx
function App() {
  const { soundEnabled } = usePreferences();
  return (
    <SoundProvider enabled={soundEnabled}>
      {children}
    </SoundProvider>
  );
}
```

#### `a11y-reduced-motion-check`
Respect prefers-reduced-motion as proxy for sound sensitivity.

**Fail:**
```tsx
function playSound(name: string) {
  audio.play(); // Plays regardless of preferences
}
```

**Pass:**
```tsx
function playSound(name: string) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  
  if (prefersReducedMotion) return;
  audio.play();
}
```

#### `a11y-volume-control`
Allow volume adjustment independent of system volume.

**Fail:**
```tsx
function playSound() {
  audio.volume = 1; // Always full volume
  audio.play();
}
```

**Pass:**
```tsx
function playSound() {
  const { volume } = usePreferences();
  audio.volume = volume; // User-controlled
  audio.play();
}
```

### Appropriateness Rules

#### `appropriate-no-high-frequency`
Do not add sound to high-frequency interactions (typing, keyboard navigation).

**Fail:**
```tsx
function Input({ onChange }) {
  const handleChange = (e) => {
    playSound("keystroke"); // Annoying on every keystroke
    onChange(e);
  };
}
```

**Pass:**
```tsx
function Input({ onChange }) {
  // No sound on typing - visual feedback only
  return <input onChange={onChange} />;
}
```

#### `appropriate-confirmations-only`
Sound is appropriate for confirmations: payments, uploads, form submissions.

**Pass:**
```tsx
async function handlePayment() {
  await processPayment();
  playSound("success"); // Appropriate - significant action
  showConfirmation();
}
```

#### `appropriate-errors-warnings`
Sound is appropriate for errors and warnings that can't be overlooked.

**Pass:**
```tsx
function handleError(error: Error) {
  playSound("error"); // Appropriate - needs attention
  showErrorToast(error.message);
}
```

#### `appropriate-no-decorative`
Do not add sound to decorative moments with no informational value.

**Fail:**
```tsx
function Card({ onHover }) {
  return (
    <div onMouseEnter={() => playSound("hover")}> {/* Decorative, no value */}
      {children}
    </div>
  );
}
```

#### `appropriate-no-punishing`
Sound should inform, not punish; avoid harsh sounds for user mistakes.

**Fail:**
```tsx
function ValidationError() {
  playSound("loud-buzzer"); // Punishing
  return <span>Invalid input</span>;
}
```

**Pass:**
```tsx
function ValidationError() {
  playSound("gentle-alert"); // Informative but not harsh
  return <span>Invalid input</span>;
}
```

### Implementation Rules

#### `impl-preload-audio`
Preload audio files to avoid playback delay.

**Fail:**
```tsx
function playSound(name: string) {
  const audio = new Audio(`/sounds/${name}.mp3`); // Loads on demand
  audio.play();
}
```

**Pass:**
```tsx
const sounds = {
  success: new Audio("/sounds/success.mp3"),
  error: new Audio("/sounds/error.mp3"),
};

// Preload on app init
Object.values(sounds).forEach(audio => audio.load());

function playSound(name: keyof typeof sounds) {
  sounds[name].currentTime = 0;
  sounds[name].play();
}
```

#### `impl-default-subtle`
Default volume should be subtle, not loud.

**Fail:**
```tsx
const DEFAULT_VOLUME = 1.0; // Too loud
```

**Pass:**
```tsx
const DEFAULT_VOLUME = 0.3; // Subtle default
```

#### `impl-reset-current-time`
Reset audio currentTime before replay to allow rapid triggering.

**Fail:**
```tsx
function playSound() {
  audio.play(); // Won't replay if already playing
}
```

**Pass:**
```tsx
function playSound() {
  audio.currentTime = 0;
  audio.play();
}
```

### Weight Matching Rules

#### `weight-match-action`
Sound weight should match action importance.

**Fail:**
```tsx
// Loud fanfare for minor action
function handleToggle() {
  playSound("triumphant-fanfare");
  setEnabled(!enabled);
}
```

**Pass:**
```tsx
// Subtle click for minor action
function handleToggle() {
  playSound("soft-click");
  setEnabled(!enabled);
}

// Richer sound for significant action
function handlePurchase() {
  playSound("success-chime");
  completePurchase();
}
```

#### `weight-duration-matches-action`
Sound duration should match action duration.

**Fail:**
```tsx
// 2-second sound for instant action
function handleClick() {
  playSound("long-whoosh"); // 2000ms
  // Action completes immediately
}
```

**Pass:**
```tsx
// Short sound for instant action
function handleClick() {
  playSound("click"); // 50ms
}

// Longer sound for process
function handleUpload() {
  playSound("upload-progress"); // Matches upload duration
}
```

## Output Format

When reviewing files, output findings as:

```
file:line - [rule-id] description of issue

Example:
components/input/index.tsx:23 - [appropriate-no-high-frequency] Playing sound on every keystroke
lib/sounds.ts:45 - [a11y-reduced-motion-check] Not checking prefers-reduced-motion
```

## Summary Table

After findings, output a summary:

| Rule | Count | Severity |
|------|-------|----------|
| `a11y-visual-equivalent` | 2 | HIGH |
| `appropriate-no-high-frequency` | 1 | HIGH |
| `impl-preload-audio` | 3 | MEDIUM |

## Sound Appropriateness Matrix

| Interaction | Sound? | Reason |
|-------------|--------|--------|
| Payment success | Yes | Significant confirmation |
| Form submission | Yes | User needs assurance |
| Error state | Yes | Can't be overlooked |
| Notification | Yes | May not be looking at screen |
| Button click | Maybe | Only for significant buttons |
| Typing | No | Too frequent |
| Hover | No | Decorative only |
| Scroll | No | Too frequent |
| Navigation | No | Keyboard nav would be noisy |

## References

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
