# User Interface Wiki - Project Standards

**Version 1.0.0**  
January 2026

> **Note:**  
> This document is for agents and LLMs to follow when maintaining, generating,  
> or refactoring code in this repository. Humans may also find it useful, but  
> guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Standards and conventions for the User Interface Wiki, a Next.js documentation site focused on UI/UX design principles. Contains guidelines for components, styling, content, and code organization to ensure consistency and maintainability.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Naming Conventions](#2-naming-conventions)
3. [File Structure](#3-file-structure)
4. [Component Standards](#4-component-standards)
5. [CSS Standards](#5-css-standards)
6. [Content Standards](#6-content-standards)
7. [TypeScript Standards](#7-typescript-standards)
8. [Animation Standards](#8-animation-standards)
9. [Accessibility Standards](#9-accessibility-standards)
10. [Performance Standards](#10-performance-standards)
11. [External Skills](#external-skills)

---

## 1. Project Overview

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework with App Router |
| React 19 | UI library with React Compiler |
| TypeScript | Type safety |
| Biome | Linting and formatting |
| CSS Modules | Scoped styling |
| Motion (Framer Motion) | Animation library |
| Fumadocs | MDX documentation framework |
| Zustand | State management |
| Base UI | Headless component primitives |

### Key Directories

```
/app           → Next.js pages and routes
/components    → Reusable UI components
/content       → MDX articles and demos
/icons         → SVG icon components
/lib           → Utilities, types, and stores
/public        → Static assets
/skills        → AI skill definitions (SKILL.md files)
/styles        → Global CSS and theme
```

---

## 2. Naming Conventions

**All names use kebab-case throughout the project.**

| Item | Convention | Example |
|------|------------|---------|
| Directories | kebab-case | `components/button-group/` |
| Files | kebab-case | `use-audio.ts`, `styles.module.css` |
| CSS classes | kebab-case | `.button-primary`, `.nav-item` |
| CSS variables | kebab-case | `--font-weight-medium` |
| URL slugs | kebab-case | `/12-principles-of-animation` |

**Incorrect:**

```css
.buttonPrimary { }
.NavItem { }
.button_primary { }
```

**Correct:**

```css
.button-primary { }
.nav-item { }
```

**Exception:** React component function names use PascalCase (e.g., `function Button()`).

---

## 3. File Structure

### Component Structure

Each component lives in its own directory with colocated files:

```
components/
  button/
    index.tsx          # Component implementation
    styles.module.css  # Scoped styles
```

**Rules:**
- Export components from `index.tsx` using named exports
- Colocate CSS modules with components
- Use `index.ts` barrel files only for multi-file exports (e.g., hooks)

**Incorrect:**

```tsx
// button.tsx - wrong filename
export default function Button() { ... }
```

**Correct:**

```tsx
// index.tsx
export function Button() { ... }
```

### Content Structure

MDX content lives in `/content/` with demos colocated:

```
content/
  12-principles-of-animation/
    index.mdx           # Article content
    demos/
      index.ts          # Demo barrel export
      squash-stretch/
        index.tsx
        styles.module.css
```

**Rules:**
- Each article is a directory with `index.mdx`
- Demos are colocated in `demos/` subdirectory
- Export all demos from `demos/index.ts`

---

## 4. Component Standards

### Component Definition

Use function declarations with explicit prop interfaces:

**Incorrect:**

```tsx
const Button = (props: any) => { ... }
```

**Correct:**

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "text";
  size?: "small" | "medium" | "large";
  children: ReactNode;
}

function Button({ variant = "primary", size = "medium", children }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], styles[size])}>
      {children}
    </button>
  );
}

export { Button };
```

### Client Components

Add `"use client"` directive only when necessary:

**When to use `"use client"`:**
- Using React hooks (`useState`, `useEffect`, etc.)
- Using browser APIs (`window`, `localStorage`, etc.)
- Using event handlers
- Using motion/animation libraries

**Incorrect:**

```tsx
"use client"; // Unnecessary - no client features used

function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

### Props Pattern

Use data attributes for variants instead of multiple className conditionals:

**Correct:**

```tsx
function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div className={styles.callout} data-variant={type}>
      {children}
    </div>
  );
}
```

```css
.callout[data-variant="info"] {
  background: var(--blue-a3);
}

.callout[data-variant="error"] {
  background: var(--red-a3);
}
```

### Motion Components

Use `motion.create()` for Base UI components:

**Correct:**

```tsx
import { Button as BaseButton } from "@base-ui/react/button";
import { motion } from "motion/react";

const MotionBaseButton = motion.create(BaseButton);

function Button(props: ButtonProps) {
  return (
    <MotionBaseButton
      whileTap={{ scale: 0.98 }}
      {...props}
    />
  );
}
```

---

## 5. CSS Standards

### CSS Modules

All component styles use CSS Modules with `.module.css` extension:

**Rules:**
- Use kebab-case for all class names
- Leverage CSS custom properties from theme
- Use `clsx` for conditional class composition

**Incorrect:**

```css
/* Hardcoded values */
.button {
  background: #333;
  font-size: 14px;
}
```

**Correct:**

```css
/* Using theme variables */
.button {
  background: var(--gray-12);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--font-letter-spacing-14px);
}
```

### Theme Variables

Use variables from `/styles/styles.theme.css`:

| Category | Example Variables |
|----------|-------------------|
| Colors | `--gray-1` through `--gray-12`, `--gray-a1` through `--gray-a12` |
| Typography | `--font-weight-normal`, `--font-weight-medium`, `--font-weight-bold` |
| Letter Spacing | `--font-letter-spacing-13px`, `--font-letter-spacing-14px` |
| Shadows | `--shadow-1`, `--shadow-2`, `--shadow-3` |
| Layout | `--page-padding-inline`, `--page-max-width` |

### Sizing Convention

Use consistent size scales:

```css
.small {
  height: 28px;
  padding: 5px 8px;
  font-size: 13px;
}

.medium {
  height: 32px;
  padding: 6px 12px;
  font-size: 14px;
}

.large {
  height: 40px;
  padding: 8px 16px;
  font-size: 15px;
}
```

### Transitions

Use consistent transition timing:

```css
.element {
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.18s ease;
}
```

---

## 6. Content Standards

### MDX Frontmatter

Every MDX article requires frontmatter:

```mdx
---
title: "Article Title"
description: "Brief description for SEO and previews"
date: "2025-04-08"
tags: ["tag1", "tag2"]
author: "raphael-salaja"
icon: "code"
---
```

### MDX Components

Import demos from colocated directory:

```mdx
import { DemoComponent } from "./demos";

<Figure>
  <DemoComponent />
  <Caption>Description of the demo</Caption>
</Figure>
```

### Figure Pattern

Wrap demos in `<Figure>` with optional `<Caption>`:

**Correct:**

```mdx
<Figure>
  <InteractiveDemo />
  <Caption>Caption text with optional footnote[^1]</Caption>
</Figure>
```

### Playground Demos

Playground demos use Sandpack and must be self-contained (no `@/components` imports).

**Button Labels for Boolean Toggles:**

For buttons that toggle boolean state, use "Toggle" as the label instead of swapping between two words.

**Incorrect:**

```tsx
<Button onClick={() => setIsVisible(!isVisible)}>
  {isVisible ? "Hide" : "Show"}
</Button>
```

**Correct:**

```tsx
<Button onClick={() => setIsVisible(!isVisible)}>Toggle</Button>
```

**Inline Components:**

Playground demos must define `Button` and `Controls` inline since they can't import from the main codebase:

```tsx
function Button({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button className={styles.button} onClick={onClick}>{children}</button>;
}

function Controls({ children }: { children: React.ReactNode }) {
  return <div className={styles.controls}>{children}</div>;
}
```

### Skills Files

Create SKILL.md files in `/skills/` for reusable guidelines:

```markdown
---
name: skill-name
description: When and how to apply this skill
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/related-article/index.mdx
---

# Skill Title

## When to Apply

Reference these guidelines when:
- Condition 1
- Condition 2

## Core Principles

| Principle | Description |
|-----------|-------------|
| Name | Explanation |
```

---

## 7. TypeScript Standards

### Type Definitions

Define types in component files or `/lib/types.ts`:

**Component-specific types:**

```tsx
// In component file
interface ButtonProps {
  variant?: "primary" | "secondary";
}
```

**Shared types:**

```tsx
// In /lib/types.ts
export interface Author {
  name: string;
  avatar: string;
}
```

### Import Conventions

Use path aliases from `tsconfig.json`:

**Incorrect:**

```tsx
import { Button } from "../../../components/button";
```

**Correct:**

```tsx
import { Button } from "@/components/button";
```

### Strict Typing

Avoid `any` type. Use specific types or `unknown`:

**Incorrect:**

```tsx
function process(data: any) { ... }
```

**Correct:**

```tsx
function process(data: unknown) {
  if (isValidData(data)) { ... }
}
```

---

## 8. Animation Standards

### Motion Library Usage

Use `motion/react` for animations:

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

### Timing Guidelines

| Interaction Type | Duration |
|------------------|----------|
| Micro-interactions | 100-200ms |
| Standard transitions | 200-300ms |
| Page transitions | 300-400ms |
| Complex animations | 400-600ms |

**Never exceed 300ms for user-initiated actions.**

### Easing Functions

Use appropriate easing:

| Easing | Use Case |
|--------|----------|
| `ease-out` | Entrances (arrive fast, settle gently) |
| `ease-in` | Exits (build momentum before departure) |
| `ease-in-out` | Deliberate movements |
| Spring | Organic overshoot-and-settle |

### Active States

Apply scale transform on interaction:

```css
.button:active {
  transform: scale(0.98);
}
```

---

## 9. Accessibility Standards

### Semantic HTML

Use appropriate semantic elements:

**Incorrect:**

```tsx
<div onClick={handleClick}>Click me</div>
```

**Correct:**

```tsx
<button onClick={handleClick}>Click me</button>
```

### ARIA Attributes

Add ARIA attributes when semantic HTML is insufficient:

```tsx
<div role="tablist" aria-label="Content tabs">
  <button role="tab" aria-selected={isActive}>Tab 1</button>
</div>
```

### Focus Management

Ensure visible focus states:

```css
.button:focus-visible {
  outline: 2px solid var(--gray-12);
  outline-offset: 2px;
}
```

### Motion Preferences

Respect reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}
```

### Skip Links

Include skip-to-content link in layout:

```tsx
<a href="#main-content" className="skip-to-content">
  Skip to content
</a>
```

---

## 10. Performance Standards

### Image Optimization

Use Next.js Image component:

```tsx
import Image from "next/image";

<Image
  src="/content/image.jpg"
  alt="Descriptive alt text"
  width={640}
  height={360}
/>
```

### Dynamic Imports

Lazy-load heavy components:

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(
  () => import("./heavy-component").then(m => m.HeavyComponent),
  { ssr: false }
);
```

### Bundle Size

Avoid barrel imports for large libraries:

**Incorrect:**

```tsx
import { motion, AnimatePresence } from "motion/react";
```

**Correct (if tree-shaking fails):**

```tsx
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
```

### Server Components

Default to Server Components. Only add `"use client"` when needed.

---

## Code Review Checklist

Before submitting changes, verify:

- [ ] All names use kebab-case (files, directories, CSS classes)
- [ ] Components use named exports from `index.tsx`
- [ ] CSS uses theme variables, not hardcoded values
- [ ] TypeScript types are explicit, no `any`
- [ ] Imports use `@/` path aliases
- [ ] MDX has complete frontmatter
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Interactive elements are keyboard accessible
- [ ] `"use client"` is only used when necessary
- [ ] No linter errors (run `npm run lint`)

---

## External Skills

This project follows additional guidelines from Vercel's agent-skills repository. Fetch and apply these when working on the codebase:

### React Best Practices

```
https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/SKILL.md
```

Covers performance optimization, bundle size, server-side rendering, re-render optimization, and advanced React patterns. Apply when writing or refactoring React components.

### Web Design Guidelines

```
https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/web-design-guidelines/SKILL.md
```

Covers UI/UX best practices, accessibility, and design compliance. Apply when reviewing UI code, checking accessibility, or auditing design.

---

## References

1. [Next.js Documentation](https://nextjs.org/docs)
2. [React Documentation](https://react.dev)
3. [Motion Documentation](https://motion.dev)
4. [Biome Documentation](https://biomejs.dev)
5. [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
6. [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)
