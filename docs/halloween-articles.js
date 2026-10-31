const sources={
 aspca:'https://www.aspca.org/pet-care/general-pet-care/halloween-safety-tips',
 aaha:'https://www.aaha.org/resources/how-to-have-a-pet-safe-halloween/',
 chocolate:'https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals',
 xylitol:'https://www.fda.gov/animal-veterinary/animal-health-literacy/paws-xylitol-toxic-dogs'
};
const photo=(name,alt,caption,eager=false)=>`<figure class="halloween-figure"><img src="/images/guides/halloween-${name}.jpg" alt="${alt}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async" width="${name==='cat-decoration'?930:name==='costume'?894:893}" height="${name==='cat-decoration'?670:name==='costume'?699:674}"><figcaption>${caption}</figcaption></figure>`;
const ref=(key,label)=>`<a href="${sources[key]}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const ko=`
<p>핼러윈 초콜릿과 사탕은 강아지에게 주지 마세요. 특히 초콜릿이나 자일리톨 함유 제품을 먹었을 가능성이 있다면 <strong>증상을 기다리지 말고 동물병원에 즉시 연락하세요.</strong> 코스튬과 장식도 귀여운 모습보다 편안함과 안전을 먼저 확인해야 합니다.</p>
<p>핼러윈에는 집에 간식이 많아지고 반려동물에게 옷을 입혀 사진을 찍기도 합니다. 강아지와 고양이에게 평범한 간식·장식이 어떤 위험을 만들 수 있는지, 이미 먹었다면 무엇을 전달해야 하는지 함께 정리했습니다.</p>
<aside class="halloween-action" aria-label="이미 먹었다면 먼저 할 일"><h2>이미 초콜릿·자일리톨을 먹었다면</h2><p>먹은 제품의 포장지와 성분표를 확보하고, 대략적인 섭취량·섭취 시각·반려동물의 몸무게를 병원에 알려주세요. 임의로 토하게 하거나 사람용 약을 먹이지 마세요.</p><a href="/guides/food-emergency/">병원에 전달할 정보 정리하기 →</a></aside>
${photo('costume','가을 배경에서 호박 모양 코스튬을 입은 강아지','사용자 제공 설명용 이미지입니다. 코스튬은 편안해하는 경우에만 착용하고, 보호자가 지켜보세요.',true)}
<h2>강아지가 초콜릿을 먹으면 왜 위험할까?</h2>
<p>초콜릿에는 테오브로민과 카페인이 들어 있습니다. 중독은 심장과 신경계에 영향을 줄 수 있으며 심한 경우 부정맥이나 발작으로 이어질 수 있습니다. 위험은 초콜릿 종류·먹은 양·몸무게 등에 따라 다릅니다. 다크초콜릿과 베이킹 초콜릿은 특히 주의해야 합니다. ${ref('chocolate','Merck Veterinary Manual의 초콜릿 중독 안내')}</p>
<p>밀크초콜릿이라고 안심하거나 집에서 안전량을 정하지 마세요. 강아지가 먹었다면 제품명과 포장지를 챙겨 바로 병원에 연락하세요. 고양이에게도 초콜릿을 주면 안 됩니다. ${ref('aspca','ASPCA의 핼러윈 안전 안내')}</p>
<h2>무설탕 사탕은 괜찮을까?</h2>
<p>무설탕이라고 안전한 것은 아닙니다. 일부 사탕과 껌에는 자일리톨이 들어 있습니다. FDA는 자일리톨이 강아지에게 심한 저혈당과 간 손상을 일으킬 수 있다고 안내합니다. 알려진 강아지의 위험을 모든 동물에게 같은 수치로 적용하지는 않습니다. ${ref('xylitol','FDA 자일리톨 안내')}</p>
<p>자일리톨이 들어 있거나 들어 있을 가능성이 있다면 즉시 병원에 문의하세요. 성분이 불분명한 제품을 먹었다면 포장지를 확인하며 상담하고, 확인이 끝날 때까지 연락을 미루지 마세요. 모든 사탕의 독성이 같다는 뜻은 아니지만, 사람용 사탕은 반려견 간식으로 선택하지 않는 것이 좋습니다.</p>
${photo('candy-risk','호박 바구니의 사탕 가까이에 얼굴을 댄 강아지','피해야 할 상황을 보여주는 사용자 제공 이미지입니다. 실제로는 사탕 바구니와 포장지를 동물이 닿지 못하는 곳에 보관하세요.')}
<h2>핼러윈 코스튬도 조심해야 할까?</h2>
<p>예쁜 디자인보다 편안함이 먼저입니다. 움직임·시야·호흡을 방해하는 옷이나 삼킬 수 있는 작은 장식은 피하세요. 옷을 싫어하거나 불편해한다면 억지로 입히지 마세요. 착용 중에는 혼자 두지 않습니다. ${ref('aspca','ASPCA 코스튬 확인사항')} · ${ref('aaha','AAHA 핼러윈 안전 안내')}</p>
<ul><li>몸에 맞는지, 움직일 때 꼬이거나 걸리지 않는지 확인합니다.</li><li>떨어져 나갈 장식이나 씹을 수 있는 부품을 점검합니다.</li><li>불편한 행동을 보이면 사진 촬영을 멈추고 옷을 벗깁니다.</li></ul>
<h2>장식물과 현관도 안전하게 관리하세요</h2>
<p>양초·전선·포장지·작은 장식품을 반려동물이 건드리거나 삼키지 못하게 치워주세요. 방문객이나 큰 소리에 예민하다면 현관에서 떨어진 조용한 공간에서 쉬게 합니다. 문을 자주 여는 날에는 탈출도 주의하고, 외출 전 목줄과 인식표를 확인하세요. ${ref('aaha','AAHA의 음식·탈출 예방 안내')}</p>
${photo('cat-decoration','빛나는 호박 장식 옆에 앉아 있는 검은 고양이','사용자 제공 설명용 이미지입니다. 실제 장식은 불꽃 없는 조명을 사용하고, 전선과 작은 부품도 동물의 손이 닿지 않게 관리하세요.')}
<h2>이미 핼러윈 간식을 먹었다면?</h2>
<p>초콜릿·자일리톨 또는 다른 유해 성분을 먹었을 가능성이 있다면 겉으로 멀쩡해 보여도 기다리지 말고 수의사에게 연락하세요. 포장지까지 삼켰는지도 함께 알리세요.</p>
<ol><li>제품명과 포장지·성분표를 확보합니다.</li><li>대략적인 양과 먹은 시각을 적습니다.</li><li>동물종·몸무게·현재 상태를 병원에 전달합니다.</li><li>수의사의 지시 없이 구토 유도나 사람용 약 투여를 하지 않습니다.</li></ol>
<h2>자주 묻는 질문</h2><h3>고양이도 초콜릿을 먹으면 안 되나요?</h3><p>네. 초콜릿은 고양이에게도 위험할 수 있습니다. 먹었을 가능성이 있다면 수의사에게 문의하세요.</p><h3>무설탕이면 강아지에게 더 좋나요?</h3><p>아닙니다. 자일리톨 등 성분을 확인해야 하며 사람용 사탕을 간식으로 주지 마세요.</p><h3>코스튬은 무조건 안 되나요?</h3><p>편안해하는지 먼저 확인하고, 움직임과 호흡 등을 방해하지 않는 옷만 보호자가 지켜보는 동안 사용하세요.</p>
<h2>펫냠에서 이어서 확인하세요</h2><ul><li><a href="/ko/dog/chocolate/">강아지 초콜릿: 제품 종류와 위험 성분</a></li><li><a href="/ko/dog/xylitol/">강아지 자일리톨: 무설탕 제품도 확인</a></li><li><a href="/ko/cat/chocolate/">고양이 초콜릿 주의사항</a></li><li><a href="/guides/main-meal-or-treat/">주식과 간식의 차이·제품 표시 읽기</a></li></ul><p>사람용 사탕 대신 동물종과 식단에 맞는 간식을 살펴보되, 반려동물용 제품도 모든 개체에게 무조건 적합하다는 뜻은 아닙니다.</p>`;
const en=`
<p>Dogs should not eat Halloween candy. Keep human sweets out of reach, especially chocolate and products containing xylitol. <strong>If either may have been eaten, contact a veterinarian immediately rather than waiting for symptoms.</strong></p>
<p>Halloween brings extra treats, costumes and decorations into a home. Here is what to check for dogs and cats, and what information to collect if a pet gets into the candy.</p>
<aside class="halloween-action" aria-label="If candy has already been eaten"><h2>Already eaten chocolate or xylitol?</h2><p>Save the packaging and ingredient list. Tell your veterinarian the estimated amount, time of ingestion and your pet’s weight. Do not induce vomiting or give human medication on your own.</p><a href="/guides/food-emergency/">Prepare information for the clinic (Korean) →</a></aside>
${photo('costume','A dog wearing a pumpkin costume against an autumn background','User-provided illustrative image. Only use a costume the pet is comfortable wearing, with supervision.',true)}
<h2>Why is chocolate dangerous for dogs?</h2><p>Chocolate contains theobromine and caffeine. Poisoning can affect the heart and nervous system, causing arrhythmias or seizures in severe cases. Risk varies with the product, amount eaten and the dog’s body weight. Dark and baking chocolate can be especially dangerous. ${ref('chocolate','Merck Veterinary Manual: chocolate toxicosis')}</p>
<p>Milk chocolate is not a reason to assume an exposure is harmless. Contact a veterinarian promptly and keep the packaging. Chocolate must also be kept away from cats. ${ref('aspca','ASPCA Halloween safety guidance')}</p>
<h2>Is sugar-free candy safe?</h2><p>No. Some sugar-free sweets and gum contain xylitol. FDA warns that it can cause dangerously low blood sugar and liver injury in dogs. This dog-specific risk is not a dose rule for every other species. ${ref('xylitol','FDA: xylitol is toxic to dogs')}</p>
<p>If xylitol is present or may be present, seek urgent veterinary advice. If ingredients are unclear after an exposure, keep checking the package while contacting the clinic; do not postpone the call. Different candies have different ingredients, but human candy is not an appropriate dog treat.</p>
${photo('candy-risk','A dog with its face close to a pumpkin bucket full of sweets','User-provided illustration of a situation to prevent. Keep candy buckets and wrappers completely out of pets’ reach.')}
<h2>What about Halloween costumes?</h2><p>Comfort comes before appearance. An outfit must not restrict breathing, movement or vision, and must not have easily swallowed accessories. Never force a reluctant pet to wear one or leave a costumed pet unattended. ${ref('aspca','ASPCA costume checks')} · ${ref('aaha','AAHA Halloween safety')}</p>
<ul><li>Check the fit and whether the outfit can twist or snag.</li><li>Look for dangling or chewable pieces.</li><li>Stop the photo session and remove the outfit if the pet seems distressed.</li></ul>
<h2>Other Halloween hazards</h2><p>Put open flames, electrical cords, small decorations and wrappers out of reach. Give an anxious pet a quiet space away from visitors and the front door. Frequent door opening can allow escapes, so check the leash and identification before an outing. ${ref('aaha','AAHA food and escape-prevention guidance')}</p>
${photo('cat-decoration','A black cat beside a glowing pumpkin decoration','User-provided illustrative image. Choose flameless lighting and keep wires and small parts inaccessible to pets.')}
<h2>What should I do if my pet eats Halloween candy?</h2><p>Contact your veterinarian or an emergency veterinary clinic promptly. Do not wait for symptoms if chocolate, xylitol or another potentially toxic ingredient may be involved. Tell the clinic if wrappers may also have been swallowed.</p>
<ol><li>Save the product name, packaging and ingredient list.</li><li>Estimate the amount eaten and time of ingestion.</li><li>Provide the species, body weight and current condition.</li><li>Do not induce vomiting or administer human medication without veterinary direction.</li></ol>
<h2>Frequently asked questions</h2><h3>Can cats eat chocolate?</h3><p>No. Chocolate can be toxic to cats too. Contact a veterinarian if exposure may have occurred.</p><h3>Are sugar-free sweets better for dogs?</h3><p>No. Some contain xylitol. Human sweets should not be used as dog treats.</p><h3>Can my dog wear a Halloween costume?</h3><p>Only if the dog is comfortable and the outfit is properly fitted, safe and supervised.</p>
<h2>Explore more on PetNyam</h2><ul><li><a href="/en/dog/chocolate/">Chocolate risks for dogs</a></li><li><a href="/en/dog/xylitol/">Xylitol and sugar-free products</a></li><li><a href="/en/cat/chocolate/">Chocolate safety for cats</a></li><li><a href="/en/#search">Find species-specific food information</a></li></ul><p>Choose treats appropriate for the species and individual diet instead of sharing human candy. A pet-food label does not make every product suitable for every animal.</p>`;
const alternates={ko:'/guides/halloween-pet-safety/',en:'/guides/halloween-pet-safety-en/'};
const refs=(english)=>`<h2>${english?'Sources':'참고 자료'}</h2><ul>${Object.entries(sources).map(([key])=>`<li>${ref(key,{aspca:'ASPCA — Halloween Safety Tips',aaha:'AAHA — Halloween Safety for Pets',chocolate:'Merck Veterinary Manual — Chocolate Toxicosis in Animals',xylitol:'FDA — Paws Off! Xylitol is Toxic to Dogs'}[key])}</li>`).join('')}</ul>`;
export const halloweenArticles={};
for(const [lang,body] of [['ko',ko],['en',en]])halloweenArticles[alternates[lang]]={
 lang,category:'seasonal-safety',alternates,published:'2026-11-01',modified:'2026-11-01',sources:Object.values(sources),
 title:lang==='ko'?'강아지 핼러윈 초콜릿 먹어도 될까? 사탕·코스튬까지 조심해야 하는 이유':'Can Dogs Eat Halloween Candy? Chocolate, Xylitol and Costume Safety Explained',
 description:lang==='ko'?'핼러윈 초콜릿·자일리톨 사탕을 먹었을 때 먼저 할 일, 코스튬·장식 안전 확인사항을 공식 자료와 함께 정리했습니다.':'What to do after possible chocolate or xylitol exposure, plus costume, decoration and escape-prevention checks for dogs and cats.',
 image:'/images/guides/halloween-costume.jpg',imageAlt:lang==='ko'?'호박 모양 코스튬을 입은 강아지':'A dog wearing a pumpkin costume',
 styles:['/halloween-articles.css?v=1'],body:body+refs(lang==='en'),
 footer:lang==='ko'?'발행·정보 확인: 2026년 11월 1일. 사용자가 제공한 원고와 이미지를 바탕으로 공식 자료를 대조하여 AI 보조 편집했습니다. 이미지는 실제 운영자 반려동물의 경험·급여 사례를 뜻하지 않습니다. 일반적인 안전 정보이며 수의사의 진료·개별 감수를 대신하지 않습니다.':'Published and sources checked November 1, 2026. Edited with AI assistance from the user’s draft and images, checked against the cited sources. Illustrations do not document the operator’s pets or a feeding experience. General safety information, not veterinary care or an independent veterinary review.'
};
