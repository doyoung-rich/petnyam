import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cotonArticles} from '../docs/coton-articles.js';
import {cotonIntroduction} from '../docs/coton-introduction.js';

const docs = new URL('../docs/', import.meta.url);
const index = await readFile(new URL('guides/index.html', docs), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', docs), 'utf8');
for (const [route, article] of Object.entries({...cotonArticles, ...cotonIntroduction})) {
  const html = await readFile(new URL(route.slice(1) + 'index.html', docs), 'utf8');
  const url = 'https://petnyam.com' + route;
  assert.ok(html.includes(`<html lang="${article.lang}"`));
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  assert.ok(html.includes(article.footer));
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.ok(!html.includes('<script src='), 'A static article must not be replaced by the application router');
  for (const [language, translation] of Object.entries(article.alternates)) {
    assert.ok(html.includes(`hreflang="${language}" href="https://petnyam.com${translation}"`));
    if(language !== article.lang) assert.ok(html.includes(`href="${translation}" lang="${language}"`));
  }
  assert.equal(index.split(`href="${route}"`).length - 1, 1);
  assert.equal(sitemap.split(`<loc>${url}</loc>`).length - 1, 1);
  assert.ok(sitemap.includes(`<loc>${url}</loc><lastmod>${article.published}</lastmod>`));
  for (const source of article.sources) assert.ok(html.includes(`href="${source}"`));
  const raw = html.match(/id="petnyam-search-metadata">([\s\S]*?)<\/script>/)[1];
  const page = JSON.parse(raw)['@graph'].find(node => node['@id'] === url + '#page');
  assert.equal(page['@type'], 'Article');
  assert.equal(page.inLanguage, article.lang);
  assert.equal(page.datePublished, article.published);
  assert.deepEqual(page.citation, article.sources);
  const observations = cotonIntroduction[route]
    ? (article.lang === 'ko' ? ['사이트를 직접 만들어 운영하고 있습니다', '제가 함께 사는 한 마리에 대한 경험'] : ['I built and operate PetNyam', 'my experience'])
    : article.lang === 'ko'
    ? ['많이 짖어요', '애견카페에 가면 활발하게 놀고', '사람들이 신기하게 봐요', '나름 착해요']
    : ['bark a lot', 'dog cafés they play energetically', 'look at them with curiosity', 'quite sweet'];
  for (const observation of observations) assert.ok(html.includes(observation));
  console.log(`Verified Korean/English owner account, translation links and metadata: ${route}`);
}
