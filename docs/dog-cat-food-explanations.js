// Food-specific editorial decisions. Source scope is part of each record, not a safety guarantee.
const source = (title, url) => ({ title, url });
const sources = {
  dogDiet: source('PDSA veterinary team: dog diet and prepared fruit', 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/your-dogs-diet'),
  dogProduce: source('VCA: dog treat options and preparation', 'https://vcahospitals.com/resources/preventive-dog/nutrition/treats-to-skip-and-treats-to-share-with-your-pet'),
  dogFruit: source('VCA: fruit, vegetables and removable parts', 'https://vcahospitals.com/resources/preventive-dog/nutrition/can-you-feed-pets-certain-fruits-and-veggies'),
  dogTreats: source('VCA: foods listed as dog training treats', 'https://vcahospitals.com/know-your-pet/treats-for-training-dogs'),
  catTreats: source('VCA: foods listed as cat training treats', 'https://vcahospitals.com/know-your-pet/using-food-and-treats-for-training-cats'),
  treatList: source('NC State Veterinary Hospital: cat and dog treat examples', 'https://hospital.cvm.ncsu.edu/services/small-animals/nutrition/healthy-human-food-treats-for-pets/'),
  catDiet: source('Cornell Feline Health Center: diet context, not approval of every food', 'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-your-cat'),
  catCarbs: source('VCA: feline diet and cooked carbohydrates; category guidance only', 'https://vcahospitals.com/mission-animal-bird/know-your-pet/nutrition-feeding-guidelines-for-cats'),
  catHazards: source('Cornell Feline Health Center: foods to avoid', 'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/common-cat-hazards-0'),
  allium: source('Merck Veterinary Manual: onion and garlic family hazards', 'https://www.merckvetmanual.com/toxicology/food-hazards/garlic-and-onion-allium-spp-toxicosis-in-animals'),
  chocolate: source('Merck Veterinary Manual: chocolate toxicosis', 'https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals'),
  foodHazards: source('ASPCA Poison Control: ingredient hazards, not testing of this recipe', 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets'),
  dogXylitol: source('FDA: xylitol and dogs', 'https://www.fda.gov/consumers/consumer-updates/paws-xylitol-its-dangerous-dogs'),
  xylitolSpecies: source('Merck Veterinary Manual: xylitol risk is species-specific', 'https://www.merckvetmanual.com/toxicology/food-hazards/xylitol-toxicosis-in-dogs'),
  macadamia: source('Merck Veterinary Manual: macadamia syndrome reported in dogs', 'https://www.merckvetmanual.com/toxicology/food-hazards/macadamia-nut-toxicosis-in-dogs'),
  avocado: source('Pet Poison Helpline: avocado flesh, fat and pit distinctions', 'https://www.petpoisonhelpline.com/blog/can-dogs-eat-avocado/'),
  tomato: source('Pet Poison Helpline: ripe tomato versus plant and unripe fruit', 'https://www.petpoisonhelpline.com/poison/tomato-plant/'),
  mushrooms: source('Pet Poison Helpline: unidentified mushroom exposure', 'https://www.petpoisonhelpline.com/poison/mushrooms/'),
  rawFood: source('FDA: microbial risks of raw pet foods', 'https://www.fda.gov/animal-veterinary/animal-health-literacy/get-facts-raw-pet-food-diets-can-be-dangerous-you-and-your-pet'),
  catDairy: source('VCA: kitten dairy and human tuna cautions', 'https://vcahospitals.com/pediatric/kitten/health-wellness/human-foods-that-are-bad-for-kittens'),
  dogRice: source('PDSA: plain rice in short-term bland feeding, not a complete diet', 'https://www.pdsa.org.uk/pet-help-and-advice/pet-health-hub/conditions/gastroenteritis-stomach-upset-in-dogs'),
};

const foodNames = [
  ['apple','사과','apple'],['grape','포도','grapes'],['chocolate','초콜릿','chocolate'],['onion','양파','onion'],['carrot','당근','carrot'],['blueberry','블루베리','blueberries'],['avocado','아보카도','avocado'],['cheese','치즈','cheese'],['sweet-potato','고구마','sweet potato'],['xylitol','자일리톨','xylitol'],
  ['cabbage','배추','Napa cabbage'],['banana','바나나','banana'],['strawberry','딸기','strawberries'],['watermelon','수박','watermelon'],['pear','배','pear'],['peach','복숭아','peach'],['orange','오렌지','orange'],['lemon','레몬','lemon'],['pineapple','파인애플','pineapple'],['mango','망고','mango'],
  ['potato','감자','potato'],['tomato','토마토','tomato'],['broccoli','브로콜리','broccoli'],['cucumber','오이','cucumber'],['pumpkin','단호박','kabocha squash'],['lettuce','상추','lettuce'],['spinach','시금치','spinach'],['garlic','마늘','garlic'],['green-onion','대파','green onion'],['mushroom','버섯','mushroom'],
  ['egg','계란','egg'],['chicken','닭고기','chicken'],['pork','돼지고기','pork'],['beef','소고기','beef'],['salmon','연어','salmon'],['tuna','참치','tuna'],['milk','우유','milk'],['yogurt','요거트','yogurt'],['peanut','땅콩','peanuts'],['almond','아몬드','almonds'],
  ['rice','쌀밥','cooked rice'],['bread','빵','bread'],['ramen','라면','instant noodles'],['kimchi','김치','kimchi'],['fried-chicken','치킨','fried chicken'],['sausage','소시지','sausage'],['ham','햄','ham'],['coffee','커피','coffee'],['alcohol','술','alcohol'],['macadamia','마카다미아','macadamia nuts'],
];
const names = Object.fromEntries(foodNames.map(([slug, ko, en]) => [slug, { ko, en }]));
// Reader-facing rationales are separate from the citation-scope label.
// These explain the food form and dietary role, not unverified therapeutic benefits.
const produceReasons = {
  apple: ['허용 대상으로 보는 것은 씻은 사과 과육입니다. 씨·심을 포함한 통사과와는 다르며, 과육도 평소 식사를 대신하는 음식은 아닙니다.', 'The option under discussion is washed apple flesh, not a whole apple with seeds and core. The flesh still does not replace the regular meal.'],
  carrot: ['당근은 무양념 채소 간식으로 고려할 수 있지만, 단단한 뿌리를 통째로 삼키는 것과 잘라서 먹는 것은 다릅니다. 씹는 능력에 맞춘 준비가 중요합니다.', 'Plain carrot can be considered a vegetable treat, but a whole firm root differs from prepared pieces. Preparation must suit the pet’s ability to chew.'],
  blueberry: ['생블루베리와 설탕·초콜릿 등이 들어간 블루베리 제품은 다른 음식입니다. 생과일을 간식으로 추가해도 그 열량은 평소 식사에 더해집니다.', 'Fresh blueberries differ from products containing added sugar or chocolate. Even fresh fruit adds calories alongside the usual diet.'],
  'sweet-potato': ['이 안내는 익힌 고구마를 간식으로 쓰는 경우입니다. 고구마가 들어간 간식도 추가 음식이며, 고구마만 먹여서는 평소 주식의 영양 구성을 대신할 수 없습니다.', 'This guidance concerns cooked sweet potato as a treat. It remains extra food, and sweet potato alone cannot replace the nutritional composition of the regular diet.'],
  banana: ['껍질을 벗긴 바나나 과육이 대상입니다. 단 과일은 간식으로만 고려하고, 여러 번 나눠 주더라도 하루에 추가한 음식이라는 점은 같습니다.', 'The option is peeled banana flesh. Sweet fruit is an optional treat; repeated small offerings still count as extra food during the day.'],
  strawberry: ['씻은 딸기 과육은 생과일 간식으로 고려할 수 있습니다. 딸기가 들어갔다고 해서 설탕이나 다른 재료가 섞인 잼·케이크까지 같은 허용 대상이 되지는 않습니다.', 'Washed strawberry flesh can be considered a fresh-fruit treat. Strawberry in a product does not approve jam or cake with sugar and other ingredients.'],
  watermelon: ['판정은 씨와 단단한 껍질을 뺀 수박 과육 기준입니다. 사람이 먹고 남긴 껍질까지 씹게 하는 것은 과육 간식과 다른 문제입니다.', 'This assessment concerns watermelon flesh without seeds or firm rind. Chewing leftover rind is a different question from a prepared flesh treat.'],
  pear: ['씨와 심을 제거한 배 과육이 대상입니다. 씨·심이 남은 큰 조각과 배즙·가공 디저트는 재료와 먹는 형태가 달라 같은 판정으로 묶지 않습니다.', 'The option is pear flesh without seeds and core. Large pieces containing the core, juice and desserts differ in form or ingredients.'],
  peach: ['복숭아 과육과 단단한 씨는 구분해야 합니다. 과육을 간식으로 고려할 수 있다는 설명은 씨를 씹거나 삼켜도 된다는 뜻이 아닙니다.', 'Peach flesh and its hard stone must be distinguished. Considering the flesh as a treat does not permit chewing or swallowing the stone.'],
  orange: ['이 안내는 껍질과 씨를 제거한 오렌지 과육에 한정됩니다. 같은 오렌지라도 껍질·잎·정유·농축 음료는 먹는 부위나 구성이 달라 별도 확인이 필요합니다.', 'This guidance is limited to orange flesh without peel and seeds. Peel, leaves, essential oil and concentrated drinks differ in part or formulation.'],
  pineapple: ['간식으로 고려하는 부분은 두꺼운 껍질과 질긴 부위를 제거한 파인애플 과육입니다. 설탕 시럽 제품이나 다른 요리는 생과육과 성분 구성이 다릅니다.', 'The option is pineapple flesh with tough peel and firm parts removed. Syrup-packed products and mixed dishes differ from fresh flesh.'],
  mango: ['큰 씨와 껍질을 뺀 망고 과육이 대상입니다. 과육을 먹을 수 있다는 안내를 씨가 남은 통망고나 망고 맛 가공식품의 허용으로 넓히지 않습니다.', 'The option is mango flesh without the large stone and skin. Flesh guidance does not approve whole mangoes or mango-flavored processed foods.'],
  potato: ['감자는 생것과 익힌 무양념 형태를 구분해야 합니다. 생감자의 솔라닌 위험 때문에 그대로 급여하지 않으며, 녹색 부분이나 싹이 있는 감자를 조리로 안전하게 만들겠다고 시도하지 마세요.', 'Distinguish raw potato from plain cooked potato. Raw-potato solanine is a concern; do not try to make green or sprouted potatoes acceptable merely by cooking them.'],
  broccoli: ['무양념 브로콜리는 채소 간식으로 고려할 수 있지만 많은 양의 채소를 주식 대신 먹이는 것은 다른 문제입니다. 브로콜리만으로 균형 잡힌 식사를 구성할 수는 없습니다.', 'Plain broccoli can be considered a vegetable treat, but replacing meals with a large vegetable portion is a different question. Broccoli alone is not a balanced meal.'],
  cucumber: ['씻은 생오이는 무양념 채소 간식으로 고려하는 재료입니다. 절이거나 양념하면 소금·소스 등 다른 재료가 더해지므로 생오이와 같은 판정을 쓰지 않습니다.', 'Washed fresh cucumber is the plain vegetable under discussion. Pickling or dressing adds ingredients, so those products do not share the fresh-cucumber assessment.'],
  pumpkin: ['확인한 자료의 대상은 익힌 호박 또는 첨가물 없는 호박 퓌레입니다. 단호박에 이 범주를 참고하되, 특정 품종이나 제품마다 안전량을 시험한 자료로 보지는 않습니다.', 'The sources discuss cooked pumpkin or plain pumpkin puree. This is category context for kabocha, not tested portions for every cultivar or product.'],
  lettuce: ['종류를 확인한 식용 상추 잎을 무양념 간식으로 고려하는 경우입니다. 드레싱이 있는 샐러드나 모르는 야생 잎은 재료가 달라 같은 허용 대상이 아닙니다.', 'This concerns identified edible lettuce leaves as a plain treat. Dressed salad and unidentified wild leaves are different foods.'],
};
const record = (status, evidence, reference, ko, en) => ({
  status, evidence, sources: reference, ko: { answer: ko[0], why: ko[1], preparation: ko[2], avoid: ko[3] }, en: { answer: en[0], why: en[1], preparation: en[2], avoid: en[3] },
});

// A missing species-specific assessment is not filled by copying another animal's verdict.
export const dogCatFoodExplanations = { dog: {}, cat: {} };
for (const species of ['dog', 'cat']) for (const [slug, ko, en] of foodNames) {
  const petKo = species === 'dog' ? '강아지' : '고양이';
  const petEn = species === 'dog' ? 'dogs' : 'cats';
  dogCatFoodExplanations[species][slug] = record('unknown', 'limited', [species === 'dog' ? sources.dogDiet : sources.catDiet],
    [`${ko}의 ${petKo} 급여 적합성을 충분히 확인하지 못했습니다. 확인 전에는 새 간식으로 주지 마세요.`, `이 페이지에서 연결한 자료는 식단의 배경 자료이며, ${ko} 자체의 종별 안전량을 검증한 자료는 아닙니다. ‘사람이 먹는다’는 이유만으로 허용하지 않습니다.`, `수의사에게 정확한 식품명·부위·조리법과 현재 먹는 사료를 알려 적합성을 확인하세요.`, `다른 동물의 ‘가능’ 판정이나 사료의 원재료 표시를 이 음식의 자유 급여 허가로 사용하지 마세요.`],
    [`We have not sufficiently assessed ${en} as a treat for ${petEn}. Do not introduce it before checking.`, `The linked diet background does not establish a food-specific safe portion. Human edibility is not our approval criterion.`, `Ask your veterinarian with the exact food, part, preparation and current diet.`, `Do not copy another species' verdict or treat an ingredient list as permission for unrestricted feeding.`]);
}

function preparedProduce(species, slug, status, reference, preparationKo, preparationEn, avoidKo, avoidEn, evidence = 'direct') {
  const { ko, en } = names[slug];
  const [referenceNoteKo, referenceNoteEn] = produceReasons[slug] || ['확인한 자료의 범위 안에서 준비 형태와 식단 역할을 구분합니다.', 'Preparation and dietary role are distinguished within the evidence reviewed.'];
  dogCatFoodExplanations[species][slug] = record(status, evidence, [reference],
    [`${ko}: 아래 준비 조건을 지킨 음식만 가끔 간식으로 고려하세요. 주식을 대신하지 않습니다.`, referenceNoteKo, preparationKo, avoidKo],
    [`${en[0].toUpperCase() + en.slice(1)}: consider only an occasional treat prepared as described below, not a replacement meal.`, referenceNoteEn, preparationEn, avoidEn]);
}

// Prepared food forms are deliberately named; juice, confectionery and seasoned meals are different questions.
const dogProduce = [
  ['apple','safe',sources.dogProduce,'씻고 씨·심을 제거한 과육을 작게 자르세요.','Wash, remove seeds and core, and cut the flesh.','통사과·사과씨·설탕을 넣은 사과 디저트는 이 설명에 포함되지 않습니다.','This does not cover whole apples, seeds or sweetened desserts.'],
  ['carrot','safe',sources.dogFruit,'씻은 당근을 삼키기 쉬운 크기로 잘라 주세요. 딱딱한 것을 잘 못 씹으면 익혀 준비하세요.','Wash and cut; use cooked pieces when chewing firm food is difficult.','긴 당근을 통째로 주거나 볶음 양념을 더하지 마세요.','Avoid whole long carrots and seasoned stir-fry.'],
  ['blueberry','safe',sources.dogTreats,'씻은 생과육만 준비하고 처음에는 다른 새 간식과 섞지 마세요.','Use washed fruit, separately from other unfamiliar treats.','머핀·잼·블루베리 초콜릿의 재료를 생과일과 같다고 보지 마세요.','Muffins, jam and chocolate-covered berries are different products.'],
  ['sweet-potato','safe',sources.dogProduce,'껍질을 제거하고 충분히 익힌 뒤 식혀서 잘라 주세요.','Peel, cook thoroughly, cool and cut.','버터·설탕을 더한 맛탕, 생고구마 덩어리와 같은 판단은 아닙니다.','Do not extend this to candied dishes or large raw chunks.'],
  ['banana','safe',sources.dogFruit,'껍질을 벗긴 과육을 작게 나누고 별도 간식으로 기록하세요.','Peel and divide the flesh; record it as an extra treat.','바나나칩·빵·우유 음료는 첨가 성분을 따로 확인하세요.','Check chips, bread and milk drinks separately.'],
  ['strawberry','safe',sources.dogTreats,'씻고 꼭지를 제거한 과육을 작게 자르세요.','Wash, remove the top and cut the fruit.','생딸기 안내를 딸기잼·케이크 급여에 적용하지 마세요.','Fresh-fruit advice does not approve jam or cake.'],
  ['watermelon','safe',sources.dogFruit,'씨와 단단한 껍질을 제거한 과육만 잘라 주세요.','Remove seeds and the firm rind; serve cut flesh only.','껍질째 씹게 하거나 큰 조각을 통째로 주지 마세요.','Do not offer rind or large uncut pieces.'],
  ['pear','safe',sources.dogDiet,'씨·심을 제거한 배 과육만 준비하세요.','Use pear flesh without seeds or core.','배즙·통조림·가공 디저트는 별도 제품입니다.','Juice, canned pears and desserts are separate products.'],
  ['peach','caution',sources.dogDiet,'씨를 완전히 제거한 과육만 작게 자르세요.','Remove the stone completely and cut the flesh.','씨를 장난감처럼 주지 마세요. 씨를 삼켰다면 병원에 확인하세요.','Never offer the stone as a chew; seek advice if swallowed.'],
  ['orange','caution',sources.dogDiet,'껍질과 씨를 제거한 과육만 대상으로 삼으세요.','Consider only flesh with peel and seeds removed.','껍질·잎·정유·오렌지 음료로 확대하지 마세요.','This does not cover peel, leaves, essential oil or drinks.'],
  ['pineapple','safe',sources.dogProduce,'두꺼운 껍질과 질긴 부위를 제거한 신선한 과육을 작게 자르세요.','Remove the tough peel and firm parts; cut fresh flesh.','설탕 시럽 통조림·피자·파인애플 디저트는 별도로 확인하세요.','Check syrup-packed fruit, pizza and desserts separately.'],
  ['mango','safe',sources.dogDiet,'껍질과 큰 씨를 제거한 과육만 준비하세요.','Use flesh with skin and large stone removed.','씨째 주거나 망고 가공 음료를 같은 간식으로 취급하지 마세요.','Do not offer the stone or substitute processed mango drinks.'],
  ['potato','caution',sources.dogDiet,'녹색 부분이나 싹이 없는 감자를 껍질 없이 익혀 소박하게 준비하세요.','Use a non-green, unsprouted potato, peeled and cooked plain.','생감자·녹색 감자·싹·감자튀김을 이 안내로 허용하지 마세요.','This does not approve raw, green or sprouted potatoes, or fries.'],
  ['broccoli','caution',sources.dogProduce,'씻은 브로콜리를 작게 잘라 간식 후보로만 고려하세요.','Wash and cut broccoli; keep it an optional treat.','밥그릇을 브로콜리로 채우거나 소스·버터를 넣지 마세요.','Do not fill the meal bowl with it or add sauce or butter.'],
  ['cucumber','safe',sources.dogProduce,'씻은 생오이를 작게 썰어 주세요.','Wash and cut plain fresh cucumber.','피클·오이김치·양념 무침은 생오이가 아닙니다.','Pickles, kimchi and dressed cucumber are different foods.'],
  ['pumpkin','caution',sources.dogProduce,'씨와 단단한 껍질을 제거하고 익힌 과육을 준비하세요. 자료는 익힌 호박 범주의 안내입니다.','Use cooked flesh without seeds or firm skin; the source addresses cooked pumpkin as a category.','단호박만으로 식사를 구성하거나 호박 디저트를 주지 마세요.','Do not build meals from pumpkin alone or offer pumpkin desserts.','category'],
  ['lettuce','safe',sources.dogTreats,'종류를 확인한 식용 상추를 씻고 작게 나누세요.','Identify edible lettuce, wash and cut it.','드레싱을 묻힌 샐러드나 모르는 야생 잎을 포함하지 않습니다.','This excludes dressed salad and unidentified wild leaves.'],
];
for (const [slug, status, ref, prepKo, prepEn, avoidKo, avoidEn, evidence] of dogProduce) preparedProduce('dog', slug, status, ref, prepKo, prepEn, avoidKo, avoidEn, evidence);

for (const slug of ['apple','carrot','blueberry','banana','strawberry','watermelon','broccoli','cucumber','pumpkin']) {
  const dogRecord = dogCatFoodExplanations.dog[slug];
  const pumpkin = slug === 'pumpkin';
  preparedProduce('cat', slug, ['blueberry','strawberry','cucumber'].includes(slug) ? 'safe' : 'caution', ['apple','blueberry','strawberry','watermelon'].includes(slug) ? sources.catTreats : sources.treatList,
    pumpkin ? '첨가물이 없는 익힌 호박 과육만 대상으로 합니다. 자료의 호박 퓌레를 모든 단호박 제품의 검증으로 보지는 않습니다.' : dogRecord.ko.preparation,
    pumpkin ? 'Consider plain cooked flesh; pumpkin puree guidance is not testing of every pumpkin product.' : dogRecord.en.preparation,
    `${dogRecord.ko.avoid} 고양이가 싫어하면 먹일 필요는 없습니다.`, `${dogRecord.en.avoid} There is no need to make an uninterested cat eat it.`, pumpkin ? 'category' : 'direct');
}

const meatForms = {
  chicken: ['껍질·뼈·양념을 빼고 속까지 익힌 닭고기', 'fully cooked chicken without skin, bones or seasoning'],
  beef: ['뼈·양념과 과도한 지방을 제거하고 익힌 소고기', 'cooked beef without bones, seasoning or excess fat'],
  pork: ['뼈·양념과 과도한 지방을 제거하고 속까지 익힌 돼지고기', 'fully cooked pork without bones, seasoning or excess fat'],
  salmon: ['가시를 꼼꼼히 제거하고 익힌 무양념 연어', 'plain cooked salmon with bones removed'],
  tuna: ['가시를 제거하고 익힌 무양념 참치', 'plain cooked tuna with bones removed'],
};
for (const species of ['dog','cat']) for (const [slug, [formKo, formEn]] of Object.entries(meatForms)) {
  const category = slug === 'pork';
  const optional = ['pork','salmon','tuna'].includes(slug);
  dogCatFoodExplanations[species][slug] = record(optional ? 'caution' : 'safe', category ? 'category' : 'direct', [category ? (species === 'dog' ? sources.dogTreats : sources.catTreats) : sources.treatList, sources.rawFood],
    [`${names[slug].ko}: ${formKo}만 가끔 간식으로 고려하세요.`, category ? '익힌 고기 범주의 안내입니다. 돼지고기의 모든 부위·제품을 검증한 것은 아닙니다.' : '연결한 간식 자료에 익힌 형태가 포함됩니다. 한 재료가 영양 균형을 갖춘 주식이라는 뜻은 아닙니다.', `${formKo}를 식혀서 작게 나누세요.`, '생고기·회·훈제 제품·통조림 양념 제품은 제외합니다. 처방식이나 음식 알레르기가 있다면 먼저 상담하세요.'],
    [`${names[slug].en[0].toUpperCase() + names[slug].en.slice(1)}: consider only an occasional treat of ${formEn}.`, category ? 'Cooked-meat category guidance does not test every pork cut or product.' : 'The linked treat guidance includes the cooked form; one ingredient is not a balanced meal.', `Cool and cut ${formEn}.`, 'This excludes raw, smoked and seasoned canned products. Check first for prescribed diets or food allergies.']);
}

for (const species of ['dog','cat']) {
  dogCatFoodExplanations[species].egg = record('safe','direct',[species === 'dog' ? sources.dogTreats : sources.catTreats, sources.rawFood],
    ['계란은 완전히 익히고 양념하지 않은 형태만 간식으로 고려하세요.','익힌 계란은 간식 예시에 포함되지만 계란만으로 주식을 구성할 수는 없습니다.','흰자와 노른자를 모두 익혀 식힌 뒤 작게 나누세요.','날계란·소금·버터를 넣은 계란 요리와 마요네즈는 같은 판단이 아닙니다.'],
    ['Consider only fully cooked, unseasoned egg as an occasional treat.','Cooked egg is a listed treat, not a complete meal.','Cook both white and yolk, cool and divide.','Raw eggs, salted or buttered dishes and mayonnaise are different products.']);
  dogCatFoodExplanations[species].avocado = record('caution','direct',[sources.avocado],
    ['아보카도는 간식으로 권하지 않습니다. 과육·씨·껍질을 구분해야 합니다.','강아지·고양이의 과육을 새·토끼와 같은 독성으로 단정하지 않습니다. 다만 씨와 지방 때문에 ‘무독성’과 ‘급여 권장’은 다릅니다.','급여용으로 준비하기보다는 접근하지 못하게 보관하세요. 먹었다면 어느 부위인지 확인하세요.','씨를 삼켰거나 이상 상태가 있으면 병원에 연락하세요. 양파·마늘이 들어간 과카몰리도 별도 위험입니다.'],
    ['Avocado is not recommended as a treat; distinguish flesh, pit and skin.','Dog and cat flesh exposure is not the same as bird or rabbit toxicity. A pit and fat still make non-toxic different from recommended.','Keep it out of reach; identify which part was eaten.','Contact a veterinarian for pit ingestion or illness. Guacamole with onion or garlic is a separate concern.']);
  dogCatFoodExplanations[species].cheese = record('caution','direct',[species === 'dog' ? sources.dogTreats : sources.catTreats, sources.foodHazards],
    ['치즈는 필수 간식이 아닙니다. 종류와 성분을 확인하고 유제품에 탈이 나는 아이는 피하세요.','치즈가 간식 목록에 있어도 유제품 소화와 지방·염분은 따로 고려해야 합니다.','첨가물 없는 종류인지 확인하세요. 평소 유제품 반응이 나빴다면 다른 간식을 고르세요.','곰팡이 치즈·양념 치즈·치즈 소스와는 구분하세요. ‘락토프리’도 모든 조건의 안전 보증은 아닙니다.'],
    ['Cheese is optional; check the type and skip it when dairy causes problems.','Treat-list inclusion does not settle dairy tolerance, fat or salt concerns.','Check ingredients and choose another reward after previous dairy upset.','Distinguish moldy cheese, flavored cheese and sauces. Lactose-free is not an all-purpose safety guarantee.']);
  for (const slug of ['milk','yogurt']) dogCatFoodExplanations[species][slug] = record('caution','category',[sources.foodHazards, ...(species === 'cat' ? [sources.catDairy] : [])],
    [`${names[slug].ko}는 일부 아이에게 소화 문제를 일으킬 수 있어 기본 간식으로 권하지 않습니다.`, '유제품 범주의 주의사항입니다. 모든 우유·요거트 제품의 적합성을 각각 확인한 것은 아닙니다.', '매일 먹는 물과 주식을 대신하지 마세요. 제품 성분과 평소 유제품 반응을 수의사에게 알려 확인하세요.', '설탕·감미료·초콜릿 등이 든 제품은 따로 확인해야 합니다. 무가당·유당 제거만으로 제한 없이 줄 수 있는 것은 아닙니다.'],
    [`${names[slug].en[0].toUpperCase() + names[slug].en.slice(1)} may cause digestive upset and is not our default treat choice.`, 'This is dairy-category caution, not testing of every product.', 'Do not replace water or meals; discuss the label and previous dairy reactions.', 'Assess sweeteners, chocolate and other additions separately. Unsweetened or lactose-free does not mean unlimited.']);
  dogCatFoodExplanations[species].almond = record('caution','direct',[sources.foodHazards],
    ['아몬드는 간식으로 권하지 않습니다. ‘독성 없음’만으로 적합한 간식이 되지는 않습니다.','견과류의 지방 때문에 소화기 문제가 생길 수 있다는 안내가 있습니다.','급여를 계획하기보다 평소 먹던 적합한 간식으로 바꾸세요. 먹었다면 원물인지 가공품인지 기록하세요.','소금·초콜릿 코팅 제품과 아몬드 가공 음료는 각각 성분을 확인해야 합니다.'],
    ['Almonds are not recommended treats; lack of a specific poison is not nutritional suitability.','Nut fats can contribute to digestive problems.','Choose an established appropriate treat; record whether an exposure involved plain nuts or a product.','Check salted or chocolate-coated almonds and almond drinks separately.']);
  dogCatFoodExplanations[species].peanut = record('unknown','limited',[species === 'cat' ? sources.catTreats : sources.dogTreats],
    ['일반 땅콩의 급여 적합성을 충분히 확인하지 못했습니다. 땅콩버터와도 구분하세요.','땅콩버터의 첨가 성분 주의사항은 땅콩 원물의 안전량을 정한 근거가 아닙니다.','새 간식으로 주기 전에 원물·가공품 구분과 성분표를 확인해 상담하세요.','소금·감미료가 들어간 제품을 원물과 같다고 보지 마세요. 특히 강아지는 자일리톨을 피해야 합니다.'],
    ['Plain-peanut suitability has not been sufficiently assessed; peanuts are not peanut butter.','Warnings about peanut-butter ingredients do not establish a plain-peanut portion.','Check the form and label with your veterinarian before introducing it.','Do not equate salted or sweetened products with plain nuts; xylitol is particularly hazardous for dogs.']);
  dogCatFoodExplanations[species].lemon = record('caution','category',[sources.foodHazards],
    ['레몬은 일부러 간식으로 주지 않는 편이 좋습니다. 과육과 껍질·잎·정유는 다릅니다.','감귤류의 산과 정유에 대한 주의사항을 적용한 권고입니다. 적은 과육 섭취를 곧바로 심한 중독이라고 단정하지 않습니다.','급여용으로 준비하기보다 아이가 접근하지 못하게 보관하세요.','레몬 정유·농축액·껍질째 제품에 생과육 설명을 적용하지 마세요.'],
    ['Do not deliberately offer lemon as a treat; flesh differs from peel, leaves and essential oil.','This applies citrus-category precautions, without calling every small flesh exposure severe poisoning.','Keep it out of reach rather than preparing a serving.','Do not extend flesh guidance to essential oil, concentrate or peel-containing products.']);
  dogCatFoodExplanations[species].tomato = record('caution','direct',[sources.tomato],
    ['토마토는 완숙 과육과 덜 익은 열매·잎·줄기를 반드시 구분하세요.','위험 성분은 부위와 성숙도에 따라 다릅니다. 완숙 과육의 낮은 독성 위험이 식물 전체의 허용을 뜻하지 않습니다.','대상은 꼭지·잎·줄기를 제거한 완숙 과육입니다. 아이에게 맞는지는 별도로 확인하세요.','덜 익은 열매·줄기·잎을 먹었다면 병원에 상담하세요. 케첩·소스는 다른 재료가 있는 제품입니다.'],
    ['Distinguish ripe tomato flesh from unripe fruit, leaves and stems.','Risk depends on plant part and ripeness; lower risk from ripe flesh does not approve the entire plant.','Only ripe flesh without plant material is under discussion; individual suitability still needs checking.','Consult a veterinarian for unripe-fruit or plant exposure. Ketchup and sauce are mixed products.']);
  dogCatFoodExplanations[species].mushroom = record('unknown','limited',[sources.mushrooms],
    ['‘버섯’이라는 이름만으로 안전 판정을 할 수 없습니다. 야생 버섯은 먹이지 마세요.','식용 판매 버섯과 독버섯을 하나의 음식으로 묶을 수 없습니다. 전문가가 확인하지 않은 버섯은 사진이나 외형만으로 판단하지 않습니다.','급여 전 정확한 종과 판매 식품 여부·조리 상태를 확인하세요.','산책 중 버섯을 먹었다면 증상을 기다리지 말고 병원에 연락하세요. 온라인에서 종을 추측해 안심하지 마세요.'],
    ['The word mushroom is too broad for a safety verdict. Never offer wild mushrooms.','Store-bought edible species and toxic fungi cannot be one food assessment; appearance is not expert identification.','Confirm the exact species, food origin and preparation before considering a treat.','Call a veterinarian after an unidentified outdoor mushroom exposure rather than waiting for signs or guessing online.']);
}

dogCatFoodExplanations.dog.rice = record('caution','direct',[sources.dogRice],
  ['무양념 익힌 쌀밥은 먹을 수 있지만 쌀밥만으로 주식을 구성하지 마세요.','자료의 쌀밥은 단기간의 소박한 식사 맥락입니다. 균형 잡힌 장기 식단이나 설사 원인 진단을 대신하지 않습니다.','소금·소스 없이 익힌 밥만 대상으로 합니다. 평소 식단 변경은 수의사와 확인하세요.','볶음밥·양념밥·생쌀에 같은 설명을 적용하지 마세요. 아픈 아이에게 이 글만 보고 치료 식단을 정하지 마세요.'],
  ['Plain cooked rice may be eaten, but rice alone is not a complete meal plan.','The source discusses short-term bland feeding, not a balanced long-term diet or a diagnosis.','Consider only rice cooked without salt or sauce; discuss diet changes.','This excludes fried rice, seasoned rice and raw grains. Do not use this page to prescribe treatment for illness.']);
dogCatFoodExplanations.cat.rice = record('caution','category',[sources.catCarbs],
  ['쌀밥은 고양이의 필수 간식이 아닙니다. 먹는다면 익힌 무양념 형태인지 먼저 확인하세요.','고양이가 익힌 탄수화물을 소화할 수 있다는 범주 설명이지, 쌀밥만으로 필요한 영양을 얻는다는 뜻은 아닙니다.','사료를 밥으로 바꾸지 말고, 필요하면 현재 식단과 함께 수의사에게 확인하세요.','볶음밥·카레밥·김밥처럼 여러 재료가 섞인 음식은 별도로 판단해야 합니다.'],
  ['Rice is not a necessary cat treat; first distinguish plain cooked rice from mixed dishes.','Cooked-carbohydrate digestion is category guidance, not evidence that rice supplies complete feline nutrition.','Do not replace cat food with rice; discuss it alongside the current diet if needed.','Fried rice, curry rice and rolls require separate ingredient assessments.']);

for (const species of ['dog','cat']) {
  dogCatFoodExplanations[species].bread = record('caution','category',[sources.foodHazards],
    ['빵은 종류마다 성분이 달라 이름만으로 허용하지 않습니다. 생반죽은 특히 피하세요.','생효모 반죽 위험과 건포도·초콜릿 등의 재료 위험은 익힌 무첨가 빵과 구분해야 합니다.','이미 먹었다면 제품명과 재료표, 익힌 빵인지 생반죽인지 확인하세요.','생반죽·건포도빵·초콜릿빵·양파나 마늘이 들어간 빵을 간식으로 주지 마세요.'],
    ['Bread cannot be approved by name alone; avoid raw yeast dough in particular.','Dough and hazardous fillings are different questions from baked plain bread.','For an exposure, identify the product, ingredients and whether it was dough or baked bread.','Do not offer raw dough or bread with raisins, chocolate, onion or garlic.']);
  const processed = {
    ramen: ['면보다 스프·국물·소스 성분 확인이 중요합니다.', 'The seasoning, broth and sauce matter more than the noodle name.'],
    kimchi: ['배추 자체와 김치는 다른 음식입니다. 양념과 젓갈 등 실제 재료를 확인해야 합니다.', 'Plain cabbage and kimchi are different foods; check the actual seasoning and added ingredients.'],
    'fried-chicken': ['익힌 무양념 닭고기와 배달 치킨은 다릅니다. 튀김옷·소스·뼈·양념을 확인해야 합니다.', 'Plain cooked chicken differs from takeaway chicken; check coating, sauce, bones and seasoning.'],
    sausage: ['소시지라는 이름만으로 육류와 향신료·염분의 구성을 알 수 없습니다.', 'The word sausage does not identify the meat, seasoning or salt formulation.'],
    ham: ['햄은 익힌 고기와 달리 제조법과 첨가 성분이 있는 가공식품입니다.', 'Ham is a processed product with preparation and added ingredients to check.'],
  };
  for (const [slug, [noteKo, noteEn]] of Object.entries(processed)) dogCatFoodExplanations[species][slug] = record('danger','category',[sources.allium,sources.foodHazards],
    [`${names[slug].ko}는 간식으로 급여하지 마세요. 제품마다 위험 재료가 다르므로 섭취 후 대응은 성분으로 판단해야 합니다.`, `${noteKo} 이 판정은 ‘모든 한 입이 중독’이라는 뜻이 아니라 사람용 혼합 요리를 권하지 않는다는 뜻입니다.`, '급여용으로 씻거나 양념을 겉에서 떼어내기보다 별도의 무양념 재료를 선택하세요.', '먹었다면 포장지·메뉴명·추정량·시각을 기록하세요. 양파·마늘 등 위험 성분이나 뼈 섭취·이상 상태가 있으면 병원에 연락하세요.'],
    [`Do not offer ${names[slug].en} as a treat; assess an exposure using the actual ingredients.`, `${noteEn} This is an unsuitable mixed-food recommendation, not a claim that every bite causes poisoning.`, 'Choose a separate plain ingredient rather than relying on rinsing or stripping visible seasoning.', 'Keep the label or menu and record amount and time. Contact a veterinarian for hazardous ingredients, swallowed bones or illness.']);
}

function hazard(slug, reference, whyKo, whyEn) {
  for (const species of ['dog','cat']) dogCatFoodExplanations[species][slug] = record('danger','direct',reference,
    [`${names[slug].ko}: 급여하지 마세요. 먹었거나 먹었을 가능성이 있으면 동물병원에 확인하세요.`, whyKo, '안전하게 먹이기 위한 조리법을 이 페이지에서 제시하지 않습니다. 먹은 제품·양·시각을 기록하세요.', '증상을 기다려 안심하거나 집에서 임의로 구토를 유도하지 마세요. 치료 여부는 수의사가 판단합니다.'],
    [`${names[slug].en[0].toUpperCase() + names[slug].en.slice(1)}: do not feed; check suspected ingestion with a veterinarian.`, whyEn, 'No safe feeding preparation is provided here. Record the product, amount and time.', 'Do not wait for signs to declare safety or induce vomiting at home; a veterinarian decides care.']);
}
hazard('chocolate',[sources.chocolate,sources.catHazards],'테오브로민과 카페인이 위험 성분입니다. 제품마다 함량이 달라 초콜릿 종류와 실제 먹은 제품을 확인해야 합니다.','Theobromine and caffeine are hazards; concentrations differ between products, so identify the actual chocolate.');
for (const slug of ['onion','garlic','green-onion']) hazard(slug,[sources.allium],`${names[slug].ko}는 양파·마늘과 같은 파속 식물입니다. 적혈구 손상 위험이 있으며 익힌 형태나 분말도 제외 대상입니다.`,`This is an Allium food with red-blood-cell injury risk, including cooked or powdered forms.`);
hazard('coffee',[sources.foodHazards],'카페인 때문에 급여하지 않습니다. 커피 음료뿐 아니라 원두·분말·커피가 든 가공식품도 구분해 확인하세요.','Caffeine is the concern; distinguish drinks, beans, grounds and coffee-containing products.');
hazard('alcohol',[sources.foodHazards],'알코올이 든 음료와 음식은 급여하지 않습니다. ‘조리했음’이나 제품 이름만으로 알코올이 없다고 확정하지 마세요.','Avoid alcohol-containing drinks and foods; a recipe name or cooking claim alone does not establish its absence.');

dogCatFoodExplanations.dog.grape = record('danger','direct',[sources.foodHazards],
  ['포도와 건포도는 강아지에게 주지 마세요. 먹었다면 증상이 없어도 동물병원에 연락하세요.','강아지에서 신장 손상 위험이 확인되어 있습니다. 온라인에서 안전한 알 수를 정할 수 없습니다.','급여를 위한 손질법은 없습니다. 포도·건포도가 든 음식도 확인하세요.','체중·제품·추정량·시각을 병원에 알려 주세요. 집에서 임의로 구토를 유도하지 마세요.'],
  ['Do not feed grapes or raisins to dogs. Contact a veterinarian after ingestion, even without symptoms.','Kidney injury is a recognized canine risk; this page cannot establish a safe number.','There is no feeding preparation recommended here; check foods containing grapes or raisins too.','Report weight, product, estimated amount and time. Do not induce vomiting yourself.']);
dogCatFoodExplanations.cat.grape = record('danger','direct',[sources.catHazards],
  ['고양이에게 포도·건포도를 간식으로 주지 마세요. 먹었다면 수의사에게 상담하세요.','Cornell의 고양이 회피 음식 목록에 포함됩니다. 강아지의 신장 중독 자료를 고양이의 정확한 중독량으로 바꾸지는 않습니다.','급여를 위한 안전량이나 손질법을 제공하지 않습니다.','종류·추정량·시각을 기록하고 상담하세요. 겉으로 멀쩡하다는 이유만으로 안전을 확정하지 마세요.'],
  ['Do not offer grapes or raisins to cats; consult a veterinarian after exposure.','Cornell lists them as feline foods to avoid; dog kidney-toxicity data are not a feline dose calculation.','No safe portion or feeding preparation is provided.','Record type, amount and time; appearance alone does not settle safety.']);
dogCatFoodExplanations.dog.xylitol = record('danger','direct',[sources.dogXylitol],
  ['자일리톨은 강아지에게 위험합니다. 섭취가 의심되면 즉시 동물병원에 연락하세요.','저혈당과 간 손상을 일으킬 수 있습니다. 무설탕 식품이라는 표시가 반려견에게 안전하다는 뜻은 아닙니다.','껌·일부 땅콩버터·구강용품 등의 성분표와 남은 제품을 확보하세요.','자일리톨·xylitol·birch sugar·wood sugar 표기를 확인하세요. 증상을 기다리거나 집에서 구토를 유도하지 마세요.'],
  ['Xylitol is dangerous to dogs; call a veterinarian immediately after suspected exposure.','It can cause low blood sugar and liver injury. Sugar-free does not mean dog-safe.','Keep the label and remaining gum, nut butter, dental product or other item.','Look for xylitol, birch sugar or wood sugar. Do not wait for signs or induce vomiting yourself.']);
dogCatFoodExplanations.cat.xylitol = record('unknown','limited',[sources.xylitolSpecies,sources.dogXylitol],
  ['고양이에게 자일리톨 제품을 일부러 주지 마세요. 강아지와 같은 중독으로 단정하지는 않습니다.','전문 독성 자료는 강아지형 저혈당·간 손상 위험을 종별로 구분합니다. 이것이 자일리톨 제품 전체를 고양이 간식으로 승인한다는 뜻은 아닙니다.','먹었다면 정확한 제품과 다른 성분, 추정량·시각을 확보해 수의사에게 확인하세요.','강아지의 중독량을 고양이에 복사하거나 초콜릿·카페인 등 다른 재료를 빠뜨리지 마세요.'],
  ['Do not intentionally offer xylitol products to cats; do not assume dog-type poisoning.','Specialist toxicology distinguishes canine low-blood-sugar and liver-injury risk. That is not approval of whole xylitol-containing products as cat treats.','Identify the product, other ingredients, amount and time and check with your veterinarian.','Do not copy dog toxicity doses or overlook chocolate, caffeine and other ingredients.']);
dogCatFoodExplanations.dog.macadamia = record('danger','direct',[sources.macadamia],
  ['마카다미아는 강아지에게 주지 마세요. 섭취했다면 병원에 확인하세요.','강아지에서 구토·근력 저하 등으로 나타나는 중독 증후군이 보고되어 있습니다.','급여용 손질법은 없습니다. 쿠키·견과 혼합물에도 들어갔는지 확인하세요.','추정량·시각과 포장지를 준비하세요. 다른 동물의 반응을 강아지의 안전 근거로 쓰지 마세요.'],
  ['Do not feed macadamias to dogs; check an exposure with a veterinarian.','A canine syndrome with effects such as vomiting and weakness is reported.','No feeding preparation is recommended; check cookies and mixed nuts.','Keep amount, time and packaging. Another species is not evidence of dog safety.']);
dogCatFoodExplanations.cat.macadamia = record('unknown','limited',[sources.macadamia],
  ['고양이 마카다미아 급여 안전성을 확인하지 못했습니다. 새 간식으로 권하지 않습니다.','전문 자료의 마카다미아 중독 증후군은 강아지에서 보고된 것입니다. 고양이의 안전을 확인한 급여 시험으로 볼 수는 없습니다.','먹었다면 견과 원물인지 쿠키인지와 제품 성분을 확인하세요.','강아지 사례를 그대로 고양이 독성으로 단정하지도, 고양이 자료 부족을 안전 증명으로 쓰지도 마세요.'],
  ['Cat feeding safety for macadamias has not been established here; they are not recommended treats.','The specialist source reports the syndrome in dogs, not a feline feeding-safety trial.','Identify whether an exposure involved nuts or a cookie and keep the ingredient list.','Neither copy canine toxicity nor treat missing cat data as proof of safety.']);

// Add food-specific context to the genuine evidence gaps instead of repeating a generic verdict.
const gaps = {
  cabbage: ['배추 잎·줄기와 김치·절임배추를 구분해야 합니다. 양배추 등 다른 채소 자료를 배추의 직접 근거로 옮기지 않았으며, 이번 확인에서는 배추 자체의 종별 급여 안내를 충분히 확보하지 못했습니다.','Distinguish Napa cabbage leaves and stems from kimchi or brined cabbage. Guidance for other cabbage types was not used as direct evidence for Napa cabbage.'],
  spinach: ['다른 잎채소가 가능하다고 시금치까지 같은 판정으로 묶지 않았습니다. 처방식·질환이 있으면 재료 적합성을 별도로 확인하세요.','We have not copied a verdict from other leafy vegetables. Check ingredient suitability separately with prescribed diets or illness.'],
  'sweet-potato': ['고구마가 들어간 고양이 사료와 고구마를 별도 간식으로 주는 것은 다른 질문입니다. 강아지 자료를 고양이 허용 근거로 사용하지 않았습니다.','Sweet potato inside formulated cat food differs from an extra treat. Dog guidance was not used as feline approval.'],
  pear: ['배 과육·씨·심·배즙은 구분할 대상입니다. 강아지 과일 안내를 고양이의 급여량으로 옮기지 않았습니다.','Pear flesh, seeds, core and juice are different forms; dog fruit advice was not converted into a feline portion.'],
  peach: ['복숭아 과육과 단단한 씨를 구분해야 합니다. 고양이 과육의 안전량을 확인하지 못했다는 뜻이지 씨를 먹여도 된다는 뜻은 아닙니다.','Flesh and the hard stone must be distinguished. An unestablished feline flesh portion does not permit feeding the stone.'],
  pineapple: ['파인애플 과육·질긴 부위·설탕 시럽 제품을 구분해야 합니다. 강아지 자료만으로 고양이 급여를 승인하지 않았습니다.','Distinguish flesh, firm parts and syrup-packed products. Dog guidance alone was not used to approve feline feeding.'],
  mango: ['망고 과육과 씨·껍질·가공품은 같은 대상이 아닙니다. 고양이 급여를 허용할 직접 근거를 충분히 확인하지 못했습니다.','Flesh, stone, skin and processed mango are different questions; sufficient direct feline feeding evidence was not established.'],
  potato: ['익힌 감자가 들어간 사료와 감자를 별도 간식으로 주는 것은 다릅니다. 생감자·싹·녹색 부위를 허용하는 안내가 아닙니다.','Potato in a formulated diet differs from an extra serving. This does not permit raw potatoes, sprouts or green parts.'],
  lettuce: ['상추라는 이름만으로 모든 식용 잎을 같은 식품으로 묶지 않았습니다. 드레싱이 든 샐러드의 성분은 더욱 별도로 확인해야 합니다.','Lettuce is not interchangeable with every edible leaf. A dressed salad needs its own ingredient assessment.'],
};
for (const species of ['dog','cat']) for (const [slug, [ko, en]] of Object.entries(gaps)) if (dogCatFoodExplanations[species][slug].status === 'unknown') {
  dogCatFoodExplanations[species][slug].ko.why = ko;
  dogCatFoodExplanations[species][slug].en.why = en;
}
dogCatFoodExplanations.cat.orange = record('caution','category',[sources.foodHazards],
  ['오렌지는 고양이에게 필요한 간식이 아닙니다. 일부러 주기보다 다른 적합한 보상을 고르세요.','감귤류 범주의 산·정유 주의사항입니다. 강아지의 과육 허용을 고양이 급여 권장으로 옮기지 않았습니다.','먹었다면 과육인지 껍질인지, 음료·농축액인지 확인하세요.','껍질·잎·정유가 포함된 제품은 생과육과 별개입니다. 이상 상태라면 병원에 문의하세요.'],
  ['Orange is not a necessary cat treat; choose an established appropriate reward instead.','This applies citrus-category precautions, not dog flesh guidance as a cat recommendation.','Identify whether exposure involved flesh, peel, a drink or concentrate.','Peel, leaves and essential-oil products differ from flesh; consult a veterinarian for illness.']);

for (const species of ['dog','cat']) {
  if (Object.keys(dogCatFoodExplanations[species]).length !== 50) throw new Error(`Expected 50 food explanations for ${species}`);
  for (const [slug, item] of Object.entries(dogCatFoodExplanations[species])) for (const lang of ['ko','en']) for (const field of ['answer','why','preparation','avoid']) {
    if (!item[lang][field]) throw new Error(`Missing ${species}/${slug}/${lang}/${field}`);
  }
}
