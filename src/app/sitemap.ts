import type { MetadataRoute } from "next";
import { readCatalogAll, readReportCatalog } from "@/lib/publishing/public";
import { articleOrigin } from "@/lib/publishing/seo";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 if(process.env.VERCEL_ENV==="preview")return [];
 const [items,reports]=await Promise.all([readCatalogAll("avera"),readReportCatalog("avera")]);
 return [...items.filter(x=>x.seo.indexable&&articleOrigin(x)&&(!x.canonical_url||x.canonical_url===`${articleOrigin(x)}/artikelen/${x.slug}`)).map(x=>({url:`${articleOrigin(x)}/artikelen/${x.slug}`,lastModified:x.updated_at})),...reports.filter(x=>x.indexable&&articleOrigin(x)).map(x=>({url:`${articleOrigin(x)}/verslagen/${x.slug}`,lastModified:x.updated_at}))];
}
