import {foodCatalog,petCatalog} from './food-page-catalog.js';
const source='https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/age-specific-and-breed-specific-diets/';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function ageFoodContext({species,size='small',years,months=0},en=false){
 const actual=years+months/12,large=species==='dog'&&['large','giant'].includes(size),growth=actual<(large?16/12:1);
 let group='species',foods={rabbit:['banana','apple','carrot','cabbage'],hamster:['apple','carrot','milk','cheese'],parrot:['apple','banana','grape','avocado']}[species];
 let title=en?'Food questions for this species':'우리 동물의 음식 키워드',note=en?'Check guidance for the exact species and preparation. These links are questions to investigate, not a feeding plan.':'선택한 동물종의 이유·손질·피할 상황을 확인하세요. 아래는 확인할 질문이며 급여 추천 목록이 아닙니다.';
 if(species==='dog'||species==='cat'){
  group=growth?'growth':actual>=7?'older':'adult';
  title=en?{growth:'Growing pets: check the diet first',older:'As pets get older: questions to check',adult:'Everyday treats and foods to avoid'}[group]:{growth:'성장 중이라면 먼저 확인할 음식',older:'나이가 들수록 확인할 음식 질문',adult:'일상 간식·위험 음식, 먼저 확인하세요'}[group];
  note=en?{growth:'A growth-appropriate complete diet comes first. Household foods do not replace milk feeding or a complete growth diet. Large dogs may still be growing after their first birthday.',older:'Review weight, health conditions and the existing diet. Age alone does not mean a pet needs a diet change; these links do not establish that a food suits your pet.',adult:'Check preparation, added ingredients and health conditions before sharing food. A human-age comparison does not determine food safety.'}[group]:{growth:'성장에 맞는 주식이 우선입니다. 아래 음식으로 수유나 성장기 주식을 대신하지 마세요. 대형·초대형견은 1세 이후에도 성장 중일 수 있습니다.',older:'체중·질환·기존 식단을 함께 확인하세요. 나이가 들었다는 이유만으로 사료를 바꾸거나 아래 음식을 급여할 필요는 없습니다.',adult:'간식은 손질·첨가 성분·건강 상태를 함께 확인하세요. 사람 나이 환산값으로 음식의 안전성을 판단하지 않습니다.'}[group];
  foods=species==='dog'?{growth:['milk','chicken','egg','cheese'],adult:['apple','carrot','chicken','grape'],older:['pumpkin','chicken','milk','cheese']}[group]:{growth:['milk','chicken','egg','tuna'],adult:['chicken','tuna','apple','onion'],older:['chicken','tuna','milk','pumpkin']}[group];
 }
 return {group,title,note,foods,source:species==='dog'||species==='cat'?source:null};
}
export function ageFoodKeywordsView(input,en=false){
 const context=ageFoodContext(input,en),pet=petCatalog[input.species];
 const links=context.foods.map(slug=>{const food=foodCatalog.find(f=>f.slug===slug);if(!food)throw Error('Unknown food keyword');const label=en?`${pet.en}: ${food.en}`:`${pet.ko} ${food.ko}`;return `<a href="/${en?'en':'ko'}/${input.species}/${slug}/"><strong>${esc(label)}</strong><span>${en?'Reasons & cautions →':'이유·주의사항 보기 →'}</span></a>`;}).join('');
 return `<section class="age-food-keywords"><h3>${context.title}</h3><p>${en?'Organized using actual pet age, not the human-age estimate.':'사람 나이가 아닌 입력한 실제 나이를 기준으로 묶었습니다.'}</p><p>${context.note}</p><div class="age-food-grid">${links}</div><p class="age-food-scope">${en?'These are browsing groups, not a diagnosis of life stage or a personalized diet.':'이 구분은 안내 목록을 위한 것이며 생애 단계 진단이나 개별 식단 처방이 아닙니다.'}${context.source?` <a href="${context.source}" target="_blank" rel="noopener noreferrer">${en?'Diet and age: source ↗':'나이와 식단의 관계·출처 ↗'}</a>`:''}</p><a class="age-more-food" href="/foods/#${input.species}">${en?'Browse more foods for this species →':'이 동물의 음식 더 찾아보기 →'}</a></section>`;
}
