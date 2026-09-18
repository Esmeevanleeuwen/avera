import "server-only";
import { cache } from "react";
import type { Catalog, Platform, PublicReport, SharedArticle } from "./model";
/** Meridian's read-only gateway projects the same database. No article copies or auth secrets. */
async function read<T>(params: Record<string,string>): Promise<T> {
  const url = new URL(process.env.SHARED_CONTENT_API_URL || "https://meridiancollective.nl/api/publicaties");
  for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value);
  const response = await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(12000),headers:{Accept:"application/json"}});
  if(response.status===404) return null as T;
  if(!response.ok) throw new Error("De gedeelde publicaties zijn tijdelijk niet beschikbaar.");
  return response.json() as Promise<T>;
}
export const readSharedArticle = cache((platform:Platform,slug:string)=>read<SharedArticle|null>({platform,slug}));
export const readSharedReport = cache((platform:Platform,slug:string)=>read<PublicReport|null>({platform,report:slug}));
export const readReportCatalog = cache((platform:Platform)=>read<PublicReport[]>({platform,reports:"1"}));
export const readCatalog = cache((platform:Platform,offset=0,limit=100)=>read<Catalog>({platform,offset:String(offset),limit:String(limit)}));
export const readCatalogAll = cache(async (platform:Platform)=>{const first=await readCatalog(platform,0,1000),items=[...first.items];for(let offset=1000;offset<first.total;offset+=1000)items.push(...(await readCatalog(platform,offset,1000)).items);return items;});
