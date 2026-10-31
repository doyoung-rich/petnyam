import {sameSpeciesNotices} from './result-journey.js';
import {rescueCards} from './rescue-home.js?v=4';
import {isFoodKey} from './food-discovery-model.js';
const events=new Set(['result_view','related_food','ingredient_search','age_calculator','rescue_notice','registration_info','related_content']);
export function resultEventDetail(event,key,language){if(!events.has(event)||!isFoodKey(key)||!['ko','en'].includes(language))return null;const [species,food]=key.split('/');return {event,species,food,language};}
let snapshotPromise,snapshotAt=0;
export function loadResultRescue(fetcher=fetch){if(!snapshotPromise||Date.now()-snapshotAt>300000){snapshotAt=Date.now();snapshotPromise=fetcher('/data/rescue-animals.json',{signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{if(data.schemaVersion!==1||!Array.isArray(data.items)||!Number.isFinite(Date.parse(data.updatedAt)))throw Error();return data;}).catch(error=>{snapshotPromise=null;throw error;});}return snapshotPromise;}
const mounted=new WeakSet(),viewed=new WeakSet();let listening=false;
export function mountResultExperience(){
 const page=document.querySelector('[data-result-page]');if(!page)return;
 function emit(event){const detail=resultEventDetail(event,page.dataset.resultKey,page.dataset.resultLanguage);if(detail)document.dispatchEvent(new CustomEvent('petnyam:interaction',{detail}));}
 // Local DOM events only: no automatic storage, console logging or network analytics.
 if(!viewed.has(page)){viewed.add(page);emit('result_view');}
 if(!listening){listening=true;document.addEventListener('click',async event=>{const current=document.querySelector('[data-result-page]');if(!current)return;const action=event.target.closest?.('[data-result-share],[data-result-copy]');if(action){const en=current.dataset.resultLanguage==='en',feedback=current.querySelector('[data-result-share-feedback]'),url=location.origin+location.pathname;try{if(action.hasAttribute('data-result-share')&&navigator.share){await navigator.share({title:document.title,url});feedback.textContent=en?'Sharing completed.':'공유했습니다.';}else{await navigator.clipboard.writeText(url);feedback.textContent=en?'Link copied.':'링크를 복사했습니다.';}}catch(error){feedback.textContent=error.name==='AbortError'?'':en?'Could not share or copy. Copy the address from your browser.':'공유·복사를 완료하지 못했습니다. 브라우저 주소를 복사해 주세요.';}return;}const link=event.target.closest?.('[data-result-event]');if(!link)return;const detail=resultEventDetail(link.dataset.resultEvent,current.dataset.resultKey,current.dataset.resultLanguage);if(detail)document.dispatchEvent(new CustomEvent('petnyam:interaction',{detail}));});}
 for(const panel of page.querySelectorAll('[data-result-rescue]')){
  if(mounted.has(panel))continue;mounted.add(panel);
  const refresh=()=>loadResultRescue().then(data=>{
   if(!panel.isConnected)return;const en=panel.dataset.rescueLanguage==='en',rows=sameSpeciesNotices(data,panel.dataset.rescueSpecies),cards=panel.querySelector('[data-result-rescue-cards]'),status=panel.querySelector('[data-result-rescue-status]');
   cards.innerHTML=rows.length?rescueCards(rows,en):`<p>${en?'No matching notices in this collected snapshot; check the official list.':'수집 목록에 같은 종의 공고가 없습니다. 공식 전체 목록을 확인해 주세요.'}</p>`;
   const time=new Date(data.updatedAt).toLocaleString(en?'en-GB':'ko-KR',{timeZone:'Asia/Seoul'}),stale=Date.now()-Date.parse(data.updatedAt)>86400000;
   status.textContent=(en?`Collected ${time} KST. `:`${time} 수집. `)+(stale?(en?'Update delayed; check the official source.':'갱신이 지연되었습니다. 공식 최신 공고를 확인해 주세요.'):(en?'Verify the latest status on the official site.':'최신 상태는 공식 공고에서 확인해 주세요.'));
   cards.querySelectorAll('a').forEach(a=>a.dataset.resultEvent='rescue_notice');
  }).catch(()=>{panel.querySelector('[data-result-rescue-status]').textContent=panel.dataset.rescueLanguage==='en'?'Could not refresh. Retained any displayed snapshot; check the official list.':'공고를 갱신하지 못했습니다. 표시된 자료가 있으면 이전 수집본이며, 공식 최신 공고를 확인해 주세요.';});
  if(typeof IntersectionObserver==='undefined')refresh();else{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();refresh();}},{rootMargin:'200px'});observer.observe(panel);}
 }
}
