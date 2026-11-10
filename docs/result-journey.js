import {officialAnimals} from './rescue-home.js?v=3';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function resultSuggestions(pet,en=false){
 const guide=(slug,ko,english,description,enDescription,icon,event='related_content',englishRoute=false)=>({href:'/guides/'+slug+(en&&englishRoute?'-en':'')+'/',title:en?english+(englishRoute?'':' (Korean)'):ko,description:en?enDescription:description,icon,event});
 const label=guide('processed-food-label','같은 음식명인데, 제품은 다를까요?','Same food name, different product?','양념·감미료·추가 성분을 포장지에서 확인해 보세요.','Read the whole label for added ingredients and sweeteners.','▤');
 const storage=guide('food-storage-record','사료·간식, 개봉일을 기록해 볼까요?','Keep a food storage record','제품명·제조번호·개봉일을 남기는 방법을 알아보세요.','Keep the product name, batch and opening date available.','▦');
 const meal=guide('main-meal-or-treat','이 음식, 주식과 간식 중 무엇일까요?','A main diet or a treat?','원료 하나와 영양 균형을 갖춘 주식은 구분해야 합니다.','Distinguish a single ingredient from a complete main diet.','◒');
 const checklist=guide('new-food-checklist','새 음식, 주기 전에 무엇을 볼까요?','What should you check before a new food?','동물종·손질·추가 성분을 순서대로 확인하세요.','Check species, preparation and added ingredients.','✓');
 if(pet==='dog')return [label,storage,guide('choosing-dog-food','사료를 바꾸기 전에 확인할 것은?','Before switching dog foods','추천 순위보다 급여 대상·교체 이유·변화 기록을 먼저 살펴보세요.','Start with the feeding purpose, reason for switching and observed changes.','▤')];
 if(pet==='cat')return [label,storage,meal];
 if(pet==='rabbit')return [meal,storage,checklist];
 if(pet==='hamster')return [storage,checklist,meal];
 if(pet==='parrot')return [label,meal,checklist];
 return [];
}
export function resultJourneyView(record,en=false){
 const cards=resultSuggestions(record.petKey,en);
 return `<nav class="result-journey" id="pet-next-steps" aria-label="${en?'Related practical guides':'함께 읽을 실용 가이드'}"><h2>${en?'Related guides':'함께 읽으면 좋은 안내'}</h2><ul>${cards.map(c=>`<li><a href="${esc(c.href)}" data-result-event="${c.event}">${esc(c.title)} →</a></li>`).join('')}</ul></nav>`;
}
export function sameSpeciesNotices(data,pet){
 const pattern=pet==='dog'?/^\[개\]/:pet==='cat'?/^\[고양이\]/:null;
 return pattern&&Array.isArray(data?.items)?data.items.filter(i=>pattern.test(i.kind)&&i.status==='보호중').slice(0,3):[];
}
export function resultRescueView(record,en=false){
 if(!['dog','cat'].includes(record.petKey))return '';
 return `<p class="result-rescue-compact" data-result-compact-rescue><a href="${en?'/en/':'/'}#rescue-heading">${en?'Browse collected shelter notices on the homepage':'지역별 보호동물 공고는 메인에서 살펴보세요'} →</a> · <a href="${officialAnimals}" target="_blank" rel="noopener noreferrer" data-result-event="rescue_notice">${en?'Official complete list ↗':'공식 전체 목록 ↗'}</a></p>`;
}
