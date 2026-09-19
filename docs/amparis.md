# Amparis — naam en domein

Avera heet **Amparis**. Het woordmerk is **AMPARIS** en de ondertitel is **The Amparis Collective**. De homepage, footer, toegankelijke merklabels, artikellijst en uitgeversnaam in JSON-LD gebruiken deze naam.

## Eén publicatiekanaal

De platformsleutel blijft `avera`. De naamswijziging maakt geen nieuw kanaal, kopieert geen artikelen en verandert geen hoofdstuk-ID's, revisies of toegangsrechten. De repositorynaam, oudere documentatie en interne bestandsnamen kunnen daarom nog Avera bevatten.

## Domeinkoppeling

De eigenaar heeft `amparis.nl` bevestigd. Bij de live-controle op 19 september 2026 verwees Vercel `https://amparis.nl` met HTTP 308 door naar `https://www.amparis.nl`. De bestaande hosting-doorverwijzing wordt behouden; het primaire publicatieadres is daarom `https://www.amparis.nl`. Dit is dezelfde website, geen extra publicatiekanaal.

`publishing_sites.origin` voor `avera` moet dit primaire adres bevatten. Artikelcanonicals en de sitemap gebruiken deze gedeelde instelling. `robots.txt` leest nu dezelfde instelling en valt alleen bij een API-storing terug op de hostingvariabele. Preview-deployments blijven uitgesloten van indexering.

```env
NEXT_PUBLIC_SITE_URL=https://www.amparis.nl
SHARED_CONTENT_API_URL=https://meridiancollective.nl/api/publicaties
```

Een voorbeeldbestand verandert geen Vercel-omgevingsvariabelen. De gedeelde database-instelling heeft bij openbare publicaties voorrang. De bestaande Vercel-projectnaam is `avera`; dit project bevat de Amparis-website. Het Meridian-project blijft `perspectief`.

## Publicaties

De read-only Meridian-API levert alleen vrijgegeven edities voor dit kanaal. Een leeg artikeloverzicht betekent dat er nog geen artikel bewust voor Amparis is gepubliceerd. Deze domeinkoppeling publiceert geen artikelen en maakt privénotities, ledencontent of interne tags niet openbaar.

Schrijven gebeurt in Meridian: Werkplek → Structuur & publicatie. Sla de tekst en instellingen op en kies de gewenste websites vóór Publiceer geselecteerde websites. Meer uitleg staat in `docs/shared-publishing.md` in de Meridian-repository.

DNS, nameservers, mailrecords en domeinredirects zijn bij deze codeaanpassing niet gewijzigd.
