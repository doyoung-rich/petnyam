import {getFoodRecord,foodStatus} from './food-page-content.js?v=14';
import {petCatalog} from './food-page-catalog.js';
import {savedFoodsKey,savedFoodsLimit,parseSavedFoods,changeSavedFoods,findNextFoods} from './food-discovery-model.js';
import {foodDiscoveryCards,savedFoodsView} from './food-discovery-view.js?v=3';
import {findExtraFoods,extraFoodLinksView} from './extra-food-index.js?v=1';
const mounted=new WeakSet();
let listening=false;
const isEnglish=()=>document.documentElement.lang==='en';
function readSaved(){try{return parseSavedFoods(window.localStorage.getItem(savedFoodsKey));}catch{return [];}}
function feedback(message){document.querySelectorAll('[data-save-feedback]').forEach(node=>{node.textContent=message;});}
export function refreshSavedFoods(){
 const saved=readSaved();
 document.querySelectorAll('[data-save-food]').forEach(button=>{
  const active=saved.includes(button.dataset.saveFood),en=isEnglish();
  button.hidden=false;button.setAttribute('aria-pressed',String(active));
  button.textContent=active?(en?'✓ Saved · remove':'✓ 저장됨 · 해제'):(en?'Save this food':'이 음식 저장');
 });
 document.querySelectorAll('[data-saved-shelf]').forEach(shelf=>{
  const en=shelf.dataset.savedLanguage==='en',lang=en?'en':'ko',list=shelf.querySelector('[data-saved-list]');
  list.replaceChildren();shelf.hidden=saved.length===0;
  for(const key of saved){
   const record=getFoodRecord(key),item=document.createElement('li'),link=document.createElement('a'),remove=document.createElement('button');
   link.href=`/${lang}/${key}/`;link.textContent=`${record.pet.emoji} ${record.pet[lang]} · ${record.food.emoji} ${record.food[lang]}`;
   remove.type='button';remove.dataset.removeSaved=key;remove.textContent='×';
   remove.setAttribute('aria-label',(en?'Remove saved food: ':'저장 해제: ')+record.pet[lang]+' '+record.food[lang]);
   item.append(link,remove);list.append(item);
  }
 });
}
function writeSaved(saved){window.localStorage.setItem(savedFoodsKey,JSON.stringify(saved));}
function bindDiscovery(root){
 if(mounted.has(root))return;mounted.add(root);
 const en=root.dataset.foodLanguage==='en',currentSlug=root.dataset.foodKey.split('/')[1];
 const form=root.querySelector('[data-next-food-form]'),pet=form.elements.namedItem('pet'),query=form.elements.namedItem('food');
 const results=root.querySelector('[data-next-food-results]'),count=root.querySelector('[data-next-food-count]');
 function update(event){
  event?.preventDefault();
  const keys=findNextFoods(pet.value,query.value,currentSlug),extras=findExtraFoods(pet.value,query.value);
  results.innerHTML=foodDiscoveryCards(keys.map(getFoodRecord),en,foodStatus)+extraFoodLinksView(extras,en);
  const animal=petCatalog[pet.value]?.[en?'en':'ko']||'';
  const total=keys.length+extras.length;count.textContent=total?(en?`${animal} · ${total} results. Open a result for preparation and cautions.`:`${animal} · ${total}개 결과 · 눌러서 이유와 손질 조건을 확인하세요.`):(en?'No match. Try an ingredient such as apple, or browse all foods.':'일치하는 음식이 없습니다. 재료 이름으로 검색하거나 전체 목록을 확인하세요.');
 }
 form.hidden=false;form.addEventListener('submit',update);query.addEventListener('input',update);pet.addEventListener('change',update);
}
export function mountFoodDiscovery(){
 if(typeof document==='undefined')return;
 const hero=document.querySelector('#app .hero');
 if(hero&&!document.querySelector('[data-saved-shelf]'))hero.insertAdjacentHTML('afterend',savedFoodsView(isEnglish()));
 document.querySelectorAll('[data-food-discovery]').forEach(bindDiscovery);
 refreshSavedFoods();
 if(listening)return;listening=true;
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-save-food],[data-remove-saved],[data-saved-clear]');
  if(!button)return;
  const en=isEnglish();
  try{
   const saved=readSaved();
   if(button.hasAttribute('data-saved-clear')){
    window.localStorage.removeItem(savedFoodsKey);refreshSavedFoods();feedback(en?'Saved list cleared.':'저장 목록을 비웠습니다.');return;
   }
   const key=button.dataset.saveFood||button.dataset.removeSaved,removing=Boolean(button.dataset.removeSaved);
   if(!removing&&!saved.includes(key)&&saved.length>=savedFoodsLimit){feedback(en?'You can save up to 8 foods. Remove one first.':'최대 8개까지 저장할 수 있습니다. 기존 음식 하나를 해제해 주세요.');return;}
   const next=removing?saved.filter(item=>item!==key):changeSavedFoods(saved,key);writeSaved(next);refreshSavedFoods();
   feedback(next.includes(key)?(en?'Saved in this browser. Find it here or on the homepage.':'이 브라우저에 저장했습니다. 이 페이지와 홈에서 다시 볼 수 있어요.'):(en?'Removed from saved foods.':'저장 목록에서 해제했습니다.'));
  }catch{feedback(en?'Browser storage is unavailable. Nothing was saved.':'브라우저 저장 공간을 사용할 수 없어 저장하지 못했습니다.');}
 });
 window.addEventListener('storage',event=>{if(event.key===savedFoodsKey||event.key===null)refreshSavedFoods();});
}
