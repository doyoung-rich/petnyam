import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {getFoodRecord} from '../docs/food-page-content.js';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
import {consolidatedFoodHref} from '../docs/content-consolidation.js';
const improved=['dog/peanut','dog/spinach','dog/mushroom','cat/peach','cat/pineapple','cat/sweet-potato'];
for(const key of improved){
 const r=getFoodRecord(key);
 assert.equal(r.evidence,'direct',key);
 assert.equal(r.status,'caution',key);
 assert.equal(r.updated,'2026-11-11',key);
 assert.ok(r.sources.some(s=>/akc.org|petmd.com/.test(s.url)),key);
}
// Dog evidence must not silently change other species or known acute hazards.
assert.equal(getFoodRecord('cat/peanut').evidence,'limited');
assert.equal(getFoodRecord('hamster/milk').status,'unknown');
for(const key of ['dog/xylitol','dog/chocolate','dog/grape'])assert.equal(getFoodRecord(key).status,'danger',key);
const remaining=[];
for(const pet of Object.keys(petCatalog))for(const food of foodCatalog){
 const key=`${pet}/${food.slug}`,r=getFoodRecord(key);
 if(r.evidence==='limited'&&!consolidatedFoodHref(key))remaining.push({key,reason:r.ko.why,sources:r.sources});
}
const report={reviewed:'2026-11-11',scope:'Existing evidence-gap inventory; six combinations re-researched. Remaining entries are an open editorial backlog, not proof of AdSense rejection.',improved,preservedUrls:true,newRedirects:0,remaining};
await writeFile(new URL('../reports/food-evidence-review-2026-11-11.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`Evidence review: ${improved.length} combinations improved in both languages; ${remaining.length} limited combinations remain for review.`);
