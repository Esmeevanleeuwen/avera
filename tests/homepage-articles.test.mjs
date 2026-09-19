import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const result = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const localRequire = name => Object.hasOwn(mocks, name) ? mocks[name] : require(name);
  new Function("require", "module", "exports", code)(localRequire, result, result.exports);
  return result.exports;
}
const model = load("src/lib/publishing/model.ts");
const items = [1, 2, 3, 4].map(number => ({
  id: String(number), slug: `chapter-${number}`, title: `Titel ${number}`, summary: `Samenvatting ${number}`,
  hero_image: "https://www.amparis.nl/images/avera-hero-frosted-silhouette.webp", image_alt: "Illustratief beeld",
  platform: "avera", status: "published", featured: false,
}));
const report = { slug: "systemische-femicide", chapters: items.map((item, index) => ({
  id: item.id, slug: item.slug, href: `/artikelen/${item.slug}`, position: index + 1,
})) };
async function render({ catalog = items, publishedReport = report, reject = false } = {}) {
  const calls = [];
  const Component = load("src/components/publishing/HomepageArticles.tsx", {
    "next/link": props => React.createElement("a", props),
    "next/image": props => React.createElement("img", Object.fromEntries(Object.entries(props).filter(([key]) => key !== "unoptimized"))),
    "@/lib/publishing/model": model,
    "@/lib/publishing/public": {
      readCatalogAll: async platform => { calls.push(["catalog", platform]); if (reject) throw new Error("PRIVATE_DATABASE_DETAILS"); return catalog; },
      readSharedReport: async (platform, slug) => { calls.push(["report", platform, slug]); return publishedReport; },
    },
    "./HomepageArticles.module.css": { section: "articleSection", grid: "articleGrid" },
  }).default;
  return { html: renderToStaticMarkup(await Component()), calls };
}

test("the former dossier position contains articles, without replacing the hero or stories", () => {
  const source = fs.readFileSync("src/app/page.tsx", "utf8");
  const location = source.indexOf("<HomepageArticles />");
  assert.ok(location > source.indexOf('id="voices"'));
  assert.ok(location < source.indexOf('id="world"'));
  assert.equal(source.match(/<HomepageArticles \/>/g).length, 1);
  assert.doesNotMatch(source, /dossiers\.map|Lees dossier|>Dossiers</);
  assert.match(source, /<AveraHero fallback=/);
  assert.match(source, /<AveraStories fallback=/);
});

test("all four unfeatured chapters render as real article links in report order", async () => {
  const { html, calls } = await render({ catalog: [...items].reverse() });
  assert.equal((html.match(/<article\b/g) || []).length, 4);
  assert.match(html, /id="artikelen"/);
  assert.match(html, /<h2[^>]*>Artikelen<\/h2>/);
  for (let number = 1; number <= 4; number++) {
    assert.ok(html.includes(`href="/artikelen/chapter-${number}"`));
    assert.ok(html.includes(`Hoofdstuk ${number}`));
    assert.ok(html.includes(`Samenvatting ${number}`));
    if (number < 4) assert.ok(html.indexOf(`Titel ${number}`) < html.indexOf(`Titel ${number + 1}`));
  }
  assert.match(html, /href="\/verslagen\/systemische-femicide"/);
  assert.deepEqual(calls, [["report", "avera", "systemische-femicide"], ["catalog", "avera"]]);
});

test("published title and order updates propagate; absent or non-public chapters are hidden", async () => {
  const publishedReport = { ...report, chapters: [report.chapters[3], report.chapters[0], report.chapters[1], report.chapters[2]] };
  const catalog = [{ ...items[0], title: "Gewijzigde titel" }, { ...items[1], status: "draft", title: "PRIVATE_DRAFT" },
    { ...items[2], platform: "meridian", title: "OTHER_SITE" }, items[3]];
  const { html } = await render({ catalog, publishedReport });
  assert.equal((html.match(/<article\b/g) || []).length, 2);
  assert.ok(html.indexOf("Titel 4") < html.indexOf("Gewijzigde titel"));
  assert.doesNotMatch(html, /PRIVATE_DRAFT|OTHER_SITE|Titel 1/);
  assert.equal((await render({ catalog: [] })).html.includes("Lees artikel"), false);
});

test("missing reports and network errors do not restore placeholders or expose errors", async () => {
  const empty = await render({ publishedReport: null });
  assert.doesNotMatch(empty.html, /<article\b|Lees dossier/);
  assert.match(empty.html, /nog geen artikelen/);
  const failed = await render({ reject: true });
  assert.doesNotMatch(failed.html, /PRIVATE_DATABASE_DETAILS|<article\b/);
  assert.match(failed.html, /tijdelijk niet beschikbaar/);
  assert.match(failed.html, /href="\/artikelen"/);
});

test("unsafe image URLs are replaced and article text is escaped", async () => {
  const { html } = await render({ catalog: [{ ...items[0], title: "<script>not executable</script>", hero_image: "javascript:alert(1)" }] });
  assert.doesNotMatch(html, /javascript:|<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /src="\/images\/avera-hero-frosted-silhouette.webp"/);
});
