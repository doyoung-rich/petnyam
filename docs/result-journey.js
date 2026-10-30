import {officialAnimals,registrationAgency,rescueCards} from './rescue-home.js?v=2';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function resultSuggestions(pet,en=false){
 const guide=(slug,ko,english,description,enDescription,icon,event='related_content',englishRoute=false)=>({href:'/guides/'+slug+(en&&englishRoute?'-en':'')+'/',title:en?english+(englishRoute?'':' (Korean)'):ko,description:en?enDescription:description,icon,event});
 const age={href:'/guides/pet-age-calculator'+(en?'-en':'')+'/?species='+pet,title:en?(pet==='dog'?'Compare your dog’s age':'Compare your cat’s age'):(pet==='dog'?'우리 강아지, 사람 나이로 몇 살일까?':'우리 고양이, 사람 나이로 몇 살일까?'),description:en?'Use the existing age chart; this is an approximate comparison.':'기존 나이 비교표로 살펴보는 대략적인 환산값입니다.',icon:'◷',event:'age_calculator'};
 const ingredient=guide('feed-ingredients','사료 원료에 어떤 성분이 있을까?','Look up an ingredient’s composition','농사로 원료 성분 검색입니다. 완제품 분석·안전 인증은 아닙니다.','Nongsaro composition data, not a finished-product analysis or safety certificate.','🥣','ingredient_search',true);
 const label=guide('processed-food-label','같은 음식명인데, 제품은 다를까요?','Same food name, different product?','양념·감미료·추가 성분을 포장지에서 확인해 보세요.','Read the whole label for added ingredients and sweeteners.','▤');
 const storage=guide('food-storage-record','사료·간식, 개봉일을 기록해 볼까요?','Keep a food storage record','제품명·제조번호·개봉일을 남기는 방법을 알아보세요.','Keep the product name, batch and opening date available.','▦');
 const meal=guide('main-meal-or-treat','이 음식, 주식과 간식 중 무엇일까요?','A main diet or a treat?','원료 하나와 영양 균형을 갖춘 주식은 구분해야 합니다.','Distinguish a single ingredient from a complete main diet.','◒');
 const checklist=guide('new-food-checklist','새 음식, 주기 전에 무엇을 볼까요?','What should you check before a new food?','동물종·손질·추가 성분을 순서대로 확인하세요.','Check species, preparation and added ingredients.','✓');
 const story=guide('about-petnyam','홍이·설이와 고양이 세 마리의 이야기','Meet the family behind PetNyam','운영자가 음식 정보를 찾아보며 펫냠을 만든 이유를 읽어보세요.','Read the owner’s story, including finding information for a relative’s hamster.','♡','related_content',true);
 if(pet==='dog')return [age,ingredient,guide('choosing-dog-food','사료를 바꾸기 전에 확인할 것은?','Before switching dog foods','추천 순위보다 급여 대상·교체 이유·변화 기록을 먼저 살펴보세요.','Start with the feeding purpose, reason for switching and observed changes.','▤')];
 if(pet==='cat')return [age,ingredient,story];
 if(pet==='rabbit')return [meal,storage,checklist];
 if(pet==='hamster')return [storage,checklist,story];
 if(pet==='parrot')return [label,meal,checklist];
 return [];
}
export function resultJourneyView(record,en=false){
 const cards=resultSuggestions(record.petKey,en);
 return `<section class="result-journey" id="pet-next-steps"><div class="result-section-heading"><span class="label">${en?'LIFE WITH YOUR PET':'검색 다음의 반려생활'}</span><h2>${en?'More to explore with your '+record.pet.en.toLowerCase():record.pet.ko+'와 더 알아보기'}</h2><p>${en?'Choose the next question that fits your situation.':'지금 궁금한 것에 맞춰 다음 질문을 골라보세요.'}</p></div><div class="result-service-grid">${cards.map(c=>`<a href="${esc(c.href)}" data-result-event="${c.event}"><span class="result-service-icon" aria-hidden="true">${c.icon}</span><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><span class="result-link-label">${en?'Explore':'자세히 보기'} →</span></a>`).join('')}</div></section>`;
}
export function sameSpeciesNotices(data,pet){
 const pattern=pet==='dog'?/^\[개\]/:pet==='cat'?/^\[고양이\]/:null;
 return pattern&&Array.isArray(data?.items)?data.items.filter(i=>pattern.test(i.kind)&&i.status==='보호중').slice(0,3):[];
}
export function resultRescueView(record,en=false,data){
 if(!['dog','cat'].includes(record.petKey))return '';
 const items=sameSpeciesNotices(data,record.petKey);
 return `<section class="result-other-services" aria-labelledby="result-other-heading"><div class="result-section-heading"><span class="label">${en?'MORE FROM PETNYAM':'펫냠에서 함께 살펴보기'}</span><h2 id="result-other-heading">${en?'Recent shelter notices':'보호동물의 최근 공고'}</h2><p>${en?'Collected public notices for this species. Check the official status; a notice does not confirm adoption availability.':'같은 동물종의 공개 공고 일부입니다. 현재 상태와 입양 가능 여부는 공식 공고에서 확인해 주세요.'}</p></div><div data-result-rescue data-rescue-species="${record.petKey}" data-rescue-language="${en?'en':'ko'}"><p class="result-rescue-time" data-result-rescue-status role="status">${data?.updatedAt?esc((en?'Snapshot: ':'자료 수집: ')+data.updatedAt):en?'Recent notices are available on the official site.':'최근 공고는 공식 사이트에서 확인할 수 있습니다.'}</p><div class="result-rescue-grid" data-result-rescue-cards>${items.length?rescueCards(items,en):`<p>${en?'No matching collected notices to show here. The official list may contain more.':'현재 수집 목록에 표시할 같은 종의 공고가 없습니다. 공식 전체 목록을 확인해 주세요.'}</p>`}</div><p class="result-rescue-source">${en?'Photos and notices: Animal Protection Information System. Collection covers only some recent notices.':'사진·공고 출처: 국가동물보호정보시스템. 최근 공고 일부를 수집하며 전국 전체 목록이 아닙니다.'} <a href="${officialAnimals}" target="_blank" rel="noopener noreferrer" data-result-event="rescue_notice">${en?'View official notices ↗':'공식 공고 보기 ↗'}</a></p></div>${record.petKey==='dog'?`<a class="result-registration" href="${registrationAgency}" target="_blank" rel="noopener noreferrer" data-result-event="registration_info"><span aria-hidden="true">⌂</span><span><strong>${en?'Need information about dog registration?':'강아지 동물등록, 어디서 하나요?'}</strong><small>${en?'Find an official agency. First registration requires a visit; no owner details are collected here.':'공식 대행기관과 방문 절차를 확인하세요. 펫냠에서는 소유자 정보를 입력받지 않습니다.'}</small></span><b aria-hidden="true">↗</b></a>`:''}</section>`;
}
