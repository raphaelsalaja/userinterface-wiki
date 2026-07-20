# User Interface Wiki — UX

> Generated from `skills/rules/` — do not edit by hand.
> 29 rules. Part of [userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki).

## Laws of UX

**Impact:** HIGH

### Visual Polish Increases Perceived Usability

Users perceive aesthetically pleasing design as more usable. Small visual details compound into trust.

**Incorrect (unstyled, raw elements):**

```css
.card {
  border: 1px solid black;
  padding: 10px;
}
```

**Correct (considered visual treatment):**

```css
.card {
  padding: 16px;
  background: var(--gray-2);
  border: 1px solid var(--gray-a4);
  border-radius: 12px;
  box-shadow: var(--shadow-1);
}
```

Reference: [Aesthetic-Usability Effect](https://lawsofux.com/aesthetic-usability-effect/)

### Minimize Extraneous Cognitive Load

Remove anything that doesn't help the user complete their task. Decoration, redundant labels, and unnecessary options all add load.

**Incorrect (extraneous elements):**

```tsx
function DeleteDialog() {
  return (
    <dialog>
      <Icon name="warning" size={64} />
      <h2>Warning!</h2>
      <p>Are you absolutely sure you want to delete?</p>
      <p>This action is permanent and cannot be undone.</p>
      <p>All associated data will be lost forever.</p>
      <div>
        <button>Cancel</button>
        <button>Delete</button>
        <button>Learn More</button>
      </div>
    </dialog>
  );
}
```

**Correct (essential information only):**

```tsx
function DeleteDialog() {
  return (
    <dialog>
      <h2>Delete this item?</h2>
      <p>This can't be undone.</p>
      <div>
        <button>Cancel</button>
        <button>Delete</button>
      </div>
    </dialog>
  );
}
```

Reference: [Cognitive Load](https://lawsofux.com/cognitive-load/)

### Use Boundaries to Group Related Content

Elements sharing a clearly defined boundary are perceived as a group.

**Incorrect (flat list with no visual grouping):**

```tsx
function Settings() {
  return (
    <div>
      <Toggle label="Dark mode" />
      <Toggle label="Notifications" />
      <Input label="Email" />
      <Input label="Password" />
    </div>
  );
}
```

**Correct (bounded sections):**

```tsx
function Settings() {
  return (
    <div>
      <section className={styles.group}>
        <h3>Appearance</h3>
        <Toggle label="Dark mode" />
      </section>
      <section className={styles.group}>
        <h3>Notifications</h3>
        <Toggle label="Notifications" />
      </section>
      <section className={styles.group}>
        <h3>Account</h3>
        <Input label="Email" />
        <Input label="Password" />
      </section>
    </div>
  );
}
```

Reference: [Law of Common Region](https://lawsofux.com/law-of-common-region/)

### Fake Speed When Actual Speed Isn't Possible

If you can't make something fast, make it feel fast with optimistic UI, skeletons, or progress indicators.

**Incorrect (blank screen during load):**

```tsx
function Page() {
  const { data, isLoading } = useFetch("/api/data");
  if (isLoading) return null;
  return <Content data={data} />;
}
```

**Correct (skeleton during load):**

```tsx
function Page() {
  const { data, isLoading } = useFetch("/api/data");
  if (isLoading) return <Skeleton />;
  return <Content data={data} />;
}
```

### Respond Within 400ms

Interactions must respond within 400ms to feel instant. Above this threshold, users notice delay.

**Incorrect (no feedback during loading):**

```tsx
async function handleClick() {
  const data = await fetchData();
  setResult(data);
}
```

**Correct (immediate optimistic feedback):**

```tsx
async function handleClick() {
  setResult(optimisticData);
  const data = await fetchData();
  setResult(data);
}
```

Reference: Doherty, W. J. (1979). Managing VM/CMS systems for user effectiveness.

### Expand Hit Areas with Invisible Padding

Use pseudo-elements or invisible padding to expand clickable areas beyond visible bounds.

**Incorrect (visible size equals hit area):**

```css
.link {
  font-size: 14px;
  /* Hit area matches text only */
}
```

**Correct (expanded invisible hit area):**

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

### Size Interactive Targets for Easy Clicking

The bigger something is, the easier it is to click. Make interactive elements large enough to hit comfortably.

**Incorrect (tiny click target):**

```css
.icon-button {
  width: 16px;
  height: 16px;
  padding: 0;
}
```

**Correct (comfortable target):**

```css
.icon-button {
  width: 32px;
  height: 32px;
  padding: 8px;
}
```

Reference: Fitts, P. M. (1954). The information capacity of the human motor system.

### Show Progress Toward Completion

People accelerate behavior as they approach a goal. Show how close they are to finishing.

**Incorrect (no sense of progress):**

```tsx
function Onboarding({ step }) {
  return <OnboardingStep step={step} />;
}
```

**Correct (progress visible):**

```tsx
function Onboarding({ step, totalSteps }) {
  return (
    <div>
      <ProgressBar value={step} max={totalSteps} />
      <span>Step {step} of {totalSteps}</span>
      <OnboardingStep step={step} />
    </div>
  );
}
```

Reference: [Goal-Gradient Effect](https://lawsofux.com/goal-gradient-effect/)

### Minimize Choices to Reduce Decision Time

Decision time increases logarithmically with the number of choices. Use progressive disclosure.

**Incorrect (all options at once):**

```tsx
function Settings() {
  return (
    <div>
      {allSettings.map(setting => (
        <SettingRow key={setting.id} {...setting} />
      ))}
    </div>
  );
}
```

**Correct (progressive disclosure):**

```tsx
function Settings() {
  return (
    <div>
      {commonSettings.map(setting => (
        <SettingRow key={setting.id} {...setting} />
      ))}
      <details>
        <summary>Advanced</summary>
        {advancedSettings.map(setting => (
          <SettingRow key={setting.id} {...setting} />
        ))}
      </details>
    </div>
  );
}
```

Reference: Hick, W. E. (1952). On the rate of gain of information.

### Use Familiar UI Patterns

Users spend most of their time on other sites. They expect yours to work the same way (Jakob's Law).

**Incorrect (custom unconventional navigation):**

```tsx
function Nav() {
  return (
    <nav>
      <button onClick={() => navigate("/")}>⬡</button>
      <button onClick={() => navigate("/search")}>⬢</button>
    </nav>
  );
}
```

**Correct (standard recognizable patterns):**

```tsx
function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/search">Search</Link>
    </nav>
  );
}
```

Reference: [Jakob's Law](https://lawsofux.com/jakobs-law/)

### Chunk Data into Groups of 5-9

Working memory holds about 7 items. Group and chunk large data sets so they're scannable.

**Incorrect (raw unformatted data):**

```tsx
<span>4532015112830366</span>
```

**Correct (chunked for readability):**

```tsx
<span>4532 0151 1283 0366</span>
```

Reference: Miller, G. A. (1956). The magical number seven, plus or minus two.

### Prioritize the Critical 20% of Features

80% of users use 20% of features (Pareto Principle). Optimize the critical path first.

**Incorrect (all features equally prominent):**

```tsx
function Toolbar() {
  return (
    <div>
      {allFeatures.map(f => <Button key={f.id}>{f.label}</Button>)}
    </div>
  );
}
```

**Correct (critical features prominent, rest accessible):**

```tsx
function Toolbar() {
  return (
    <div>
      {criticalFeatures.map(f => <Button key={f.id}>{f.label}</Button>)}
      <MoreMenu features={secondaryFeatures} />
    </div>
  );
}
```

Reference: [Pareto Principle](https://lawsofux.com/pareto-principle/)

### End Experiences with Clear Success States

People judge experiences by their peak moment and their end. Invest in success and completion states.

**Incorrect (abrupt end after action):**

```tsx
async function handleSubmit() {
  await submitForm(data);
  router.push("/");
}
```

**Correct (satisfying completion state):**

```tsx
async function handleSubmit() {
  await submitForm(data);
  setStatus("success");
}

return status === "success" ? (
  <SuccessScreen message="You're all set." />
) : (
  <Form onSubmit={handleSubmit} />
);
```

Reference: [Peak-End Rule](https://lawsofux.com/peak-end-rule/)

### Accept Messy Input, Output Clean Data

Inputs should accept messy human data and normalize it. Validate generously, format strictly.

**Incorrect (rigid format required):**

```tsx
function DateInput({ onChange }) {
  return (
    <input
      type="text"
      placeholder="YYYY-MM-DD"
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={onChange}
    />
  );
}
```

**Correct (accepts multiple formats):**

```tsx
function DateInput({ onChange }) {
  function handleChange(e) {
    const parsed = parseFlexibleDate(e.target.value);
    if (parsed) onChange(parsed);
  }

  return (
    <input
      type="text"
      placeholder="Any date format"
      onChange={handleChange}
    />
  );
}
```

Reference: Postel, J. (1980). RFC 761 — Transmission Control Protocol.

### Simplify Complex Visuals into Clear Forms

People interpret complex visuals as the simplest form possible. Reduce visual noise to aid comprehension.

**Incorrect (visually noisy layout):**

```css
.card {
  border: 2px dashed red;
  background: linear-gradient(45deg, #f0f, #0ff);
  box-shadow: 5px 5px 0 black, 10px 10px 0 gray;
  outline: 3px dotted blue;
}
```

**Correct (clear, simple form):**

```css
.card {
  background: var(--gray-2);
  border: 1px solid var(--gray-a4);
  border-radius: 12px;
  box-shadow: var(--shadow-1);
}
```

Reference: [Law of Prägnanz](https://lawsofux.com/law-of-pragnanz/)

### Show What Matters Now, Reveal Complexity Later

Don't overwhelm users with everything at once. Reveal complexity incrementally as needed.

**Incorrect (all controls visible):**

```tsx
function Editor() {
  return (
    <div>
      <BasicTools />
      <AdvancedTools />
      <ExpertTools />
      <DebugTools />
    </div>
  );
}
```

**Correct (progressive disclosure):**

```tsx
function Editor() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <div>
      <BasicTools />
      {showAdvanced && <AdvancedTools />}
      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        Toggle
      </button>
    </div>
  );
}
```

### Group Related Elements Spatially

Elements near each other are perceived as related. Use spacing to create visual groups.

**Incorrect (uniform spacing between unrelated items):**

```css
.form label,
.form input,
.form .hint,
.form .divider {
  margin-bottom: 16px;
}
```

**Correct (tighter spacing within groups, larger between):**

```css
.form label {
  margin-bottom: 4px;
}

.form input {
  margin-bottom: 2px;
}

.form .hint {
  margin-bottom: 24px;
}
```

Reference: [Law of Proximity](https://lawsofux.com/law-of-proximity/)

### Place Key Items First or Last

Users best remember the first and last items in a sequence. Place the most important actions at these positions.

**Incorrect (important action buried in middle):**

```tsx
<nav>
  <Link href="/settings">Settings</Link>
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
</nav>
```

**Correct (key items at edges):**

```tsx
<nav>
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
  <Link href="/settings">Settings</Link>
</nav>
```

Reference: [Serial Position Effect](https://lawsofux.com/serial-position-effect/)

### Similar Elements Should Look Alike

Elements that function the same should look the same. Visual consistency signals functional consistency.

**Incorrect (same function, different appearance):**

```css
.save-button {
  background: blue;
  border-radius: 8px;
}

.submit-button {
  background: green;
  border-radius: 0;
}
```

**Correct (same function, same appearance):**

```css
.primary-action {
  background: var(--gray-12);
  color: var(--gray-1);
  border-radius: 8px;
}
```

Reference: [Law of Similarity](https://lawsofux.com/law-of-similarity/)

### Move Complexity, Don't Hide It

Every system has irreducible complexity. The question is who handles it — the user or the system.

**Incorrect (complexity pushed to user):**

```tsx
<input
  type="text"
  placeholder="Enter date as YYYY-MM-DDTHH:mm:ss.sssZ"
/>
```

**Correct (system absorbs complexity):**

```tsx
<DatePicker
  onChange={(date) => setDate(date.toISOString())}
/>
```

Reference: [Tesler's Law](https://lawsofux.com/teslers-law/)

### Visually Connect Related Elements

Elements that are visually connected (by lines, color, or frames) are perceived as more related.

**Incorrect (steps with no visual connection):**

```tsx
function Steps({ current }) {
  return (
    <div>
      <span>Step 1</span>
      <span>Step 2</span>
      <span>Step 3</span>
    </div>
  );
}
```

**Correct (connected with a visual line):**

```tsx
function Steps({ current }) {
  return (
    <div className={styles.steps}>
      {steps.map((step, i) => (
        <div key={step.id} className={styles.step} data-active={i <= current}>
          <div className={styles.dot} />
          {i < steps.length - 1 && <div className={styles.connector} />}
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
```

Reference: [Law of Uniform Connectedness](https://lawsofux.com/law-of-uniform-connectedness/)

### Make Important Elements Visually Distinct

When multiple similar elements are present, the one that differs is most likely to be remembered.

**Incorrect (primary action blends in):**

```tsx
<div className={styles.actions}>
  <button className={styles.button}>Cancel</button>
  <button className={styles.button}>Delete Account</button>
</div>
```

**Correct (destructive action stands out):**

```tsx
<div className={styles.actions}>
  <button className={styles["button-secondary"]}>Cancel</button>
  <button className={styles["button-danger"]}>Delete Account</button>
</div>
```

Reference: [Von Restorff Effect](https://lawsofux.com/von-restorff-effect/)

### Show Incomplete State to Drive Completion

People remember incomplete tasks better than completed ones. Use this to drive engagement.

**Incorrect (no indication of incomplete profile):**

```tsx
function Dashboard() {
  return <DashboardContent />;
}
```

**Correct (incomplete state visible):**

```tsx
function Dashboard({ profile }) {
  return (
    <div>
      {!profile.isComplete && (
        <Banner>
          Complete your profile — {profile.completionPercent}% done
        </Banner>
      )}
      <DashboardContent />
    </div>
  );
}
```

Reference: [Zeigarnik Effect](https://lawsofux.com/zeigarnik-effect/)

## Predictive Prefetching

**Impact:** MEDIUM

### Use hitSlop to Trigger Predictions Earlier

Expand the invisible prediction area around elements with hitSlop to start loading sooner.

**Incorrect (tight prediction area):**

```tsx
const { elementRef } = useForesight({
  callback: () => prefetch(),
  hitSlop: 0,
});
```

**Correct (expanded prediction area):**

```tsx
const { elementRef } = useForesight({
  callback: () => prefetch(),
  hitSlop: 20,
});
```

### Prefetch on Keyboard Navigation

Monitor focus changes and prefetch when the user is a few tab stops away from a registered element.

**Correct (tab-aware prefetching):**

```tsx
const { elementRef } = useForesight({
  callback: () => router.prefetch("/settings"),
  name: "settings-link",
  // Tab prediction fires when focus approaches
});
```

### Prefetch by Intent, Not Viewport

Don't prefetch everything visible in the viewport. Prefetch based on user intent to avoid wasted bandwidth.

**Incorrect (prefetch all visible links):**

```tsx
<Link href="/page" prefetch={true}>Page</Link>
```

**Correct (intent-based prefetching):**

```tsx
<Link href="/page" prefetch={false}>Page</Link>
// Let trajectory/hover prediction handle it
```

### Fall Back Gracefully on Touch Devices

Touch devices have no cursor. Fall back to viewport or touch-start strategies automatically.

**Incorrect (assumes cursor exists):**

```tsx
function PrefetchLink({ href, children }) {
  return (
    <Link
      href={href}
      onMouseMove={() => prefetch(href)}
    >
      {children}
    </Link>
  );
}
```

**Correct (device-aware strategy):**

```tsx
const { elementRef } = useForesight({
  callback: () => router.prefetch(href),
  hitSlop: 20,
});
// Automatically falls back to touch-start on mobile
```

### Trajectory Prediction Over Hover Prefetching

Hover prefetching starts too late. Trajectory prediction fires while the cursor is still in motion, reclaiming 100-200ms.

**Incorrect (waits for hover):**

```tsx
<Link
  href="/about"
  onMouseEnter={() => router.prefetch("/about")}
>
  About
</Link>
```

**Correct (trajectory-based):**

```tsx
const { elementRef } = useForesight({
  callback: () => router.prefetch("/about"),
  hitSlop: 20,
  name: "about-link",
});

<Link ref={elementRef} href="/about">About</Link>
```

### Use Predictive Prefetching Selectively

Predictive prefetching doesn't belong in every project. Use it where navigation latency is noticeable.

**Good use cases:** data-heavy dashboards, multi-page apps with slow API responses, e-commerce product pages.

**Bad use cases:** static sites with instant navigation, single-page apps with all data preloaded.
