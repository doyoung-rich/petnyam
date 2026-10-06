// Reviewed against the linked species-specific sources on 2026-10-07.
// "category" is a dietary rationale, never evidence of a toxic dose.
// Uncertainty is kept visible rather than importing dog/cat toxicity claims.
const sources = {
  pdsa: { title: 'PDSA: Hamster diet and food FAQs', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/small-pets/hamsters-as-pets' },
  rspca: { title: 'RSPCA: Feeding hamsters', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/rodents/hamsters/diet' },
  rodent: { title: 'RSPCA: Poisoning in pet rodents', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/rodents/poisoning' },
  awla: { title: 'Animal Welfare League of Arlington: Caring for hamsters', url: 'https://www.awla.org/wp-content/uploads/2020/10/Hamster.pdf' },
  woodgreen: { title: 'Woodgreen: Hamster care guide', url: 'https://woodgreen.org.uk/wp-content/uploads/2025/12/Hamster-Care-Guide-2025.pdf' },
  birdProduce: { title: 'VCA: Fruits and vegetables in bird diets', url: 'https://vcahospitals.com/spring-creek/know-your-pet/fruits-and-vegetables-in-bird-diets' },
  budgie: { title: 'VCA: Feeding budgies (species-specific guidance)', url: 'https://vcahospitals.com/lakeline/know-your-pet/budgies-feeding' },
  lovebird: { title: 'VCA: Feeding lovebirds (species-specific guidance)', url: 'https://vcahospitals.com/mountain-vista/know-your-pet/lovebirds-feeding' },
  avianHospital: { title: 'Avian and Animal Hospital: Bird feeding guidelines', url: 'https://www.avianandanimal.com/feeding-guidelines-for-birds.html' },
  birdVet: { title: 'Bird Vet Melbourne: Feeding pet birds', url: 'https://birdvetmelbourne.com/feeding-pet-birds/' },
  merckBird: { title: 'Merck Veterinary Manual: Nutrition in psittacines', url: 'https://www.merckvetmanual.com/management-and-nutrition/nutrition-exotic-and-zoo-animals/nutrition-in-psittacines' },
  merckOwner: { title: 'Merck Veterinary Manual: Feeding a pet bird', url: 'https://www.merckvetmanual.com/en-us/veterinary/bird-owners/choosing-and-taking-care-of-a-pet-bird/feeding-a-pet-bird' },
  avocado: { title: 'Merck Veterinary Manual: Avocado toxicosis in animals', url: 'https://www.merckvetmanual.com/toxicology/food-hazards/avocado-persea-spp-toxicosis-in-animals' },
};

const names = {
  apple: ['사과', 'Apple'], grape: ['포도', 'Grapes'], chocolate: ['초콜릿', 'Chocolate'], onion: ['양파', 'Onion'], carrot: ['당근', 'Carrot'], blueberry: ['블루베리', 'Blueberries'], avocado: ['아보카도', 'Avocado'], cheese: ['치즈', 'Cheese'], 'sweet-potato': ['고구마', 'Sweet potato'], xylitol: ['자일리톨', 'Xylitol'],
  cabbage: ['배추', 'Cabbage'], banana: ['바나나', 'Banana'], strawberry: ['딸기', 'Strawberries'], watermelon: ['수박', 'Watermelon'], pear: ['배', 'Pear'], peach: ['복숭아', 'Peach'], orange: ['오렌지', 'Orange'], lemon: ['레몬', 'Lemon'], pineapple: ['파인애플', 'Pineapple'], mango: ['망고', 'Mango'],
  potato: ['감자', 'Potato'], tomato: ['토마토', 'Tomato'], broccoli: ['브로콜리', 'Broccoli'], cucumber: ['오이', 'Cucumber'], pumpkin: ['단호박', 'Pumpkin'], lettuce: ['상추', 'Lettuce'], spinach: ['시금치', 'Spinach'], garlic: ['마늘', 'Garlic'], 'green-onion': ['대파', 'Green onion'], mushroom: ['버섯', 'Mushrooms'],
  egg: ['계란', 'Egg'], chicken: ['닭고기', 'Chicken'], pork: ['돼지고기', 'Pork'], beef: ['소고기', 'Beef'], salmon: ['연어', 'Salmon'], tuna: ['참치', 'Tuna'], milk: ['우유', 'Milk'], yogurt: ['요거트', 'Yogurt'], peanut: ['땅콩', 'Peanuts'], almond: ['아몬드', 'Almonds'],
  rice: ['쌀밥', 'Cooked rice'], bread: ['빵', 'Bread'], ramen: ['라면', 'Instant noodles'], kimchi: ['김치', 'Kimchi'], 'fried-chicken': ['치킨', 'Fried chicken'], sausage: ['소시지', 'Sausage'], ham: ['햄', 'Ham'], coffee: ['커피', 'Coffee'], alcohol: ['술', 'Alcohol'], macadamia: ['마카다미아', 'Macadamia nuts'],
};

function make(status, evidence, refs, ko, en) {
  const keys = ['answer', 'why', 'preparation', 'avoid'];
  return { status, evidence, sources: refs, ko: Object.fromEntries(keys.map((key, i) => [key, ko[i]])), en: Object.fromEntries(keys.map((key, i) => [key, en[i]])) };
}

function unresolved(pet, slug) {
  const [koName, enName] = names[slug];
  const hamster = pet === 'hamster';
  return make('unknown', 'limited', [hamster ? sources.rspca : sources.merckBird], [
    `${koName}: 먼저 급여하지 말고, ${hamster ? '햄스터' : '조류'} 진료가 가능한 수의사에게 확인하세요.`,
    `확인한 자료만으로 ${koName}의 해당 동물 급여 조건을 정할 수 없습니다. 정보부족은 독성이 입증되었다는 뜻도, 안전하다는 뜻도 아닙니다. 아래 자료는 기본 식단 설명이며 이 음식의 안전성을 보증하지 않습니다.`,
    '식품명·원재료·조리 방식과 반려동물의 종류를 알려 주세요. 이미 먹었다면 추정량과 시각도 기록하세요.',
    '다른 동물의 먹이 판정, 사람용 권장량, 인터넷의 일률적인 몇 g 기준을 그대로 적용하지 마세요.',
  ], [
    `${enName}: do not offer it before checking with a ${hamster ? 'hamster-experienced' : 'avian'} veterinarian.`,
    `The reviewed material does not establish feeding conditions for this food in this animal. Unknown means neither proven toxic nor proven safe. The reference explains the basic diet, not this item's safety.`,
    'Identify the ingredient, preparation and exact pet species. After ingestion, record the estimated amount and time too.',
    'Do not transfer another species’ verdict, a human serving size or a universal gram limit to your pet.',
  ]);
}

export const smallPetFoodExplanations = {
  hamster: Object.fromEntries(Object.keys(names).map(slug => [slug, unresolved('hamster', slug)])),
  parrot: Object.fromEntries(Object.keys(names).map(slug => [slug, unresolved('parrot', slug)])),
};

const hamsterFruitReason = '과육은 간식 후보지만 주식은 아닙니다. 단맛이 있는 과일을 많이 주는 것은 피하며, 특히 당뇨 위험이 있는 드워프 햄스터는 식단을 먼저 상담하세요.';
const hamsterFruitReasonEn = 'Flesh is a treat option, not the main diet. Limit sugary fruit; a dwarf hamster with diabetes risk needs individual dietary advice.';
function hamsterFruit(slug, preparationKo, preparationEn, avoidKo, avoidEn, ref) {
  const [koName, enName] = names[slug];
  smallPetFoodExplanations.hamster[slug] = make('caution', 'direct', [ref], [
    `${koName} 과육은 가끔 주는 간식으로만 생각하세요.`, hamsterFruitReason, preparationKo, avoidKo,
  ], [`${enName} flesh is an occasional treat, not a meal.`, hamsterFruitReasonEn, preparationEn, avoidEn]);
}
hamsterFruit('apple', '씻은 사과에서 씨와 심을 빼고 먹기 편하게 잘라 주세요.', 'Wash the apple; remove seeds and core and cut manageable pieces.', '사과씨·가당 잼·주스는 이 과육 안내에 포함되지 않습니다.', 'Apple seeds, sweetened jam and juice are not covered by the flesh guidance.', sources.rspca);
hamsterFruit('banana', '껍질을 벗긴 신선한 과육만 사용하고 남은 것은 치워 주세요.', 'Use fresh peeled flesh and remove leftovers.', '바나나칩·설탕 코팅 간식은 신선한 바나나와 별도 제품입니다.', 'Banana chips and sugar-coated snacks are different products.', sources.pdsa);
hamsterFruit('pear', '씻은 과육을 사용하고 씨와 심은 빼 주세요.', 'Wash the pear and remove seeds and core.', '시럽에 든 배 통조림과 배즙은 같은 간식으로 보지 마세요.', 'Do not treat pears in syrup or pear juice as the same snack.', sources.pdsa);
hamsterFruit('peach', '단단한 씨를 완전히 제거하고 과육만 준비하세요.', 'Remove the hard stone completely; prepare flesh only.', '씨를 깨서 주거나 씨가 붙은 조각을 주지 마세요.', 'Do not crack the stone or offer pieces attached to it.', sources.pdsa);
hamsterFruit('strawberry', '씻은 신선한 딸기를 준비하고 물러진 부분은 사용하지 마세요.', 'Use washed fresh strawberries, not spoiled portions.', '딸기잼·시럽·설탕을 뿌린 딸기는 제외하세요.', 'Exclude jam, syrup and sugar-coated strawberries.', sources.woodgreen);

const hamsterVegetables = {
  broccoli: ['씻은 브로콜리를 조미료 없이 준비하세요.', 'Use washed broccoli without seasoning.', '브로콜리 크림수프·치즈 소스는 제외하세요.', 'Exclude creamy soup and cheese sauce.', sources.woodgreen],
  carrot: ['씻은 당근을 먹기 편하게 자르고 남은 조각은 치워 주세요.', 'Wash, cut manageable pieces and remove leftovers.', '당근 케이크·설탕이 든 당근주스는 제외하세요.', 'Carrot cake and sweetened juice are not included.', sources.awla],
  cucumber: ['씻은 오이를 양념 없이 준비하세요.', 'Use washed plain cucumber.', '피클과 소금에 절인 오이는 생오이와 다릅니다.', 'Pickled or salted cucumber is a different food.', sources.awla],
  pumpkin: ['단호박 속살을 양념 없이 준비하세요. 껍질·씨는 별도 확인 대상입니다.', 'Prepare plain squash flesh; skin and seeds require separate assessment.', '설탕·버터를 넣은 단호박죽은 이 안내와 다릅니다.', 'Sweetened or buttered squash porridge is not covered.', sources.pdsa],
  spinach: ['씻은 잎을 사용하세요. 처음에는 평소 식단을 한꺼번에 바꾸지 마세요.', 'Use washed leaves; do not replace the existing diet abruptly.', '소금·참기름·마늘이 들어간 시금치나물은 제외하세요.', 'Exclude spinach seasoned with salt, sesame oil or garlic.', sources.pdsa],
};
for (const [slug, [prepKo, prepEn, avoidKo, avoidEn, ref]] of Object.entries(hamsterVegetables)) {
  const [koName, enName] = names[slug];
  smallPetFoodExplanations.hamster[slug] = make('caution', 'direct', [ref], [
    `${koName}은 평소 먹이에 곁들이는 채소로만 주세요.`, '급여 후보로 소개된 채소라도 이것만으로 균형 잡힌 식사가 되지는 않습니다. 먹이통뿐 아니라 숨겨 둔 신선식품도 확인하세요.', prepKo, avoidKo,
  ], [`${enName} is a supplementary vegetable, not a complete meal.`, 'A listed vegetable is not a balanced diet on its own. Check stored fresh food as well as the food bowl.', prepEn, avoidEn]);
}

Object.assign(smallPetFoodExplanations.hamster, {
  egg: make('caution', 'direct', [sources.woodgreen], ['완전히 익힌 계란은 간식 후보입니다. 주식으로 바꾸지는 마세요.', '햄스터는 잡식성이지만 단백질 식품 하나를 먹인다고 식단이 완성되는 것은 아닙니다.', '삶아 완전히 익힌 계란을 식혀 양념 없이 준비하세요.', '날계란·반숙·마요네즈가 들어간 계란 요리는 제외하세요.'], ['Fully cooked egg is a treat option, not a replacement meal.', 'Being omnivorous does not mean one protein food supplies a complete diet.', 'Cool a fully boiled egg and leave it unseasoned.', 'Exclude raw or undercooked egg and mayonnaise-based dishes.']),
  chocolate: make('danger', 'direct', [sources.rodent], ['초콜릿은 햄스터에게 주지 마세요.', '초콜릿의 테오브로민은 설치류에 해로운 자극 성분입니다.', '먹었다면 제품명·추정량·시각을 준비해 즉시 병원에 연락하세요.', '초콜릿 과자·코코아도 확인하세요. 집에서 임의로 치료하지 마세요.'], ['Do not feed chocolate to a hamster.', 'Theobromine in chocolate is a hazardous stimulant for rodents.', 'After ingestion, contact a veterinarian promptly with the product, amount and time.', 'Check chocolate snacks and cocoa too; do not attempt home treatment.']),
  grape: make('unknown', 'limited', [sources.rspca, sources.woodgreen], ['포도는 간식으로 주지 말고 급여 여부를 먼저 확인하세요.', '기관의 햄스터 안내가 서로 다릅니다. RSPCA는 피하도록 안내하지만 Woodgreen은 간식 예시에 포함합니다. 펫냠은 이 차이를 숨기고 안전하다고 단정하지 않습니다.', '이미 먹었다면 종류·추정량·섭취 시각을 기록해 햄스터 진료가 가능한 병원에 문의하세요.', '강아지 포도 중독 설명을 햄스터에 그대로 옮기거나 건포도를 대안으로 주지 마세요.'], ['Do not offer grapes before checking the conflicting advice.', 'Hamster guidance differs: RSPCA advises avoiding them, whereas Woodgreen includes them as a treat example. We do not turn that disagreement into a safety guarantee.', 'After ingestion, record the type, amount and time and seek hamster-experienced advice.', 'Do not import dog grape-toxicity claims or substitute raisins.']),
  onion: make('unknown', 'limited', [sources.pdsa, sources.awla], ['양파는 급여하지 말고 전문 진료 안내를 받으세요.', '확인한 햄스터 먹이 목록이 서로 다릅니다. PDSA는 목록에 포함하지만 AWLA는 피하도록 안내합니다. 안전량과 조건을 여기서 정하지 않습니다.', '양파·양파가루가 든 제품을 먹었다면 성분표와 먹은 시각을 준비하세요.', '익혔으니 안전하다고 판단하거나 개·고양이의 독성 기준을 그대로 적용하지 마세요.'], ['Do not offer onion without specialist advice.', 'The checked hamster lists disagree: PDSA includes onion; AWLA advises against it. This page establishes no safe amount or preparation.', 'Keep the ingredient label and time after onion or onion-powder ingestion.', 'Do not assume cooking proves safety or transfer dog/cat toxicity thresholds.']),
  orange: make('caution', 'direct', [sources.pdsa], ['오렌지는 새로운 간식으로 시작하지 않는 편이 좋습니다.', '햄스터의 감귤류 급여에 관한 판단이 아직 정리되지 않아 확인한 안내는 더 잘 확립된 다른 과일을 선택하도록 권합니다.', '새 과일을 찾는다면 먼저 햄스터용 식단에서 확인된 후보를 고르세요.', '산도가 높다는 이유만으로 확정적인 중독을 주장하거나 오렌지주스를 주지 마세요.'], ['Do not choose orange as a new hamster treat.', 'The reviewed citrus advice remains unsettled and favors better-established alternatives.', 'Choose an alternative already confirmed within the hamster’s diet.', 'Acidity alone is not proof of poisoning; do not offer orange juice.']),
  lemon: make('caution', 'direct', [sources.pdsa], ['레몬은 햄스터 간식으로 권하지 않습니다.', '감귤류에 대한 안내가 아직 확정적이지 않습니다. 불확실한 식품을 시험하기보다 다른 확인된 간식을 선택하는 판단입니다.', '물에는 레몬즙 대신 깨끗한 물만 사용하세요.', '피해야 한다는 안내를 모든 섭취가 중독이라는 뜻으로 확대하지 마세요.'], ['Lemon is not recommended as a hamster treat.', 'Citrus guidance is unsettled. Choosing an established alternative avoids testing an uncertain food.', 'Provide clean drinking water, not lemon juice.', 'An avoidance recommendation does not mean every exposure is poisoning.']),
  peanut: make('unknown', 'limited', [sources.pdsa, sources.awla], ['땅콩은 급여 전에 햄스터 식단을 확인하세요.', '일부 안내는 견과류를 간식으로 소개하지만, 땅콩은 별도로 피하라고 하는 안내도 있습니다. 견과류 전체에 대한 설명을 땅콩 안전성의 증거로 보지 않습니다.', '제품명·소금·설탕·조리 여부를 확인해 병원에 상담하세요.', '땅콩버터·소금 땅콩은 일반 땅콩과 별도 제품입니다.'], ['Check the hamster’s diet before offering peanuts.', 'Some guidance allows nuts in general; another specifically excludes peanuts. A nut-category statement is not proof of peanut safety.', 'Identify seasoning and preparation when seeking advice.', 'Peanut butter and salted peanuts are separate products.']),
  almond: make('unknown', 'limited', [sources.pdsa, sources.awla], ['아몬드는 급여 전에 종류와 식단을 확인하세요.', '견과류 일반 안내와 아몬드 제외 안내가 함께 존재합니다. 종류가 불분명한 아몬드를 안전한 햄스터 간식으로 권하지 않습니다.', '제품 포장과 원재료를 준비해 전문 진료가 가능한 병원에 문의하세요.', '모든 아몬드가 같다고 보거나 사람용 양념 견과를 주지 마세요.'], ['Check the type and diet before offering almonds.', 'General nut guidance and almond-specific avoidance guidance differ. An unspecified almond is not endorsed as a hamster treat.', 'Keep the packaging and ask a hamster-experienced veterinarian.', 'Do not assume all almond types are equivalent or offer flavored human snacks.']),
  tomato: make('caution', 'direct', [sources.pdsa, sources.awla], ['토마토는 익은 과육만 간식 후보로 보세요.', 'PDSA는 토마토를 먹이 예시에 포함하고 AWLA는 토마토의 녹색 식물 부분을 제외합니다. 과육과 잎·줄기를 구분하는 안내입니다.', '씻은 익은 과육에서 잎·줄기·꼭지를 분리하세요.', '토마토 잎·줄기와 소금·양념이 있는 케첩·소스는 제외하세요.'], ['Only ripe tomato flesh is a treat option.', 'PDSA lists tomato; AWLA excludes tomato greens. Flesh and green plant parts need separate decisions.', 'Wash ripe flesh and separate leaves, stem and calyx.', 'Exclude tomato greens and salted or flavored sauces.']),
});

// Produce is conditional on the bird's species-specific diet, not a universal parrot ration.
const parrotFruitReason = '과일은 주식을 대신하는 식품이 아닙니다. 먹을 수 있는 종류·식단 비중은 앵무새의 종과 건강 상태에 맞춰 정하세요.';
const parrotFruitReasonEn = 'Fruit is not a replacement diet. Suitability and its place in the diet depend on the parrot’s species and health.';
const parrotFruits = {
  apple: ['씨와 심을 빼고 씻은 과육을 준비하세요.', 'Remove seeds and core; use washed flesh.', '사과씨와 가당 주스·잼은 제외하세요.', 'Exclude apple seeds and sweetened juice or jam.', sources.birdProduce],
  banana: ['껍질을 벗겨 신선한 과육만 준비하세요.', 'Peel and use fresh flesh.', '바나나칩과 설탕 코팅 제품은 별도입니다.', 'Chips and sugar-coated products are separate foods.', sources.birdProduce],
  pear: ['씻고 씨와 심을 제거하세요.', 'Wash and remove seeds and core.', '시럽 통조림은 생배와 다릅니다.', 'Pears in syrup are not fresh pear.', sources.birdProduce],
  peach: ['단단한 씨를 완전히 빼고 과육만 준비하세요.', 'Remove the stone completely; prepare flesh only.', '씨가 붙거나 깨진 씨가 섞인 조각은 제외하세요.', 'Exclude pieces containing stone fragments.', sources.birdProduce],
  pineapple: ['질긴 껍질을 제거한 신선한 과육을 준비하세요.', 'Use fresh flesh without the tough skin.', '설탕을 넣은 통조림과 주스는 제외하세요.', 'Exclude sweetened canned fruit and juice.', sources.birdProduce],
  mango: ['큰 씨와 질긴 껍질을 빼고 과육을 준비하세요.', 'Remove the large stone and tough skin; prepare flesh.', '망고젤리·가당 말린 망고는 별도 제품입니다.', 'Mango sweets and sweetened dried mango are separate products.', sources.birdProduce],
  grape: ['씻은 포도를 새의 크기에 맞게 준비하세요.', 'Wash grapes and prepare appropriately for the bird’s size.', '포도주와 건포도에 이 안내를 적용하지 마세요.', 'This guidance does not cover wine or raisins.', sources.merckOwner],
  strawberry: ['씻은 신선한 과육을 준비하세요.', 'Use washed fresh flesh.', '딸기잼과 시럽은 제외하세요.', 'Exclude jam and syrup.', sources.avianHospital],
  blueberry: ['씻고 상하거나 곰팡이 난 열매는 버리세요.', 'Wash and discard spoiled or moldy berries.', '블루베리 머핀·가당 잼은 별도 제품입니다.', 'Muffins and sweetened jam are separate products.', sources.avianHospital],
  watermelon: ['껍질을 분리한 과육을 먹기 편하게 준비하세요.', 'Prepare manageable flesh pieces without rind.', '수박주스·설탕을 넣은 화채는 제외하세요.', 'Exclude sweetened juice or fruit punch.', sources.avianHospital],
};
for (const [slug, [prepKo, prepEn, avoidKo, avoidEn, ref]] of Object.entries(parrotFruits)) {
  const [koName, enName] = names[slug];
  smallPetFoodExplanations.parrot[slug] = make('caution', 'direct', [ref, sources.merckBird], [
    `${koName} 과육은 해당 종의 식단에서 허용된 경우 곁들이세요.`, parrotFruitReason, prepKo, avoidKo,
  ], [`${enName} flesh can supplement a diet when appropriate for that species.`, parrotFruitReasonEn, prepEn, avoidEn]);
}

const parrotVegetables = {
  carrot: ['씻은 당근을 양념 없이 준비하세요.', 'Use washed unseasoned carrot.', '당근 케이크와 소금·설탕이 든 주스는 제외하세요.', 'Exclude carrot cake and salted or sweetened juice.', sources.birdProduce],
  broccoli: ['깨끗이 씻어 새가 다룰 수 있는 크기로 준비하세요.', 'Wash and prepare pieces the bird can manage.', '치즈소스·버터·소금을 넣은 요리는 제외하세요.', 'Exclude cheese sauce, butter and added salt.', sources.birdVet],
  cucumber: ['씻은 오이를 조미료 없이 준비하세요.', 'Use washed unseasoned cucumber.', '피클은 생오이와 다른 제품입니다.', 'Pickles are different from fresh cucumber.', sources.birdProduce],
  pumpkin: ['단호박 과육을 조미료 없이 준비하세요.', 'Prepare plain squash flesh.', '버터·설탕이 들어간 단호박죽은 별도입니다.', 'Buttered or sweetened squash dishes are separate foods.', sources.birdProduce],
  spinach: ['씻은 잎을 다양한 먹이에 곁들이세요.', 'Offer washed leaves within a varied diet.', '시금치만 반복해서 주거나 양념나물을 주지 마세요.', 'Do not make spinach the entire diet or offer seasoned dishes.', sources.birdVet],
  'sweet-potato': ['고구마를 익힌 뒤 식혀 양념 없이 준비하세요.', 'Cook, cool and leave the sweet potato unseasoned.', '설탕·버터가 든 고구마 디저트는 제외하세요.', 'Exclude sweetened or buttered desserts.', sources.avianHospital],
  lettuce: ['먹이 안내에서 확인된 로메인 등 잎 종류를 먼저 구분하세요.', 'Identify a listed leaf type, such as romaine, first.', '아이스버그 양상추와 모든 상추를 같은 영양가로 보지 마세요.', 'Do not assume iceberg lettuce and all other leaves have the same nutritional value.', sources.avianHospital],
};
for (const [slug, [prepKo, prepEn, avoidKo, avoidEn, ref]] of Object.entries(parrotVegetables)) {
  const [koName, enName] = names[slug];
  smallPetFoodExplanations.parrot[slug] = make('caution', slug === 'lettuce' ? 'category' : 'direct', [ref, sources.merckBird], [
    `${koName}은 종별 식단에 맞는 경우 채소 후보로 사용할 수 있습니다.`, '먹을 수 있다는 설명은 마음껏 주거나 이것 하나로 영양을 채우라는 뜻이 아닙니다. 로리·로리킷 등 특수 식단이 필요한 종은 별도 안내를 받으세요.', prepKo, avoidKo,
  ], [`${enName} can be a vegetable option within a suitable species-specific diet.`, 'An edible option is neither unlimited nor a complete diet. Lories, lorikeets and other specialized feeders need separate guidance.', prepEn, avoidEn]);
}

Object.assign(smallPetFoodExplanations.parrot, {
  avocado: make('danger', 'direct', [sources.avocado], ['아보카도는 앵무새에게 주지 마세요.', '조류에서 아보카도 중독과 심각한 손상이 보고되어 있습니다. 과육만 떼거나 씨를 빼도 급여 후보로 보지 않습니다.', '섭취가 의심되면 증상을 기다리지 말고 조류 진료가 가능한 병원에 연락하세요.', '과육·씨·껍질·잎과 아보카도가 든 요리를 접근하지 못하게 하세요.'], ['Do not feed avocado to a parrot.', 'Avocado poisoning with serious harm is documented in birds. Removing the stone does not make the flesh a recommended food.', 'If ingestion is suspected, contact an avian veterinarian without waiting for signs.', 'Keep flesh, stone, skin, leaves and avocado dishes out of reach.']),
  onion: make('danger', 'direct', [sources.birdProduce], ['양파는 앵무새 간식으로 주지 마세요.', '확인한 조류 안내는 양파를 피하도록 합니다. 양파 성분이 혈액 세포에 해를 줄 수 있다는 우려가 급여하지 않는 근거입니다.', '이미 먹었다면 성분표·먹은 시각·추정량을 조류 진료 병원에 전달하세요.', '양파 분말과 양파가 든 국물·소스도 재료를 확인하세요.'], ['Do not offer onion as a parrot treat.', 'Bird guidance advises avoidance because of potential harm to blood cells.', 'After ingestion, give an avian veterinarian the label, time and estimated amount.', 'Check onion powder, sauces and soups for the ingredient.']),
  garlic: make('danger', 'direct', [sources.birdProduce], ['마늘은 앵무새에게 주지 마세요.', '조류 급여 안내에서 피하도록 하는 식품입니다. 사람에게 쓰는 건강식품이라는 이유로 새에게 권하지 않습니다.', '섭취한 제품의 마늘·마늘가루 표시와 시각을 기록하세요.', '익힌 마늘·마늘빵·마늘 소스를 안전한 대안으로 보지 마세요.'], ['Do not feed garlic to a parrot.', 'The bird-feeding guidance advises avoiding it. A food’s human health reputation is not an avian recommendation.', 'Record garlic ingredients and the ingestion time.', 'Do not treat cooked garlic, garlic bread or garlic sauce as safe alternatives.']),
  chocolate: make('danger', 'direct', [sources.budgie], ['초콜릿과 코코아는 앵무새에게 주지 마세요.', '조류 진료 안내는 초콜릿을 급여 금지 식품으로 다룹니다. 사람 간식의 일부라고 새에게 나눠 줄 이유는 없습니다.', '먹었다면 포장지와 먹은 시각·추정량을 준비해 조류 진료 병원에 문의하세요.', '초콜릿 과자와 코코아가 든 음료도 확인하세요.'], ['Do not feed chocolate or cocoa to a parrot.', 'Avian feeding guidance excludes chocolate; being part of a human snack is not a reason to share it.', 'Contact an avian veterinarian with the packaging, time and amount after ingestion.', 'Check cocoa drinks and chocolate snacks too.']),
  coffee: make('danger', 'direct', [sources.budgie], ['커피는 앵무새에게 주지 마세요.', '카페인이 든 음료는 조류 급여 안내에서 제외됩니다. 마실 것은 깨끗한 물로 준비하세요.', '컵을 치우고 섭취했다면 제품과 시각·추정량을 기록하세요.', '커피뿐 아니라 카페인 함유 차·콜라·에너지 음료도 공유하지 마세요.'], ['Do not give coffee to a parrot.', 'Caffeinated drinks are excluded in bird-feeding guidance. Provide clean water to drink.', 'Remove the cup and record the product, time and amount after ingestion.', 'Do not share caffeinated tea, cola or energy drinks either.']),
  alcohol: make('danger', 'direct', [sources.lovebird], ['술은 앵무새에게 주지 마세요.', '알코올 음료는 조류 급여 안내에서 제외되는 식품입니다. 한 모금 정도로 안전성을 시험하지 마세요.', '섭취했다면 종류·도수·추정량·시각을 준비해 조류 진료 병원에 연락하세요.', '맥주·와인·칵테일과 술이 든 음식에 접근하지 못하게 하세요.'], ['Do not give alcohol to a parrot.', 'Avian feeding guidance excludes alcoholic drinks. Do not test safety with a sip.', 'After ingestion, contact an avian veterinarian with the drink, strength, amount and time.', 'Keep beer, wine, cocktails and alcohol-containing food inaccessible.']),
  milk: make('caution', 'direct', [sources.lovebird], ['우유를 앵무새의 음료나 주식으로 주지 마세요.', '조류는 유당 소화에 제약이 있어 우유를 일반적인 급여 식품으로 권하지 않습니다.', '마실 것은 깨끗한 물로 준비하세요. 이미 마셨다면 제품과 상태를 확인하세요.', '초콜릿 우유·가당 우유와 우유 대체음료도 물 대신 쓰지 마세요.'], ['Do not use milk as a parrot’s drink or meal.', 'Lactose digestion is limited in birds; milk is not recommended as a routine food.', 'Provide clean water. After ingestion, identify the product and the bird’s condition.', 'Do not replace water with chocolate milk, sweetened milk or plant-based drinks.']),
  yogurt: make('caution', 'category', [sources.lovebird], ['요거트는 앵무새용 정기 간식으로 권하지 않습니다.', '유제품에 대한 소화상 주의가 근거입니다. 모든 요거트가 중독을 일으킨다는 주장은 아니며, 제품별 첨가 성분도 다릅니다.', '유당 함량과 설탕·감미료·향료가 다르므로 제품명을 확인해 상담하세요.', '사람용 유산균 제품이 조류에게도 필요하다고 판단하지 마세요.'], ['Yogurt is not recommended as a routine parrot treat.', 'This is a dairy-digestion precaution, not a claim that every yogurt is poisonous. Added ingredients differ.', 'Identify lactose, sugar, sweeteners and flavorings before seeking advice.', 'Do not assume a human probiotic product is necessary for a bird.']),
  cheese: make('caution', 'direct', [sources.lovebird], ['치즈는 주식이나 정기 간식으로 권하지 않습니다.', '일부 종의 안내는 아주 적은 치즈를 언급하지만 유제품에 주의를 요구합니다. 이 설명을 모든 앵무새의 급여 허가로 확대하지 않습니다.', '먹었다면 제품의 소금·첨가 성분과 먹은 양을 확인하세요.', '치즈소스·짠 가공치즈를 평소 먹이에 더하지 마세요.'], ['Cheese is not recommended as a meal or routine treat.', 'Some species guidance mentions occasional cheese while cautioning about dairy. This is not permission for every parrot.', 'After ingestion, identify salt, added ingredients and amount.', 'Do not routinely add cheese sauce or salty processed cheese.']),
  egg: make('caution', 'direct', [sources.avianHospital], ['완전히 익힌 계란은 종별 식단에서 허용된 경우만 곁들이세요.', '일부 조류 식단 안내의 단백질 후보입니다. 모든 종의 필수 식품이거나 날계란까지 허용한다는 뜻은 아닙니다.', '삶아 완전히 익힌 뒤 식히고 양념을 넣지 마세요.', '날계란·반숙·마요네즈가 들어간 계란 요리는 제외하세요.'], ['Fully cooked egg can supplement a diet when suitable for the bird’s species.', 'It is a protein option in some avian guidance, not a requirement for every species or permission for raw egg.', 'Cook completely, cool and leave unseasoned.', 'Exclude raw or undercooked egg and mayonnaise-based dishes.']),
  rice: make('caution', 'direct', [sources.birdVet], ['양념 없는 익힌 밥은 종별 식단에서 허용된 경우만 곁들이세요.', '곡물 식품을 곁들이는 식단 설명에 해당합니다. 밥만으로 조류의 기본 영양을 채울 수는 없습니다.', '완전히 익힌 밥을 식혀 준비하고 오래 남겨 두지 마세요.', '볶음밥·간장밥·소금과 기름이 든 밥은 제외하세요.'], ['Plain cooked rice can supplement a suitable species-specific diet.', 'This is a supplementary grain food, not a complete avian diet.', 'Use cooked, cooled rice and remove leftovers.', 'Exclude fried rice, soy sauce, salt and added oil.']),
  bread: make('caution', 'category', [sources.avianHospital], ['사람용 빵 전체를 앵무새 간식으로 권하지 않습니다.', '일부 안내의 통곡물 빵 예시는 모든 제과 제품을 포함하지 않습니다. 주식도 아니며 성분표를 따로 확인해야 합니다.', '사용하려는 빵의 원재료를 종별 식단 안내와 비교하세요.', '초콜릿·크림·소금·설탕이 많은 빵과 곰팡이 난 빵은 제외하세요.'], ['Do not treat every human bread as a suitable parrot snack.', 'A whole-grain-bread example is not approval for all bakery products or a complete diet.', 'Check the exact ingredient list against the bird’s dietary guidance.', 'Exclude chocolate, creamy, heavily salted or sweetened and moldy breads.']),
  orange: make('caution', 'direct', [sources.merckOwner, sources.birdProduce], ['오렌지는 앵무새 종류와 식단을 먼저 확인하세요.', '일반 먹이 목록에는 등장하지만, 철분에 민감한 일부 꿀먹이 조류는 감귤류를 피해야 합니다. 모든 앵무새에 같은 설명을 적용하지 않습니다.', '허용된 종에서만 껍질을 분리한 과육을 준비하세요.', '로리·로리킷 등 특수 식단 종과 철분 제한을 안내받은 새에게 임의로 주지 마세요.'], ['Check the parrot’s species and diet before offering orange.', 'It appears in general food lists, but some iron-sensitive nectar feeders need to avoid citrus. One rule does not fit all parrots.', 'Only use peeled flesh where the species-specific diet permits it.', 'Do not offer it without advice to specialized nectar feeders or birds on iron restrictions.']),
  lemon: make('unknown', 'limited', [sources.merckOwner], ['레몬은 급여 전에 조류 진료가 가능한 수의사에게 확인하세요.', '일부 꿀먹이 조류의 감귤류 제한은 확인되지만, 레몬을 모든 앵무새에게 권할 조건은 확보하지 못했습니다.', '앵무새의 정확한 종과 기존 식단·건강 상태를 확인하세요.', '다른 감귤류의 먹이 목록을 레몬의 안전성 증거로 보거나 레몬물을 주지 마세요.'], ['Check with an avian veterinarian before offering lemon.', 'Citrus restrictions are documented for some nectar feeders, but universal lemon-feeding conditions have not been established here.', 'Identify the exact species, existing diet and health status.', 'A listing for another citrus fruit is not proof of lemon safety; do not offer lemon water.']),
});

// These cautions are about unsuitable human-food products, not a claim of
// demonstrated toxicity for every ingredient or exposure in these species.
const processed = {
  ramen: ['짠 스프와 조미료가 섞인 가공식품입니다. 면과 국물의 성분도 다릅니다.', 'Instant noodles, seasoning packets and broth have different ingredients.'],
  kimchi: ['절임·양념 제품이며 재료와 소금 함량이 제품마다 다릅니다. 생배추와 같은 음식으로 보지 않습니다.', 'This seasoned, salted product is not equivalent to its fresh vegetable ingredient.'],
  'fried-chicken': ['닭고기뿐 아니라 튀김옷·기름·소스가 섞인 음식입니다. 익힌 무양념 닭고기의 설명과 다릅니다.', 'Coating, oil and sauce make this different from plain cooked chicken.'],
  sausage: ['소금·지방·조미료 등이 들어간 가공육이며 제조법마다 원재료가 다릅니다.', 'A processed meat with product-dependent salt, fat and seasonings.'],
  ham: ['햄은 생고기나 무양념 익힌 고기와 달리 염지·가공한 제품입니다.', 'Cured processed ham is different from unseasoned cooked meat.'],
};
for (const pet of ['hamster', 'parrot']) {
  for (const [slug, [whyKo, whyEn]] of Object.entries(processed)) {
    const [koName, enName] = names[slug];
    smallPetFoodExplanations[pet][slug] = make('caution', 'category', [pet === 'hamster' ? sources.rspca : sources.budgie], [
      `${koName}은 간식으로 주지 마세요.`, `${whyKo} 이 판단은 기본 식단과 제품 성분에 관한 주의이며, 이 종에서 모든 원재료의 독성이 입증되었다는 뜻은 아닙니다.`,
      '급여할 준비 방법은 권하지 않습니다. 이미 먹었다면 포장지·원재료·추정량·시각을 확인해 전문 진료 병원에 문의하세요.',
      '양념을 눈으로 걷어냈다는 이유로 무양념 식품과 같다고 판단하지 마세요.',
    ], [
      `Do not offer ${enName.toLowerCase()} as a treat.`, `${whyEn} This is a dietary and product-ingredient precaution, not proof that every ingredient is toxic in this species.`,
      'No preparation for feeding is recommended. After ingestion, keep the label, ingredients, amount and time for specialist advice.',
      'Removing visible seasoning does not establish equivalence to an unseasoned food.',
    ]);
  }
}

for (const pet of ['hamster', 'parrot']) {
  smallPetFoodExplanations[pet].cabbage = make('unknown', 'limited', [pet === 'hamster' ? sources.pdsa : sources.birdProduce], [
    '배추와 양배추를 먼저 구분하세요. 정확한 채소가 확인되기 전에는 급여를 권하지 않습니다.',
    '이 사이트의 배추 항목은 영어로 Cabbage라고 표시되어 왔습니다. 자료의 cabbage 일반 안내만으로 한국어 배추와 모든 품종의 급여 조건이 확인된 것은 아닙니다.',
    '배추·양배추·청경채 중 어떤 채소인지 확인하고 종류에 맞는 먹이 안내를 확인하세요.', '김치·소금절임은 신선한 잎과 별도 제품입니다.',
  ], [
    'Identify the cabbage type before feeding; the Korean label refers to Napa cabbage.',
    'The site has used the English label Cabbage for Korean Napa cabbage. A generic cabbage reference does not establish conditions for every cultivar.',
    'Distinguish Napa cabbage, ordinary cabbage and bok choy before choosing feeding guidance.', 'Kimchi and salted leaves are separate products.',
  ]);
  smallPetFoodExplanations[pet].xylitol.ko.why = '확인한 자료로는 이 동물의 자일리톨 안전량을 정할 수 없습니다. 강아지에서 알려진 위험과 같은 정도의 독성이 이 종에서도 입증되었다고 옮겨 쓰지 않습니다. 그렇다고 안전한 감미료로 권하지도 않습니다.';
  smallPetFoodExplanations[pet].xylitol.en.why = 'No safe xylitol amount for this animal is established here. We do not transfer the documented dog risk into a claim of equally proven toxicity in this species, or recommend it as a safe sweetener.';
  smallPetFoodExplanations[pet].macadamia.ko.why = '강아지의 마카다미아 위험 설명만으로 이 동물의 독성 여부나 안전량을 판단할 수 없습니다. 해당 종에 맞는 직접 근거가 부족해 급여를 권하지 않습니다.';
  smallPetFoodExplanations[pet].macadamia.en.why = 'Dog-specific macadamia hazards do not establish toxicity or a safe amount for this animal. Direct species-specific support is insufficient, so feeding is not recommended.';
}
