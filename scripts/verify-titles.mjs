import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {foodPageMeta,getFoodRecord} from '../docs/food-page-content.js';
import {siteTitles,titleWithBrand,applySiteTitle} from '../docs/title-strategy.js';
const docs=new URL('../docs/',import.meta.url);
const plain=s=>s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const seen=new Set();let count=0,foodCount=0;const lengths={ko:[],en:[]};
for(const file of (await readdir(docs,{recursive:true})).filter(f=>f.endsWith('.html'))){
 const html=await readFile(new URL(file.replaceAll('\\','/'),docs),'utf8');
 if(html.includes('name="petnyam-consolidated-from"'))continue;
 const path=file==='404.html'?'/404.html':new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
 const match=path.match(/^\/(ko|en)\/([^/]+\/[^/]+)\/$/),lang=html.match(/<html lang="([^"]+)"/)[1];
 const title=plain(html.match(/<title>([\s\S]*?)<\/title>/)[1]);
 const expected=match?foodPageMeta(match[2],lang==='en').title:titleWithBrand(siteTitles[path]);
 assert.equal(title,expected,path);assert.ok(!seen.has(title),'Duplicate title: '+title);seen.add(title);
 assert.ok(!/\*\*|충격|대박|무조건 안전|guaranteed|100% safe/i.test(title));
 assert.equal((html.match(/<h1\b/g)||[]).length,1,path);
 assert.equal(plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]),title.replace(' | PetNyam',''),path);
 for(const pattern of [/property="og:title" content="([^"]*)"/,/name="twitter:title" content="([^"]*)"/])assert.equal(plain(html.match(pattern)?.[1]||''),title,path);
 const schema=html.match(/id="petnyam-search-metadata">([\s\S]*?)<\/script>/)?.[1];
 if(file!=='404.html'){
  const graph=JSON.parse(schema)['@graph'],page=graph.find(n=>n['@id']?.endsWith('#page'));
  assert.equal(page.name,title,path);if(page.headline)assert.equal(page.headline,title.replace(' | PetNyam',''),path);
 }
 if(match){
  foodCount++;const record=getFoodRecord(match[2]);assert.ok(title.includes(lang==='en'?record.pet.plural:record.pet.ko)||record.key==='cat/xylitol');
  if(record.evidence==='limited')assert.ok(!/소량 가능|safe treat|safe to feed/i.test(title));
  if(lang==='en'&&['milk','alcohol','coffee'].includes(record.food.slug))assert.ok(title.includes('drink '),title);
 }
 lengths[lang]?.push(title.length);count++;
}
// The browser title synchronizer must preserve the same strategy after a home rerender.
const h1={},og={},twitter={};globalThis.location={pathname:'/en/'};
globalThis.document={title:'Old title',querySelector:s=>({'#app h1':h1,'meta[property="og:title"]':og,'meta[name="twitter:title"]':twitter}[s])};
try{applySiteTitle();assert.equal(document.title,titleWithBrand(siteTitles['/en/']));assert.equal(h1.textContent,siteTitles['/en/']);assert.equal(og.content,document.title);assert.equal(twitter.content,document.title);}finally{delete globalThis.document;delete globalThis.location;}
assert.equal(foodCount,434);assert.equal(count,485);
const report=JSON.parse(await readFile(new URL('../reports/title-review.json',import.meta.url),'utf8'));
assert.equal(report.pages,count+66);assert.equal(report.review.length,count+66);
for(const page of report.review){assert.ok(page.before&&page.final&&page.keyword&&page.reason.length&&page.thumbnail.ratio==='1:1');assert.ok(page.bodyOpening.length>=1);}
console.log(JSON.stringify({checkedPages:count,foodPages:foodCount,uniqueTitles:seen.size,maxTitleLength:{ko:Math.max(...lengths.ko),en:Math.max(...lengths.en)},note:'Lengths include the brand; mobile truncation varies. No ranking or CTR guarantee.'}));
