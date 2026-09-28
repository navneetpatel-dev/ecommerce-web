#!/usr/bin/env node
/**
 * Generates the raster app icons from one source of truth:
 *   - src/app/apple-icon.png    180x180, full-bleed (iOS masks it itself) —
 *                               iOS ignores SVG for home-screen icons
 *   - public/icon-192.png       192x192 for the web manifest
 *   - public/icon-512.png       512x512 for the web manifest
 *   - public/icon-maskable-512.png  512x512 with the 20% safe-zone padding
 *                               Android asks for when masking
 *
 * Colours mirror the light theme in `shared/styles/globals.css` (--paper,
 * --brand); an icon asset cannot read CSS custom properties. Re-run after
 * changing the mark:  node scripts/generate-app-icons.mjs
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAPER = "#f6f3ec";
const BRAND = "#8a6a2e";

/**
 * The store mark (same geometry as `app/icon.svg`) drawn on a 64x64 grid.
 * `inset` shrinks the glyph inside the tile: maskable icons need it.
 */
function markSvg(size, inset = 0) {
  const scale = 1 - inset * 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="${PAPER}" />
      <g transform="translate(${32} ${32}) scale(${scale}) translate(-32 -32)">
        <path d="M20 22h24l-2.4 22.2a3 3 0 0 1-3 2.8H25.4a3 3 0 0 1-3-2.8L20 22Z"
          fill="none" stroke="${BRAND}" stroke-width="3.2" stroke-linejoin="round" />
        <path d="M26 22v-3.4a6 6 0 0 1 12 0V22"
          fill="none" stroke="${BRAND}" stroke-width="3.2" stroke-linecap="round" />
      </g>
    </svg>`,
  );
}

const targets = [
  { file: "src/app/apple-icon.png", size: 180, inset: 0.04 },
  { file: "public/icon-192.png", size: 192, inset: 0.04 },
  { file: "public/icon-512.png", size: 512, inset: 0.04 },
  { file: "public/icon-maskable-512.png", size: 512, inset: 0.14 },
];

for (const { file, size, inset } of targets) {
  const destination = path.join(root, file);
  mkdirSync(path.dirname(destination), { recursive: true });
  await sharp(markSvg(size, inset))
    .png({ compressionLevel: 9 })
    .toFile(destination);
  console.log(`${file} (${size}x${size})`);
}
