import {officialAnimals} from './rescue-home.js?v=3';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function continuationLinks(en=false,pet=''){
 const suffix=en?'-en':'',ageQuery=['dog','cat'].includes(pet)?'?species='+pet:'';
 return [
  {kind:'rescue',icon:'⌂',title:en?'Looking for a missing family member?':'잃어버린 가족을 찾고 계신가요?',description:en?'Browse official rescue and shelter notices by region.':'지역별 구조·보호 공고에서 확인해 보세요.',cta:en?'Open official notices ↗':'공식 보호동물 공고 보기 ↗',href:officialAnimals,external:true,event:'rescue_notice'},
  {kind:'story',icon:'♡',title:en?'An apple, five pets—why did I build PetNyam?':'사과 한 조각이 궁금해서, 펫냠까지 만들었다고요?',description:en?'Meet Hong-i, Seol-i and three cats in the owner’s real story.':'홍이·설이와 고양이 세 마리, 보호자의 실제 이야기를 만나보세요.',cta:en?'Read the family story →':'함께 사는 이야기 읽기 →',href:'/guides/about-petnyam'+suffix+'/',event:'related_content'},
  {kind:'age',icon:'◷',title:en?'Could your pet be older than you?':'우리 아이, 나보다 나이가 많을까?',description:en?'Compare dog and cat ages in human years; care notes for other pets.':'강아지·고양이 사람 나이 비교와 다른 동물의 나이 안내를 확인하세요.',cta:en?'Open the pet age calculator →':'동물 나이 계산기 바로가기 →',href:'/guides/pet-age-calculator'+suffix+'/'+ageQuery,event:'age_calculator'},
  {kind:'ingredients',icon:'🥣',title:en?'Pet food ingredients—what is in them?':'반려동물 사료 원료, 어떤 성분이 있을까?',description:en?'Search Nongsaro composition data. Feeding suitability is a separate question.':'농사로 원료 성분 자료를 찾아보세요. 급여 가능 여부와는 별개입니다.',cta:en?'Search Nongsaro ingredients →':'농사로 원료 검색 바로가기 →',href:'/guides/feed-ingredients'+suffix+'/',event:'ingredient_search'}
 ];
}
function tile(c,en){return `<a class="continuation-tile continuation-${c.kind}" href="${esc(c.href)}" data-result-event="${c.event}"${c.external?' target="_blank" rel="noopener noreferrer"':''}><span class="continuation-icon" aria-hidden="true">${c.icon}</span><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><span class="continuation-cta">${esc(c.cta)}</span></a>`;}
export function contentContinuationView(en=false,pet=''){return `<section class="content-continuation" data-content-continuation aria-labelledby="continuation-heading"><div class="continuation-heading"><span class="label">${en?'CONTINUE EXPLORING':'이어서 만나는 펫냠'}</span><h2 id="continuation-heading">${en?'What else would you like to know about life with pets?':'우리 아이와 사는 이야기, 더 궁금하지 않으세요?'}</h2></div><div class="continuation-grid">${continuationLinks(en,pet).map(c=>tile(c,en)).join('')}</div></section>`;}
export function homeToolLinksView(en=false){return `<div class="home-tool-links" data-home-tools>${continuationLinks(en).filter(c=>['age','ingredients'].includes(c.kind)).map(c=>tile(c,en)).join('')}</div>`;}
