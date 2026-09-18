import Link from "next/link";
import type { ReactNode } from "react";
import { readCatalogAll } from "@/lib/publishing/public";
import { safeHref } from "@/lib/publishing/model";
import "./public.css";
/** Keep the existing landing-page composition until real editions are explicitly featured. */
export async function AveraStories({fallback}:{fallback:ReactNode}) {
  let items;try{items=(await readCatalogAll("avera")).filter(x=>x.featured);}catch{return <>{fallback}<p role="status">De gedeelde artikelen zijn tijdelijk niet bereikbaar. <Link href="/artikelen">Probeer het artikeloverzicht</Link></p></>;}
  return <>{items.length?<div className="pub-catalog">{items.slice(0,6).map(item=><article key={item.id}>{item.hero_image&&safeHref(item.hero_image)&&<img src={item.hero_image} alt={item.image_alt||""}/>}<h2><Link href={`/artikelen/${item.slug}`}>{item.title}</Link></h2><p>{item.summary}</p><Link href={`/artikelen/${item.slug}`}>Lees artikel →</Link></article>)}</div>:fallback}<p><Link href="/artikelen">Alle artikelen en verslagen →</Link></p></>;
}
export async function AveraHero({fallback}:{fallback:ReactNode}) {
  let item;try{item=(await readCatalogAll("avera")).find(x=>x.featured&&x.featured_position==="main");}catch{return fallback;}
  if(!item)return fallback;
  return <section className="pub-article" id="investigations"><header><p>{item.eyebrow||"Uitgelicht verhaal"}</p><h1>{item.title}</h1><p className="pub-lead">{item.summary}</p><Link href={`/artikelen/${item.slug}`}>Lees het verhaal →</Link></header>{item.hero_image&&safeHref(item.hero_image)&&<img className="pub-hero" src={item.hero_image} alt={item.image_alt||""}/>}</section>;
}
