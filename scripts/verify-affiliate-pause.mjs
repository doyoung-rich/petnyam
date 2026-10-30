import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url),docs=new URL('docs/',root);
const settings=JSON.parse(await readFile(new URL('site-static/affiliate-settings.json',root),'utf8'));
assert.equal(settings.enabled,false,'This check is for the paused configuration');
for(const file of ['docs/convenience.js','site-static/convenience.js']){
 const js=await readFile(new URL(file,root),'utf8');
 assert.ok(js.includes('const affiliateDisplayEnabled=false;'));
 assert.ok(!/https?:[^\s"'`]*(?:amazon|coupang)/i.test(js),'No public product catalog URLs while paused');
 assert.ok(js.includes('if(!affiliateDisplayEnabled)'));
 const start=js.indexOf('async function refreshConvenience(){'),end=js.indexOf('new MutationObserver',start);
 assert.ok(start>=0&&end>start);
 let created=0,removed=0;
 const input={},form={},results={};
 const dock={innerHTML:'',querySelector:selector=>selector==='input'?input:selector==='form'?form:results};
 const context={affiliateDisplayEnabled:false,clearInterval(){},carouselTimer:undefined,en:false,topButton:{setAttribute(){}},dock,
  document:{querySelector:()=>({}),querySelectorAll:()=>[{remove(){removed++;}}],createElement(){created++;throw Error('Shopping element created while paused');}}};
 await runInNewContext(js.slice(start,end)+'\nrefreshConvenience()',context);
 assert.equal(created,0);assert.equal(removed,1);assert.equal(typeof form.onsubmit,'function');
}
const products=JSON.parse(await readFile(new URL('coupang-products.json',docs),'utf8'));
assert.equal(products.affiliateDisplay,'paused');assert.deepEqual(products.products,[]);
let pages=0;
for(const file of await readdir(docs,{recursive:true})){
 if(!file.endsWith('.html'))continue;
 const html=await readFile(new URL(file.replaceAll('\\','/'),docs),'utf8');
 assert.ok(!/href=["'][^"']*(?:link\.coupang|link\.amazon|amazon\.com\/dp)/i.test(html));
 if(html.includes('convenience.js')){assert.ok(html.includes('convenience.js?v=9'));pages++;}
}
const home=await readFile(new URL('index.html',docs),'utf8');
assert.ok(home.includes('index,follow'));assert.ok(!home.includes('noindex'));
const ads=await readFile(new URL('ads.txt',docs),'utf8');assert.ok(ads.includes('pub-2911341623586356'));
console.log(`Paused affiliate runtime and payload verified across ${pages} page entry points; search controls and indexing retained.`);
