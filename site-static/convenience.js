const expandedFoods=[
['cabbage','배추','Cabbage','🥬',['caution','caution','safe','caution','safe']],['banana','바나나','Banana','🍌',['safe','caution','safe','safe','safe']],['strawberry','딸기','Strawberry','🍓',['safe','safe','safe','safe','safe']],['watermelon','수박','Watermelon','🍉',['safe','caution','safe','caution','safe']],['pear','배','Pear','🍐',['safe','caution','safe','safe','safe']],['peach','복숭아','Peach','🍑',['caution','caution','caution','caution','caution']],['orange','오렌지','Orange','🍊',['caution','caution','caution','caution','caution']],['lemon','레몬','Lemon','🍋',['caution','caution','caution','caution','caution']],['pineapple','파인애플','Pineapple','🍍',['safe','caution','caution','caution','caution']],['mango','망고','Mango','🥭',['safe','caution','caution','caution','caution']],
['potato','감자','Potato','🥔',['caution','caution','danger','caution','caution']],['tomato','토마토','Tomato','🍅',['caution','caution','caution','caution','caution']],['broccoli','브로콜리','Broccoli','🥦',['safe','caution','safe','safe','safe']],['cucumber','오이','Cucumber','🥒',['safe','safe','safe','safe','safe']],['pumpkin','단호박','Pumpkin','🎃',['safe','caution','safe','safe','safe']],['lettuce','상추','Lettuce','🥬',['safe','safe','safe','safe','safe']],['spinach','시금치','Spinach','🥬',['caution','caution','caution','caution','caution']],['garlic','마늘','Garlic','🧄',['danger','danger','unknown','unknown','unknown']],['green-onion','대파','Green onion','🌿',['danger','danger','unknown','unknown','unknown']],['mushroom','버섯','Mushroom','🍄',['caution','caution','unknown','unknown','unknown']],
['egg','계란','Egg','🥚',['safe','safe','danger','caution','safe']],['chicken','닭고기','Chicken','🍗',['safe','safe','danger','caution','caution']],['pork','돼지고기','Pork','🥩',['caution','caution','danger','caution','caution']],['beef','소고기','Beef','🥩',['safe','safe','danger','caution','caution']],['salmon','연어','Salmon','🐟',['caution','caution','danger','caution','caution']],['tuna','참치','Tuna','🐟',['caution','caution','danger','caution','caution']],['milk','우유','Milk','🥛',['caution','caution','danger','caution','caution']],['yogurt','요거트','Yogurt','🥣',['caution','caution','danger','caution','caution']],['peanut','땅콩','Peanut','🥜',['caution','caution','danger','caution','caution']],['almond','아몬드','Almond','🌰',['caution','caution','danger','caution','caution']],
['rice','쌀밥','Cooked rice','🍚',['safe','safe','danger','safe','safe']],['bread','빵','Bread','🍞',['caution','caution','danger','caution','caution']],['ramen','라면','Instant noodles','🍜',['danger','danger','danger','danger','danger']],['kimchi','김치','Kimchi','🥗',['danger','danger','danger','danger','danger']],['fried-chicken','치킨','Fried chicken','🍗',['danger','danger','danger','danger','danger']],['sausage','소시지','Sausage','🌭',['danger','danger','danger','danger','danger']],['ham','햄','Ham','🥓',['danger','danger','danger','danger','danger']],['coffee','커피','Coffee','☕',['danger','danger','danger','danger','danger']],['alcohol','술','Alcohol','🍺',['danger','danger','danger','danger','danger']],['macadamia','마카다미아','Macadamia nut','🌰',['danger','unknown','danger','unknown','unknown']]
];
foods.push(...expandedFoods);
route();

