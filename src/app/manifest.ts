import type { MetadataRoute } from "next";
import { SITE } from "@/shared/seo/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    // Manifest JSON cannot read CSS custom properties, so these mirror the
    // light-palette token values in shared/styles/globals.css (--paper, --brand).
    background_color: "#f6f3ec",
    theme_color: "#8a6a2e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
