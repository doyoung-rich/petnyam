const fruitGuide='dog-fruit-preparation';
export const newFruitKeywords=[
 ['mandarin','귤','Mandarin','🍊',['귤','감귤','만다린','tangerine','mandarin']],
 ['cantaloupe','멜론(캔털루프)','Cantaloupe melon','🍈',['멜론','메론','캔털루프','cantaloupe']],
 ['honeydew','허니듀 멜론','Honeydew melon','🍈',['허니듀','허니듀 멜론','honeydew']],
 ['blackberry','블랙베리','Blackberries','🫐',['블랙베리','blackberry','blackberries']],
 ['cranberry','크랜베리','Cranberries','🔴',['크랜베리','cranberry','cranberries']],
 ['coconut','코코넛','Coconut','🥥',['코코넛','coconut']],
 ['papaya','파파야','Papaya','🍈',['파파야','papaya']],
 ['nectarine','천도복숭아','Nectarine','🍑',['천도복숭아','넥타린','nectarine']]
];
const entry=(slug,anchor,ko,en,emoji,aliases,pets)=>({slug,anchor,ko,en,emoji,aliases,pets});
export const extraFoodEntries=[
 entry('can-dogs-eat-kiwi','','키위','Kiwi','🥝',['키위','kiwi'],['dog']),
 entry('can-dogs-eat-raspberries','','라즈베리','Raspberries','🫐',['라즈베리','raspberry','raspberries'],['dog']),
 ...newFruitKeywords.map(([anchor,ko,en,emoji,aliases])=>entry(fruitGuide,anchor,ko,en,emoji,[...aliases,'과일','fruit'],['dog'])),
 entry('pork-belly-for-pets','','삼겹살','Pork belly','🥓',['삼겹살','돼지고기 삼겹살','pork belly'],['dog','cat']),
 ...[['tenderloin','소고기 안심','Beef tenderloin',['소고기 안심','쇠고기 안심','안심','beef tenderloin']],['ribeye','소고기 등심','Beef ribeye',['소고기 등심','쇠고기 등심','등심','ribeye']],['striploin','소고기 채끝','Beef striploin',['소고기 채끝','쇠고기 채끝','채끝','striploin']],['brisket','소고기 양지','Beef brisket',['소고기 양지','쇠고기 양지','양지','brisket']],['round','소고기 우둔·홍두깨살','Beef round',['소고기 우둔','쇠고기 우둔','우둔','홍두깨','beef round']],['ribs','소갈비','Beef ribs',['소갈비','갈비','beef ribs']]].map(([anchor,ko,en,aliases])=>entry('beef-cuts-for-pets',anchor,ko,en,'🥩',[...aliases,'소고기 부위','쇠고기 부위','beef cuts'],['dog','cat'])),
 entry('ground-meat-for-pets','','다짐육·다진 소고기','Ground meat','🥩',['다짐육','다진고기','다진 고기','다진 소고기','ground beef','ground meat'],['dog','cat'])
];
export function extraFoodHref(entry,en=false){return '/guides/'+entry.slug+(en?'-en':'')+'/'+(entry.anchor?'#'+entry.anchor:'');}
export function findExtraFoods(pet,query){const q=String(query).trim().toLowerCase().replace(/\s/g,'');return q?extraFoodEntries.filter(f=>f.pets.includes(pet)&&!(f.slug==='beef-cuts-for-pets'&&/돼지|pork/.test(q))&&f.aliases.some(a=>a.toLowerCase().replace(/\s/g,'').includes(q)||q.includes(a.toLowerCase().replace(/\s/g,'')))).slice(0,8):[];}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function extraFoodLinksView(entries,en=false){return entries.map(f=>`<a class="next-food-card" data-result-event="related_food" href="${extraFoodHref(f,en)}"><span class="next-food-emoji" aria-hidden="true">${f.emoji}</span><span><strong>${esc(f[en?'en':'ko'])}</strong><span class="next-food-hint">${en?'Read the detailed preparation and caution guide →':'손질·부위·조리 상태의 자세한 설명 보기 →'}</span></span></a>`).join('');}
export function extraFoodDirectory(){return `<section class="expanded-food-directory"><h2>과일·고기, 더 구체적으로 찾아보기</h2><p>과일 8종은 강아지 자료를 확인한 안내입니다. 고기 글은 강아지와 고양이의 식단 조건을 구분하며, 다른 동물의 급여 판정으로 적용하지 않습니다.</p><h3>강아지 과일 8종</h3><ul>${extraFoodEntries.filter(f=>f.slug===fruitGuide).map(f=>`<li><a href="${extraFoodHref(f)}">${esc(f.ko)} · 손질과 주의점 →</a></li>`).join('')}</ul><h3>강아지·고양이 고기 부위와 조리 상태</h3><ul>${extraFoodEntries.filter(f=>f.pets.includes('cat')).map(f=>`<li><a href="${extraFoodHref(f)}">${esc(f.ko)} · 지방·뼈·조리 확인 →</a></li>`).join('')}</ul></section>`;}
export function meatDetailLinks(record,en=false){if(!['dog','cat'].includes(record.petKey)||!['beef','pork'].includes(record.food.slug))return '';const pork=record.food.slug==='pork',slug=pork?'pork-belly-for-pets':'beef-cuts-for-pets',suffix=en?'-en':'';return `<section class="food-cut-links"><h2>${en?'Check the cut and preparation':'부위·조리 상태까지 확인해 보세요'}</h2><p>${en?'The general meat name does not describe every cut, fatty portion or prepared dish.':'같은 고기 이름이어도 부위·지방·뼈·추가 재료가 다릅니다. 더 구체적인 설명을 함께 확인하세요.'}</p><a href="/guides/${slug}${suffix}/">${en?(pork?'Pork belly and fat':'Tenderloin, ribeye and other beef cuts'):(pork?'삼겹살과 지방·양념':'안심·등심·채끝·양지·우둔·갈비')} →</a><a href="/guides/ground-meat-for-pets${suffix}/">${en?'Ground meat and burger ingredients':'다짐육·햄버거 패티의 차이'} →</a></section>`;}
