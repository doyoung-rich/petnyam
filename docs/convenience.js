const expandedFoods=[
['cabbage','배추','Cabbage','🥬',['caution','caution','safe','caution','safe']],['banana','바나나','Banana','🍌',['safe','caution','safe','safe','safe']],['strawberry','딸기','Strawberry','🍓',['safe','safe','safe','safe','safe']],['watermelon','수박','Watermelon','🍉',['safe','caution','safe','caution','safe']],['pear','배','Pear','🍐',['safe','caution','safe','safe','safe']],['peach','복숭아','Peach','🍑',['caution','caution','caution','caution','caution']],['orange','오렌지','Orange','🍊',['caution','caution','caution','caution','caution']],['lemon','레몬','Lemon','🍋',['caution','caution','caution','caution','caution']],['pineapple','파인애플','Pineapple','🍍',['safe','caution','caution','caution','caution']],['mango','망고','Mango','🥭',['safe','caution','caution','caution','caution']],
['potato','감자','Potato','🥔',['caution','caution','danger','caution','caution']],['tomato','토마토','Tomato','🍅',['caution','caution','caution','caution','caution']],['broccoli','브로콜리','Broccoli','🥦',['safe','caution','safe','safe','safe']],['cucumber','오이','Cucumber','🥒',['safe','safe','safe','safe','safe']],['pumpkin','단호박','Pumpkin','🎃',['safe','caution','safe','safe','safe']],['lettuce','상추','Lettuce','🥬',['safe','safe','safe','safe','safe']],['spinach','시금치','Spinach','🥬',['caution','caution','caution','caution','caution']],['garlic','마늘','Garlic','🧄',['danger','danger','unknown','unknown','unknown']],['green-onion','대파','Green onion','🌿',['danger','danger','unknown','unknown','unknown']],['mushroom','버섯','Mushroom','🍄',['caution','caution','unknown','unknown','unknown']],
['egg','계란','Egg','🥚',['safe','safe','danger','caution','safe']],['chicken','닭고기','Chicken','🍗',['safe','safe','danger','caution','caution']],['pork','돼지고기','Pork','🥩',['caution','caution','danger','caution','caution']],['beef','소고기','Beef','🥩',['safe','safe','danger','caution','caution']],['salmon','연어','Salmon','🐟',['caution','caution','danger','caution','caution']],['tuna','참치','Tuna','🐟',['caution','caution','danger','caution','caution']],['milk','우유','Milk','🥛',['caution','caution','danger','caution','caution']],['yogurt','요거트','Yogurt','🥣',['caution','caution','danger','caution','caution']],['peanut','땅콩','Peanut','🥜',['caution','caution','danger','caution','caution']],['almond','아몬드','Almond','🌰',['caution','caution','danger','caution','caution']],
['rice','쌀밥','Cooked rice','🍚',['safe','safe','danger','safe','safe']],['bread','빵','Bread','🍞',['caution','caution','danger','caution','caution']],['ramen','라면','Instant noodles','🍜',['danger','danger','danger','danger','danger']],['kimchi','김치','Kimchi','🥗',['danger','danger','danger','danger','danger']],['fried-chicken','치킨','Fried chicken','🍗',['danger','danger','danger','danger','danger']],['sausage','소시지','Sausage','🌭',['danger','danger','danger','danger','danger']],['ham','햄','Ham','🥓',['danger','danger','danger','danger','danger']],['coffee','커피','Coffee','☕',['danger','danger','danger','danger','danger']],['alcohol','술','Alcohol','🍺',['danger','danger','danger','danger','danger']],['macadamia','마카다미아','Macadamia nut','🌰',['danger','unknown','danger','unknown','unknown']]
];
foods.push(...expandedFoods);
route();
const requestStyle=document.createElement('style');requestStyle.textContent='.food-request-button{display:block;width:calc(100% - 16px);margin:8px;padding:12px 14px;border:1px solid #377fb3;border-radius:10px;background:#edf8ff;color:#235f89;font-weight:800;cursor:pointer;text-align:center}.food-request-button:disabled{cursor:default;opacity:.8}';document.head.append(requestStyle);

