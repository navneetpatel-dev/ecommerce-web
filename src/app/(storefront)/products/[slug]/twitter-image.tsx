/**
 * Twitter/X uses the same generated card as Open Graph. Next only treats a
 * segment as having a twitter image when the file exists, and X falls back to
 * `og:image` anyway — this keeps both tags pointing at one renderer.
 */
export { default, size, contentType, alt } from "./opengraph-image";
