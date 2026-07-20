import Navigation from "@/components/navigation";
import { Providers } from "@/components/providers";
import { fonts } from "@/lib/fonts";
import { METADATA, VIEWPORT } from "@/lib/site";

import "@/styles/styles.css";

export const metadata = METADATA;
export const viewport = VIEWPORT;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fonts}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>
          <Navigation />
          <main id="__next-main">
            <div id="main-content">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
