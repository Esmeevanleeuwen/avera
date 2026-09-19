# Amparis — naamswijziging

Avera heet voortaan **Amparis**. Het woordmerk is **AMPARIS** en de bestaande ondertitel wordt **The Amparis Collective**. De homepage, footer, toegankelijke merklabels, artikellijst en uitgeversnaam in JSON-LD gebruiken de nieuwe naam.

## Gedeelde artikelen behouden

De platformsleutel in de database en API blijft `avera`. De naamswijziging maakt geen nieuw publicatiekanaal, kopieert geen artikelen en verandert geen hoofdstuk-ID's, verslagen, revisies of toegangsrechten. Meridian toont voor dit kanaal het label Amparis. Bestaande functies, tabelnamen, afbeeldingspaden en de repositorynaam mogen daarom nog `avera` bevatten.

De pagina's voor hoofdstukken en verslagen blijven dezelfde opgeslagen inhoud en verwijzingen gebruiken. Instellingen voor canonicals worden niet stilzwijgend vervangen.

## Volledig domein nog bevestigen

Alleen de naam Amparis is opgegeven; een domeinextensie is nog niet bevestigd. Er is daarom geen `.nl`, `.com` of ander adres ingevuld of geregistreerd. Er zijn geen DNS-records, redirects of hostinginstellingen gewijzigd.

Zodra het volledige HTTPS-adres vaststaat, hoort dit in `publishing_sites.origin` voor de bestaande sleutel `avera` en in de Amparis-deployment bij `NEXT_PUBLIC_SITE_URL`. De server-side Meridian-API blijft de gedeelde bron. `SHARED_CONTENT_API_URL` wijst naar die API, niet naar de publieke Amparis-homepage. De site moet daarnaast via de hosting aan het bevestigde domein worden gekoppeld.

Oudere documentatie met Avera beschrijft hetzelfde platform onder de vorige naam.
