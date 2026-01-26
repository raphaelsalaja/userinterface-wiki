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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false,
          },
        },
      ],
    });

    // Support .txt imports for playground source files
    config.module.rules.push({
      test: /\.(tsx|css)\.txt$/,
      type: "asset/source",
    });

    return config;
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
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(config);
