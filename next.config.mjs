import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/categories/:path+",
        destination: "/category/:path+",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Browsers ignore this over plain HTTP, so it is inert locally and
          // only binds once the app is served over TLS. `preload` and
          // `includeSubDomains` are deliberately omitted: the latter would
          // force HTTPS on every sibling subdomain (image hosts, API) and the
          // deployment does not guarantee they all terminate TLS yet.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000",
          },
          // Camera: delivery barcode scanning. Geolocation: delivery location
          // beacon and address capture. Everything else stays switched off.
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), geolocation=(self), microphone=(), payment=(self)",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
