const getIndex = (theme: string | undefined) => `
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";

import "./styles.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" forcedTheme="${theme ?? "light"}">
      <link rel="preconnect" href="https://rsms.me/" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <App />
    </ThemeProvider>
  </StrictMode>
);
`;

const styles = `
@import "@radix-ui/colors/amber.css";
@import "@radix-ui/colors/amber-dark.css";
@import "@radix-ui/colors/amber-alpha.css";
@import "@radix-ui/colors/amber-dark-alpha.css";

@import "@radix-ui/colors/blue.css";
@import "@radix-ui/colors/blue-dark.css";
@import "@radix-ui/colors/blue-alpha.css";
@import "@radix-ui/colors/blue-dark-alpha.css";

@import "@radix-ui/colors/bronze.css";
@import "@radix-ui/colors/bronze-dark.css";
@import "@radix-ui/colors/bronze-alpha.css";
@import "@radix-ui/colors/bronze-dark-alpha.css";

@import "@radix-ui/colors/brown.css";
@import "@radix-ui/colors/brown-dark.css";
@import "@radix-ui/colors/brown-alpha.css";
@import "@radix-ui/colors/brown-dark-alpha.css";

@import "@radix-ui/colors/crimson.css";
@import "@radix-ui/colors/crimson-dark.css";
@import "@radix-ui/colors/crimson-alpha.css";
@import "@radix-ui/colors/crimson-dark-alpha.css";

@import "@radix-ui/colors/cyan.css";
@import "@radix-ui/colors/cyan-dark.css";
@import "@radix-ui/colors/cyan-alpha.css";
@import "@radix-ui/colors/cyan-dark-alpha.css";

@import "@radix-ui/colors/gold.css";
@import "@radix-ui/colors/gold-dark.css";
@import "@radix-ui/colors/gold-alpha.css";
@import "@radix-ui/colors/gold-dark-alpha.css";

@import "@radix-ui/colors/grass.css";
@import "@radix-ui/colors/grass-dark.css";
@import "@radix-ui/colors/grass-alpha.css";
@import "@radix-ui/colors/grass-dark-alpha.css";

@import "@radix-ui/colors/gray.css";
@import "@radix-ui/colors/gray-dark.css";
@import "@radix-ui/colors/gray-alpha.css";
@import "@radix-ui/colors/gray-dark-alpha.css";

@import "@radix-ui/colors/green.css";
@import "@radix-ui/colors/green-dark.css";
@import "@radix-ui/colors/green-alpha.css";
@import "@radix-ui/colors/green-dark-alpha.css";

@import "@radix-ui/colors/indigo.css";
@import "@radix-ui/colors/indigo-dark.css";
@import "@radix-ui/colors/indigo-alpha.css";
@import "@radix-ui/colors/indigo-dark-alpha.css";

@import "@radix-ui/colors/iris.css";
@import "@radix-ui/colors/iris-dark.css";
@import "@radix-ui/colors/iris-alpha.css";
@import "@radix-ui/colors/iris-dark-alpha.css";

@import "@radix-ui/colors/jade.css";
@import "@radix-ui/colors/jade-dark.css";
@import "@radix-ui/colors/jade-alpha.css";
@import "@radix-ui/colors/jade-dark-alpha.css";

@import "@radix-ui/colors/lime.css";
@import "@radix-ui/colors/lime-dark.css";
@import "@radix-ui/colors/lime-alpha.css";
@import "@radix-ui/colors/lime-dark-alpha.css";

@import "@radix-ui/colors/mauve.css";
@import "@radix-ui/colors/mauve-dark.css";
@import "@radix-ui/colors/mauve-alpha.css";
@import "@radix-ui/colors/mauve-dark-alpha.css";

@import "@radix-ui/colors/mint.css";
@import "@radix-ui/colors/mint-dark.css";
@import "@radix-ui/colors/mint-alpha.css";
@import "@radix-ui/colors/mint-dark-alpha.css";

@import "@radix-ui/colors/olive.css";
@import "@radix-ui/colors/olive-dark.css";
@import "@radix-ui/colors/olive-alpha.css";
@import "@radix-ui/colors/olive-dark-alpha.css";

@import "@radix-ui/colors/orange.css";
@import "@radix-ui/colors/orange-dark.css";
@import "@radix-ui/colors/orange-alpha.css";
@import "@radix-ui/colors/orange-dark-alpha.css";

@import "@radix-ui/colors/pink.css";
@import "@radix-ui/colors/pink-dark.css";
@import "@radix-ui/colors/pink-alpha.css";
@import "@radix-ui/colors/pink-dark-alpha.css";

@import "@radix-ui/colors/plum.css";
@import "@radix-ui/colors/plum-dark.css";
@import "@radix-ui/colors/plum-alpha.css";
@import "@radix-ui/colors/plum-dark-alpha.css";

@import "@radix-ui/colors/purple.css";
@import "@radix-ui/colors/purple-dark.css";
@import "@radix-ui/colors/purple-alpha.css";
@import "@radix-ui/colors/purple-dark-alpha.css";

@import "@radix-ui/colors/red.css";
@import "@radix-ui/colors/red-dark.css";
@import "@radix-ui/colors/red-alpha.css";
@import "@radix-ui/colors/red-dark-alpha.css";

@import "@radix-ui/colors/ruby.css";
@import "@radix-ui/colors/ruby-dark.css";
@import "@radix-ui/colors/ruby-alpha.css";
@import "@radix-ui/colors/ruby-dark-alpha.css";

@import "@radix-ui/colors/sage.css";
@import "@radix-ui/colors/sage-dark.css";
@import "@radix-ui/colors/sage-alpha.css";
@import "@radix-ui/colors/sage-dark-alpha.css";

@import "@radix-ui/colors/sand.css";
@import "@radix-ui/colors/sand-dark.css";
@import "@radix-ui/colors/sand-alpha.css";
@import "@radix-ui/colors/sand-dark-alpha.css";

@import "@radix-ui/colors/sky.css";
@import "@radix-ui/colors/sky-dark.css";
@import "@radix-ui/colors/sky-alpha.css";
@import "@radix-ui/colors/sky-dark-alpha.css";

@import "@radix-ui/colors/slate.css";
@import "@radix-ui/colors/slate-dark.css";
@import "@radix-ui/colors/slate-alpha.css";
@import "@radix-ui/colors/slate-dark-alpha.css";

@import "@radix-ui/colors/teal.css";
@import "@radix-ui/colors/teal-dark.css";
@import "@radix-ui/colors/teal-alpha.css";
@import "@radix-ui/colors/teal-dark-alpha.css";

@import "@radix-ui/colors/tomato.css";
@import "@radix-ui/colors/tomato-dark.css";
@import "@radix-ui/colors/tomato-alpha.css";
@import "@radix-ui/colors/tomato-dark-alpha.css";

@import "@radix-ui/colors/violet.css";
@import "@radix-ui/colors/violet-dark.css";
@import "@radix-ui/colors/violet-alpha.css";
@import "@radix-ui/colors/violet-dark-alpha.css";

@import "@radix-ui/colors/yellow.css";
@import "@radix-ui/colors/yellow-dark.css";
@import "@radix-ui/colors/yellow-alpha.css";
@import "@radix-ui/colors/yellow-dark-alpha.css";

@import "@radix-ui/colors/black-alpha.css";
@import "@radix-ui/colors/white-alpha.css";



*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  -webkit-font-smoothing: antialiased;
  border: 0;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: baseline;
}

html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
  background: var(--gray-1);
  color: var(--gray-12);
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

ul,
li,
ol {
  padding: 0;
  margin: 0;
  list-style: none;
}

button {
  padding: 0;
  font: inherit;
  text-align: unset;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
}

input {
  padding: 0;
  font: inherit;
  background: none;
  border: none;
}

#root {
  height: 100%;
  isolation: isolate;
}

.radix-themes {
  height: 100%;
}

:root {
  --font-letter-spacing-12px: 0.006px;
  --font-letter-spacing-13px: -0.041px;
  --font-letter-spacing-14px: -0.087px;
  --font-letter-spacing-15px: -0.132px;
  --font-letter-spacing-16px: -0.175px;
  --font-letter-spacing-17px: -0.217px;
  --font-letter-spacing-18px: -0.257px;
  --font-letter-spacing-19px: -0.296px;
  --font-letter-spacing-20px: -0.333px;
  --font-letter-spacing-21px: -0.369px;
  --font-letter-spacing-22px: -0.403px;
  --font-letter-spacing-23px: -0.436px;
  --font-letter-spacing-24px: -0.468px;

  --font-weight-light: 330;
  --font-weight-normal: 450;
  --font-weight-medium: 550;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --shadow-1:
    inset 0 0 0 1px var(--gray-a5), inset 0 1.5px 2px 0 var(--gray-a2),
    inset 0 1.5px 2px 0 var(--black-a2);

  --shadow-2:
    0 0 0 1px var(--gray-a3),
    0 0 0 0.5px var(--black-a1),
    0 1px 1px 0 var(--gray-a2),
    0 2px 1px -1px var(--black-a1),
    0 1px 3px 0 var(--black-a1);

  --shadow-3:
    0 0 0 1px var(--gray-a3),
    0 2px 3px -2px var(--gray-a3),
    0 3px 12px -4px var(--black-a2),
    0 4px 16px -8px var(--black-a2);

  --shadow-4:
    0 0 0 1px var(--gray-a3), 0 8px 40px var(--black-a1),
    0 12px 32px -16px var(--gray-a3);

  --shadow-5:
    0 0 0 1px var(--gray-a3), 0 12px 60px var(--black-a3),
    0 12px 32px -16px var(--gray-a5);

  --shadow-6:
    0 0 0 1px var(--gray-a3), 0 12px 60px var(--black-a3),
    0 16px 64px var(--gray-a2), 0 16px 36px -20px var(--gray-a7);

  font-family: Inter, sans-serif;
  font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */
}

@supports (font-variation-settings: normal) {
  :root { font-family: InterVariable, sans-serif; }
}

@supports (color: color-mix(in oklab, white, black)) {
  :root {
    --shadow-1:
      inset 0 0 0 1px var(--gray-a5), inset 0 1.5px 2px 0 var(--gray-a2),
      inset 0 1.5px 2px 0 var(--black-a2);

    --shadow-2:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 0 0 0.5px var(--black-a1),
      0 1px 1px 0 var(--gray-a2),
      0 2px 1px -1px var(--black-a1),
      0 1px 3px 0 var(--black-a1);

    --shadow-3:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 2px 3px -2px var(--gray-a3),
      0 3px 12px -4px var(--black-a2),
      0 4px 16px -8px var(--black-a2);

    --shadow-4:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 8px 40px var(--black-a1), 0 12px 32px -16px var(--gray-a3);

    --shadow-5:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 12px 60px var(--black-a3), 0 12px 32px -16px var(--gray-a5);

    --shadow-6:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 12px 60px var(--black-a3), 0 16px 64px var(--gray-a2),
      0 16px 36px -20px var(--gray-a7);
  }
}

:is(.dark, .dark-theme),
:is(.dark, .dark-theme) :where(.radix-themes:not(.light, .light-theme)) {
  --shadow-1:
    inset 0 -1px 1px 0 var(--gray-a3),
    inset 0 0 0 1px var(--gray-a3),
    inset 0 3px 4px 0 var(--black-a5),
    inset 0 0 0 1px var(--gray-a4);

  --shadow-2:
    0 0 0 1px var(--gray-a6),
    0 0 0 0.5px var(--black-a3),
    0 1px 1px 0 var(--black-a6),
    0 2px 1px -1px var(--black-a6),
    0 1px 3px 0 var(--black-a5);

  --shadow-3:
    0 0 0 1px var(--gray-a6),
    0 2px 3px -2px var(--black-a3),
    0 3px 8px -2px var(--black-a6),
    0 4px 12px -4px var(--black-a7);

  --shadow-4:
    0 0 0 1px var(--gray-a6), 0 8px 40px var(--black-a3),
    0 12px 32px -16px var(--black-a5);

  --shadow-5:
    0 0 0 1px var(--gray-a6), 0 12px 60px var(--black-a5),
    0 12px 32px -16px var(--black-a7);

  --shadow-6:
    0 0 0 1px var(--gray-a6), 0 12px 60px var(--black-a4),
    0 16px 64px var(--black-a6), 0 16px 36px -20px var(--black-a11);
}

/* prettier-ignore */
@supports (color: color-mix(in oklab, white, black)) {
  :is(.dark, .dark-theme),
  :is(.dark, .dark-theme) :where(.radix-themes:not(.light, .light-theme)) {
    --shadow-1:
      inset 0 -1px 1px 0 var(--gray-a3),
      inset 0 0 0 1px var(--gray-a3),
      inset 0 3px 4px 0 var(--black-a5),
      inset 0 0 0 1px var(--gray-a4);

    --shadow-2:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 0 0 0.5px var(--black-a3),
      0 1px 1px 0 var(--black-a6),
      0 2px 1px -1px var(--black-a6),
      0 1px 3px 0 var(--black-a5);

    --shadow-3:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 2px 3px -2px var(--black-a3),
      0 3px 8px -2px var(--black-a6),
      0 4px 12px -4px var(--black-a7);

    --shadow-4:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 8px 40px var(--black-a3), 0 12px 32px -16px var(--black-a5);

    --shadow-5:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 12px 60px var(--black-a5), 0 12px 32px -16px var(--black-a7);

    --shadow-6:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 12px 60px var(--black-a4), 0 16px 64px var(--black-a6),
      0 16px 36px -20px var(--black-a11);
  }
}
`;

export const getPrerequisites = (theme: string | undefined) => ({
  "/styles.css": { code: styles, hidden: true },
  "/index.tsx": { code: getIndex(theme), hidden: true },
});
