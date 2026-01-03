/**
 * Font configuration
 */

import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  variable: "--font-family-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-family-monospace",
  subsets: ["latin"],
});

const newYork = localFont({
  variable: "--font-family-serif",
  src: "../public/fonts/new-york/new-york.ttf",
  display: "swap",
});

export const fonts = [inter.variable, jetbrainsMono.variable, newYork.variable];
