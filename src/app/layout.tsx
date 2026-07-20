import { Analytics } from "@vercel/analytics/next";
import { GlobalHotkeys } from "@/components/chrome/global-hotkeys";
import { Providers } from "@/components/chrome/providers";
import { fonts } from "@/lib/fonts";
import { getOrderedPages } from "@/lib/sections";
import { METADATA, VIEWPORT } from "@/lib/site";

import "@/styles/styles.css";

export const metadata = METADATA;
export const viewport = VIEWPORT;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pages = getOrderedPages().map((page) => ({
    title: page.title,
    url: page.url,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fonts}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>
          <main id="__next-main">
            <div id="main-content">{children}</div>
          </main>
          <GlobalHotkeys pages={pages} />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
