# Content

Every article is a directory under `content/` with an `index.mdx` and
optional colocated demos. This document is the template for adding one.

## Directory structure

```
content/
  my-article/
    index.mdx           # Article content with frontmatter
    demos/              # Optional interactive demos
      index.ts          # Barrel — export order defines demo sequence
      my-demo/
        index.tsx       # Demo component (named export)
        styles.module.css
        playgrounds/    # Optional Sandpack playground sources
```

## Frontmatter

Every `index.mdx` starts with:

```mdx
---
title: "Article Title"
description: "One or two sentences used for SEO, previews, and llms.txt."
date: "2026-01-01"
author: "raphael-salaja"
icon: "writing"
---
```

All fields are required. `date` is the publication date in `YYYY-MM-DD`.

## Demos

- Demo directories use **descriptive kebab-case** names: no numeric
  prefixes, no `-demo` suffix (`sound-lab`, not `sound-lab-demo` or
  `01-sound-lab`).
- Each demo exports a single named component from `index.tsx` and
  colocates its `styles.module.css`. Purely static demos (e.g. an inline
  SVG diagram) may omit the stylesheet.
- Export every demo from `demos/index.ts`. **The barrel's export order is
  the demo sequence** — it drives ordering on the `/demo` pages, so keep
  it in the article's narrative order.
- The demo registry is generated: run `pnpm generate demos` after adding,
  renaming, or removing a demo. Each demo is also served standalone at
  `/demo/<name>`, so renames change public URLs.

Import demos in MDX from the barrel and wrap them in `<Figure>`:

```mdx
import { MyDemo } from "./demos";

<Figure>
  <MyDemo />
  <Caption>What the demo shows.</Caption>
</Figure>
```

## Playgrounds

Editable code examples use Sandpack. Creating a `demos/<name>/playgrounds/`
directory opts the demo in: `pnpm generate playgrounds` compiles the demo's
`index.tsx` and `styles.module.css` into an importable
`playgrounds/index.ts` bundle (`<Name>Playground`). Playground code runs in
an isolated sandbox, so it must be self-contained — no `@/components`
imports. See `AGENTS.md` for playground conventions (inline
`Button`/`Controls`, "Toggle" labels for boolean state).

## Exercises

An exercise is a playground with a learn-by-recreating twist: an editable
starter scaffold plus a hidden solution. Add variants inside the demo's
`playgrounds/` directory:

```
demos/<name>/playgrounds/
  starter/index.tsx     # Editable scaffold with a TODO comment
  solution/index.tsx    # Finished implementation (optional — defaults
                        # to the demo itself when omitted)
```

Each variant may include its own `styles.module.css`; otherwise the demo's
stylesheet is reused. Both files must be self-contained (no `@/` runtime
imports). The generator emits `<Name>Exercise = { starter, solution }`,
which spreads into the `<Exercise>` MDX component:

```mdx
import { SpringExercise } from "./demos/spring/playgrounds";

<Exercise
  prompt="Convert the release animation to a spring."
  {...SpringExercise}
/>
```

## Registering the article

Add the slug to the right section in `src/lib/sections.ts`. That single
entry places the article in the sidebar, the home page, prev/next
navigation, and the `[`/`]` keyboard shortcuts. Unregistered articles
fall into an "Other" bucket, so nothing disappears — but register them.

## Short-form articles

A short-form article is not a separate content model — it is a normal
`content/<slug>/index.mdx` with the same frontmatter, registered in
whichever section it belongs to. The differences are editorial:

- One concept per piece, a few paragraphs long.
- Usually a single small demo or a CSS snippet instead of a demo suite.
- Demos remain optional; the article layout degrades gracefully when
  there are none.

Use short-form for single-technique pieces (a CSS property, one UX
heuristic); use long-form when the topic needs progressive build-up.
