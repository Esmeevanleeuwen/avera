import type {MetadataRoute} from "next";
import {safeOrigin} from "@/lib/publishing/model";
export default function robots():MetadataRoute.Robots {const origin=safeOrigin(process.env.NEXT_PUBLIC_SITE_URL)||safeOrigin(process.env.SITE_URL);return {rules:{userAgent:"*",...(process.env.VERCEL_ENV==="preview"?{disallow:"/"}:{allow:"/"})},sitemap:origin?`${origin}/sitemap.xml`:undefined};}
