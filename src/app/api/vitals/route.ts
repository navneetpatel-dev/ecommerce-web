import { NextResponse } from "next/server";

/**
 * Thin collector for real-user Core Web Vitals metrics (Rule 26: parse,
 * delegate, respond — no business logic). Metrics are logged server-side so a
 * monitoring backend can pick them up; nothing is persisted client-side.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const { name, value, rating, path, effectiveType } = body as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || typeof value !== "number") {
    return NextResponse.json({ error: "invalid metric" }, { status: 400 });
  }

  console.info(
    JSON.stringify({
      kind: "web-vitals",
      name,
      value,
      rating,
      path,
      effectiveType,
      ts: Date.now(),
    }),
  );

  return new NextResponse(null, { status: 204 });
}
