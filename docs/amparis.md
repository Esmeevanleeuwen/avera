# Amparis — naam en domein

Avera heet voortaan **Amparis**. Het woordmerk is **AMPARIS** en de ondertitel is **The Amparis Collective**. De homepage, footer, toegankelijke merklabels, artikellijst en uitgeversnaam in JSON-LD gebruiken de nieuwe naam.

## Gedeelde artikelen behouden

De platformsleutel in de database en API blijft `avera`. De naamswijziging maakt geen nieuw publicatiekanaal, kopieert geen artikelen en verandert geen hoofdstuk-ID's, verslagen, revisies of toegangsrechten. Meridian toont voor dit kanaal het label Amparis. Bestaande functies, tabelnamen, afbeeldingspaden en de repositorynaam mogen daarom nog `avera` bevatten.

## Bevestigd domein

De eigenaar heeft **amparis.nl** bevestigd met de domeingegevens uit TransIP. Het officiële adres is `https://amparis.nl`, zonder www.

In de gedeelde database is `publishing_sites.origin` voor de bestaande sleutel `avera` ingesteld op `https://amparis.nl`. Alleen het websiteadres is aangepast. Bestaande artikelinstellingen, verslagen, teksten en toegangsrechten zijn niet gewijzigd. Er is geen artikel gepubliceerd en de eerdere, afzonderlijke database-activatie is hiermee niet uitgevoerd.

`.env.example` bevat nu:

```env
NEXT_PUBLIC_SITE_URL=https://amparis.nl
SHARED_CONTENT_API_URL=https://meridiancollective.nl/api/publicaties
```

Een voorbeeldbestand stelt niet automatisch de Vercel-omgeving in. Voeg `NEXT_PUBLIC_SITE_URL` ook toe in de hostingomgeving. De server-side Meridian-API blijft de gedeelde bron; `SHARED_CONTENT_API_URL` wijst naar die API, niet naar de publieke Amparis-homepage.

## Hosting en DNS nog koppelen

Bij de controle was in het gekoppelde Vercel-team geen Amparis- of Avera-project aanwezig. De bestaande repository `Esmeevanleeuwen/avera` bevat de Amparis-website. Importeer deze als een afzonderlijk Vercel-project, bijvoorbeeld met de projectnaam `amparis`. Gebruik niet het Meridian-project `perspectief` voor dit domein.

Voeg bij dat project onder Settings → Domains `amparis.nl` en `www.amparis.nl` toe. Stel www in als doorverwijzing naar het adres zonder www. Neem de aanbevolen DNS-waarden uit dat Vercel-project exact over in TransIP; waarden kunnen projectspecifiek zijn. Bewaar de TransIP-nameservers en bestaande e-mailrecords. DNSSEC hoeft voor deze DNS-recordmethode niet te worden uitgeschakeld.

De aangeleverde TransIP-tekst bevatte geen ingevulde DNS-recordwaarden. Er zijn in deze stap geen DNS-records, domeinredirects, nameservers of hostinginstellingen gewijzigd. Controleer na koppeling de domeinverificatie en HTTPS in Vercel en daarna de homepage, artikelen en sitemap.

Officiële handleidingen:
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/domains/set-up-custom-domain
- https://www.transip.nl/knowledgebase/25-domein-koppelen-aan-externe-webserver

Oudere documentatie met Avera beschrijft hetzelfde platform onder de vorige naam.
