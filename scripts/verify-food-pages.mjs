import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
import {getFoodRecord,foodPageMeta,foodStatus,foodUpdated} from '../docs/food-page-content.js';
const docs=new URL('../docs/',import.meta.url);
const source=await readFile(new URL('../site-static/app.js',import.meta.url),'utf8')+await readFile(new URL('../site-static/convenience.js',import.meta.url),'utf8');
const sourceSlugs=new Set([...source.matchAll(/\['([^']+)','[^']+','[^']+','[^']+',\[/g)].map(m=>m[1]));
assert.equal(foodCatalog.length,50);assert.deepEqual(new Set(foodCatalog.map(f=>f.slug)),sourceSlugs);
const stats={};let count=0;
for(const pet of Object.keys(petCatalog))for(const food of foodCatalog){
 const key=pet+'/'+food.slug,r=getFoodRecord(key);stats[pet]||={direct:0,category:0,limited:0};stats[pet][r.evidence]++;
 assert.ok(foodStatus[r.status]);assert.ok(['direct','category','limited'].includes(r.evidence));assert.ok(r.sources?.length);
 for(const lang of ['ko','en']){
  for(const field of ['answer','why','preparation','avoid'])assert.ok(typeof r[lang][field]==='string'&&r[lang][field].length>8,`${key} ${field}`);
  const html=await readFile(new URL(`${lang}/${key}/index.html`,docs),'utf8'),url=`https://petnyam.com/${lang}/${key}/`;
  assert.ok(html.includes(`data-food-clarity="${key}"`));
  assert.ok(html.includes(`<html lang="${lang}"`));assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.ok(html.includes(`rel="canonical" href="${url}"`));
  for(const id of ['food-why','food-preparation','food-avoid','food-eaten','food-sources'])assert.ok(html.includes(`id="${id}"`),`${key} ${id}`);
  assert.ok(html.includes(foodStatus[r.status][lang]));
  assert.ok(!html.includes('상세 근거 설명이 아직 충분하지')&&!html.includes('PetNyam V1 데이터'));
  assert.ok(html.includes('editorial.js?v=8'));assert.ok(html.includes('editorial.css?v=2'));
  for(const s of r.sources)assert.ok(html.includes(s.url));
  const schema=JSON.parse(html.match(/id="petnyam-search-metadata">([\s\S]*?)<\/script>/)[1]);
  const page=schema['@graph'].find(n=>n['@id']===url+'#page');
  assert.equal(page.inLanguage,lang);assert.equal(page.dateModified,foodUpdated);
  assert.ok(page.citation.every(s=>html.includes(s)));
  assert.ok(html.includes(`<title>${foodPageMeta(key,lang==='en').title}</title>`));
  if(pet==='rabbit')assert.ok(!html.includes('구토·')&&!html.includes('vomiting, weakness'));
  count++;
 }
}
console.log(JSON.stringify({foodPages:count,evidence:stats,note:'Layout and consistency checks, not veterinary approval.'}));
