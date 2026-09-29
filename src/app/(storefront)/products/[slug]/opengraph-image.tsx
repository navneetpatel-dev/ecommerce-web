import { ImageResponse } from "next/og";
import { SITE } from "@/shared/seo/constants";
import { getProductBySlug } from "@/shared/seo/data";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

/** Social card dimensions: 1.91:1 is what platforms render without cropping. */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Product preview";

/** Long catalogue names would overflow the card, so they are clamped here. */
const MAX_NAME_LENGTH = 96;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Per-product social card. Before this, a shared product link previewed the raw
 * 800x800 catalogue photo, which every platform then cropped to fit its own
 * aspect ratio. Colours mirror the light theme tokens (an image asset cannot
 * read CSS custom properties).
 */
export default async function ProductOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const name = product?.name
    ? product.name.slice(0, MAX_NAME_LENGTH)
    : SITE.name;
  const vendor = product?.vendor.businessName ?? "";
  const price = product ? formatInr(product.price) : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        backgroundColor: "#f6f3ec",
        color: "#1b1917",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#8a6a2e",
        }}
      >
        <span>{SITE.name}</span>
        <span>{vendor}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {name}
        </div>
        {price ? (
          <div style={{ fontSize: 40, color: "#8a6a2e" }}>{price}</div>
        ) : null}
      </div>

      <div style={{ fontSize: 26, color: "#6b6459" }}>
        {`GST included · Fast delivery · Easy returns`}
      </div>
    </div>,
    size,
  );
}
