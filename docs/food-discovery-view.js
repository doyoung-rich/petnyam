import {petCatalog} from './food-page-catalog.js';
export const escapeFoodHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function foodDiscoveryCards(records,english,statuses){
 const lang=english?'en':'ko';
 return records.map(r=>`<a class="next-food-card" href="/${lang}/${r.key}/"><span class="next-food-emoji" aria-hidden="true">${r.food.emoji}</span><span><strong>${escapeFoodHtml(r.food[lang])}</strong><span class="next-food-status" style="color:${statuses[r.status].color};background:${statuses[r.status].background}">${statuses[r.status][lang]}</span></span><span aria-hidden="true">→</span></a>`).join('');
}
export function savedFoodsView(english=false){
 return `<section class="saved-foods" data-saved-shelf data-saved-language="${english?'en':'ko'}" hidden><div class="saved-foods-heading"><h2>${english?'Your saved foods':'저장한 음식'}</h2><button type="button" data-saved-clear>${english?'Clear list':'목록 비우기'}</button></div><p>${english?'Saved only in this browser. Open a food to check the current guidance again.':'이 브라우저에만 저장됩니다. 다시 열어 현재 설명과 조건을 확인하세요.'}</p><ul data-saved-list></ul></section>`;
}
export function foodDiscoveryView(record,candidates,english,statuses){
 const lang=english?'en':'ko';
 return `<section class="food-discovery" id="next-food" data-food-discovery data-food-key="${record.key}" data-food-language="${lang}"><div class="label">${english?'KEEP CHECKING':'다음 음식도 확인해요'}</div><h2>${english?'What else is on your pet’s menu?':'다른 음식도 궁금하세요?'}</h2><p>${english?'Compare the preparation and cautions for each food. Foods shown together are not a recommended meal or a list of safe substitutes.':'같은 동물 기준으로 다음 음식의 손질법과 주의사항을 확인하세요. 함께 표시된 음식이 추천 식단이나 안전한 대체 간식 목록이라는 뜻은 아닙니다.'}</p><form class="next-food-form" role="search" data-next-food-form hidden><label>${english?'Animal':'반려동물'}<select name="pet">${Object.entries(petCatalog).map(([key,pet])=>`<option value="${key}"${key===record.petKey?' selected':''}>${pet.emoji} ${pet[lang]}</option>`).join('')}</select></label><label>${english?'Food name':'음식 이름'}<input name="food" type="search" autocomplete="off" placeholder="${english?'Try banana or milk':'예: 바나나, 우유'}"></label><button type="submit">${english?'Find':'찾기'}</button></form><p class="next-food-count" data-next-food-count aria-live="polite">${english?record.pet.en+' · More foods to check':record.pet.ko+' · 이어서 확인할 음식'}</p><div class="next-food-grid" data-next-food-results>${foodDiscoveryCards(candidates,english,statuses)}</div><p><a href="/foods/">${english?'Browse every food (Korean directory)':'동물별 음식 목록 전체 보기'} →</a> · <a href="/guides/pet-treat-cost-calculator/">${english?'Compare treat costs (Korean)':'간식 비용 비교 계산기'} →</a></p>${savedFoodsView(english)}</section>`;
}
export function quickFoodSaveView(key,english){
 return `<div class="food-quick-actions"><a href="#next-food">${english?'Check another food':'다른 음식 이어서 찾기'} ↓</a><button type="button" data-save-food="${key}" aria-pressed="false" hidden>${english?'Save this food':'이 음식 저장'}</button><span class="food-save-feedback" data-save-feedback role="status"></span></div>`;
}