// Independent controls are refreshed after the existing router renders.
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const dock=document.createElement('div');dock.className='search-dock';
const topButton=document.createElement('button');topButton.className='back-top';topButton.textContent='↑';topButton.hidden=true;
document.body.append(dock,topButton);
topButton.onclick=()=>window.scrollTo({top:0,behavior:reduceMotion.matches?'instant':'smooth'});
window.addEventListener('scroll',()=>{topButton.hidden=scrollY<250},{passive:true});
const coupangLinks=['g9Q1lG65y8','g9Q4suqYc8','g9Q5FjzTDE','g9Q68seDZY','g9Q8uAbbqe','g9Q9GJ928y','g9RaXRhBhl','g9RcpUwnkq','g9RdKJhDye','g9RfB7d0Me'];
const shoppingGroups={coupang:coupangLinks.map((id,i)=>[`쿠팡 반려동물 추천 ${i+1}`,`Coupang pet pick ${i+1}`,'상품 정보·가격·배송을 쿠팡에서 확인하세요','Check product details, price and delivery on Coupang','🛍️',`https://link.coupang.com/a/${id}`]),amazon:[['Outward Hound 슬로우 식기','Outward Hound Fun Feeder','크기와 옵션 확인하기','Explore sizes and options','🥣','https://www.amazon.com/dp/B00FPKNRF0'],['OXO Pet POP 보관통','OXO Pet POP Container','사료·간식 보관 용품','Food and treat storage','📦','https://www.amazon.com/dp/B09T7893VT']]};
let carouselTimer;
async function refreshConvenience(){
 clearInterval(carouselTimer);
 topButton.setAttribute('aria-label',en?'Back to top':'맨 위로 이동');
 dock.innerHTML=`<form class="dock-form" role="search"><label class="sr-only" for="dock-query">${en?'Search food':'음식 이름 검색'}</label><input id="dock-query" type="search" autocomplete="off" placeholder="${en?'Search a food':'음식 이름 검색'}" required><button type="submit">${en?'Search':'검색'}</button></form><div class="dock-results" hidden aria-live="polite"></div>`;
 const input=dock.querySelector('input'),results=dock.querySelector('.dock-results');
 function searchDock(){const q=input.value.trim().toLowerCase();results.hidden=!q;if(!q)return;const matches=foods.filter(f=>(f[1]+' '+f[2]+' '+f[0]).toLowerCase().includes(q));results.replaceChildren();const title=document.createElement('p');title.textContent=pets[pet][2]+' '+pets[pet][en?1:0];results.append(title);if(!matches.length){const empty=document.createElement('p');empty.textContent=en?'No matching food. Try another name.':'검색 결과가 없어요. 다른 음식 이름을 입력해 주세요.';results.append(empty)}matches.forEach(f=>{const a=document.createElement('a');a.href=`/${en?'en':'ko'}/${pet}/${f[0]}`;a.textContent=f[3]+' '+f[en?2:1]+' · '+stat[f[4][keys.indexOf(pet)]][en?1:2];results.append(a)})}
 input.oninput=searchDock;dock.querySelector('form').onsubmit=e=>{e.preventDefault();searchDock()};input.onkeydown=e=>{if(e.key==='Escape')results.hidden=true};
 const popular=document.querySelector('#popular');if(!popular)return;
 const section=document.createElement('section');section.id='shopping';section.className='shopping-section';
 section.innerHTML=`<div class="shopping-heading"><div><span class="label">SHOPPING</span><h2>${en?'Supplies for everyday pet care':'우리 아이 생활용품 둘러보기'}</h2></div><p>${en?'Two stores, more choices':'쿠팡과 Amazon에서 살펴보세요'}</p></div><div class="shopping-columns"></div><p class="shopping-disclosure">${en?'Amazon links are standard links without affiliate tracking. Icons are illustrative, not product photos. Check details, price and shipping at the store.':'Amazon은 일반 링크로 제휴 수익이 연결되지 않았습니다. 아이콘은 상품 사진이 아닙니다. 상품 정보·가격·배송은 판매처에서 확인하세요.'}</p>`;
 popular.after(section);
 const rotators=[];
 const groups=shoppingGroups;
 for(const [store,items] of Object.entries(groups)){
  const panel=document.createElement('article');panel.className='shop-panel '+store;panel.setAttribute('aria-label',store==='coupang'?'쿠팡 상품':'Amazon products');
  panel.innerHTML=`<div class="shop-banner"><div><small>${en?'PET SUPPLIES':'반려동물 용품'}</small><h3>${store==='coupang'?'쿠팡':'Amazon'}</h3></div><span>${en?'Find your next everyday essential':'급여부터 보관까지'} →</span></div><div class="shop-window"><div class="shop-track">${items.map((p,i)=>`<a class="shop-slide" href="${p[5]}" target="_blank" rel="${store==='coupang'?'sponsored noopener noreferrer':'noopener noreferrer'}" aria-label="${p[en?1:0]} (${en?'opens a new tab':'새 창'})"><div class="shop-art" aria-hidden="true">${/^https?:/.test(p[4])?`<img src="${p[4]}" alt="${p[en?1:0]}" loading="lazy">`:p[4]}</div><div class="shop-copy"><span>${en?'PRODUCT PICK':'살펴볼 상품'} ${i+1}</span><h4>${p[en?1:0]}</h4><p>${p[en?3:2]}</p><b>${en?'View at store':'판매처에서 보기'} ↗</b></div></a>`).join('')}</div></div><div class="shop-controls"><button data-prev aria-label="${en?'Previous product':'이전 상품'}">←</button><span data-count>1 / ${items.length}</span><button data-next aria-label="${en?'Next product':'다음 상품'}">→</button><button data-play>${en?'Pause':'일시정지'}</button></div>`;
  if(store==='coupang'){const disclosure=document.createElement('p');disclosure.className='affiliate-disclosure';disclosure.textContent=en?'Advertisement · This site participates in Coupang Partners and receives a commission from qualifying purchases.':'광고 · 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';panel.append(disclosure)}
  section.querySelector('.shopping-columns').append(panel);
  let index=0,paused=reduceMotion.matches,hover=false;const track=panel.querySelector('.shop-track'),play=panel.querySelector('[data-play]');
  const update=()=>{track.style.transform=`translateX(-${index*100}%)`;panel.querySelector('[data-count]').textContent=`${index+1} / ${items.length}`;panel.querySelectorAll('.shop-slide').forEach((a,i)=>{a.tabIndex=i===index?0:-1;a.setAttribute('aria-hidden',String(i!==index))});play.textContent=paused?(en?'Play':'자동재생'):(en?'Pause':'일시정지');play.setAttribute('aria-pressed',String(paused))};
  const advance=n=>{index=(index+n+items.length)%items.length;update()};
  panel.querySelector('[data-prev]').onclick=()=>advance(-1);panel.querySelector('[data-next]').onclick=()=>advance(1);play.onclick=()=>{paused=!paused;update()};
  panel.onmouseenter=()=>{hover=true};panel.onmouseleave=()=>{hover=false};panel.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){paused=true;update()}});
  rotators.push(()=>{if(!paused&&!hover&&!panel.contains(document.activeElement)&&!document.hidden)advance(1)});update();
 }
 carouselTimer=setInterval(()=>rotators.forEach(f=>f()),4000);
}
new MutationObserver(records=>{if(records.some(r=>r.removedNodes.length)||!app.querySelector('.shopping-section'))refreshConvenience()}).observe(app,{childList:true});
document.addEventListener('click',e=>{if(!dock.contains(e.target))dock.querySelector('.dock-results').hidden=true});
refreshConvenience();

