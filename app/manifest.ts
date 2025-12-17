import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "userinterface.wiki",
    short_name: "ui.wiki",
    description:
      "A living manual for better interfaces. Learn design principles, motion, typography, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfc",
    theme_color: "#111113",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
