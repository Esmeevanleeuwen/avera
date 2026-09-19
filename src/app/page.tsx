import { AveraStories, AveraHero } from "@/components/publishing/AveraFeed";
import {
  ArrowRight,
  LockKeyhole,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { getHomepageContent } from "@/lib/homepage";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const c = (...names: Array<string | false | null | undefined>) =>
  names
    .filter((name): name is string => Boolean(name))
    .flatMap((name) => name.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(" ");

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={c("brand", inverse && "brandInverse")} href="#top" aria-label="AMPARIS homepage">
      <span className={c("brandName")}>AMPARIS</span>
      <span className={c("brandTag")}>The Amparis Collective</span>
    </a>
  );
}

function ArrowLink({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  return (
    <a className={c("arrowLink")} href={href}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
    </a>
  );
}

export default async function Home() {
  const { dossiers, metrics, stories } = await getHomepageContent();

  return (
    <main className={c("page")} id="top">
      <header className={c("siteHeader")}>
        <div className={c("headerInner")}>
          <Brand />
          <nav className={c("desktopNav")} aria-label="Hoofdnavigatie">
            <a href="#stories">Stories</a>
            <a href="#voices">Voices</a>
            <a href="#investigations">Investigations</a>
            <a href="#data">Data</a>
            <a href="#world">World</a>
            <a href="#about">About</a>
          </nav>
          <a className={c("anonymousLink")} href="#share">
            <LockKeyhole aria-hidden="true" size={14} />
            <span>Anoniem deelnemen</span>
          </a>
          <details className={c("mobileMenu")}>
            <summary aria-label="Open navigatie"><Menu aria-hidden="true" size={22} /></summary>
            <nav aria-label="Mobiele navigatie">
              <a href="#stories">Stories</a>
              <a href="#voices">Voices</a>
              <a href="#investigations">Investigations</a>
              <a href="#data">Data</a>
              <a href="#world">World</a>
              <a href="#about">About</a>
            </nav>
          </details>
        </div>
      </header>

      <AveraHero fallback={<section className={c("hero")} id="investigations">
        <div className={c("heroCopy")}>
          <p className={c("eyebrow")}>Onderzoek — Phosphoros</p>
          <span className={c("accentRule")} aria-hidden="true" />
          <h1>Wat blijft bestaan wanneer niemand durft te spreken?</h1>
          <p className={c("heroIntro")}>
            Een diepgaand onderzoek naar seksueel misbruik, macht en medeplichtigheid. Naar de structuren die stilte beschermen, verantwoordelijkheid verspreiden en daardoor kunnen blijven bestaan.
          </p>
          <ArrowLink href="#stories">Lees het onderzoek</ArrowLink>
        </div>
        <div className={c("heroImage")} role="img" aria-label="Vage menselijke silhouet achter matglas" />
      </section>} />

      <section className={c("impactBar")} aria-label="Impact in cijfers">
        <p className={c("impactStatement")}>Seksueel misbruik is geen incident.<br />Het is een structuur die door<br />stilte blijft bestaan.</p>
        {metrics.map((metric) => (
          <div className={c("impactMetric")} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className={c("shareSection")} id="share">
        <div className={c("shieldMark")} aria-hidden="true"><ShieldCheck size={42} strokeWidth={1.2} /></div>
        <div className={c("shareCopy")}>
          <h2>Jouw ervaring telt,<br />ook zonder je naam.</h2>
          <p>Deel wat je meemaakte of meemaakt. Anoniem, veilig en op jouw voorwaarden. Jouw verhaal helpt patronen zichtbaar te maken en verandering te versnellen.</p>
          <a className={c("button buttonDark")} href="#share-information">
            Deel je ervaring veilig <ArrowRight aria-hidden="true" size={15} />
          </a>
        </div>
        <div className={c("privacyNote")} id="share-information">
          <h3>Deel je ervaring veilig</h3>
          <div><LockKeyhole aria-hidden="true" size={18} /><p>Volledig anoniem. Jij beslist wat je deelt en wat niet.</p></div>
        </div>
      </section>

      <section className={c("storiesSection")} id="stories">
        <div className={c("sectionKicker")}><span>01</span><i />Uitgelichte verhalen<b /></div>
        <AveraStories fallback={<div className={c("storiesGrid")}>
          <article className={c("storyFeature")}>
            <div className={c("storyImage featureImage")} />
            <div className={c("storyOverlay")}>
              <p>{stories[0].number} — {stories[0].category}</p>
              <h2>{stories[0].title}</h2>
              <span>{stories[0].excerpt}</span>
              <small>Door {stories[0].author} <i /> {stories[0].time}</small>
            </div>
          </article>
          <div className={c("secondaryStories")}>
            <article className={c("imageStory architectureStory")}>
              <div className={c("storyImage architectureImage")} />
              <div className={c("storyText")}>
                <p>{stories[1].number} — <em>{stories[1].category}</em></p>
                <h3>{stories[1].title}</h3>
                <span>{stories[1].excerpt}</span>
                <small>Door {stories[1].author} <i /> {stories[1].time}</small>
              </div>
            </article>
            <article className={c("imageStory portraitStory")}>
              <div className={c("storyImage portraitImage")} />
              <div className={c("storyText")}>
                <p>{stories[2].number} — <em>{stories[2].category}</em></p>
                <h3>{stories[2].title}</h3>
                <span>{stories[2].excerpt}</span>
                <small>Door {stories[2].author} <i /> {stories[2].time}</small>
              </div>
            </article>
          </div>
        </div>} />
      </section>

      <section className={c("voicesSection")} id="voices">
        <div className={c("voicesIntro")}>
          <div className={c("sectionKicker")}><span>02</span><i />Signaal / collectieve data</div>
          <h2>Één vraag.<br />Duizenden stemmen.</h2>
          <p>Geanonimiseerde inzichten uit ervaringen die met ons zijn gedeeld.</p>
          <div className={c("dataGrid")} id="data">
            <div className={c("dataPoint")}>
              <strong>31%</strong><span>heeft dit nog nooit<br />hardop gezegd</span>
              <div className={c("miniBars wineBars")} aria-label="Oplopende bordeauxrode datapunten"><i /><i /><i /><i /><i /><i /></div>
            </div>
            <div className={c("dataPoint")}>
              <strong>62%</strong><span>voelde zich niet<br />gehoord</span>
              <div className={c("miniBars lightBars")} aria-label="Oplopende rode datapunten"><i /><i /><i /><i /><i /><i /></div>
            </div>
            <div className={c("dataPoint")}>
              <strong>7.842</strong><span>antwoorden in<br />deze week</span>
              <div className={c("miniBars blueBars")} aria-label="Oplopende blauwe datapunten"><i /><i /><i /><i /><i /><i /></div>
            </div>
          </div>
          <div className={c("legend")}><i className={c("wine")} />Macht &amp; controle <i className={c("rose")} />Instellingen &amp; systemen <i className={c("blue")} />Herstel &amp; steun</div>
        </div>
      </section>

      <section className={c("dossierSection")}>
        <div className={c("sectionKicker")}><span>03</span><i />Dossiers<b /></div>
        <div className={c("dossierGrid")}>
          {dossiers.map((dossier, index) => (
            <article className={c("dossier")} key={dossier.title}>
              <div className={c("dossierImage", `dossierImage${index + 1}`)} role="img" aria-label="Abstracte menselijke silhouetten achter matglas" />
              <div>
                <h3>{dossier.title}</h3>
                <p>{dossier.text}</p>
                <ArrowLink>Lees dossier</ArrowLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={c("closingSection")} id="world">
        <div className={c("lighthouseImage")} role="img" aria-label="Vuurtoren op rotsen aan zee" />
        <div className={c("closingCopy")}>
          <h2>We herwinnen regie.<br />Samen.</h2>
          <p>Kennis, solidariteit en actie bouwen aan een wereld waarin niemand hoeft te zwijgen om veilig te zijn.</p>
          <ArrowLink>Lees hoe je kunt bijdragen</ArrowLink>
        </div>
        <form className={c("newsletter")} action="#" method="post">
          <h3>Blijf op de hoogte.</h3>
          <p>Ontvang nieuwe verhalen, inzichten en onderzoeken in je inbox.</p>
          <div><label className={c("srOnly")} htmlFor="email">E-mailadres</label><input id="email" name="email" type="email" placeholder="E-mailadres" required /><button type="submit">Aanmelden</button></div>
        </form>
      </section>

      <footer className={c("footer")} id="about">
        <div className={c("footerGrid")}>
          <div className={c("footerBrand")}>
            <Brand inverse />
            <p>Journalistiek. Data. Gemeenschap.<br />Voor een wereld zonder misbruik.</p>
            <div className={c("socials")}><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="X">X</a></div>
          </div>
          <div className={c("footerColumn")}><h3>Ontdek</h3><a href="#stories">Stories</a><a href="#voices">Voices</a><a href="#investigations">Investigations</a><a href="#data">Data</a><a href="#world">World</a></div>
          <div className={c("footerColumn")}><h3>Over Amparis</h3><a href="#about">Over ons</a><a href="#">Ons manifest</a><a href="#">Methodologie</a><a href="#">Veiligheid &amp; privacy</a><a href="#">Veelgestelde vragen</a></div>
          <div className={c("footerColumn")}><h3>Doe mee</h3><a href="#share">Deel je ervaring</a><a href="#world">Word lid</a><a href="#">Steun ons werk</a><a href="#">Partner worden</a></div>
          <div className={c("footerColumn legal")}><h3>Juridisch</h3><a href="#">Privacy</a><a href="#">Gebruiksvoorwaarden</a><a href="#">Cookiebeleid</a><a href="#">Veiligheid</a></div>
        </div>
        <p className={c("copyright")}>© 2026 AMPARIS Collective</p>
      </footer>
    </main>
  );
}