function updateFoodCount(){const stats=document.querySelectorAll('.quick strong');if(stats[1])stats[1].textContent=String(foods.length)}
document.addEventListener('click',e=>{if(e.target.closest('[data-pet],#lang'))setTimeout(updateFoodCount)});
updateFoodCount();
if(!sessionStorage.getItem('petnyam-view-counted')){sessionStorage.setItem('petnyam-view-counted','1');fetch('/api/page-view',{method:'POST',keepalive:true}).catch(()=>{})}

function prioritizeRelatedFoods(){
 const parts=location.pathname.split('/').filter(Boolean).filter(part=>part!=='petnyam');
 if(!['ko','en'].includes(parts[0])||parts.length!==3)return;
 const [,,slug]=parts,petKey=parts[1],food=foods.find(item=>item[0]===slug),statusIndex=keys.indexOf(petKey),related=document.querySelector('.related');
 if(!food||statusIndex<0||!related)return;
 const status=food[4][statusIndex];
 [...related.querySelectorAll('a')].sort((a,b)=>{
  const aFood=foods.find(item=>a.getAttribute('href')?.endsWith('/'+item[0]));
  const bFood=foods.find(item=>b.getAttribute('href')?.endsWith('/'+item[0]));
  return Number(bFood?.[4][statusIndex]===status)-Number(aFood?.[4][statusIndex]===status);
 }).forEach(link=>related.append(link));
}
new MutationObserver(prioritizeRelatedFoods).observe(app,{childList:true});
prioritizeRelatedFoods();

