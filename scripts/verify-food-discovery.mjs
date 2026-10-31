import {resolveConsolidatedHref} from '../docs/content-consolidation.js';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
import {getFoodRecord,foodStatus} from '../docs/food-page-content.js';
import {savedFoodsKey,parseSavedFoods,changeSavedFoods,findNextFoods} from '../docs/food-discovery-model.js';
import {foodDiscoveryCards} from '../docs/food-discovery-view.js';
import {mountFoodDiscovery} from '../docs/food-discovery.js';
const read=path=>readFile(new URL('../docs/'+path,import.meta.url),'utf8');

assert.deepEqual(parseSavedFoods('not json'),[]);
assert.deepEqual(parseSavedFoods('{"dog":"apple"}'),[]);
assert.deepEqual(parseSavedFoods('["dog/apple","dog/apple","__proto__/apple","constructor/apple","dog/../../x","<script>/apple",42,"cat/mango"]'),['dog/apple','cat/mango']);
let saved=[];
for(const food of foodCatalog.slice(0,8))saved=changeSavedFoods(saved,'dog/'+food.slug);
assert.equal(saved.length,8);assert.throws(()=>changeSavedFoods(saved,'cat/apple'));
assert.equal(changeSavedFoods(saved,'dog/apple').length,7);
assert.throws(()=>changeSavedFoods(saved,'__proto__/apple'));
assert.deepEqual(findNextFoods('rabbit','바 나 나'),['rabbit/banana']);
assert.deepEqual(findNextFoods('cat','MANGO'),['cat/mango']);
assert.deepEqual(findNextFoods('dog','sweet potato'),['dog/sweet-potato']);
assert.deepEqual(findNextFoods('dog','<script>'),[]);
assert.deepEqual(findNextFoods('__proto__','apple'),[]);
for(const pet of Object.keys(petCatalog))for(const food of foodCatalog){
 const next=findNextFoods(pet,'',food.slug);assert.equal(next.length,4);
 assert.ok(!next.includes(pet+'/'+food.slug));assert.ok(next.every(key=>key.startsWith(pet+'/')&&getFoodRecord(key)));
}
const cards=foodDiscoveryCards(findNextFoods('rabbit','banana').map(getFoodRecord),false,foodStatus);
assert.ok(cards.includes('/ko/rabbit/banana/'));assert.ok(cards.includes(foodStatus[getFoodRecord('rabbit/banana').status].ko));

// Exercise actual event handlers: searching, species switching, explicit saving,
// blocked storage, clearing and restoring the same saved list on revisit.
const listeners={},storage=new Map();let blocked=false;
class Element {
 constructor(){this.dataset={};this.attrs={};this.children=[];this.handlers={};this.hidden=false;this.textContent='';}
 setAttribute(key,value){this.attrs[key]=value;} hasAttribute(key){return Object.hasOwn(this.attrs,key);}
 append(...children){this.children.push(...children);}replaceChildren(){this.children=[];}
 addEventListener(name,handler){this.handlers[name]=handler;}
}
const saveButton=new Element();saveButton.dataset.saveFood='dog/apple';
const feedback=new Element(),list=new Element(),shelf=new Element();shelf.dataset.savedLanguage='ko';
shelf.querySelector=selector=>selector==='[data-saved-list]'?list:null;
const pet=new Element(),query=new Element(),results=new Element(),count=new Element(),form=new Element();pet.value='dog';query.value='';
form.elements={namedItem(name){return name==='pet'?pet:query;}};
const root=new Element();root.dataset={foodLanguage:'ko',foodKey:'dog/apple'};
root.querySelector=selector=>({'[data-next-food-form]':form,'[data-next-food-results]':results,'[data-next-food-count]':count}[selector]);
globalThis.window={localStorage:{getItem:key=>storage.get(key)||null,setItem(key,value){if(blocked)throw Error('blocked');storage.set(key,value);},removeItem:key=>storage.delete(key)},addEventListener(){}};
globalThis.document={documentElement:{lang:'ko'},querySelector:()=>null,
 querySelectorAll:selector=>({'[data-save-food]':[saveButton],'[data-save-feedback]':[feedback],'[data-saved-shelf]':[shelf],'[data-food-discovery]':[root]}[selector]||[]),
 createElement:()=>new Element(),addEventListener(name,handler){listeners[name]=handler;}};
const click=button=>listeners.click({target:{closest:()=>button}});
try{
 mountFoodDiscovery();assert.equal(storage.size,0,'No automatic saving on page view');assert.equal(shelf.hidden,true);assert.equal(form.hidden,false);
 query.value='바나나';query.handlers.input();assert.ok(results.innerHTML.includes('/ko/dog/banana/'));
 pet.value='rabbit';pet.handlers.change();assert.ok(results.innerHTML.includes('/ko/rabbit/banana/'));assert.ok(!results.innerHTML.includes('/ko/dog/'));
 form.handlers.submit({preventDefault(){}});
 click(saveButton);assert.deepEqual(parseSavedFoods(storage.get(savedFoodsKey)),['dog/apple']);assert.equal(saveButton.attrs['aria-pressed'],'true');assert.equal(shelf.hidden,false);
 assert.equal(list.children[0].children[0].href,'/ko/dog/apple/');
 mountFoodDiscovery();assert.equal(list.children.length,1,'Revisit restores existing saved foods without duplicates');
 click(saveButton);assert.deepEqual(parseSavedFoods(storage.get(savedFoodsKey)),[]);assert.equal(shelf.hidden,true);
 blocked=true;click(saveButton);assert.equal(saveButton.attrs['aria-pressed'],'false');assert.ok(feedback.textContent.includes('저장하지 못했습니다'));blocked=false;
 click(saveButton);const clear=new Element();clear.attrs['data-saved-clear']='';click(clear);assert.equal(storage.has(savedFoodsKey),false);
}finally{delete globalThis.window;delete globalThis.document;}

for(const lang of ['ko','en'])for(const pet of Object.keys(petCatalog))for(const food of foodCatalog){
 const html=await read(`${lang}/${pet}/${food.slug}/index.html`);
 if(html.includes('name="petnyam-consolidated-from"'))continue;
 assert.ok(html.includes('data-food-discovery'));assert.ok(html.includes(`data-save-food="${pet}/${food.slug}"`));
 assert.ok(html.includes('data-next-food-form hidden'),'No broken non-JS search form');
 for(const key of findNextFoods(pet,'',food.slug))assert.ok(html.includes(`href="${resolveConsolidatedHref(`/${lang}/${key}/`)}"`),'Static discovery links must work without JS');
}
for(const file of ['index.html','en/index.html'])assert.ok((await read(file)).includes('data-saved-shelf'));
const privacy=await read('policy/privacy/index.html');assert.ok(privacy.includes('localStorage'));assert.ok(privacy.includes('2026년 10월 31일'));
const apple=await read('ko/dog/apple/index.html');assert.ok(apple.includes('food-questions'));assert.ok(apple.includes('씨와 심은 왜 따로 빼나요?'));
const runtime=await read('food-discovery.js');assert.ok(!/fetch\(|sendBeacon|XMLHttpRequest/.test(runtime));
console.log('Food discovery verified: 434 detailed bilingual pages plus 66 consolidated entry routes, species-specific search, explicit local saves, revisit, limit, corrupt/blocked storage, static links, apple questions and privacy.');
