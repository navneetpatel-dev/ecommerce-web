import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/shared/seo/constants";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import { generateRootMetadata, ROOT_VIEWPORT } from "@/shared/seo/rootMetadata";
import "@/shared/styles/globals.css";
import Script from "next/script";
import { Providers } from "./providers";
import { WebVitalsReporter } from "@/shared/components/WebVitalsReporter.component";
import { rootLayoutStyles } from "./rootLayout.styles";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = ROOT_VIEWPORT;

export const metadata: Metadata = generateRootMetadata();

/**
 * Pre-hydration theme hint (Rule 29 hydration safety): applies the stored
 * color mode before first paint so the default-palette dark mode never
 * flashes. The stylesheet baseline matches `activeThemeConfig`, so no
 * script is needed for the default light mode or non-default palettes —
 * ThemePaletteProvider resolves those after mount.
 */
const THEME_BOOTSTRAP_SCRIPT = `
  (function() {
    try {
      var stored = localStorage.getItem('${STORAGE_KEYS.THEME_MODE}');
      var theme = stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

const rootLocale = SITE.locale.split("_")[0];
const rootFontVariables = `${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={rootLocale}
      className={rootFontVariables}
      suppressHydrationWarning
    >
      <body className={rootLayoutStyles.body}>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <Providers>{children}</Providers>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