function applyContentEnhancements(){
 const parts=location.pathname.split('/').filter(Boolean).filter(part=>part!=='petnyam');
 if(!['ko','en'].includes(parts[0])||parts.length!==3)return;
 const [lang,petKey,slug]=parts,food=foods.find(item=>item[0]===slug),petInfo=pets[petKey],statusIndex=keys.indexOf(petKey),detail=document.querySelector('.detail');
 if(!food||!petInfo||statusIndex<0||!detail)return;
 const english=lang==='en',foodName=food[english?2:1],petName=petInfo[english?1:0],verdict=stat[food[4][statusIndex]][english?1:0];
 const description=english
  ? `Can a ${petName.toLowerCase()} eat ${foodName.toLowerCase()}? Check PetNyam's ${verdict.toLowerCase()} result, key cautions, what to record after eating, and reviewed sources.`
  : `${petName} ${foodName}, 먹어도 될까요? PetNyam의 ‘${verdict}’ 판정과 급여 전 확인할 주의사항, 섭취 뒤 기록할 정보, 검토 출처를 확인하세요.`;
 document.querySelector('meta[name="description"]')?.setAttribute('content',description);
 document.querySelector('meta[property="og:description"]')?.setAttribute('content',description);
 document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
 const reasonHeading=detail.querySelector('.info h2');
 if(reasonHeading){
  const finalConsonant=(food[1].charCodeAt(food[1].length-1)-0xac00)%28!==0;
  reasonHeading.textContent=english?`What does ${foodName.toLowerCase()} mean for ${petName.toLowerCase()}s?`:`${petName}에게 ${foodName}${finalConsonant?'은':'는'} 어떤가요?`;
 }
 const labels=detail.querySelectorAll('.info .label');
 if(labels[1])labels[1].textContent=english?'BEFORE OR AFTER EATING':'섭취 전·후 확인할 점';
 if(['danger','unknown'].includes(food[4][statusIndex])){
  const secondCaution=detail.querySelector('.info ul li:nth-child(2)');
  if(secondCaution)secondCaution.textContent=english
   ? 'Record the food, amount and time eaten before contacting a veterinarian.'
   : '먹었다면 음식 종류·양·시간을 기록해 동물병원에 전달하세요.';
 }
 const sources=detail.querySelectorAll('.info')[2];
 if(sources&&!sources.querySelector('.source-context')){
  const context=document.createElement('p');
  context.className='source-context';
  context.textContent=english
   ? 'This V1 result summarizes the public sources linked above. Individual health conditions and the amount eaten need veterinary advice.'
   : '이 V1 결과는 위에 연결한 공개 출처를 바탕으로 정리했습니다. 개별 건강 상태와 섭취량은 수의사 판단이 우선합니다.';
  sources.append(context);
 }
}
new MutationObserver(applyContentEnhancements).observe(app,{childList:true});
applyContentEnhancements();

function addGuideNavigation(){
 const nav=document.querySelector('header nav');
 if(!nav||nav.querySelector('[data-nav="guides"]'))return;
 const link=document.createElement('a');
 link.href='/guides';link.dataset.nav='guides';link.textContent='이용 가이드';
 nav.append(link);
}
addGuideNavigation();
document.addEventListener('click',event=>{
 const link=event.target.closest('a[data-nav="guides"]');
 if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();event.stopImmediatePropagation();location.assign(link.href);
},true);
