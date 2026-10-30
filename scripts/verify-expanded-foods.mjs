import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {extraFoodEntries,newFruitKeywords,extraFoodHref,findExtraFoods,extraFoodLinksView} from '../docs/extra-food-index.js';
import {expandedFoodGuides} from '../docs/expanded-food-guides.js';
import {meatMaterialReference} from '../docs/meat-material-reference.js';
const docs=new URL('../docs/',import.meta.url),snapshot=JSON.parse(await readFile(new URL('data/feed-materials.json',docs),'utf8'));
assert.equal(newFruitKeywords.length,8);assert.equal(extraFoodEntries.length,18);assert.equal(Object.keys(expandedFoodGuides).length,8);
assert.equal(findExtraFoods('dog','귤')[0].anchor,'mandarin');assert.equal(findExtraFoods('dog','멜론').length,2);
assert.equal(findExtraFoods('cat','삼겹살')[0].slug,'pork-belly-for-pets');assert.equal(findExtraFoods('dog','홍두깨살')[0].anchor,'round');assert.ok(!findExtraFoods('dog','돼지고기 안심').some(f=>f.slug==='beef-cuts-for-pets'));
for(const pet of ['cat','rabbit','hamster','parrot'])assert.equal(findExtraFoods(pet,'파파야').length,0);
assert.equal(findExtraFoods('rabbit','삼겹살').length,0);assert.equal(findExtraFoods('__proto__','소고기').length,0);
assert.equal(findExtraFoods('dog','<script>').length,0);assert.ok(extraFoodLinksView(findExtraFoods('dog','천도')).includes('#nectarine'));
for(const item of meatMaterialReference.items)assert.deepEqual(item,snapshot.items.find(i=>i.feedSeqNo===item.feedSeqNo),'Ingredient figures must remain original values');
const descriptions=new Set();
for(const [route,a]of Object.entries(expandedFoodGuides)){
 const html=await readFile(new URL('.'+route+'index.html',docs),'utf8');assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes(a.title));assert.ok(html.includes('2026-10-31'));assert.ok(html.includes('rel="canonical" href="https://petnyam.com'+route+'"'));
 assert.ok(!descriptions.has(a.description));descriptions.add(a.description);for(const url of a.sources)assert.ok(html.includes(url));
 for(const match of html.matchAll(/href="(\/[^"<>]+)"/g)){const path=match[1].split(/[?#]/)[0];await access(new URL('.'+path+(path.endsWith('/')?'index.html':''),docs));}
}
for(const entry of extraFoodEntries)for(const en of [false,true]){const href=extraFoodHref(entry,en),[path,id]=href.split('#'),html=await readFile(new URL('.'+path+'index.html',docs),'utf8');if(id)assert.ok(html.includes('id="'+id+'"'));}
for(const file of ['docs/convenience.js','site-static/convenience.js']){
 const text=await readFile(new URL('../'+file,import.meta.url),'utf8'),json=text.match(/^const supplementalFoodArticles=(.*);/)[1];assert.deepEqual(JSON.parse(json),extraFoodEntries);
 const context={pet:'dog',en:false,pets:{dog:['강아지','Dog'],cat:['고양이','Cat'],rabbit:['토끼','Rabbit']},document:{createElement:()=>({})}};
 runInNewContext(text.split("document.addEventListener('input'")[0],context);
 for(const entry of extraFoodEntries)for(const pet of entry.pets)for(const en of [false,true]){context.pet=pet;context.en=en;const matches=context.matchingSupplementalFoods(entry.aliases[0]),found=matches.find(f=>f.slug===entry.slug&&f.anchor===entry.anchor);assert.ok(found);assert.equal(context.supplementalFoodLink(found).href,extraFoodHref(entry,en));}
 context.pet='cat';assert.equal(context.matchingSupplementalFoods('파파야').length,0);context.pet='rabbit';assert.equal(context.matchingSupplementalFoods('삼겹살').length,0);
}
const directory=await readFile(new URL('foods/index.html',docs),'utf8');for(const entry of extraFoodEntries.slice(2))assert.ok(directory.includes(extraFoodHref(entry)));
for(const pet of ['dog','cat'])for(const meat of ['pork','beef'])for(const lang of ['ko','en']){const html=await readFile(new URL(lang+'/'+pet+'/'+meat+'/index.html',docs),'utf8');assert.ok(html.includes('food-cut-links'));assert.ok(html.includes('/expanded-food-guides.css?v=1'));}
const lookup=await readFile(new URL('feed-materials.js',docs),'utf8');assert.ok(lookup.includes("get('q')"));assert.ok(!/sendBeacon|localStorage/.test(lookup));
console.log('Expanded foods verified: 8 fruit keywords, 8 meat/cut keywords, 8 bilingual guide pages, exact Nongsaro records, species-scoped search, working anchors and original pork/beef detail links.');
