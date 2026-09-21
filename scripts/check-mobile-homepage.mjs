import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Public-shaped fixtures only. This test never signs in or changes production content.
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const titles = ['Femicide begint niet bij de moord', 'Wanneer een relatie een systeem van controle wordt', 'Iedere instantie ziet een deel. Wie ziet het gevaar?', 'Bescherming is meer dan een melding'];
const summaries = ['Een bronnenanalyse over femicide als maatschappelijk patroon: wat de cijfers aantonen, hoe controle werkt en waar bescherming kan tekortschieten.', 'Dwingende controle gaat over een patroon dat vrijheid beperkt. Over afhankelijkheid, risico rond een breuk en het verschil tussen signalen en voorspellingen.', 'Over regie, de duiding van geweld en registratie: wat inspecties en onderzoek laten zien over de manier waarop bescherming is georganiseerd.', 'Wat een structurele aanpak van femicide zou moeten veranderen: van herkenning en wetgeving tot daadwerkelijke handelingsruimte, ondersteuning en verantwoording.'];
const items = titles.map((title, i) => ({ id: String(i + 1), slug: `test-hoofdstuk-${i + 1}`, title, summary: summaries[i], platform: 'avera', status: 'published', featured: false, hero_image: '/images/avera-hero-frosted-silhouette.webp', image_alt: 'Illustratief silhouet', seo: { indexable: false } }));
const report = { id: 'test-report', slug: 'systemische-femicide', title: 'Systemische femicide: controle, afhankelijkheid en bescherming', chapters: items.map((a, i) => ({ id: a.id, slug: a.slug, href: `/artikelen/${a.slug}`, position: i + 1, title: a.title })) };
const fixture = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify(url.searchParams.has('report') ? report : { items, total: items.length, origin: 'https://www.amparis.nl' }));
});
await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve));
const port = 3100;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], {
  env: { ...process.env, SHARED_CONTENT_API_URL: `http://127.0.0.1:${fixture.address().port}/api/publicaties`, NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', chunk => { serverLog += chunk; });
server.stderr.on('data', chunk => { serverLog += chunk; });
await fs.mkdir('mobile-results', { recursive: true });
const results = [];
const failures = [];
function check(value, message) { if (!value) failures.push(message); }
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { ready = (await fetch(`http://127.0.0.1:${port}/`)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, `Homepage server did not start: ${serverLog}`);
  for (const [engine, browserType] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await browserType.launch();
    try {
      const sizes = engine === 'chromium' ? [[320, 740], [360, 800], [375, 812], [390, 844], [430, 932], [568, 320], [768, 1024], [850, 900], [900, 900], [1024, 768], [1280, 900], [1440, 1000]] : [[320, 740], [390, 844], [768, 1024]];
      for (const [width, height] of sizes) {
        const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, hasTouch: width <= 1024, isMobile: width <= 430 });
        const errors = [];
        await page.emulateMedia({ reducedMotion: 'reduce' });
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const layout = await page.evaluate(() => {
          const box = selector => { const el = document.querySelector(selector); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, minHeight: getComputedStyle(el).minHeight, marginLeft: getComputedStyle(el).marginLeft }; };
          const clipped = [...document.querySelectorAll('h1,h2,h3,p,a,input,button,summary')].filter(el => {
            if (!el.getClientRects().length || !el.checkVisibility({ checkVisibilityCSS: true })) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
          }).map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 70), x: el.getBoundingClientRect().x, width: el.getBoundingClientRect().width }));
          return { documentWidth: document.documentElement.scrollWidth, viewport: innerWidth, clipped, heroImage: box('[class*="__heroImage"]'), heroTitle: box('#investigations h1'), header: box('header'), articleCards: document.querySelectorAll('#artikelen article').length };
        });
        results.push({ engine, width, height, ...layout });
        check(layout.documentWidth <= width + 1, `${engine} ${width}: page overflows`);
        check(layout.clipped.length === 0, `${engine} ${width}: clipped text or controls: ${JSON.stringify(layout.clipped)}`);
        check(layout.articleCards === 4, `${engine} ${width}: missing chapter cards`);
        check(errors.length === 0, `${engine} ${width}: browser errors ${errors.join('; ')}`);
        if (width <= 850) {
          check(layout.heroImage.height <= 470, `${engine} ${width}: mobile hero image still has desktop minimum height`);
          check(layout.heroImage.x >= -1, `${engine} ${width}: mobile hero image still has desktop negative margin`);
        }
        if (width <= 1024) {
          // Native summary roles differ between browser accessibility trees.
          // Its controls relationship remains stable while its label changes on opening.
          const opener = page.locator('summary[aria-controls="mobile-homepage-navigation"]');
          const r = await opener.boundingBox();
          check(r && r.width >= 44 && r.height >= 44, `${engine} ${width}: menu target smaller than 44px`);
          check(await opener.getAttribute('aria-label') === 'Open navigatie', `${engine} ${width}: menu has no opening label`);
          await opener.click();
          const nav = page.getByRole('navigation', { name: 'Mobiele navigatie' });
          check(await nav.isVisible(), `${engine} ${width}: menu not visible`);
          const bounds = await nav.boundingBox();
          check(bounds && bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `${engine} ${width}: menu outside viewport`);
          check(bounds && bounds.y + bounds.height <= height + 1, `${engine} ${width}: menu outside viewport height`);
          if (width === 390) await page.screenshot({ path: `mobile-results/${engine}-${width}-menu.png` });
          await page.keyboard.press('Escape');
          await page.waitForTimeout(80);
          check(!(await nav.isVisible()), `${engine} ${width}: Escape does not dismiss menu`);
          check(await opener.evaluate(el => document.activeElement === el), `${engine} ${width}: Escape loses keyboard focus`);
          await opener.click();
          await nav.getByRole('link', { name: 'Artikelen', exact: true }).click();
          await page.waitForTimeout(80);
          check(!(await nav.isVisible()), `${engine} ${width}: menu stays open after selecting an article section`);
          check(new URL(page.url()).hash === '#artikelen', `${engine} ${width}: article navigation does not reach the section`);
          await page.evaluate(() => window.scrollTo(0, 0));
          await opener.click();
          await page.locator('header').getByRole('link', { name: 'AMPARIS homepage' }).click();
          await page.waitForTimeout(80);
          check(!(await nav.isVisible()), `${engine} ${width}: outside click does not dismiss menu`);
        }
        if ([390, 768, 1440].includes(width)) {
          await page.locator('#artikelen').scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: `mobile-results/${engine}-${width}-full.png`, fullPage: true });
          await page.locator('#artikelen').screenshot({ path: `mobile-results/${engine}-${width}-articles.png` });
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: `mobile-results/${engine}-${width}-top.png` });
        }
        await page.close();
      }
    } finally { await browser.close(); }
  }
} catch (error) {
  failures.push(error instanceof Error ? error.stack || error.message : String(error));
} finally {
  server.kill('SIGTERM');
  fixture.close();
  await fs.writeFile('mobile-results/layout.json', JSON.stringify({ results, failures }, null, 2));
  await fs.writeFile('mobile-results/server.log', serverLog);
}
console.log(JSON.stringify({ viewports: results.length, failures }, null, 2));
assert.equal(failures.length, 0, 'Responsive checks failed; see mobile-results/layout.json');
