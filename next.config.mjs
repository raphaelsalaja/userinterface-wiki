import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  compress: true,
  typedRoutes: true,
  reactCompiler: true,
  reactStrictMode: true,
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
  },
  async rewrites() {
    return [
      // Agent-readable plain-markdown rendering of each article
      {
        source: "/:slug.md",
        destination: "/api/markdown/:slug",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(config);
