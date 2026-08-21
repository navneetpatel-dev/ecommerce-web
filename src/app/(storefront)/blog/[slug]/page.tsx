import type { Metadata } from "next";
import { BlogDetailPage } from "@/features/content";

export const metadata: Metadata = {
  title: "Blog Article",
};

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
