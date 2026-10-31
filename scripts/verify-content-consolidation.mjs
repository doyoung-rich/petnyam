import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {consolidatedFoods,consolidatedFoodHref,resolveConsolidatedHref} from '../docs/content-consolidation.js';
import {getFoodRecord} from '../docs/food-page-content.js';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
const docs=new URL('../docs/',import.meta.url),read=p=>readFile(new URL(p,docs),'utf8');
const keys=Object.entries(consolidatedFoods).flatMap(([pet,foods])=>foods.map(f=>pet+'/'+f));
const generic=Object.keys(petCatalog).flatMap(p=>foodCatalog.map(f=>getFoodRecord(p+'/'+f.slug))).filter(r=>r.ko.why.includes('정보부족은 독성이 입증되었다는 뜻도')).map(r=>r.key);
assert.deepEqual(new Set(keys),new Set(generic));assert.equal(keys.length,33);
const sitemap=await read('sitemap.xml');let redirected=0;
for(const key of keys)for(const lang of ['ko','en']){
 const old=`/${lang}/${key}/`,target=consolidatedFoodHref(key,lang==='en'),[route,id]=target.split('#'),h=await read('.'+old+'index.html'),destination=await read('.'+route+'index.html');
 assert.ok(h.includes(`name="petnyam-consolidated-from" content="${old}"`));
 assert.ok(h.includes(`http-equiv="refresh" content="0; url=https://petnyam.com${target}"`));
 assert.ok(h.includes(`rel="canonical" href="https://petnyam.com${route}"`));
 assert.ok(h.includes(`data-consolidated-target href="${target}"`));
 assert.ok(!/\b(?:src="\/app.js|src="\/editorial.js|adsbygoogle|noindex)/.test(h),'Universal redirect, no old renderer or ads');
 assert.ok(destination.includes(`id="${id}"`));assert.ok(!destination.includes('name="petnyam-consolidated-from"'));
 assert.ok(!sitemap.includes(`<loc>https://petnyam.com${old}</loc>`));
 assert.equal(resolveConsolidatedHref(old),target);redirected++;
}
for(const file of(await readdir(docs,{recursive:true})).filter(f=>f.endsWith('.html'))){
 const h=await read(file.replaceAll('\\','/'));
 for(const [,href]of h.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g))assert.equal(resolveConsolidatedHref(href),href,'Internal link still uses a legacy route: '+file);
}
assert.equal(resolveConsolidatedHref('/ko/dog/apple/'),'/ko/dog/apple/');
assert.equal(consolidatedFoodHref('hamster/milk'),null,'Keep the specific milk explanation');
assert.equal(consolidatedFoodHref('parrot/lemon'),null,'Keep the species-specific citrus explanation');
assert.equal(redirected,66);console.log('Content consolidation verified: 33 exact generic combinations, 66 universal redirects, valid guide anchors, canonical targets, no old renderer/ads, and all internal links updated.');
