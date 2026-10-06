// Rabbit-specific editorial notes checked 2026-10-07.
// "danger" means do not offer, not that every excluded food is a proven toxin.
// "category" explicitly applies a dietary category; it is not a feeding trial.
// Shared facts are authored once below; individual records add scope and preparation.
const sources = {
  rspca: { title: 'RSPCA · Rabbit diet', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/rabbits/diet' },
  pdsa: { title: 'PDSA · Feeding your rabbits', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/rabbits/feeding-your-rabbits' },
  rwaf: { title: 'RWAF · Recommended vegetables and herbs', url: 'https://rabbitwelfare.co.uk/welfare-need/recommended-vegetables-and-herbs/' },
  rvc: { title: 'Royal Veterinary College · Rabbit feeding guidelines', url: 'https://www.rvc.ac.uk/Media/Default/small-animal/documents/Rabbit_feeding_guidelines_2022.pdf' },
  merck: { title: 'Merck Veterinary Manual · Diet for rabbits', url: 'https://www.merckvetmanual.com/all-other-pets/rabbits/diet-for-rabbits' },
  nutrition: { title: 'Merck Veterinary Manual · Nutrition of rabbits', url: 'https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits' },
  table: { title: 'Merck Veterinary Manual · Foods harmful to rabbits', url: 'https://www.merckvetmanual.com/multimedia/table/plants-and-foods-that-are-harmful-to-rabbits' },
  avocado: { title: 'Merck Veterinary Manual · Avocado toxicosis', url: 'https://www.merckvetmanual.com/toxicology/food-hazards/avocado-persea-spp-toxicosis-in-animals' },
  hrs: { title: 'Rabbit.org Foundation · Greens are great', url: 'https://rabbit.org/care/diet/greens-are-great/' },
  pasadena: { title: 'Pasadena Humane · Rabbit fruit and vegetable list', url: 'https://pasadenahumane.org/rabbit-safe-vegetable-and-fruit-list/' },
  vetpartners: { title: 'VetPartners · Feeding your rabbit', url: 'https://www.vetpartners.co.uk/pet-advice/rabbit-advice/routine-healthcare-rabbits/the-complete-guide-to-feeding-your-rabbit/' },
  aspca: { title: 'ASPCA · People foods to avoid (general pet guidance)', url: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets' },
};

const fruitWhy = {
  ko: '건강한 성체 토끼 기준으로, 과일은 달고 당분이 있어 주식이 아니라 가끔 주는 간식입니다. 많이 먹거나 식단을 갑자기 바꾸면 소화 문제가 생길 수 있습니다. 건초를 덜 먹게 할 만큼 주지 마세요.',
  en: 'For healthy adult rabbits, fruit is a sugary occasional treat, not a staple. Overfeeding or sudden diet changes can upset digestion. Do not let treats displace hay.',
};
const freshAvoid = {
  ko: '가공품·양념은 이 답의 대상이 아닙니다. 새로운 음식은 한 번에 하나씩 소개하고, 먹는 양이나 배변이 달라지면 중단하세요.',
  en: 'This answer does not cover processed or seasoned products. Introduce one new food at a time; stop if appetite or droppings change.',
};
const produceWhy = {
  ko: '토끼 식단에 다양성을 더하는 신선식품입니다. 다만 건초 대신 배를 채우는 음식은 아닙니다. 건초와 물을 기본으로 유지하세요.',
  en: 'Fresh produce adds variety, but does not replace the hay-based diet. Keep hay and water available.',
};
const noFeedPreparation = {
  ko: '토끼용 음식으로 준비하거나 시험 급여하지 마세요. 평소 먹던 건초와 적절한 토끼용 사료를 선택하세요.',
  en: 'Do not prepare or trial-feed this as rabbit food. Choose familiar hay and appropriate rabbit feed.',
};
const animalWhy = {
  ko: '토끼는 초식동물입니다. 고기·생선 같은 동물성 식품은 필요한 섬유질 중심 식단에 맞지 않습니다. 이 판단은 급여 부적합성에 관한 것이며, 한 입이 곧 중독이라는 뜻은 아닙니다.',
  en: 'Rabbits are herbivores. Meat and fish do not fit their fibre-based feeding plan. Unsuitable food is not the same as proven poisoning from one bite.',
};
const dairyWhy = {
  ko: '성체 토끼에게 유제품을 간식으로 권하지 않습니다. 우유를 먹는 어린 동물이라는 이미지로 성체의 식단을 판단하지 마세요. 토끼용 먹이를 유제품으로 대체할 이유가 없습니다.',
  en: 'Dairy is not a recommended treat for adult rabbits. Milk-feeding in infancy does not make dairy suitable for adults; it should not replace rabbit food.',
};
const nutsWhy = {
  ko: '토끼 급여 안내에서는 견과류를 피하도록 합니다. 견과류는 건초 같은 섬유질 주식과 다르고, 먹고 싶어 한다고 필요한 간식은 아닙니다. 강아지의 견과류 중독 자료를 토끼에게 그대로 적용한 판단은 아닙니다.',
  en: 'Rabbit feeding guidance excludes nuts. They are not a substitute for fibrous hay. This is not an extrapolation of dog-specific nut poisoning.',
};
const starchWhy = {
  ko: '사람이 먹는 빵·밥·면을 토끼의 건초나 전용 사료 대신 권하지 않습니다. 곡물을 포함한 완전배합 토끼 사료와 사람의 곡물 음식을 같은 것으로 보지 마세요.',
  en: 'Human bread, rice and noodles are not recommended replacements for hay or rabbit feed. A formulated rabbit pellet is not equivalent to a human grain dish.',
};

function record(status, evidence, ko, en, refs) {
  return {
    status,
    evidence,
    ko: { answer: ko[0], why: ko[1], preparation: ko[2], avoid: ko[3] },
    en: { answer: en[0], why: en[1], preparation: en[2], avoid: en[3] },
    sources: refs.map(key => sources[key]),
  };
}

function fruit(koName, enName, preparationKo, preparationEn, refs) {
  return record('caution', 'direct',
    [`${koName} 과육은 가끔 소량의 간식으로 줄 수 있습니다.`, fruitWhy.ko, preparationKo, freshAvoid.ko],
    [`${enName} flesh can be an occasional small treat.`, fruitWhy.en, preparationEn, freshAvoid.en],
    [...refs, 'rvc']);
}

function animal(koName, enName, extraKo = '', extraEn = '') {
  return record('danger', 'category',
    [`${koName}은(는) 토끼에게 먹이지 마세요.`, animalWhy.ko, noFeedPreparation.ko, extraKo || '날것·익힌 것 모두 토끼용 식단으로 권하지 않습니다.'],
    [`Do not feed ${enName} to rabbits.`, animalWhy.en, noFeedPreparation.en, extraEn || 'Neither raw nor cooked versions are recommended rabbit foods.'],
    ['nutrition']);
}

function dairy(koName, enName, evidence = 'category') {
  return record('danger', evidence,
    [`${koName}은(는) 토끼 간식으로 주지 마세요.`, dairyWhy.ko, noFeedPreparation.ko, '무가당·저지방·유당 제거 제품이라고 토끼 급여가 권장되는 것은 아닙니다.'],
    [`Do not offer ${enName} as a rabbit treat.`, dairyWhy.en, noFeedPreparation.en, 'Unsweetened, low-fat or lactose-free does not establish suitability for rabbits.'],
    evidence === 'direct' ? ['hrs', 'rspca'] : ['rspca']);
}

function nut(koName, enName) {
  return record('danger', 'category',
    [`${koName}은(는) 토끼 간식으로 권하지 않습니다.`, nutsWhy.ko, noFeedPreparation.ko, '소금이나 양념을 빼도 견과류 급여를 권하는 답으로 바뀌지 않습니다.'],
    [`${enName} are not recommended rabbit treats.`, nutsWhy.en, noFeedPreparation.en, 'Removing salt or seasoning does not make nuts a recommended treat.'],
    ['hrs']);
}

export const rabbitFoodExplanations = {
  apple: fruit('사과', 'Apple', '씻은 사과에서 심과 씨를 제거하고 과육만 준비하세요.', 'Wash; remove the core and seeds, and offer only flesh.', ['vetpartners']),
  banana: record('caution', 'direct',
    ['네, 바나나 과육은 가끔 아주 조금 줄 수 있습니다. 매일 주는 주식은 아닙니다.', fruitWhy.ko, '껍질을 벗긴 신선한 과육을 작게 잘라 준비하세요. 한 개를 통째로 주는 방식은 피하세요.', '바나나칩·빵·우유는 바나나 과육과 별개입니다. 아프거나 식욕·배변이 달라진 토끼에게 새 간식으로 시험하지 마세요.'],
    ['Yes, a little banana flesh can be an occasional treat—not a daily staple.', fruitWhy.en, 'Peel fresh banana and prepare a small piece, rather than handing over a whole banana.', 'Banana chips, bread and milk drinks are different products. Do not trial a new treat in a rabbit with illness or appetite/dropping changes.'],
    ['rspca', 'vetpartners', 'rvc']),
  grape: fruit('포도', 'Grape', '씻은 신선한 과육만 소량 준비하세요. 건포도와 주스까지 같은 답으로 묶지 마세요.', 'Use a little fresh, washed flesh; do not treat raisins and juice as the same food.', ['pdsa']),
  blueberry: fruit('블루베리', 'Blueberry', '씻은 신선한 블루베리를 준비하세요. 잼이나 달게 만든 제품은 제외합니다.', 'Use fresh, washed berries—not jam or sweetened products.', ['pasadena']),
  strawberry: fruit('딸기', 'Strawberry', '씻은 신선한 과육만 준비하세요. 설탕이나 크림을 더하지 마세요.', 'Use fresh, washed flesh without sugar or cream.', ['vetpartners']),
  mango: fruit('망고', 'Mango', '과육만 작게 떼어 준비하세요. 큰 씨·껍질을 급여 대상으로 삼지 않습니다.', 'Prepare a little flesh; this answer does not cover the large stone or peel.', ['pasadena']),
  watermelon: fruit('수박', 'Watermelon', '보호자가 확인하기 쉬운 작은 과육 조각을 준비하세요. 이 페이지는 껍질 급여까지 권하는 안내가 아닙니다.', 'Prepare a small piece of flesh; this page does not recommend feeding the rind.', ['pasadena']),
  pineapple: fruit('파인애플', 'Pineapple', '껍질을 제거한 신선한 과육을 준비하세요. 통조림 시럽이나 주스는 별개입니다.', 'Remove the skin and use fresh flesh; syrup-packed fruit and juice are separate products.', ['vetpartners']),
  pear: fruit('배', 'Pear', '씻고 심·씨를 제거한 과육만 준비하세요.', 'Wash and prepare flesh without the core or seeds.', ['pdsa', 'vetpartners']),
  peach: fruit('복숭아', 'Peach', '단단한 씨를 제거한 과육만 준비하세요. 씨를 깨거나 통째로 주지 마세요.', 'Remove the stone; prepare flesh only, never a whole or broken stone.', ['vetpartners']),
  orange: fruit('오렌지', 'Orange', '과육만 소량 준비하세요. 껍질·잎·감귤 향 오일은 이 답의 급여 대상이 아닙니다.', 'Use a little flesh only; this answer excludes peel, leaves and citrus oils.', ['pasadena']),
  lemon: record('unknown', 'limited',
    ['레몬은 토끼 간식으로 권할 근거를 충분히 확인하지 못했습니다.', '확인한 토끼 급여 자료만으로 레몬의 급여 조건을 정하기 어렵습니다. 신맛만 보고 독성이나 안전을 단정하지 않습니다.', '시험 급여보다 근거가 확인된 토끼 먹이를 선택하세요.', '오렌지 과육 안내를 레몬·껍질·오일의 안전 근거로 확대하지 마세요.'],
    ['There is not enough checked guidance to recommend lemon as a rabbit treat.', 'The rabbit feeding sources reviewed do not establish feeding conditions for lemon. Sour taste alone proves neither safety nor toxicity.', 'Choose established rabbit foods rather than trial-feeding it.', 'Orange-flesh guidance does not establish safety of lemon, peel or oils.'],
    ['merck']),
  carrot: record('caution', 'direct',
    ['당근 뿌리는 가끔 소량만 주세요. 토끼의 주식이 아닙니다.', '당근 뿌리는 당분이 있는 간식으로 분류됩니다. 당근을 많이 주는 것보다 건초를 충분히 먹는 식단이 중요합니다.', '씻은 뿌리를 조금만 준비하세요. 당근 뿌리와 잎의 급여 역할은 다릅니다.', freshAvoid.ko],
    ['Carrot root is an occasional small treat, not a rabbit staple.', 'The root is a sugary treat; a hay-based diet matters more than filling up on carrots.', 'Wash the root and prepare a little. The root and leafy tops serve different feeding roles.', freshAvoid.en],
    ['rwaf']),
  broccoli: record('caution', 'direct',
    ['브로콜리는 적은 양으로 조심해서 도입하세요.', '토끼 급여 목록에 있지만, 일부 토끼에서는 가스가 생길 수 있어 많은 양을 한꺼번에 주지 않습니다.', '씻은 신선한 브로콜리를 다른 적합한 채소와 번갈아 소개하세요.', freshAvoid.ko],
    ['Introduce broccoli cautiously in small amounts.', 'It appears in rabbit feeding lists, but may cause gas in some rabbits; do not offer a large amount at once.', 'Use fresh, washed broccoli and rotate suitable vegetables.', freshAvoid.en],
    ['pdsa']),
  cabbage: record('caution', 'direct',
    ['양배추는 가끔 조금씩, 반응을 보며 주세요.', '급여 안내에 포함되지만 많은 양이나 갑작스러운 식단 변화는 피합니다. 채소 하나만 계속 주는 식단도 권하지 않습니다.', '씻은 신선한 잎을 다른 적합한 잎채소와 번갈아 준비하세요.', freshAvoid.ko],
    ['Offer a little cabbage occasionally and monitor tolerance.', 'Feeding guidance includes it, but large servings and sudden changes should be avoided. Do not rely on one vegetable alone.', 'Use washed, fresh leaves in rotation with other suitable greens.', freshAvoid.en],
    ['pdsa']),
  lettuce: record('safe', 'direct',
    ['로메인 같은 적합한 상추는 잎채소 식단에 포함할 수 있습니다.', produceWhy.ko, '종류를 확인하고 씻으세요. 이 답은 로메인 등 적합한 잎상추 기준입니다.', '모든 상추를 같은 것으로 보지 마세요. 아이스버그 양상추는 권하지 않습니다.'],
    ['Suitable lettuce such as romaine can be included among fresh greens.', produceWhy.en, 'Identify and wash the variety; this answer covers suitable leaf lettuces such as romaine.', 'Do not treat all lettuces alike. Iceberg lettuce is not recommended.'],
    ['pdsa', 'hrs']),
  cucumber: record('safe', 'direct',
    ['오이는 다른 적합한 채소와 함께 조금씩 줄 수 있습니다.', produceWhy.ko, '씻은 신선한 오이를 준비하세요. 피클이나 양념 오이는 별개입니다.', freshAvoid.ko],
    ['A little cucumber can accompany other suitable vegetables.', produceWhy.en, 'Use fresh, washed cucumber; pickles and seasoned cucumber are different foods.', freshAvoid.en],
    ['rwaf']),
  pumpkin: record('caution', 'direct',
    ['호박 과육은 적은 양을 다른 채소와 함께 줄 수 있습니다.', '토끼 급여 목록에 포함된 비잎채소입니다. 잎채소보다 식단의 작은 부분으로 다루고, 건초를 대체하지 않습니다.', '양념 없는 신선한 과육 기준입니다. 씨·껍질까지 같은 답으로 묶지 않습니다.', '호박죽·호박파이·달게 만든 호박 제품은 별도 성분 확인이 필요하며 토끼용 간식으로 권하지 않습니다.'],
    ['A little pumpkin flesh can accompany other vegetables.', 'It is a listed non-leafy vegetable: a smaller part of fresh food, not a hay replacement.', 'This answer covers fresh, plain flesh—not seeds or rind.', 'Pumpkin porridge, pie and sweetened products are different foods and are not recommended rabbit treats.'],
    ['rwaf']),
  spinach: record('caution', 'direct',
    ['시금치는 가끔 소량, 다른 잎채소와 번갈아 주세요.', '토끼 급여 목록에 있지만 매번 같은 채소만 먹이는 방식은 피하고, 시금치는 제한적인 식단 구성 요소로 다룹니다.', '씻은 신선한 잎을 사용하세요. 시금치나물 같은 양념 음식은 제외합니다.', freshAvoid.ko],
    ['Offer a little spinach occasionally in rotation with other greens.', 'It is listed as suitable in moderation, not as the sole or unrestricted green.', 'Use fresh, washed leaves—not seasoned spinach dishes.', freshAvoid.en],
    ['pdsa']),
  tomato: record('caution', 'direct',
    ['잘 익은 토마토 과육만 조금 줄 수 있습니다. 잎·줄기는 주지 마세요.', '토마토는 먹는 부위를 구분해야 합니다. 토끼 급여 목록이 인정하는 것은 익은 과육이지 식물 전체가 아닙니다.', '꼭지·잎·줄기를 떼고 잘 익은 과육만 준비하세요.', '초록색 덜 익은 열매와 식물 부분은 피하세요. 케첩·소스도 이 답에 포함되지 않습니다.'],
    ['Only a little ripe tomato flesh; never offer leaves or stems.', 'The edible part matters. Feeding guidance covers ripe flesh, not the whole plant.', 'Remove the stalk, leaves and stems; use ripe flesh only.', 'Avoid green unripe fruit and plant parts. Ketchup and sauces are not covered.'],
    ['rwaf', 'rspca']),
  avocado: record('danger', 'direct',
    ['아보카도는 과육도 토끼에게 먹이지 마세요.', '토끼는 아보카도 중독에 취약한 동물로 확인됩니다. 독성 성분인 퍼신과 관련된 심장 손상 위험이 있어 일반 과일 간식처럼 다루지 않습니다.', '껍질이나 씨만 빼면 안전해지는 음식이 아닙니다.', '이미 먹었다면 증상을 기다리지 말고 동물병원에 양·시간·먹은 부위를 알려 상담하세요.'],
    ['Do not feed avocado to rabbits, including the flesh.', 'Rabbits are susceptible to avocado toxicity. Persin-associated heart injury is a concern; avocado is not an ordinary fruit treat.', 'Removing the peel or stone does not establish safety.', 'If eaten, contact a veterinarian with the amount, time and plant part rather than waiting for symptoms.'],
    ['avocado']),
  chocolate: record('danger', 'direct',
    ['초콜릿은 토끼에게 먹이지 마세요.', '토끼 전용 유해식품 표에 급여 금지 음식으로 분류됩니다. 코코아의 메틸잔틴 성분도 반려동물 중독 위험과 관련됩니다.', '종류나 양을 바꿔 시험하지 마세요.', '화이트초콜릿도 권하는 간식이 아닙니다. 섭취가 의심되면 제품 포장과 양·시간을 가지고 동물병원에 문의하세요.'],
    ['Do not feed chocolate to rabbits.', 'Rabbit-specific guidance lists it as toxic. Cocoa methylxanthines are also a pet poisoning concern.', 'Do not trial a different type or quantity.', 'White chocolate is not a recommended treat either. If ingestion is suspected, contact a veterinarian with the package, amount and time.'],
    ['table', 'aspca']),
  onion: record('danger', 'direct',
    ['양파는 토끼에게 먹이지 마세요.', '토끼 급여 지침에서 피해야 하는 음식으로 명시합니다. 사람에게 흔한 채소라는 이유로 토끼에게도 권할 수 없습니다.', noFeedPreparation.ko, '익힌 양파나 양파가 들어간 요리도 급여 대상으로 삼지 마세요.'],
    ['Do not feed onion to rabbits.', 'Rabbit feeding guidance explicitly excludes onion. A common human vegetable is not automatically suitable for a rabbit.', noFeedPreparation.en, 'Do not offer cooked onion or onion-containing dishes either.'],
    ['hrs']),
  garlic: record('danger', 'direct',
    ['마늘은 토끼에게 먹이지 마세요.', '토끼 급여 지침에서 피해야 하는 음식으로 명시합니다. 마늘을 건강식이나 영양 보충용으로 추가하지 마세요.', noFeedPreparation.ko, '익힌 마늘·마늘가루가 들어간 사람 음식도 급여하지 마세요.'],
    ['Do not feed garlic to rabbits.', 'Rabbit feeding guidance explicitly excludes garlic. Do not add it as a health food or supplement.', noFeedPreparation.en, 'Avoid human foods containing cooked garlic or garlic powder too.'],
    ['hrs']),
  'green-onion': record('danger', 'category',
    ['파는 토끼 간식으로 주지 마세요.', '양파·마늘을 제외하는 토끼 식단 원칙을 같은 파속 채소에 보수적으로 적용한 안내입니다. 파의 토끼별 중독량을 확인했다는 뜻은 아닙니다.', noFeedPreparation.ko, '대파·쪽파나 파가 들어간 양념 음식을 급여하지 마세요.'],
    ['Do not offer green onion as a rabbit treat.', 'This conservatively applies rabbit guidance excluding onion and garlic to another Allium vegetable; it is not a rabbit-specific toxic-dose finding.', noFeedPreparation.en, 'Avoid scallions and dishes seasoned with them.'],
    ['rspca']),
  mushroom: record('danger', 'direct',
    ['버섯은 토끼에게 먹이지 마세요.', '확인한 토끼 급여 지침은 버섯을 피하도록 합니다. 사람이 먹는 버섯인지 여부만으로 토끼 급여를 판단하지 않습니다.', noFeedPreparation.ko, '종류를 모르는 야생 버섯은 특히 피하세요. 이 페이지는 버섯별 독성을 감별하는 도구가 아닙니다.'],
    ['Do not feed mushrooms to rabbits.', 'The checked rabbit feeding guidance excludes mushrooms. Human edibility alone does not establish suitability for rabbits.', noFeedPreparation.en, 'Especially avoid unidentified wild mushrooms. This page does not identify mushroom-specific toxins.'],
    ['rspca']),
  potato: record('danger', 'direct',
    ['감자는 토끼 간식으로 권하지 않습니다. 싹·녹색 부분은 특히 주지 마세요.', '토끼 안내에서는 감자를 피하도록 하며, 수의학 표는 눈·새싹·녹색 부분을 유해 부위로 구분합니다. 익혔다는 이유로 토끼 간식으로 권하지 않습니다.', noFeedPreparation.ko, '감자칩·튀김도 급여 대상이 아닙니다.'],
    ['Potato is not a recommended rabbit treat; never offer sprouts or green parts.', 'Rabbit guidance excludes potatoes, and the veterinary table identifies eyes, new shoots and green parts as harmful. Cooking is not a reason to recommend it.', noFeedPreparation.en, 'Potato chips and fries are not recommended either.'],
    ['hrs', 'table']),
  'sweet-potato': record('danger', 'direct',
    ['고구마 뿌리는 토끼에게 먹이지 않는 쪽으로 안내합니다.', '확인한 토끼 전용 수의학 표는 고구마를 급여 금지로 분류합니다. 고구마 잎·줄기를 다루는 별도 자료를 뿌리 급여의 안전 근거로 확대하지 않습니다.', noFeedPreparation.ko, '삶거나 구웠다는 이유만으로 급여 가능하다고 판단하지 마세요.'],
    ['Do not offer sweet potato root to rabbits.', 'The checked rabbit-specific veterinary table lists sweet potato as a do-not-feed food. Separate discussions of vines do not establish root safety.', noFeedPreparation.en, 'Do not assume boiling or baking establishes suitability.'],
    ['table']),
  coffee: record('danger', 'direct',
    ['커피는 토끼에게 먹이지 마세요.', '토끼 영양 안내는 카페인 함유 식품을 안전하지 않은 음식으로 구분합니다. 사람 음료인 커피를 토끼의 물 대신 줄 이유도 없습니다.', '물만 제공하고 커피나 커피 찌꺼기에 접근하지 못하게 하세요.', '디카페인·커피우유도 권하는 토끼 음료가 아닙니다. 섭취했다면 제품과 양·시간을 동물병원에 알려주세요.'],
    ['Do not give coffee to rabbits.', 'Rabbit nutrition guidance identifies caffeine-containing foods as unsafe. Coffee is not a substitute for water.', 'Provide water and prevent access to coffee and grounds.', 'Decaffeinated coffee and milk coffee are not recommended rabbit drinks. Report any ingestion to a veterinarian with the product, amount and time.'],
    ['merck']),
  alcohol: record('danger', 'category',
    ['술과 알코올 함유 음식은 토끼에게 주지 마세요.', '일반 반려동물 중독 안내는 알코올 섭취를 위험으로 다룹니다. 이 안내에서 토끼에게 안전한 음주량을 제시하는 것은 아닙니다.', '음료와 흘린 술에 접근하지 못하게 하고 신선한 물을 제공하세요.', '술을 먹었다면 집에서 먹여 중화하려 하지 말고 동물병원에 제품·양·시간을 알려주세요.'],
    ['Do not give rabbits alcohol or alcohol-containing foods.', 'General pet toxicology guidance treats alcohol ingestion as dangerous. This page does not establish a safe drinking dose for rabbits.', 'Prevent access to drinks and spills; provide fresh water.', 'After exposure, do not try to neutralise it with food; contact a veterinarian with the product, amount and time.'],
    ['aspca']),
  beef: animal('소고기', 'beef'),
  chicken: animal('닭고기', 'chicken'),
  pork: animal('돼지고기', 'pork'),
  salmon: animal('연어', 'salmon'),
  tuna: animal('참치', 'tuna'),
  egg: record('danger', 'direct',
    ['달걀은 토끼에게 먹이지 마세요.', '토끼 급여 지침에서 달걀을 피하도록 합니다. 단백질을 보충한다는 이유로 초식동물의 식단에 달걀을 추가하지 마세요.', noFeedPreparation.ko, '삶은 달걀도 토끼 간식으로 권하지 않습니다.'],
    ['Do not feed eggs to rabbits.', 'Rabbit feeding guidance excludes eggs. Do not add them as a protein supplement to a herbivore feeding plan.', noFeedPreparation.en, 'Boiled eggs are not recommended rabbit treats either.'],
    ['rspca']),
  'fried-chicken': animal('치킨', 'fried chicken', '튀김옷·양념이 있는 치킨은 생닭 과육과도 다른 제품이며, 둘 다 토끼 식단으로 권하지 않습니다.', 'Batter and seasoning make fried chicken a different product from plain chicken; neither is recommended rabbit food.'),
  ham: animal('햄', 'ham', '가공육의 성분은 제품마다 다릅니다. 양념을 빼도 동물성 식품을 토끼에게 권하는 답으로 바뀌지 않습니다.', 'Ingredients vary between processed meats. Removing seasoning does not make animal products recommended rabbit food.'),
  sausage: animal('소시지', 'sausage', '제품마다 육류·지방·조미료 구성이 달라 토끼 급여량을 정하는 음식으로 다루지 않습니다.', 'Meat, fat and seasoning vary by product; this is not a food for which to establish a rabbit serving.'),
  milk: dairy('우유', 'milk'),
  cheese: dairy('치즈', 'cheese'),
  yogurt: dairy('요거트', 'yogurt', 'direct'),
  almond: nut('아몬드', 'Almonds'),
  macadamia: nut('마카다미아', 'Macadamia nuts'),
  peanut: nut('땅콩', 'Peanuts'),
  bread: record('danger', 'direct',
    ['빵은 토끼 간식으로 주지 마세요.', starchWhy.ko, noFeedPreparation.ko, '구운 빵뿐 아니라 발효 중인 생반죽도 접근하지 못하게 하세요.'],
    ['Do not offer bread as a rabbit treat.', starchWhy.en, noFeedPreparation.en, 'Keep both baked bread and rising raw dough out of reach.'],
    ['hrs', 'aspca']),
  rice: record('danger', 'category',
    ['밥은 토끼 간식이나 주식으로 권하지 않습니다.', starchWhy.ko, noFeedPreparation.ko, '흰밥·현미밥을 건초 대신 주지 마세요. 이 판단은 밥 한 입의 급성 독성을 입증한 결과는 아닙니다.'],
    ['Rice is not recommended as a rabbit treat or staple.', starchWhy.en, noFeedPreparation.en, 'Do not replace hay with white or brown rice. This is not evidence that one bite of rice is acutely toxic.'],
    ['hrs', 'merck']),
  ramen: record('danger', 'category',
    ['라면은 면과 국물 모두 토끼에게 주지 마세요.', '토끼의 섬유질 중심 식단에 맞지 않는 사람 음식입니다. 제품별 조미료가 다르고, 수의학 토끼 식단 안내도 짜거나 지방이 많은 간식을 피하도록 합니다.', noFeedPreparation.ko, '국물만 빼거나 면을 씻었다고 급여 가능한 토끼 먹이가 되는 것은 아닙니다.'],
    ['Do not give rabbits ramen noodles or broth.', 'This human dish does not fit a fibre-based rabbit diet. Seasoning varies, and rabbit nutrition guidance excludes salty or fatty treats.', noFeedPreparation.en, 'Removing broth or rinsing noodles does not establish suitability.'],
    ['merck']),
  kimchi: record('danger', 'category',
    ['김치는 토끼에게 먹이지 마세요.', '김치는 신선한 무양념 채소와 다릅니다. 제품마다 소금·양념·첨가물이 달라, 원재료 채소의 급여 안내를 김치에 적용하지 않습니다.', noFeedPreparation.ko, '배추나 오이를 먹을 수 있다는 말이 그 채소로 만든 김치도 괜찮다는 뜻은 아닙니다.'],
    ['Do not feed kimchi to rabbits.', 'Kimchi is not plain fresh produce. Salt, seasonings and added ingredients vary; vegetable-feeding advice does not establish safety of the prepared dish.', noFeedPreparation.en, 'A suitable vegetable does not make kimchi prepared from it suitable too.'],
    ['merck']),
  xylitol: record('unknown', 'limited',
    ['자일리톨을 토끼에게 안전하다고 권할 근거는 부족합니다. 일부러 주지 마세요.', '확인한 자료로 토끼의 안전 급여 조건을 정할 수 없습니다. 강아지의 저혈당·간 손상 사례를 토끼에게 똑같이 단정하지도 않습니다.', '자일리톨 함유 제품을 토끼 간식으로 선택하지 마세요.', '이미 먹었다면 껌·과자 등 제품의 다른 성분도 중요하므로 포장·양·시간을 가지고 동물병원에 상담하세요.'],
    ['There is not enough evidence to recommend xylitol for rabbits; do not deliberately feed it.', 'The checked sources do not establish rabbit feeding safety. Dog findings about hypoglycaemia or liver injury should not automatically be assigned to rabbits.', 'Do not choose xylitol-containing products as rabbit treats.', 'After ingestion, other ingredients in gum or sweets also matter. Contact a veterinarian with the package, amount and time.'],
    ['merck']),
};
