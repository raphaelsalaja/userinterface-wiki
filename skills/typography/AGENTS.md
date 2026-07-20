# User Interface Wiki — Typography

> Generated from `skills/rules/` — do not edit by hand.
> 16 rules. Part of [userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki).

## Typography

**Impact:** MEDIUM

### Use Antialiased Font Smoothing

Set -webkit-font-smoothing: antialiased on retina displays. The default subpixel rendering looks thicker and fuzzier.

**Correct:**

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Use Disambiguation Stylistic Set for UI

Enable ss02 (or your font's disambiguation set) in code-facing UIs to distinguish I, l, 1 and 0, O.

**Correct:**

```css
.code-ui { font-feature-settings: "ss02"; }
```

### Use font-display swap to Avoid Invisible Text

Set font-display: swap so text renders immediately with a fallback font while the custom font loads.

**Incorrect (invisible text during load):**

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
}
```

**Correct (text visible immediately):**

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-display: swap;
}
```

### Pair Justified Text with Hyphens

Justified text without hyphens creates rivers of whitespace. Always pair with hyphens: auto.

**Incorrect (rivers of whitespace):**

```css
.article { text-align: justify; }
```

**Correct (hyphenation prevents rivers):**

```css
.article {
  text-align: justify;
  hyphens: auto;
}
```

### Add Letter Spacing to Uppercase Text

Uppercase and small-caps text needs positive letter-spacing to feel open and readable.

**Incorrect (tight uppercase):**

```css
.label {
  text-transform: uppercase;
  font-size: 12px;
}
```

**Correct (opened up):**

```css
.label {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
}
```

### Disable Font Synthesis for Missing Styles

Set font-synthesis: none to prevent the browser from faking bold or italic. Browser-generated faux styles look terrible.

**Correct:**

```css
.icon-font,
.display-font {
  font-synthesis: none;
}
```

### Oldstyle Numbers for Body Text

Use oldstyle-nums in body text so numbers blend with lowercase letters. Use lining-nums in tables and headings.

**Correct (prose):**

```css
.body-text { font-variant-numeric: oldstyle-nums; }
```

**Correct (data):**

```css
.data-table { font-variant-numeric: lining-nums tabular-nums; }
```

### Enable Contextual Alternates

Keep contextual alternates enabled (calt). They adjust punctuation and glyph shapes based on surrounding characters.

**Correct (usually on by default, don't disable):**

```css
body { font-feature-settings: "calt" 1; }
```

### Keep Optical Sizing Auto

Leave font-optical-sizing at auto. The font adjusts glyph shapes for the current size — thicker strokes at small sizes, finer details at large sizes.

**Incorrect (forced optical size):**

```css
body {
  font-optical-sizing: none;
}
```

**Correct (automatic adjustment):**

```css
body {
  font-optical-sizing: auto;
}
```

### Use Typographic Fractions

Enable diagonal-fractions to convert 1/2, 1/3, etc. into proper typographic fractions.

**Correct:**

```css
.recipe { font-variant-numeric: diagonal-fractions; }
```

### Slashed Zero for Disambiguation

Enable slashed zero in code-adjacent UIs so users never confuse 0 with O.

**Correct:**

```css
.code { font-variant-numeric: slashed-zero; }
/* or */
.code { font-feature-settings: "zero"; }
```

### Tabular Numbers for Data Display

Use tabular-nums for any numeric data that should align in columns (tables, dashboards, pricing).

**Incorrect (proportional numbers misalign):**

```css
.price { font-variant-numeric: proportional-nums; }
```

**Correct (tabular numbers align):**

```css
.price { font-variant-numeric: tabular-nums; }
```

### Balance Headings with text-wrap

Use text-wrap: balance on headings to make lines roughly equal length instead of one long line and a short orphan.

**Incorrect (unbalanced heading):**

```css
h1 { /* default text-wrap */ }
```

**Correct (balanced):**

```css
h1 { text-wrap: balance; }
```

### Use text-wrap pretty for Body Text

Use text-wrap: pretty for body text to reduce orphans. Use text-wrap: balance for headings.

**Correct:**

```css
p { text-wrap: pretty; }
h1, h2, h3 { text-wrap: balance; }
```

### Offset Underlines from Descenders

Use text-underline-offset to push underlines below descenders so they look intentional.

**Incorrect (underline collides with descenders):**

```css
a { text-decoration: underline; }
```

**Correct (offset underline):**

```css
a {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-skip-ink: auto;
}
```

### Use Continuous Weight Values with Variable Fonts

Variable fonts accept any integer from 100-900, not just the standard stops at 400, 500, 600, 700.

**Incorrect (limited to standard stops):**

```css
.medium { font-weight: 500; }
.semibold { font-weight: 600; }
```

**Correct (precise weight control):**

```css
.medium { font-weight: 450; }
.semibold { font-weight: 550; }
```
