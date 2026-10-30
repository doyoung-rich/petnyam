import {featureArticles} from './feature-articles.js';
import {siteTitles} from './title-strategy.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=name=>'/images/guides/'+name+'.svg';
const basics=[
 ['food-emergency','이미 먹었다면 제품·양·시각과 현재 상태를 정리하고 병원에 전달하세요.','emergency'],
 ['read-a-verdict','가능·주의·금지·정보 부족의 차이와 판정의 범위를 읽어보세요.','safety'],
 ['new-food-checklist','동물종·손질·추가 성분을 확인하는 새 음식 체크리스트입니다.','safety'],
 ['processed-food-label','원재료 이름이 같아도 제품은 다를 수 있어요. 성분표에서 확인할 항목을 살펴보세요.','label'],
 ['xylitol-product-check','무설탕 제품의 성분표에서 자일리톨을 확인하는 순서를 정리했습니다.','label'],
 ['main-meal-or-treat','주식과 간식의 용도, 포장지의 영양 적합성 표시를 구분해 보세요.','bowl'],
 ['food-storage-record','사료·간식의 포장지와 제조번호, 개봉일을 어떻게 기록할지 알아보세요.','record'],
 ['changing-foods-safely','제품과 식단이 달라진 점, 식욕·배변·활동 변화를 기록해 보세요.','record']
].map(([slug,description,cover])=>({route:'/guides/'+slug+'/',title:siteTitles['/guides/'+slug+'/'],description,image:asset(cover),category:'음식·안전 가이드'}));
const feature=(route,a)=>{
 let cover='care',category=a.lang==='en'?'English guide':'견종 이야기';
 if(route.includes('calculator')){cover='calculator';category=a.lang==='en'?'Calculator':'계산기';}
 if(route.includes('roulette')){cover='play';category='놀이·기록';}
 if(route.includes('food')){cover='bowl';category=a.lang==='en'?'Food guide':'음식·생활 가이드';}
 if(a.category==='food-expanded'){cover=route.includes('fruit')?'kiwi':'bowl';category=a.lang==='en'?'Detailed food guide':'과일·고기 상세 안내';} if(a.category==='ingredients'){cover='bowl';category=a.lang==='en'?'Ingredient search':'농사로 원료 검색';} if(a.category==='travel'){cover='travel';category=a.lang==='en'?'Dog-friendly outings':'반려동물과 가기 좋은 곳';} if(a.category==='food'){cover=route.includes('raspberries')?'raspberry':'kiwi';category=a.lang==='en'?'Food question':'새로운 음식 질문';} const image=route.includes('about-petnyam')?'/images/owner/hong-apple.webp':route.includes('pet-age-calculator')?'/images/owner/seol-apple.webp':route.includes('pet-treat-cost-calculator')?'/images/owner/leon-mini.webp':asset(cover);
 return {route,title:a.title,description:a.description,image,category,kind:a.category,lang:a.lang};
};
const card=c=>`<a class="guide-tile" href="${c.route}"${c.lang?` lang="${c.lang}"`:''}><div class="guide-tile-cover"><img src="${c.image}" alt="" width="800" height="500" loading="lazy" decoding="async"></div><div class="guide-tile-copy"><span class="guide-category">${esc(c.category)}</span><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><span class="guide-read">${c.lang==='en'?'Read guide →':'자세히 보기 →'}</span></div></a>`;
const section=(id,title,description,cards)=>`<section class="guide-group" id="${id}" aria-labelledby="${id}-heading"><div class="guide-group-heading"><h2 id="${id}-heading">${title}</h2><p>${description}</p></div><div class="guide-tile-grid">${cards.map(card).join('')}</div></section>`;
export function guideLibraryView(){
 const entries=Object.entries(featureArticles).map(([route,a])=>feature(route,a));
 const ko=entries.filter(c=>c.lang==='ko'&&!c.route.includes('about-petnyam'));
 const tools=ko.filter(c=>/calculator|roulette/.test(c.route));
 const stories=ko.filter(c=>c.route.includes('coton'));
 const travel=ko.filter(c=>c.kind==='travel'); const food=ko.filter(c=>!tools.includes(c)&&!stories.includes(c)&&!travel.includes(c));
 return `<div class="guide-library"><div class="guide-library-intro"><span class="guide-kicker">PETNYAM GUIDES</span><h1>${esc(siteTitles['/guides/'])}</h1><p>궁금한 주제의 대표 이미지를 눌러보세요. 보호자의 이야기부터 음식 안내와 생활 계산기까지 한곳에 모았습니다.</p><nav class="guide-library-nav" aria-label="가이드 주제"><a href="#guide-tools">계산기·생활 도구</a><a href="#guide-food">음식·안전</a><a href="#guide-travel">동반 나들이</a><a href="#guide-stories">견종 이야기</a><a href="#guide-english">English</a></nav></div><a class="guide-spotlight" href="/guides/about-petnyam/"><div class="guide-spotlight-image"><img src="/images/owner/hong-apple.webp" alt="사과에 가까이 다가온 보스턴테리어 홍이" width="960" height="1280" fetchpriority="high"></div><div class="guide-spotlight-copy"><span class="guide-kicker">다섯 아이의 보호자가 만드는 곳</span><h2>홍이·설이, 그리고 고양이 세 마리.<br>제가 펫냠을 운영하는 이유</h2><p>사과를 먹여도 될까 궁금했던 순간과 처제의 햄스터 정보를 찾던 경험에서 펫냠이 시작됐습니다. 직접 전한 이야기와 사진을 만나보세요.</p><span class="guide-spotlight-read">운영자 이야기 읽기 →</span></div></a>${section('guide-tools','직접 써보는 계산기·생활 도구','나이를 비교하고, 비용을 계산하고, 놀이 후보를 살펴보세요.',tools)}${section('guide-food','음식·안전 가이드','음식 이름만으로 판단하기 어려울 때, 무엇을 확인할지 알려드려요.',[...food,...basics])}${section('guide-travel','반려동물과 가기 좋은 곳','공식 동반 규정으로 살펴보는 전국 나들이 안내입니다.',travel)}${section('guide-stories','견종 이야기','성격과 생활, 함께 살기 전에 확인할 내용을 읽어보세요.',stories)}<section class="guide-group" id="guide-english" aria-labelledby="guide-english-heading"><h2 id="guide-english-heading">English guides</h2><details class="guide-language-list"><summary>영어 가이드 펼쳐보기 · Browse English guides</summary><div class="guide-tile-grid">${entries.filter(c=>c.lang==='en').map(card).join('')}</div></details></section><aside class="guide-library-footer"><strong>음식 이름으로 바로 찾고 싶다면</strong><a href="/foods/">동물별 음식 목록 보기 →</a></aside></div>`;
}
