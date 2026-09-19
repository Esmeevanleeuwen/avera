# AMPARIS

Amparis is de nieuwe naam van Avera. De website bevat verhalen, onderzoeken en doorlopende verslagen. De naam is aangepast in de homepage, footer, artikelnavigatie, paginatitels en gestructureerde artikelmetadata. De bestaande vormgeving en inhoud blijven behouden.

## Lokale ontwikkeling

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

## Supabase en gedeelde artikelen

Kopieer `.env.example` naar `.env.local` en vul zo nodig de publieke projectwaarden in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

De bestaande homepagegegevens gebruiken `supabase/avera_homepage.sql`. Zonder deze configuratie gebruikt de homepage de bestaande statische inhoud. Gedeelde artikelen en verslagen komen uit de read-only Meridian-API; daarvoor is geen tweede artikelendatabase nodig.

De technische platformsleutel `avera`, bestaande tabelnamen, mediapaden en repositorynaam blijven behouden voor compatibiliteit. Dit zijn geen zichtbare merknamen. Zie `docs/amparis.md` voor de naamswijziging en domeininstelling en `docs/shared-publishing.md` voor het publicatiemodel.

## Controle

```bash
npm run lint
node --test tests/publishing-links.test.mjs tests/amparis-branding.test.mjs
npm run build
```

`AVERA_TECHNISCHE_DOCUMENTATIE.md` beschrijft de oorspronkelijke implementatie onder de vorige naam.
