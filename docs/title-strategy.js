// 도영랩식 공통 전략: keyword → real question → supported answer direction.
// Hooks must be supported by the existing food explanation; uncertainty stays explicit.
export const titleStrategyVersion='doyounglab-v1';
export const siteTitles={
 '/guides/halloween-pet-safety/':'강아지 핼러윈 초콜릿 먹어도 될까? 사탕·코스튬까지 조심해야 하는 이유',
 '/guides/halloween-pet-safety-en/':'Can Dogs Eat Halloween Candy? Chocolate, Xylitol and Costume Safety Explained',
 '/guides/dog-fruit-preparation/':'강아지 과일 먹어도 될까? 귤·멜론·베리 등 8종 손질법',
 '/guides/dog-fruit-preparation-en/':'Can Dogs Eat These Fruits? Preparation for 8 More Fruits',
 '/guides/pork-belly-for-pets/':'강아지·고양이 삼겹살 먹어도 될까? 지방·양념·생고기 구분',
 '/guides/pork-belly-for-pets-en/':'Can Dogs and Cats Eat Pork Belly? Fat, Seasoning and Raw Meat',
 '/guides/beef-cuts-for-pets/':'강아지·고양이 소고기, 안심·등심은 다를까? 부위별 확인',
 '/guides/beef-cuts-for-pets-en/':'Beef for Dogs and Cats: Do Tenderloin, Ribeye and Ribs Differ?',
 '/guides/ground-meat-for-pets/':'강아지·고양이 다짐육 먹어도 될까? 생고기·햄버거와 구분',
 '/guides/ground-meat-for-pets-en/':'Can Dogs and Cats Eat Ground Meat? Cooking and Burger Ingredients',
 '/guides/feed-ingredients/':'반려동물 사료 원료, 어떤 성분이 있을까? 농사로 원료 검색',
 '/guides/feed-ingredients-en/':'Pet Food Ingredients: What Is in Them? Search Nongsaro Composition Data',
 '/guides/dog-friendly-places-korea/':'강아지와 가볼만한곳, 어디가 좋을까? 춘천·대전·의성 동반 규정 비교',
 '/guides/dog-friendly-places-korea-en/':'Dog-Friendly Places in Korea: Compare Chuncheon, Daejeon and Uiseong',
 '/guides/can-dogs-eat-kiwi/':'강아지 키위 먹어도 될까? 껍질·통째 급여와 작은 조각의 차이',
 '/guides/can-dogs-eat-kiwi-en/':'Can Dogs Eat Kiwi? Peel It and Avoid Whole-Fruit Choking Risks',
 '/guides/can-dogs-eat-raspberries/':'강아지 라즈베리 먹어도 될까? 소량 급여와 가공제품 주의점',
 '/guides/can-dogs-eat-raspberries-en/':'Can Dogs Eat Raspberries? Small Portions and Product Labels Matter',
 '/guides/pet-age-calculator/':'강아지 나이 계산기, 사람 나이로 몇 살일까? 체급별 환산',
 '/guides/pet-age-calculator-en/':'Dog Age Calculator: How Old in Human Years? Compare by Size',
 '/':'반려동물 음식 먹어도 될까? 동물별 주의사항 검색',
 '/en/':'Can My Pet Eat This? Food Risks and Preparation by Species',
 '/foods/':'반려동물 음식 목록, 무엇을 확인할까? 동물별 판정 찾기',
 '/guides/':'반려동물 음식 가이드, 어떻게 확인할까? 급여·성분·섭취 후 대처',
 '/guides/read-a-verdict/':'반려동물 음식 판정, 가능과 주의는 다를까? 기준과 한계',
 '/guides/food-emergency/':'반려동물이 위험 음식을 먹었다면? 병원 연락 전 확인할 정보',
 '/guides/new-food-checklist/':'반려동물 새 음식, 바로 줘도 될까? 급여 전 확인 목록',
 '/guides/processed-food-label/':'반려동물 가공식품, 원물과 같을까? 성분표 확인법',
 '/guides/xylitol-product-check/':'강아지 무설탕 제품, 안전할까? 자일리톨 성분 확인 순서',
 '/guides/main-meal-or-treat/':'반려동물 주식과 간식, 무엇이 다를까? 영양 적합성 표시 읽기',
 '/guides/food-storage-record/':'사료·간식 포장지, 버려도 될까? 보관·문제 확인에 필요한 기록',
 '/guides/changing-foods-safely/':'반려동물 사료 교체, 무엇이 달라졌을까? 식단·반응 기록법',
 '/guides/choosing-dog-food/':'강아지 사료 추천, 무엇부터 볼까? 선택·교체 체크리스트',
 '/guides/cat-food-heavy-metals/':'Heavy Metals in Cat Food: What Do Reports Actually Show?',
 '/guides/pet-treat-cost-calculator/':'반려동물 간식 비용 계산기, 어느 쪽이 저렴할까? 사용 비용·결제액 비교',
 '/guides/pet-play-roulette/':'강아지·고양이 놀이 룰렛, 오늘 뭘 할까? 후보 고르기와 기록법',
 '/guides/coton-de-tulear-life/':'꼬똥 드 툴레아 많이 짖을까? 보호자가 말하는 성격·애견카페 경험',
 '/guides/coton-de-tulear-life-en/':'Do Coton de Tulear Dogs Bark a Lot? One Owner’s Café Experience',
 '/guides/what-is-coton-de-tulear/':'꽃동강아지, 꼬똥 드 툴레아란? 성격·털빠짐과 키우기 전 확인',
 '/guides/what-is-coton-de-tulear-en/':'What Is a Coton de Tulear? Temperament, Shedding and Daily Care',
 '/guides/about-petnyam/':'반려동물 음식 정보, 왜 직접 찾았을까? 다섯 아이와 펫냠을 운영하는 이유',
 '/guides/about-petnyam-en/':'Why I Built PetNyam: Two Dogs, Three Cats and Food Questions',
 '/policy/terms/':'펫냠 이용약관: 서비스 범위와 정보 이용 기준',
 '/policy/privacy/':'펫냠 개인정보처리방침: 음식 저장·광고·쿠키 안내',
 '/policy/disclaimer/':'펫냠 의학적 면책: 음식 정보의 한계와 응급 상황 안내',
 '/policy/contact/':'펫냠 문의·오류 제보: 운영자 연락처와 전달할 정보',
 '/404.html':'펫냠 페이지를 찾을 수 없나요? 음식 검색으로 돌아가기'
};
const plural={apple:'apples',grape:'grapes',onion:'onions',carrot:'carrots',blueberry:'blueberries',banana:'bananas',strawberry:'strawberries',pear:'pears',peach:'peaches',orange:'oranges',lemon:'lemons',mango:'mangoes',potato:'potatoes',tomato:'tomatoes',cucumber:'cucumbers',mushroom:'mushrooms',egg:'eggs',almond:'almonds',peanut:'peanuts',macadamia:'macadamia nuts'};
const hooks=[
 [/씨.*심|심.*씨/,'씨·심 제거와 과육 급여 조건','Seeds, Core and Preparation'],
 [/껍질.*씨|씨.*껍질/,'껍질·씨와 과육의 차이','Skin, Seeds and Preparation'],
 [/양파|마늘|대파/,'양념·성분을 따로 확인해야 하는 이유','Ingredients and Seasoning to Check'],
 [/날계란|반숙|완전히 익힌 계란/,'익힘·양념에 따라 달라지는 조건','Cooking and Seasoning Precautions'],
 [/뼈.*양념|양념.*뼈/,'뼈·양념·익힘 상태 확인','Bones, Seasoning and Cooking'],
 [/생선|생연어|훈제|생참치/,'생것·익힌 것·가공품 구분','Raw, Cooked and Processed Forms'],
 [/껍질/,'껍질·손질과 급여 전 주의사항','Skin and Preparation Tips'],
 [/가당|설탕|시럽/,'원물과 가당 제품의 차이','Plain Food vs Sweetened Products'],
 [/주식|식단|간식/,'간식·주식 구분과 급여 조건','Treats, Meals and Precautions'],
 [/양념|소금|조미/,'양념·가공 형태별 주의사항','Seasoning and Product Risks']
];
export function foodTitleParts(record,english=false){
 const {pet,food}=record,lang=english?'en':'ko';
 const keyword=english?`${pet.en} ${plural[food.slug]||food.en.toLowerCase()}`:`${pet.ko} ${food.ko}`;
 const beverage=['milk','coffee','alcohol'].includes(food.slug);
 let question=english?`Can ${pet.plural} ${beverage?'drink':'eat'} ${plural[food.slug]||food.en.toLowerCase()}?`:`${keyword} ${beverage?'마셔도':'먹어도'} 될까?`;
 const corpus=Object.values(record.ko).join(' ');
 let direction,proof;
 if(record.evidence==='limited'){
  direction=english?'Evidence Gaps and What to Check':'급여 보류 이유와 확인할 정보';proof='limited';
  if(!english)question=`${keyword}, 줘도 괜찮을까?`;
 }else if(record.status==='danger'){
  direction=english?'Risks and What to Do If Eaten':'먹었을 때 확인할 정보';proof='danger';
  if(!english)question=`${keyword}, 왜 피해야 할까?`;
 }else{
  const match=hooks.find(([pattern])=>pattern.test(corpus));
  direction=match?.[english?2:1]||(english?'Preparation and Feeding Precautions':'준비 방법과 급여 전 주의사항');proof=match?.[0].source||'preparation';
 }
 if(record.key==='dog/apple'){direction=english?'Seeds, Core and Skin Explained':'씨·심·껍질 주의점';proof='apple-faq';}
 if(record.key==='hamster/milk'){direction=english?'Drinking Water vs Pup Feeding':'성체 음료와 새끼 수유 구분';proof='milk-adult-pup';}
 if(record.key==='hamster/grape'){direction=english?'Why Feeding Guidance Differs':'기관별 안내가 다른 이유';proof='conflicting-guidance';}
 if(record.key==='parrot/salmon'){direction=english?'Species, Raw Fish and Smoked Products':'종·생연어·훈제 제품 확인';proof='species-preparation';}
 if(record.key==='cat/xylitol'){question=english?'Is Xylitol Toxic to Cats?':`${keyword}, 강아지와 같을까?`;direction=english?'Dog Data vs Cat Evidence':'종별 근거와 제품 성분 확인';proof='species-evidence';}
 if(food.slug==='milk'&&record.key!=='hamster/milk'&&/유당/.test(corpus)){direction=english?'Lactose, Digestion and Ingredients':'유당·소화와 제품 성분 확인';proof='lactose-content';}
 if(record.petKey==='rabbit'&&['apple','banana','strawberry','blueberry','watermelon','pear'].includes(food.slug)&&/건초/.test(corpus)){direction=english?'Fruit Treats vs the Main Diet':'건초·과일 간식의 비중과 손질';proof='rabbit-diet-content';}
 if(!english&&record.evidence!=='limited'&&record.status!=='danger'&&['chicken','pork','beef','egg'].includes(food.slug)&&/익힌|익힘|익혀/.test(corpus))question=`${keyword}, 익히면 괜찮을까?`;
 if(!english&&record.evidence!=='limited'&&record.status!=='danger'&&['banana','strawberry','blueberry','watermelon','pear'].includes(food.slug)&&/가끔/.test(corpus))question=`${keyword}, 매일 줘도 될까?`;
 // No food is called safe solely to make the title more clickable.
 return {keyword,question,direction,proof,lang,title:question+' '+direction};
}
export function foodTitle(record,english=false){return foodTitleParts(record,english).title;}
export const titleWithBrand=heading=>heading+' | PetNyam';
export function titleForPath(path){return siteTitles[path];}
export function applySiteTitle(){
 if(typeof document==='undefined')return;
 const heading=siteTitles[location.pathname];if(!heading)return;
 document.title=titleWithBrand(heading);
 const h1=document.querySelector('#app h1');if(h1)h1.textContent=heading;
 for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]']){const node=document.querySelector(selector);if(node)node.content=document.title;}
}
