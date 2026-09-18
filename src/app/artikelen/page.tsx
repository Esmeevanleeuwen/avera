import Link from "next/link";
import { readCatalogAll } from "@/lib/publishing/public";
import { safeHref } from "@/lib/publishing/model";
import "@/components/publishing/public.css";
export const dynamic="force-dynamic";
export const metadata={title:"Artikelen | Avera",description:"Verhalen, artikelen en doorlopende verslagen van Avera."};
export default async function Page(){const items=await readCatalogAll("avera");return <main className="pub-article"><nav><Link href="/">AVERA</Link></nav><header><p>Verhalen & verslagen</p><h1>Artikelen</h1></header><div className="pub-catalog">{items.map(item=><article key={item.id}>{item.hero_image&&safeHref(item.hero_image)&&<img src={item.hero_image} alt={item.image_alt||""}/>}<h2><Link href={`/artikelen/${item.slug}`}>{item.title}</Link></h2><p>{item.summary}</p></article>)}</div>{!items.length&&<p>Er zijn nog geen artikelen voor Avera gepubliceerd.</p>}</main>;}
