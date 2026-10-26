import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const apiHostname = hostnameOf(apiUrl);

const isDev = process.env.NODE_ENV === "development";

/**
 * Pragmatic CSP: keeps Next's inline runtime (theme bootstrap, hydration
 * payloads) working via 'unsafe-inline' while pinning script/frame/object
 * sources. jsdelivr serves the ffmpeg WASM the vendor media compressor fetches
 * at runtime (worker-src blob: covers its blob workers), and
 * 'wasm-unsafe-eval' is required for WebAssembly compilation in
 * Chrome-family browsers. Add any new third-party origin here explicitly.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https: wss:${isDev ? " ws:" : ""}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/**
 * Image-optimizer allowlist. The optimizer proxies any host listed here, so
 * this is deliberately closed (never `**`): seed/demo media and the auth
 * brand art live on Unsplash, production uploads on the backend's S3 public
 * base, and localhost serves local development. Fronting S3 with a custom
 * CDN domain? Add its hostname to this list too.
 */
const remotePatterns = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "**.amazonaws.com" },
  { protocol: "http", hostname: "localhost" },
  ...(apiHostname && apiHostname !== "localhost"
    ? [{ protocol: "https", hostname: apiHostname }]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Docker image runs the minimal standalone server (`node server.js`).
  // Opt-in so `npm run build && npm start` keeps working outside Docker.
  ...(process.env.NEXT_OUTPUT_STANDALONE === "true"
    ? { output: "standalone" }
    : {}),
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
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns,
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
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
