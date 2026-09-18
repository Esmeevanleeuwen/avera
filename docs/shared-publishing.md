# Gedeelde artikelen uit Meridian

Avera leest vrijgegeven artikelen en verslagen uit dezelfde database als Meridian, via de publieke read-only API van Meridian. De artikeltekst wordt niet gekopieerd naar Avera-tabellen. Beide websites kunnen dezelfde snapshot gebruiken, met hun eigen URL, vormgeving, SEO en homepageplaatsing.

Routes: `/artikelen`, `/artikelen/[slug]`, `/verslagen/[slug]`, `/sitemap.xml`. Een oude artikel-slug verwijst permanent door naar de huidige slug. Interne links gebruiken stabiele artikel-/sectie-ID's en worden als gewone HTML-links gerenderd. De inhoudsopgave en hoofdstuklinks tonen alleen op Avera gepubliceerde hoofdstukken.

Optionele configuratie:

```
SHARED_CONTENT_API_URL=https://meridiancollective.nl/api/publicaties
NEXT_PUBLIC_SITE_URL=https://het-officiele-avera-domein
```

`NEXT_PUBLIC_SITE_URL` moet het werkelijke productieadres zijn. Het gedeelde siteadres kan ook door owner in Meridian worden ingesteld. Er is geen geheime databasesleutel nodig. De bestaande Supabase-configuratie voor de landingspagina kan ongewijzigd blijven.

Nieuw gepubliceerde inhoud wordt bij de volgende aanvraag gelezen; geen kopieertaak en geen gedeelde cache-secret. Een artikel komt alleen op de homepage als de Avera-plaatsing Uitgelicht is aangevinkt. Hoofditem kan de bestaande hero vervangen. De bestaande landingspagina blijft anders behouden. Bij een API-fout toont de homepage geen concepten of verzonnen artikelkopieën; het artikeloverzicht meldt de fout via de foutafhandeling.

De database-implementatie, publicatierechten en uitrolvolgorde staan in Meridian onder `docs/shared-publishing.md` en `supabase/migrations/20260918000*_shared_publishing.sql`. De gedeelde model-, renderer- en SEO-bestanden zijn in beide repositories gelijk; wijzigingen daaraan moeten samen worden bijgewerkt. Een echte package-release kan dit later automatiseren.

Controle: `node --test tests/publishing-links.test.mjs`, `npm run lint`, `npm run build`. Een deployment/hostingkoppeling voor Avera blijft nodig om deze routes live te gebruiken.
