import assert from 'node:assert/strict';
import {readFile,access,writeFile} from 'node:fs/promises';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
import {getFoodRecord,foodStatus,foodPageInner} from '../docs/food-page-content.js';
import {resultSuggestions,sameSpeciesNotices,resultRescueView} from '../docs/result-journey.js';
import {resultEventDetail,loadResultRescue} from '../docs/result-interactions.js';
import {continuationLinks,homeToolLinksView} from '../docs/content-continuation.js';
const docs=new URL('../docs/',import.meta.url),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const snapshot=JSON.parse(await readFile(new URL('data/rescue-animals.json',docs),'utf8'));
assert.equal(sameSpeciesNotices({items:[{kind:'[개] 믹스견',status:'종료(반환)'},{kind:'[고양이] 한국 고양이',status:'보호중'},{kind:'[개] 믹스견',status:'보호중'}]},'dog').length,1);
assert.deepEqual(sameSpeciesNotices(snapshot,'parrot'),[]);assert.deepEqual(sameSpeciesNotices({},'dog'),[]);
assert.ok(resultRescueView(getFoodRecord('dog/apple'),false,{}).includes('공식 전체 목록'));
assert.equal(resultEventDetail('unknown','dog/apple','ko'),null);assert.equal(resultEventDetail('age_calculator','../../private','ko'),null);assert.equal(resultEventDetail('result_view','dog/apple','xx'),null);
assert.deepEqual(resultEventDetail('related_food','cat/milk','en'),{event:'related_food',species:'cat',food:'milk',language:'en'});
await assert.rejects(loadResultRescue(async()=>({ok:false})));
let calls=0;const fetcher=async()=>{calls++;return {ok:true,json:async()=>snapshot};};await Promise.all([loadResultRescue(fetcher),loadResultRescue(fetcher)]);assert.equal(calls,1,'Concurrent panels must share one cached request');
// Exercise lazy loading and an actual rejected fetch without touching existing cards.
const failureRuntime=await import('../docs/result-interactions.js?failure-test');
const prior={document:globalThis.document,fetch:globalThis.fetch,observer:globalThis.IntersectionObserver};let observed,requests=0;
const status={textContent:''},cards={innerHTML:'retained public snapshot'},panel={dataset:{rescueSpecies:'dog',rescueLanguage:'ko'},isConnected:true,querySelector:s=>s==='[data-result-rescue-status]'?status:cards};
const page={dataset:{resultKey:'dog/apple',resultLanguage:'ko'},querySelectorAll:()=>[panel]};
try{
 globalThis.document={querySelector:()=>page,dispatchEvent(){},addEventListener(){}};
 globalThis.fetch=async()=>{requests++;throw Error('offline');};
 globalThis.IntersectionObserver=class{constructor(callback){observed=callback;}observe(){}disconnect(){}};
 failureRuntime.mountResultExperience();assert.equal(requests,0,'No rescue fetch before the lower section enters view');
 observed([{isIntersecting:true}]);await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(requests,1);assert.ok(status.textContent.includes('공고를 갱신하지 못했습니다'));assert.equal(cards.innerHTML,'retained public snapshot');
}finally{if(prior.document===undefined)delete globalThis.document;else globalThis.document=prior.document;globalThis.fetch=prior.fetch;if(prior.observer===undefined)delete globalThis.IntersectionObserver;else globalThis.IntersectionObserver=prior.observer;}
let count=0,totalBytes=0,priorBytes=0,maxBytes=0;
for(const pet of Object.keys(petCatalog))for(const food of foodCatalog)for(const lang of ['ko','en']){
 const key=pet+'/'+food.slug,r=getFoodRecord(key),en=lang==='en',file=lang+'/'+key+'/index.html',html=await readFile(new URL(file,docs),'utf8');
 assert.equal((html.match(/<h1>/g)||[]).length,1);assert.equal((html.match(/id="next-food"/g)||[]).length,1);assert.ok(html.includes('data-result-page'));assert.ok(html.includes(`data-verdict="${r.status}"`));assert.ok(html.includes(esc(r[lang].answer)));assert.ok(html.includes(foodStatus[r.status][lang]));
 for(const field of ['why','preparation','avoid'])assert.ok(html.includes(esc(r[lang][field])),key+' retains '+field);
 for(const ref of r.sources)assert.ok(html.includes(ref.url));
 assert.ok(html.indexOf('id="food-sources"')<html.indexOf('id="next-food"'));assert.ok(html.indexOf('id="next-food"')<html.indexOf('id="pet-next-steps"'));
 if(r.status==='danger')assert.ok(html.indexOf('result-urgent')<html.indexOf('result-overview'));
 else assert.ok(!html.includes('class="result-urgent"'));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'No duplicate IDs: '+file);
 assert.ok(html.includes('/result-experience.css?v=1'));assert.ok(html.includes(`href="https://petnyam.com/${file.replace('index.html','')}"`));
 assert.equal(html.includes('data-result-rescue data-rescue-species'),['dog','cat'].includes(pet));
 const suggestions=resultSuggestions(pet,en);assert.ok(suggestions.length<=3);
 if(!['dog','cat'].includes(pet))assert.ok(!suggestions.some(c=>/age-calculator|feed-ingredients/.test(c.href)));
 const continuation=continuationLinks(en,pet);assert.equal(continuation.length,4);assert.ok(html.indexOf('data-content-continuation')<html.indexOf('class="result-overview"'));if(r.status==='danger')assert.ok(html.indexOf('class="result-urgent"')<html.indexOf('data-content-continuation'));
 for(const link of continuation)assert.ok(html.includes(esc(link.href)));
 if(['dog','cat'].includes(pet))assert.ok(continuation.some(c=>c.kind==='age'&&c.href.endsWith('?species='+pet)));
 for(const c of suggestions){const path=c.href.split(/[?#]/)[0];await access(new URL('.'+path+'index.html',docs));}
 for(const match of html.matchAll(/href="(\/(?:ko|en|guides|foods)\/[^"<>]*)"/g)){const path=match[1].split(/[?#]/)[0];await access(new URL('.'+path+(path.endsWith('/')?'index.html':''),docs));}
 const bytes=Buffer.byteLength(html);totalBytes+=bytes;maxBytes=Math.max(maxBytes,bytes);count++;
}
const runtime=await readFile(new URL('result-interactions.js',docs),'utf8');assert.ok(runtime.includes('IntersectionObserver'));assert.ok(!/sendBeacon|XMLHttpRequest|localStorage|gtag\(|dataLayer/.test(runtime));
for(const [path,en]of [['index.html',false],['en/index.html',true]]){const home=await readFile(new URL(path,docs),'utf8');assert.ok(home.includes(homeToolLinksView(en)),'Home must show both tool links');assert.ok(home.includes('id="rescue-heading"><a href="https://www.animal.go.kr/'));assert.ok(home.includes('<h2><a href="/guides/about-petnyam'+(en?'-en':'')+'/">'));}
assert.ok(runtime.includes("fetcher('/data/rescue-animals.json'"));assert.ok(!runtime.includes('apiKey'));assert.ok(!runtime.includes('ANIMAL_'));
const baseline=JSON.parse(await readFile(new URL('../reports/result-experience-baseline.json',import.meta.url),'utf8'));priorBytes=baseline.bytes;const current=await readFile(new URL('ko/parrot/sweet-potato/index.html',docs),'utf8');
const report={checkedFoodPages:count,statusesAndSourceTextPreserved:true,uniqueIdsAndRealDestinations:true,cachedSnapshotRequests:true,tracking:'Local DOM events only; no analytics transmission added',parrotExampleBytes:{before:priorBytes,after:Buffer.byteLength(current)},averageFoodPageBytes:Math.round(totalBytes/count),maximumFoodPageBytes:maxBytes,newRuntimeBytes:Buffer.byteLength(runtime),notes:'Byte measurements are not a Core Web Vitals or real-user latency measurement. Existing AdSense remains unchanged.'};
await writeFile(new URL('../reports/result-experience-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
