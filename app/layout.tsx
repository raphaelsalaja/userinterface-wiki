import { clsx } from "clsx";

import type { Metadata, Viewport } from "next";
import { fonts } from "@/lib/config/fonts";

import "@/styles/index.css";
import { Main, Root } from "@/components/layout";
import Navigation from "@/components/navigation";
import { Providers } from "@/components/providers";

const SITE_URL = "https://userinterface.wiki";
const SITE_NAME = "userinterface.wiki";
const SITE_DESCRIPTION =
  "A living manual for better interfaces. Learn design principles, motion, typography, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "UI design",
    "user interface",
    "animation",
    "motion design",
    "typography",
    "design principles",
    "web design",
  ],
  authors: [
    { name: "Raphael Salaja", url: "https://twitter.com/raphaelsalaja" },
  ],
  creator: "Raphael Salaja",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@raphaelsalaja",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(fonts)}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Navigation />
          <Main>
            <Root id="main-content">{children}</Root>
          </Main>
        </Providers>
      </body>
    </html>
  );
}
