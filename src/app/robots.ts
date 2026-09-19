import type { MetadataRoute } from "next";
import { safeOrigin } from "@/lib/publishing/model";
import { readCatalog } from "@/lib/publishing/public";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  let origin = safeOrigin(process.env.NEXT_PUBLIC_SITE_URL) || safeOrigin(process.env.SITE_URL);
  try {
    // Use the same official address as article canonicals and the sitemap.
    // A hosting environment variable can still be used during API outages.
    const catalog = await readCatalog("avera", 0, 1);
    origin = safeOrigin(catalog?.origin) || origin;
  } catch {
    // Never turn a temporary content-service outage into a robots.txt error.
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: origin ? `${origin}/sitemap.xml` : undefined,
  };
}
