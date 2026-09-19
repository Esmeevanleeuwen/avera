import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readCatalogAll, readSharedReport } from "@/lib/publishing/public";
import { plainText, safeHref, type PublicReport, type SharedArticle } from "@/lib/publishing/model";
import styles from "./HomepageArticles.module.css";

// Editorial placement only: titles, summaries, images and chapter order stay in the CMS.
const homepageReport = "systemische-femicide";

export default async function HomepageArticles() {
  let report: PublicReport | null = null;
  let articles: SharedArticle[] = [];
  let unavailable = false;

  try {
    [report, articles] = await Promise.all([
      readSharedReport("avera", homepageReport),
      readCatalogAll("avera"),
    ]);
  } catch {
    unavailable = true;
  }

  // Both readers contain public releases only. A withdrawn chapter must disappear,
  // including when a withdrawal occurs between the two read requests.
  const byId = new Map(articles
    .filter(article => article.platform === "avera" && article.status === "published")
    .map(article => [article.id, article]));
  const cards = (report?.chapters ?? []).flatMap(chapter => {
    const article = byId.get(chapter.id);
    return article ? [{ article, position: chapter.position }] : [];
  });

  return (
    <section id="artikelen" className={styles.section} aria-labelledby="homepage-articles-heading">
      <div className={styles.kicker}>
        <span aria-hidden="true">03</span><i aria-hidden="true" />
        <h2 id="homepage-articles-heading">Artikelen</h2><b aria-hidden="true" />
      </div>
      {cards.length > 0 ? (
        <div className={styles.grid}>
          {cards.map(({ article, position }) => (
            <article className={styles.card} key={article.id}>
              <Link href={`/artikelen/${article.slug}`} className={styles.cardLink}>
                <Image
                  src={safeHref(article.hero_image || "") || "/images/avera-hero-frosted-silhouette.webp"}
                  alt={article.image_alt || ""}
                  width={640}
                  height={480}
                  unoptimized
                  className={styles.image}
                />
                <div className={styles.copy}>
                  <span className={styles.chapter}>Hoofdstuk {position}</span>
                  <h3>{plainText(article.title)}</h3>
                  {article.summary && <p>{plainText(article.summary)}</p>}
                  <span className={styles.readLink}>
                    Lees artikel <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.notice} role="status">
          {unavailable ? "De artikelen zijn tijdelijk niet beschikbaar. Probeer het artikeloverzicht." : "Er zijn hier nog geen artikelen gepubliceerd."}
        </p>
      )}
      <div className={styles.footer}>
        <Link href="/artikelen">Alle artikelen <span aria-hidden="true">→</span></Link>
        {cards.length > 0 && report && <Link href={`/verslagen/${report.slug}`}>Lees het volledige verslag <span aria-hidden="true">→</span></Link>}
      </div>
    </section>
  );
}