// Independent controls are refreshed after the existing router renders.
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const dock=document.createElement('div');dock.className='search-dock';
const topButton=document.createElement('button');topButton.className='back-top';topButton.textContent='↑';topButton.hidden=true;
document.body.append(dock,topButton);
topButton.onclick=()=>window.scrollTo({top:0,behavior:reduceMotion.matches?'instant':'smooth'});
window.addEventListener('scroll',()=>{topButton.hidden=scrollY<250},{passive:true});
const shoppingGroups={coupang:[["쿠팡 추천 상품","Coupang pick","상품 정보·가격은 쿠팡에서 확인하세요","View product details and price on Coupang","🛍️","https://link.coupang.com/a/g9Q1lG65y8"]],amazon:[['Outward Hound 슬로우 식기','Outward Hound Fun Feeder','크기와 옵션 확인하기','Explore sizes and options','🥣','https://www.amazon.com/dp/B00FPKNRF0'],['OXO Pet POP 보관통','OXO Pet POP Container','사료·간식 보관 용품','Food and treat storage','📦','https://www.amazon.com/dp/B09T7893VT']]};
let coupangProducts;
async function loadCoupangProducts(){
 if(coupangProducts)return coupangProducts;
 try{const response=await Promise.race([fetch('/coupang-products.json'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),8000))]);if(!response.ok)throw new Error('coupang');const data=await response.json();coupangProducts=data.products.map(p=>[p.name,p.name,`${Number(p.price).toLocaleString('ko-KR')}원${p.rocket?' · 로켓배송':''}`,`${Number(p.price).toLocaleString('en-US')} KRW${p.rocket?' · Rocket delivery':''}`,p.image,p.url]);return coupangProducts.length?coupangProducts:shoppingGroups.coupang}catch{return shoppingGroups.coupang}
}
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
 const groups={...shoppingGroups,coupang:await loadCoupangProducts()};
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

function enhanceFoodCountAndRequests(){
 const stats=document.querySelectorAll('.quick strong');if(stats[1]&&stats[1].textContent!==String(foods.length))stats[1].textContent=String(foods.length);
 document.querySelectorAll('#suggest,.dock-results').forEach(box=>{
  const input=box.id==='suggest'?document.querySelector('#search'):document.querySelector('#dock-query');
  const query=input?.value.trim();if(!query||foods.some(f=>(f[0]+' '+f[1]+' '+f[2]).toLowerCase().includes(query.toLowerCase())))return;
  let button=box.querySelector('.food-request-button');if(!button){button=document.createElement('button');button.className='food-request-button';box.append(button)}
  const label=en?'Request “'+query+'” for review':'“'+query+'” 음식 검토 요청하기';if(button.textContent!==label)button.textContent=label;button.onclick=()=>requestFood(button,query);
 });
}
async function requestFood(button,food){
 button.disabled=true;button.textContent=en?'Sending…':'요청 중…';
 try{const response=await fetch('/api/food-request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({food,pet})});if(!response.ok)throw new Error();button.textContent=en?'✓ Request received':'✓ 요청이 접수됐어요'}catch{button.disabled=false;button.textContent=en?'Please try again':'잠시 후 다시 시도해 주세요'}
}
new MutationObserver(enhanceFoodCountAndRequests).observe(app,{childList:true,subtree:true});
document.addEventListener('input',e=>{if(e.target.matches('#search,#dock-query'))setTimeout(enhanceFoodCountAndRequests)});
enhanceFoodCountAndRequests();
if(!sessionStorage.getItem('petnyam-view-counted')){sessionStorage.setItem('petnyam-view-counted','1');fetch('/api/page-view',{method:'POST',keepalive:true}).catch(()=>{})}
