---
name: userinterface-wiki-typography
description: "CSS typography best practices: OpenType features, numeric variants, variable fonts, text wrapping, and rendering controls. Use when styling text or reviewing font-related CSS."
license: MIT
metadata:
  author: raphael-salaja
  source: https://github.com/raphaelsalaja/userinterface-wiki
---

# User Interface Wiki — Typography

16 focused rules extracted from the unified userinterface-wiki skill. See AGENTS.md in this directory for every rule expanded with code examples.

## Typography — MEDIUM

- `type-antialiased-on-retina` — Set -webkit-font-smoothing: antialiased on retina displays. The default subpixel rendering looks thicker and fuzzier.
- `type-disambiguation-stylistic-set` — Enable ss02 (or your font's disambiguation set) in code-facing UIs to distinguish I, l, 1 and 0, O.
- `type-font-display-swap` — Set font-display: swap so text renders immediately with a fallback font while the custom font loads.
- `type-justify-with-hyphens` — Justified text without hyphens creates rivers of whitespace. Always pair with hyphens: auto.
- `type-letter-spacing-uppercase` — Uppercase and small-caps text needs positive letter-spacing to feel open and readable.
- `type-no-font-synthesis` — Set font-synthesis: none to prevent the browser from faking bold or italic. Browser-generated faux styles look terrible.
- `type-oldstyle-nums-for-prose` — Use oldstyle-nums in body text so numbers blend with lowercase letters. Use lining-nums in tables and headings.
- `type-opentype-contextual-alternates` — Keep contextual alternates enabled (calt). They adjust punctuation and glyph shapes based on surrounding characters.
- `type-optical-sizing-auto` — Leave font-optical-sizing at auto. The font adjusts glyph shapes for the current size — thicker strokes at small sizes, finer details at large sizes.
- `type-proper-fractions` — Enable diagonal-fractions to convert 1/2, 1/3, etc. into proper typographic fractions.
- `type-slashed-zero` — Enable slashed zero in code-adjacent UIs so users never confuse 0 with O.
- `type-tabular-nums-for-data` — Use tabular-nums for any numeric data that should align in columns (tables, dashboards, pricing).
- `type-text-wrap-balance-headings` — Use text-wrap: balance on headings to make lines roughly equal length instead of one long line and a short orphan.
- `type-text-wrap-pretty` — Use text-wrap: pretty for body text to reduce orphans. Use text-wrap: balance for headings.
- `type-underline-offset` — Use text-underline-offset to push underlines below descenders so they look intentional.
- `type-variable-weight-continuous` — Variable fonts accept any integer from 100-900, not just the standard stops at 400, 500, 600, 700.
