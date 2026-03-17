/**
 * Font configuration
 */

import localFont from "next/font/local";

const inter = localFont({
  variable: "--font-family-display",
  src: [
    {
      path: "../public/fonts/inter/InterVariable.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  display: "swap",
});

const berkeleyMono = localFont({
  variable: "--font-family-monospace",
  src: "../public/fonts/berkeley-mono/BerkeleyMonoVariable.woff2",
  display: "swap",
});

const newYork = localFont({
  variable: "--font-family-serif",
  src: "../public/fonts/new-york/new-york.ttf",
  display: "swap",
});

const lfe = localFont({
  variable: "--font-family-lfe",
  src: [
    { path: "../public/fonts/lfe/regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/lfe/medium.ttf", weight: "500", style: "normal" },
    {
      path: "../public/fonts/lfe/semi-bold.ttf",
      weight: "600",
      style: "normal",
    },
    { path: "../public/fonts/lfe/bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const fonts = [
  inter.variable,
  berkeleyMono.variable,
  newYork.variable,
  lfe.variable,
].join(" ");
