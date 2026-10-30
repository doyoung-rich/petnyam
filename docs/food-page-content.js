import {foodCatalog, petCatalog} from './food-page-catalog.js';
import {rabbitFoodExplanations} from './rabbit-food-explanations.js';
import {dogCatFoodExplanations} from './dog-cat-food-explanations.js?v=10';
import {smallPetFoodExplanations} from './small-pet-food-explanations.js?v=10';
import {priorityContent} from './priority-content.js';
import {findNextFoods} from './food-discovery-model.js';
import {foodDiscoveryView,quickFoodSaveView} from './food-discovery-view.js?v=2';
import {foodTitle,titleWithBrand} from './title-strategy.js?v=1';
import {resultJourneyView,resultRescueView} from './result-journey.js';

export const foodUpdated = '2026-10-07';
const explanations = {...dogCatFoodExplanations, rabbit:rabbitFoodExplanations, ...smallPetFoodExplanations};
export const foodStatus = {
 safe:{ko:'손질 후 소량 가능',en:'Small prepared portions',shortKo:'소량 가능',shortEn:'Small treat',color:'#12624f',background:'#e8f7f1'},
 caution:{ko:'조건 확인 · 주의',en:'Check conditions first',shortKo:'조건·주의',shortEn:'Caution',color:'#805000',background:'#fff5d8'},
 danger:{ko:'급여하지 마세요',en:'Do not feed',shortKo:'주지 마세요',shortEn:'Do not feed',color:'#a92d35',background:'#fff0f0'},
 unknown:{ko:'확인 전 급여 보류',en:'Wait for species-specific advice',shortKo:'확인 필요',shortEn:'Check first',color:'#475362',background:'#eef1f4'}
};
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = value => Array.isArray(value) ? value.join(' ') : value;
export function getFoodRecord(key) {
 const [petKey,slug] = key.split('/');
 const food = foodCatalog.find(item=>item.slug===slug), pet = petCatalog[petKey];
 if(!food || !pet) return null;
 const record = explanations[petKey]?.[slug];
 if(!record) throw new Error(`Missing food explanation: ${key}`);
 return {...record,pet,food,key,petKey};
}
export function foodPageMeta(key,english=false) {
 const record=getFoodRecord(key); if(!record)return null;
 return {title:titleWithBrand(foodTitle(record,english)),description:text(record[english?'en':'ko'].answer)};
}
function section(id,title,body) {
 return `<section class="info food-explanation food-step" id="${id}"><h2>${title}</h2><p>${escape(text(body))}</p></section>`;
}
export function foodArticle(key,english=false) {
 const r=getFoodRecord(key); if(!r)return '';
 const c=r[english?'en':'ko'], lang=english?'en':'ko', p=priorityContent[key], pc=p?.[lang];
 const updatedNotice=english?`Content updated: ${r.updated||foodUpdated}. AI-assisted editorial information, not veterinary review or a personalized feeding prescription.`:`본문 업데이트: ${r.updated||foodUpdated}. AI 보조로 정리한 일반 정보이며 수의사 감수나 개별 급여 처방을 뜻하지 않습니다.`;
 const evidence={direct:english?'Food and species named in source':'음식·동물종이 자료에 명시됨',category:english?'Diet-category guidance, not a toxicity test':'식단·식품군 기준으로 설명',limited:english?'Specific evidence remains limited':'해당 조합의 근거는 제한적'};
 const sources=new Map((r.sources||[]).map(s=>[s.url,s.title]));
 for(const [label,url] of p?.sources||[])sources.set(url,label);
 const emergency=r.petKey==='rabbit'
  ? (english?'If eating stops, droppings decrease or stop, or breathing changes, contact a rabbit-experienced veterinarian promptly.':'먹지 않거나 배변이 줄거나 멈추거나 호흡이 달라지면 토끼를 진료하는 동물병원에 바로 연락하세요.')
  : (english?'For a known hazardous ingredient, or unusual weakness, tremors or breathing, contact a veterinarian promptly. Do not wait for symptoms after a known toxic exposure.':'위험 성분을 먹었거나 무기력·떨림·호흡 변화가 있다면 동물병원에 바로 연락하세요. 독성 음식 섭취가 의심되면 증상이 생길 때까지 기다리지 마세요.');
 return `<nav class="food-jump" aria-label="${english?'On this page':'이 페이지에서 찾기'}"><a href="#food-why">${english?'Why':'이유'}</a><a href="#food-preparation">${english?'Preparation':'준비·급여'}</a><a href="#food-avoid">${english?'Avoid':'피할 상황'}</a><a href="#food-eaten">${english?'Already eaten':'이미 먹었다면'}</a><a href="#food-sources">${english?'Sources':'출처'}</a></nav>`
  + section('food-why',english?'Why this recommendation?':'왜 이렇게 안내하나요?',c.why)
  + section('food-preparation',english?'What to prepare or check':'준비·급여 전에 확인하세요',c.preparation)
  + section('food-avoid',english?'When not to offer it':'이 경우에는 주지 마세요',c.avoid)
  + (pc?`<section class="info food-explanation"><h2>${english?'More detail for this food':'이 음식에 대해 더 알아보기'}</h2><p>${escape(pc[1])}</p><h3>${escape(pc[2])}</h3><p>${escape(pc[3])}</p><h3>${escape(pc[4])}</h3><p>${escape(pc[5])}</p></section>`:'')
  + (r.faq?.[lang]?.length?`<section class="info food-explanation food-questions" id="food-questions"><h2>${english?'Questions about this food':'많이 궁금해하는 질문'}</h2>${r.faq[lang].map(([question,answer])=>`<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('')}</section>`:'')
  + `<section class="info food-explanation food-eaten" id="food-eaten"><h2>${english?'Already eaten? Start here':'이미 먹었다면 이렇게 확인하세요'}</h2><p>${english?'An “avoid” recommendation does not mean every accidental bite is poisoning. Ingredients, amount, time and the animal matter.':'‘주지 마세요’가 모든 한 입의 중독을 뜻하지는 않습니다. 성분·먹은 양·시각·동물 상태를 함께 확인해야 합니다.'}</p><ol><li>${english?'Stop further access and keep the food or packaging.':'더 먹지 않도록 치우고 음식이나 포장지를 보관하세요.'}</li><li>${english?'Record the species, product, estimated amount and time; say when an amount is unknown.':'동물종·제품명·추정량·먹은 시각을 기록하세요. 모르는 양은 모른다고 적으세요.'}</li><li>${emergency}</li></ol><p>${r.petKey==='rabbit'?(english?'Do not give human medicines or attempt home treatment.':'사람 약을 먹이거나 집에서 임의로 치료하지 마세요.'):(english?'Do not induce vomiting or give human medicines on your own.':'임의로 구토를 유도하거나 사람 약을 먹이지 마세요.')}</p><a href="/guides/food-emergency/">${english?'What to tell the vet (Korean)':'병원에 전달할 기록 보기'} →</a></section>`
  + `<section class="info food-explanation" id="food-sources"><h2>${english?'Sources and scope':'출처와 설명의 범위'}</h2><p class="food-evidence">${escape(evidence[r.evidence]||evidence.limited)}</p><p>${r.evidence==='direct'?(english?'The linked material addresses this food and animal. Individual health and preparation still matter.':'연결한 자료에 이 음식과 동물에 대한 안내가 있습니다. 그래도 개별 건강 상태와 준비 방식은 따로 확인해야 합니다.'):r.evidence==='category'?(english?'This recommendation applies the diet guidance for this species to the food category. It does not establish a toxic dose or prove every preparation safe.':'이 동물의 식단 원칙을 해당 식품군에 적용한 설명입니다. 독성량을 입증하거나 모든 조리 형태의 안전성을 보장하는 자료는 아닙니다.'):(english?'The checked sources do not resolve every detail for this combination. Do not turn that uncertainty into a safety claim.':'확인한 자료만으로 이 조합의 모든 세부 조건을 결정할 수는 없습니다. 정보의 빈칸을 안전하다는 뜻으로 해석하지 마세요.')}</p>${[...sources].map(([url,title])=>`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(title)} ↗</a>`).join('')}<p class="food-fineprint">${updatedNotice}</p><a href="/guides/read-a-verdict/">${english?'How to read a recommendation (Korean)':'판정 읽는 법과 한계'} →</a></section>`;
}
export function foodPageInner(key,english=false,context={}) {
 const r=getFoodRecord(key);if(!r)return '';
 const c=r[english?'en':'ko'], status=foodStatus[r.status], lang=english?'en':'ko';
 const title=foodPageMeta(key,english).title.replace(' | PetNyam','');
 const symbols={safe:'✓',caution:'!',danger:'×',unknown:'?'};
 const short=value=>String(text(value)).match(/^.*?[.!?。](?:\s|$)/s)?.[0]?.trim()||text(value);
 const urgent=english?'Do not wait for symptoms after a known toxic exposure. Contact a veterinarian and keep the product, amount and time available. Do not induce vomiting yourself.':'독성 음식 섭취가 의심되면 증상을 기다리지 말고 동물병원에 연락하세요. 제품·추정량·먹은 시각을 준비하고 임의로 구토를 유도하지 마세요.';
 const summary=[['01',english?'Preparation & conditions':'손질·급여 조건',c.preparation,'food-preparation'],['02',english?'Forms and situations to avoid':'피해야 할 형태·상황',c.avoid,'food-avoid'],['03',english?'If already eaten':'이미 먹었다면',english?'Keep the product and record the amount, time and any changes.':'제품·추정량·먹은 시각과 달라진 상태를 기록하세요.','food-eaten']];
 const evidence=r.evidence==='direct'?(english?'Food and species named in the linked source.':'연결 자료에 음식과 동물종이 명시되어 있습니다.'):r.evidence==='category'?(english?'Explained using the species’ diet-category guidance.':'동물종의 식단·식품군 안내에 따른 설명입니다.'):(english?'Specific evidence remains limited.':'이 조합의 구체적인 근거는 제한적입니다.');
 return '<div class="wrap result-page" data-result-page data-result-key="'+key+'" data-result-language="'+lang+'"><a class="back" href="'+(english?'/en/':'/')+'">← '+(english?'Search another food':'다른 음식 검색하기')+'</a>'
 + '<header class="verdict food-verdict result-verdict" data-verdict="'+r.status+'" style="background:'+status.background+';--result-tone:'+status.color+'"><div class="food-heading"><span class="food-pet">'+r.pet.emoji+' '+escape(r.pet[lang])+' · '+r.food.emoji+' '+escape(r.food[lang])+'</span><h1>'+escape(title)+'</h1><span class="food-decision" style="color:'+status.color+'"><b class="result-decision-icon" aria-hidden="true">'+symbols[r.status]+'</b>'+status[lang]+'</span><p class="food-answer">'+escape(text(c.answer))+'</p><span class="food-fineprint">'+(english?'Plain ingredient guidance; processed products need a separate check.':'기본 식재료 기준 · 가공품·양념·개체 상태는 별도 확인')+'</span></div>'
 + (r.status==='danger'?'<div class="result-urgent" role="note"><strong>'+(english?'Suspected ingestion? Contact a veterinarian first.':'이미 먹었거나 섭취가 의심되나요? 동물병원에 먼저 연락하세요.')+'</strong><p>'+urgent+'</p><a href="#food-eaten">'+(english?'Read the immediate steps':'지금 확인할 내용 보기')+' →</a></div>':'')+'</header>'
 + quickFoodSaveView(key,english)
 + '<section class="result-overview" aria-labelledby="result-overview-title"><div class="result-section-heading"><span class="label">'+(english?'AT A GLANCE':'먼저 이것부터')+'</span><h2 id="result-overview-title">'+(english?'The key checks at a glance':'한눈에 보는 핵심 확인사항')+'</h2></div><div class="result-summary-grid">'+summary.map(([number,heading,body,target])=>'<a href="#'+target+'"><span class="result-summary-number">'+number+'</span><h3>'+heading+'</h3><p>'+escape(short(body))+'</p><span class="result-link-label">'+(english?'Read the details':'자세한 설명')+' ↓</span></a>').join('')+'</div></section>'
 + '<div class="result-reading-layout"><article data-editorial="1" data-food-clarity="'+key+'" data-food-language="'+lang+'">'+foodArticle(key,english)+'</article><aside class="result-reading-aside" aria-label="'+(english?'Reading guide and sharing':'읽기 안내와 공유')+'"><span class="label">'+(english?'READ WITH THE SOURCE':'출처와 함께 읽기')+'</span><h2>'+(english?'What supports this answer?':'이 설명의 근거는?')+'</h2><p>'+evidence+'</p><a href="#food-sources">'+(english?'Sources and limits':'자료와 설명 범위 보기')+' →</a><hr><h2>'+(english?'Keep it for later':'다시 확인하고 싶다면')+'</h2><p>'+(english?'Save in this browser above, or share this page with another caregiver.':'위의 저장 버튼으로 이 브라우저에 보관하거나 다른 보호자에게 공유하세요.')+'</p><div class="result-share"><button type="button" data-result-share>'+(english?'Share':'공유하기')+'</button><button type="button" data-result-copy>'+(english?'Copy link':'링크 복사')+'</button></div><span role="status" data-result-share-feedback></span></aside></div>'
 + foodDiscoveryView(r,findNextFoods(r.petKey,'',r.food.slug).map(getFoodRecord),english,foodStatus)
 + resultJourneyView(r,english)+resultRescueView(r,english,context.rescueData)
 + '<p class="result-editorial-note">'+(english?'Advertising and affiliate products do not determine food recommendations.':'광고·제휴 상품은 음식 판정의 근거가 아닙니다.')+'</p><div class="ad">ADVERTISEMENT</div></div>';
}
