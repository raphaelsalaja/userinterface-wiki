const getIndex = (theme: string | undefined) => `
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

import "@radix-ui/themes/styles.css";
import "./styles.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" forcedTheme="${theme ?? "light"}">
      <Theme appearance="${theme ?? "light"}">
        <App />
      </Theme>
    </ThemeProvider>
  </StrictMode>
);
`;

const styles = `
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
}
`;

export const getPrerequisites = (theme: string | undefined) => ({
  "/index.tsx": { code: getIndex(theme), hidden: true },
  "/styles.css": { code: styles, hidden: true },
});
