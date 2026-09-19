import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file) {
  const output = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const localRequire = name => name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : require(name);
  new Function('require', 'module', 'exports', code)(localRequire, output, output.exports);
  return output.exports;
}
const model = load(path.resolve('src/lib/publishing/model.ts'));
const seo = load(path.resolve('src/lib/publishing/seo.ts'));

test('Amparis uses the existing publication identity and does not change chapter URLs', () => {
  assert.equal(model.isPlatform('avera'), true);
  const item = {
    platform: 'avera', origin: 'https://amparis.test', slug: 'hoofdstuk-twee',
    title: 'Tweede hoofdstuk', summary: 'Samenvatting', seo: { indexable: true },
    published_at: '2026-09-18T00:00:00Z', updated_at: '2026-09-18T00:00:00Z',
    report: { slug: 'verslag', title: 'Verslag' },
  };
  const jsonld = seo.articleStructuredData(item);
  assert.equal(jsonld.publisher.name, 'Amparis');
  assert.equal(jsonld.publisher.url, item.origin);
  assert.equal(jsonld.mainEntityOfPage, 'https://amparis.test/artikelen/hoofdstuk-twee');
  assert.equal(jsonld.isPartOf.url, 'https://amparis.test/verslagen/verslag');
  assert.equal(seo.articleStructuredData({ ...item, platform: 'meridian' }).publisher.name, 'Meridian');
  const canonical = 'https://meridian.test/artikelen/hoofdstuk-twee';
  assert.equal(seo.articleMetadata({ ...item, canonical_url: canonical }).alternates.canonical, canonical);
});

test('visible brand, page metadata and article navigation use Amparis', () => {
  const home = fs.readFileSync('src/app/page.tsx', 'utf8');
  assert.match(home, />AMPARIS</);
  assert.match(home, /The Amparis Collective/);
  assert.match(home, /Over Amparis/);
  assert.match(home, /© 2026 AMPARIS Collective/);
  assert.doesNotMatch(home, />AVERA<|Over Avera|The Avera Collective|AVERA homepage/);
  const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
  assert.match(layout, /AMPARIS — The Amparis Collective/);
  const list = fs.readFileSync('src/app/artikelen/page.tsx', 'utf8');
  assert.match(list, /Artikelen \| Amparis/);
  assert.match(list, /readCatalogAll\("avera"\)/);
  const article = fs.readFileSync('src/components/publishing/SharedArticleView.tsx', 'utf8');
  assert.match(article, /\? "Amparis" : "Meridian"/);
});
