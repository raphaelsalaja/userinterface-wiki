import type { Metadata, Viewport } from "next";

export const SITE_MANIFEST = {
  name: "userinterface.wiki",
  short_name: "userinterface.wiki",
  description:
    "A living manual for better interfaces. Learn design principles, motion, typography, and more.",
  start_url: "/",
  display: "standalone" as const,
  background_color: "#fcfcfc",
  theme_color: "#111113",
  icons: [
    {
      src: "/open-graph/icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/open-graph/icon-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  url: "https://www.userinterface.wiki",
  author: {
    name: "Raphael Salaja",
    twitter: "@raphaelsalaja",
    url: "https://twitter.com/raphaelsalaja",
  },
  github: "https://github.com/raphaelsalaja/userinterface-wiki",
};

export const METADATA: Metadata = {
  metadataBase: new URL(SITE_MANIFEST.url),
  title: {
    default: SITE_MANIFEST.name,
    template: `%s`,
  },
  description: SITE_MANIFEST.description,
  icons: {
    icon: "/open-graph/icon.png",
    apple: "/open-graph/apple-icon.png",
  },
  keywords: [
    "UI design",
    "user interface",
    "animation",
    "motion design",
    "typography",
    "design principles",
    "web design",
  ],
  authors: [{ name: SITE_MANIFEST.author.name, url: SITE_MANIFEST.author.url }],
  creator: SITE_MANIFEST.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_MANIFEST.url,
    siteName: SITE_MANIFEST.name,
    title: SITE_MANIFEST.name,
    description: SITE_MANIFEST.description,
    images: [
      {
        url: "/open-graph/default.png",
        width: 1200,
        height: 630,
        alt: SITE_MANIFEST.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_MANIFEST.name,
    description: SITE_MANIFEST.description,
    creator: SITE_MANIFEST.author.twitter,
    images: ["/open-graph/default.png"],
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
    canonical: SITE_MANIFEST.url,
    types: {
      "application/rss+xml": `${SITE_MANIFEST.url}/feed.xml`,
    },
  },
};

export const VIEWPORT: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: SITE_MANIFEST.theme_color },
    {
      media: "(prefers-color-scheme: light)",
      color: SITE_MANIFEST.background_color,
    },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
