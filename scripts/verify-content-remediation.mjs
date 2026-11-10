import assert from 'node:assert/strict';
import {readFile,readdir,access,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
import {getFoodRecord} from '../docs/food-page-content.js';
import {foodDetailNotes,foodDetailReading} from '../docs/food-detail-notes.js';
import {consolidatedFoodHref} from '../docs/content-consolidation.js';
const docs=new URL('../docs/',import.meta.url),esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
assert.deepEqual(new Set(Object.keys(foodDetailNotes)),new Set(foodCatalog.map(f=>f.slug)));
assert.equal(new Set(Object.values(foodDetailNotes).map(n=>n.ko[0])).size,50,'Food-specific questions cannot all be the same');
const prior=JSON.parse(await readFile(new URL('../reports/content-remediation-baseline.json',import.meta.url),'utf8'));
let count=0,limited=0,total=0;const common={},feeding={};
for(const pet of Object.keys(petCatalog))for(const food of foodCatalog){
 const key=pet+'/'+food.slug;if(consolidatedFoodHref(key))continue;const r=getFoodRecord(key);
 feeding[key]={status:r.status,evidence:r.evidence,sources:r.sources,ko:r.ko,en:r.en};
 if(r.evidence==='limited')limited++;
 for(const lang of ['ko','en']){
  const html=await readFile(new URL(`${lang}/${key}/index.html`,docs),'utf8'),notes=foodDetailReading(r,lang==='en');
  assert.ok(html.includes('id="food-specific-questions"'),key);
  for(const [q,a] of notes.items)assert.ok(html.includes(esc(q))&&html.includes(esc(a)),key+' specific comparison and species context');
  if(notes.unresolved)assert.ok(html.includes(esc(notes.unresolved.question)),key+' named evidence question');
  assert.ok(!html.includes('data-result-rescue data-rescue-species'),'Do not repeat shelter cards on food pages');
  assert.ok(html.includes('id="next-food"')&&html.includes('data-content-continuation'),'Keep food search and the four requested continuation links');
  if(r.status==='danger')assert.ok(html.indexOf('class="result-urgent"')<html.indexOf('id="food-specific-questions"'),'Keep urgent action above optional reading');
  const shared=html.match(/<section class="info food-explanation food-eaten"[\s\S]*?<\/section>/)?.[0];assert.ok(shared?.includes('/guides/food-emergency/'));
  if(key==='dog/apple')common[lang]=Buffer.byteLength(shared);
  total+=Buffer.byteLength(html);count++;
 }
}
assert.equal(count,434);assert.equal(limited,24,'Uncertainty must not be converted into permission');
assert.equal(createHash('sha256').update(JSON.stringify(feeding)).digest('hex'),prior.feedingSha256,'This layout-only release must retain feeding verdicts, facts and sources');
for(const lang of ['ko','en'])assert.ok(common[lang]<prior.commonEmergencyBytes[lang],'Common emergency block must shrink while retaining the full-guide link');
const removed=['gogunsan-dog-footbridge-reference.webp','gogunsan-dog-harbor-reference.webp','gogunsan-dog-islands-map-reference.jpg','gogunsan-dog-coastal-arch-reference.jpg','gogunsan-dog-rock-reference.jpg'];
for(const name of removed)await assert.rejects(access(new URL('images/guides/'+name,docs)),name+' must be absent from deployment');
for(const file of (await readdir(docs,{recursive:true})).filter(f=>/\.(?:html|js|xml)$/.test(f))){const text=await readFile(new URL(file.replaceAll('\\','/'),docs),'utf8');for(const name of removed)assert.ok(!text.includes(name),file+' must not publish withdrawn media');}
const travel=await readFile(new URL('guides/gogunsan-dog-travel/index.html',docs),'utf8');assert.ok(travel.includes('/images/guides/gogunsan-trip-checklist.svg'));assert.ok(travel.includes('펫냠 직접 제작 안내도'));
const report={checked:'2026-11-11',foodPages:count,comparisons:50,limitedCombinationsRetained:limited,feedingVerdictsAndSourcesPreserved:true,withdrawnExternalImages:removed.length,commonEmergencyBytes:{before:prior.commonEmergencyBytes,after:common},averagePageBytes:{before:prior.averageFoodPageBytes,after:Math.round(total/count)},note:'Editorial and technical checks; not veterinary approval, a copyright clearance opinion or an AdSense approval prediction.'};
await writeFile(new URL('../reports/content-remediation-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
