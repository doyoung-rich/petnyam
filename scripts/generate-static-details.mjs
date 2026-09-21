import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docs = join(root, "docs");
const origin = "https://petnyam.com";
const pets = {
  dog: ["강아지", "Dog", "🐶"],
  cat: ["고양이", "Cat", "🐱"],
  rabbit: ["토끼", "Rabbit", "🐰"],
  hamster: ["햄스터", "Hamster", "🐹"],
  parrot: ["앵무새", "Parrot", "🦜"],
};
const status = {
  safe: ["먹을 수 있어요", "Generally safe", "#e8f7f1"],
  caution: ["조심해서 주세요", "Use caution", "#fff5d8"],
  danger: ["먹이면 안 돼요", "Do not feed", "#fff0f0"],
  unknown: ["정보가 부족해요", "Not enough evidence", "#eef1f4"],
};

const app = await readFile(join(root, "site-static", "app.js"), "utf8");
const convenience = await readFile(join(root, "site-static", "convenience.js"), "utf8");
const foods = [...(`${app}\n${convenience}`).matchAll(
  /\['([^']+)','([^']+)','([^']+)','([^']+)',\['([^']+)','([^']+)','([^']+)','([^']+)','([^']+)'\]\]/g,
)].map((match) => ({ slug: match[1], ko: match[2], en: match[3], emoji: match[4], results: match.slice(5) }));
const uniqueFoods = [...new Map(foods.map((food) => [food.slug, food])).values()];
const template = (await readFile(join(docs, "index.html"), "utf8"))
  .replace(/(<a data-nav="trust" href="\/#trust">검증 원칙<\/a>)(?:<a data-nav="guides" href="\/guides">이용 가이드<\/a>)*/, '$1<a data-nav="guides" href="/guides">이용 가이드</a>')
  .replace(/(<a href="\/policy\/disclaimer">의학적 면책<\/a>)(?:<a href="\/guides">이용 가이드<\/a><a href="\/policy\/contact">문의<\/a>)*/, '$1<a href="/guides">이용 가이드</a><a href="/policy/contact">문의</a>');
await writeFile(join(docs, "index.html"), template);
const contentTemplate = template
  .replace(/<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-2911341623586356" crossorigin="anonymous"><\/script>/, "")
  .replace('<script src="/app.js?v=3"></script><script src="/convenience.js?v=3"></script><script src="/ads.js?v=1"></script>', "");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function particle(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code % 28 !== 0 ? "은" : "는";
}

function detailMarkup({ lang, petKey, food }) {
  const english = lang === "en";
  const [petKo, petEn, petEmoji] = pets[petKey];
  const petName = english ? petEn : petKo;
  const foodName = english ? food.en : food.ko;
  const verdict = food.results[Object.keys(pets).indexOf(petKey)];
  const [verdictKo, verdictEn, background] = status[verdict];
  const verdictName = english ? verdictEn : verdictKo;
  const description = english
    ? `Can a ${petEn.toLowerCase()} eat ${food.en.toLowerCase()}? Check PetNyam's ${verdictEn.toLowerCase()} result, key cautions, what to record after eating, and reviewed sources.`
    : `${petKo} ${food.ko}, 먹어도 될까요? PetNyam의 ‘${verdictKo}’ 판정과 급여 전 확인할 주의사항, 섭취 뒤 기록할 정보, 검토 출처를 확인하세요.`;
  const reason = english
    ? `PetNyam lists this food as ${verdictEn.toLowerCase()} for ${petEn.toLowerCase()}s in its V1 data.`
    : `PetNyam V1 데이터에서 ${food.ko}${particle(food.ko)} ${petKo}에게 ‘${verdictKo}’로 분류합니다.`;
  const caution = ["danger", "unknown"].includes(verdict)
    ? (english ? "If eaten, record the food, amount and time before contacting a veterinarian." : "먹었다면 음식 종류·양·시간을 기록해 동물병원에 전달하세요.")
    : (english ? "Introduce unfamiliar foods in small amounts and monitor your pet." : "처음 주는 음식은 소량부터 확인하고 반응을 살펴보세요.");
  const pageUrl = `${origin}/${lang}/${petKey}/${food.slug}`;
  const title = english ? `${petEn} ${food.en} — is it safe? | PetNyam` : `${petKo} ${food.ko} 먹어도 될까? | PetNyam`;
  const initial = `<main id="app"><section class="detail"><div class="wrap"><a class="back" href="${english ? "/en" : "/"}">← ${english ? "Search another food" : "다른 음식 검색하기"}</a><div class="verdict" style="background:${background}"><div class="big">${food.emoji}</div><div><p>${petEmoji} ${escapeHtml(petName)} × ${escapeHtml(foodName)}</p><h1>${escapeHtml(verdictName)}</h1><span>${escapeHtml(food.en)} · ${english ? "Reviewed Sep 2026" : "최종 검토 2026.09"}</span></div></div><div class="grid"><article><section class="info"><div class="label">${english ? "WHY" : "판정 이유"}</div><h2>${english ? `What does ${escapeHtml(food.en.toLowerCase())} mean for ${escapeHtml(petEn.toLowerCase())}s?` : `${escapeHtml(petKo)}에게 ${escapeHtml(food.ko)}${particle(food.ko)} 어떤가요?`}</h2><p>${escapeHtml(reason)}</p></section><section class="info"><div class="label">${english ? "BEFORE OR AFTER EATING" : "섭취 전·후 확인할 점"}</div><p>${escapeHtml(caution)}</p></section><section class="info"><div class="label">${english ? "REVIEWED SOURCES" : "검토한 근거"}</div><a href="https://www.merckvetmanual.com/special-pet-topics/poisoning/food-hazards">Merck Veterinary Manual ↗</a><a href="https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets">ASPCA Poison Control ↗</a><p>${english ? "This V1 result summarizes the public sources linked above. Individual health conditions and the amount eaten need veterinary advice." : "이 V1 결과는 위에 연결한 공개 출처를 바탕으로 정리했습니다. 개별 건강 상태와 섭취량은 수의사 판단이 우선합니다."}</p></section></article></div></div></section></main>`;
  const head = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(description)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${pageUrl}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${pageUrl}"><link rel="alternate" hreflang="ko" href="${origin}/ko/${petKey}/${food.slug}"><link rel="alternate" hreflang="en" href="${origin}/en/${petKey}/${food.slug}"><link rel="alternate" hreflang="x-default" href="${origin}/ko/${petKey}/${food.slug}">`)
    .replace('<main id="app"></main>', initial);
  return { head, pageUrl };
}

const urls = [origin + "/"];
for (const lang of ["ko", "en"]) {
  for (const petKey of Object.keys(pets)) {
    for (const food of uniqueFoods) {
      const { head, pageUrl } = detailMarkup({ lang, petKey, food });
      const file = join(docs, lang, petKey, food.slug, "index.html");
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, head);
      urls.push(pageUrl);
    }
  }
}
const englishHomeUrl = `${origin}/en`;
const englishHome = template
  .replace(/<title>.*?<\/title>/, "<title>Can my pet eat this food? | PetNyam</title>")
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Search PetNyam for food-safety results for dogs, cats, rabbits, hamsters and parrots.">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="Can my pet eat this food? | PetNyam">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Search food-safety results and reviewed sources for companion animals.">')
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${englishHomeUrl}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${englishHomeUrl}"><link rel="alternate" hreflang="ko" href="${origin}/"><link rel="alternate" hreflang="en" href="${englishHomeUrl}"><link rel="alternate" hreflang="x-default" href="${origin}/">`)
  .replace('<main id="app"></main>', '<main id="app"><section class="hero"><div class="copy"><h1>Can my pet eat<br><em>this food?</em></h1><p>Choose your pet and search a food to see the verdict, cautions and reviewed sources.</p></div></section></main>');
await mkdir(join(docs, "en"), { recursive: true });
await writeFile(join(docs, "en", "index.html"), englishHome);
urls.push(englishHomeUrl);

const policies = {
  terms: ["이용약관 | PetNyam", "PetNyam 서비스 이용 기준과 정보의 한계를 확인하세요.", "이용약관", `<p>PetNyam은 반려동물 보호자가 음식별 안전 정보를 빠르게 확인하도록 돕는 정보 서비스입니다.</p><h2>정보의 사용</h2><p>각 판정은 공개 수의학·동물복지 자료를 바탕으로 정리한 V1 정보입니다. 반려동물의 건강 상태, 섭취량, 조리 방식에 따라 판단이 달라질 수 있으므로 진단이나 치료를 대신하지 않습니다.</p><h2>외부 링크와 광고성 링크</h2><p>일부 페이지는 근거 자료 또는 판매처로 연결됩니다. 외부 사이트의 내용과 개인정보 처리 방식은 해당 사이트의 정책을 따릅니다. 쿠팡 파트너스 링크가 있는 경우 해당 영역에 광고·수수료 고지를 표시합니다.</p><h2>문의</h2><p>서비스 관련 문의는 <a href="mailto:jungdo63@gmail.com">jungdo63@gmail.com</a>으로 보내주세요.</p><p>시행일: 2026년 9월 21일</p>`],
  privacy: ["개인정보처리방침 | PetNyam", "PetNyam의 이용 정보 및 광고 관련 개인정보 처리 안내입니다.", "개인정보처리방침", `<p>PetNyam은 회원가입과 자체 문의 양식을 제공하지 않으며, 음식 검색어를 계정 정보와 결합해 자체 저장하지 않습니다.</p><h2>접속과 외부 서비스</h2><p>정적 사이트 제공 과정에서 호스팅·CDN 사업자는 서비스 운영과 보안을 위해 일반적인 접속 기록을 처리할 수 있습니다. PetNyam 페이지에는 Google AdSense 스크립트가 포함되어 있어, 광고가 제공되는 경우 Google 및 그 기술 제공자가 기기·브라우저 정보와 쿠키 등 관련 정보를 처리할 수 있습니다.</p><h2>광고와 쿠키</h2><p>광고 개인화, 쿠키 사용, 선택권은 실제 광고 제공 지역과 Google의 설정에 따라 달라질 수 있습니다. Google의 광고 개인정보 처리 방식은 <a href="https://policies.google.com/technologies/ads">Google 광고 기술 안내</a>에서 확인할 수 있습니다.</p><h2>문의 및 변경</h2><p>정책 관련 문의는 운영자 정도영에게 <a href="mailto:jungdo63@gmail.com">jungdo63@gmail.com</a>으로 보내주세요. 실제 처리 방식이 바뀌면 이 페이지의 시행일을 함께 갱신합니다.</p><p>시행일: 2026년 9월 21일</p>`],
  disclaimer: ["의학적 면책 안내 | PetNyam", "PetNyam 음식 안전 정보의 범위와 응급 상황 안내를 확인하세요.", "의학적 면책 안내", `<p>PetNyam은 일반적인 교육·정보 제공 목적의 서비스이며 수의사의 진단, 처방, 치료를 대신하지 않습니다.</p><h2>응급 상황</h2><p>위험 음식 섭취가 의심되거나 구토, 무기력, 떨림, 호흡 변화 등 이상 증상이 있으면 온라인 정보만으로 판단하지 말고 가까운 동물병원 또는 수의사에게 먼저 연락하세요. 음식 종류, 섭취량, 섭취 시각을 기록하면 상담에 도움이 될 수 있습니다.</p><h2>판정의 한계</h2><p>‘먹을 수 있어요’는 무제한 급여나 모든 개체에 대한 안전 보증이 아닙니다. 기존 질환, 알레르기, 나이, 체중과 조리·첨가 방식은 개별적으로 고려해야 합니다.</p><p>시행일: 2026년 9월 21일</p>`],
  contact: ["문의 | PetNyam", "PetNyam 운영자와 연락하는 방법을 확인하세요.", "문의", `<p>PetNyam 서비스, 정보 페이지 또는 광고성 링크 표기에 관한 문의는 아래 주소로 보내주세요.</p><p><strong>운영자:</strong> 정도영<br><strong>이메일:</strong> <a href="mailto:jungdo63@gmail.com">jungdo63@gmail.com</a></p><p>의료 응급 상담은 이메일이 아닌 가까운 동물병원 또는 수의사에게 연락하세요.</p>`],
};
for (const [slug, [title, description, heading, body]] of Object.entries(policies)) {
  const pageUrl = `${origin}/policy/${slug}`;
  const policyPage = contentTemplate
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${pageUrl}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${pageUrl}">`)
    .replace('<main id="app"></main>', `<main id="app"><article class="policy"><h1>${heading}</h1>${body}</article></main>`);
  const file = join(docs, "policy", slug, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, policyPage);
  urls.push(pageUrl);
}
const guides = {
  "food-emergency": ["반려동물이 위험 음식을 먹었을 때: 연락 전 기록할 정보 | PetNyam", "반려동물의 위험 음식 섭취가 의심될 때 수의사 상담 전 정리할 정보를 확인하세요.", "반려동물이 위험 음식을 먹었을 때, 먼저 할 일", `<p>위험 음식 섭취가 의심될 때 가장 중요한 일은 온라인에서 원인을 추정하는 것이 아니라 수의사 또는 동물병원에 연락해 개별 상황을 안내받는 것입니다.</p><h2>연락 전에 정리할 정보</h2><ol><li>먹었거나 물었을 가능성이 있는 음식의 이름과 제품명</li><li>대략적인 섭취량과 섭취한 시각</li><li>반려동물의 종류, 체중, 나이와 현재 보이는 증상</li><li>포장지·성분표가 있다면 사진 또는 제품 정보</li></ol><p>이 정보는 수의사가 위험도를 판단하는 데 도움이 될 수 있습니다. 임의로 구토를 유도하거나 사람용 약을 먹이는 방법은 이 페이지에서 안내하지 않습니다.</p><h2>왜 음식별 페이지를 확인하나요?</h2><p>PetNyam의 음식별 판정은 빠른 확인을 위한 출발점입니다. ‘먹이면 안 돼요’ 또는 ‘정보가 부족해요’가 표시되면 음식 이름만이 아니라 실제 섭취량과 증상을 함께 전달해야 합니다.</p><h2>확인한 자료</h2><p><a href="https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets">ASPCA Poison Control: People foods to avoid</a> · <a href="https://www.merckvetmanual.com/special-pet-topics/poisoning/food-hazards">Merck Veterinary Manual: Food hazards</a></p><p>최종 검토: 2026년 9월 21일 · 사람 검토 필요: 수의학적 표현과 지역별 응급 연락처</p>`],
  "read-a-verdict": ["반려동물 음식 판정 읽는 법 | PetNyam", "PetNyam의 네 가지 음식 안전 판정과 확인해야 할 한계를 설명합니다.", "PetNyam 음식 판정, 이렇게 읽어주세요", `<p>PetNyam은 음식과 반려동물 조합을 네 가지 상태로 표시합니다. 이 표시는 급여량을 계산하거나 진료를 대체하는 도구가 아니라, 보호자가 다음 확인을 시작할 수 있도록 돕는 안내입니다.</p><h2>네 가지 상태</h2><ul><li><strong>먹을 수 있어요:</strong> 알려진 독성만으로는 바로 금지하지 않는 경우입니다. 처음에는 소량과 개별 반응을 확인해야 합니다.</li><li><strong>조심해서 주세요:</strong> 조리 방법, 양, 성분 또는 개체 상태에 따라 문제가 될 수 있어 수의사 확인이 필요한 경우입니다.</li><li><strong>먹이면 안 돼요:</strong> 해당 조합에서 급여를 피해야 하는 경우입니다.</li><li><strong>정보가 부족해요:</strong> 충분히 신뢰할 수 있는 근거가 없어 안전하다고 단정하지 않는 경우입니다.</li></ul><h2>판정과 함께 볼 것</h2><p>반려동물 종류를 먼저 선택하고, 음식명·상태·검토 출처를 함께 확인하세요. 제품 식품은 원재료와 첨가물을 별도로 봐야 하며, 질환이나 복용 중인 약이 있다면 수의사 조언이 우선입니다.</p><p>최종 검토: 2026년 9월 21일 · 사람 검토 필요: 새 데이터 추가 시 판정 근거</p>`],
  "new-food-checklist": ["새 음식을 주기 전 확인 목록 | PetNyam", "반려동물에게 새 음식을 주기 전 음식 형태, 성분, 양과 개체 상태를 확인하는 방법입니다.", "새 음식을 주기 전, 보호자가 확인할 목록", `<p>음식 이름 하나만으로 모든 급여 상황을 판단하기는 어렵습니다. 같은 식재료라도 가공·조리 방식과 첨가물에 따라 반려동물에게 맞지 않을 수 있습니다.</p><h2>확인 목록</h2><ol><li>반려동물 종류에 맞는 음식별 판정을 확인합니다.</li><li>생식·조리식·가공식품인지, 양념·감미료·카페인·알코올 등이 들어갔는지 확인합니다.</li><li>처음 시도하는 음식이라면 소량으로 시작하고 평소와 다른 반응이 있는지 살핍니다.</li><li>어린 개체, 고령 개체, 기존 질환이 있거나 특수 식이를 하는 경우에는 수의사에게 먼저 묻습니다.</li></ol><h2>검색 결과가 없을 때</h2><p>PetNyam에 없는 음식은 안전하다는 뜻이 아닙니다. 제품명보다 원재료를 확인하고, 신뢰할 수 있는 수의학 자료나 수의사에게 추가 확인하세요.</p><h2>확인한 자료</h2><p><a href="https://www.merckvetmanual.com/special-pet-topics/poisoning/food-hazards">Merck Veterinary Manual: Food hazards</a></p><p>최종 검토: 2026년 9월 21일 · 사람 검토 필요: 제품별 성분과 개별 급여량</p>`],
  "processed-food-label": ["가공식품을 검색할 때: 제품명보다 성분표를 먼저 보는 법 | PetNyam", "반려동물에게 사람 음식이나 가공식품을 주기 전 성분표를 확인하는 실용적인 방법입니다.", "가공식품을 검색할 때, 제품명보다 성분표를 먼저 보세요", `<p>‘빵’, ‘요거트’, ‘땅콩버터’처럼 음식 이름이 같아도 제품마다 원재료와 첨가물이 다릅니다. PetNyam의 음식별 결과는 출발점이고, 포장된 제품을 판단할 때는 실제 성분표가 추가로 필요합니다.</p><h2>포장지에서 먼저 찾을 정보</h2><ol><li>식품명과 제조사: 비슷한 이름의 제품을 구분하기 위해 기록합니다.</li><li>원재료와 알레르기 정보: 음식 이름에 없는 향료·감미료·양념이 들어갈 수 있습니다.</li><li>‘무설탕’, ‘저당’, ‘기능성’ 같은 표시: 이름만 보고 급여 가능 여부를 결론내리지 말고 성분을 확인합니다.</li><li>반려동물 종류와 상태: 같은 성분도 종과 건강 상태에 따라 판단이 달라질 수 있습니다.</li></ol><h2>이 페이지가 하지 않는 일</h2><p>성분표만으로 개별 제품의 급여량이나 치료 효과를 판단하지 않습니다. 이미 먹었거나 위험 성분이 의심되면 제품 포장지를 보관하고 수의사에게 연락하세요.</p><h2>확인한 자료</h2><p><a href="https://www.fda.gov/animal-veterinary/animal-foods-feeds/animal-food-labeling-and-pet-food-claims">FDA: Animal Food Labeling and Pet Food Claims</a> · <a href="https://www.fda.gov/animal-veterinary/animal-health-literacy/potentially-dangerous-items-your-pet">FDA: Potentially Dangerous Items for Your Pet</a></p><p>최종 검토: 2026년 9월 22일 · 사람 검토 필요: 국가별 표기 기준과 제품별 성분</p>`],
  "xylitol-product-check": ["무설탕 제품을 발견했을 때: 자일리톨 확인 순서 | PetNyam", "무설탕 식품·구강용품 등에서 자일리톨을 확인하고, 반려견 섭취가 의심될 때 정리할 정보를 안내합니다.", "무설탕 제품이라면, 자일리톨부터 확인하세요", `<p>무설탕 제품은 사탕이나 껌에만 한정되지 않습니다. FDA는 자일리톨이 일부 땅콩버터, 구강용품, 기침 시럽, 보충제 등에도 들어갈 수 있다고 안내합니다. 제품명보다 원재료 목록을 확인하는 이유입니다.</p><h2>확인 순서</h2><ol><li>포장지 원재료에서 ‘xylitol’을 찾습니다. FDA는 birch sugar, wood sugar 같은 다른 이름도 함께 언급합니다.</li><li>반려견이 접근했거나 먹었을 가능성이 있으면 제품명, 남은 양, 시각과 포장지를 준비합니다.</li><li>섭취가 의심되면 증상이 없더라도 수의사 또는 응급 동물병원에 즉시 연락합니다.</li></ol><h2>범위와 한계</h2><p>이 글은 특정 제품의 안전성이나 치료 방법을 판단하지 않습니다. 고양이 등 다른 동물에 대한 위험도를 이 글의 반려견 안내로 추정하지 말고, 해당 동물의 수의사에게 확인하세요.</p><h2>확인한 자료</h2><p><a href="https://www.fda.gov/consumers/consumer-updates/paws-xylitol-its-dangerous-dogs">FDA: Paws Off Xylitol; It’s Dangerous for Dogs</a> · <a href="https://www.fda.gov/animal-veterinary/animal-health-literacy/who-do-you-call-if-you-have-pet-emergency">FDA: Who Do You Call if You Have a Pet Emergency?</a></p><p>최종 검토: 2026년 9월 22일 · 사람 검토 필요: 응급 연락처와 수의학 표현</p>`],
  "main-meal-or-treat": ["주식과 간식 구분하기: ‘완전하고 균형 잡힌’ 표시 읽는 법 | PetNyam", "반려견·반려묘 식품 라벨의 ‘complete and balanced’ 표시와 간식의 역할을 구분하는 방법입니다.", "주식과 간식은 같은 기준으로 보지 않습니다", `<p>사람 음식이든 반려동물용 제품이든, ‘먹을 수 있어요’라는 음식 판정은 그 제품이 하루 식단 전체를 대신한다는 뜻이 아닙니다. 특히 반려동물용 간식과 보조제는 주식용으로 설계되지 않을 수 있습니다.</p><h2>라벨에서 확인할 것</h2><ol><li>반려견용인지 반려묘용인지 확인합니다.</li><li>주식으로 급여할 제품이라면 영양 적합성 문구를 확인합니다.</li><li>간식·스낵·보조제는 주식과 구분해 보고, 기존 식단과 함께 수의사에게 상담합니다.</li></ol><h2>과장된 해석을 피하는 법</h2><p>FDA는 ‘complete and balanced’ 표시가 있는 제품이 단독 식단용으로 의도된다는 점과, 간식·스낵·보조제는 보통 단독 식단용이 아니라는 점을 설명합니다. 이 표시는 특정 질환을 치료한다는 의미가 아닙니다.</p><h2>확인한 자료</h2><p><a href="https://www.fda.gov/animal-veterinary/animal-health-literacy/complete-and-balanced-pet-food">FDA: Complete and Balanced Pet Food</a> · <a href="https://www.fda.gov/animal-veterinary/animal-foods-feeds/animal-food-labeling-and-pet-food-claims">FDA: Animal Food Labeling and Pet Food Claims</a></p><p>최종 검토: 2026년 9월 22일 · 사람 검토 필요: 개별 식이와 질환별 급여 계획</p>`],
  "food-storage-record": ["사료·간식 보관 기록하기: 문제가 생겼을 때 남겨야 할 정보 | PetNyam", "사료나 간식에 문제가 의심될 때 제품을 식별할 수 있도록 보관·기록하는 방법입니다.", "사료·간식 포장지는 버리기 전에 이 정보를 남기세요", `<p>반려동물이 평소와 다른 반응을 보이거나 제품 문제가 의심될 때, 제품 이름만으로는 같은 제조 단위를 구분하기 어려울 수 있습니다. 포장지에 있는 정보는 수의사 상담이나 판매처 문의 때 도움이 됩니다.</p><h2>남겨둘 정보</h2><ul><li>제품명, 제조사, 제품 종류</li><li>유통기한 또는 best by 날짜</li><li>로트 번호와 바코드</li><li>구매처, 개봉일, 보관 장소</li><li>먹인 양과 반려동물에게 나타난 변화</li></ul><h2>보관의 기본</h2><p>FDA는 원래 포장이나 용기에 제품 정보를 보관하면 결함·리콜 문제가 생겼을 때 제품명, 제조사, 로트 번호, 날짜를 확인하기 쉽다고 안내합니다. 이 글은 제품 결함의 원인을 판단하지 않으며, 이상 증상이 있으면 수의사에게 먼저 연락해야 합니다.</p><h2>확인한 자료</h2><p><a href="https://www.fda.gov/animal-veterinary/animal-health-literacy/proper-storage-pet-food-treats">FDA: Proper Storage of Pet Food & Treats</a></p><p>최종 검토: 2026년 9월 22일 · 사람 검토 필요: 국내 유통기한·리콜 신고 경로</p>`],
  "changing-foods-safely": ["새 사료나 간식으로 바꿀 때: 기록 중심의 확인 방법 | PetNyam", "새 제품을 추가하거나 바꿀 때 제품 정보와 반려동물 반응을 기록해 수의사 상담에 활용하는 방법입니다.", "새 사료나 간식으로 바꿀 때는 ‘무엇이 달라졌는지’를 기록하세요", `<p>반려동물의 식단을 바꾸는 이유는 제품 교체, 기호 변화, 건강 상태 등 다양합니다. PetNyam은 개별 급여 일정을 제시하지 않지만, 보호자가 변화 전후의 정보를 정리하면 수의사 상담이 더 명확해질 수 있습니다.</p><h2>바꾸기 전과 후에 기록할 것</h2><ol><li>기존 제품과 새 제품의 이름, 원재료, 용도(주식·간식·보조제)</li><li>바꾼 날짜와 동시에 달라진 요소(간식, 약, 생활환경)</li><li>식욕, 배변, 활력처럼 평소와 달라진 점</li><li>기존 질환, 처방식, 복용 중인 약</li></ol><h2>수의사에게 먼저 물어야 하는 경우</h2><p>처방식 사용 중이거나 질환 관리 목적의 식이를 하고 있다면, 일반적인 음식 검색 결과나 온라인 글만으로 교체하지 말고 담당 수의사에게 확인하세요. 제품 라벨의 질환 관련 표현도 치료 지시로 해석하지 않습니다.</p><h2>확인한 자료</h2><p><a href="https://www.fda.gov/animal-veterinary/animal-foods-feeds/animal-food-labeling-and-pet-food-claims">FDA: Animal Food Labeling and Pet Food Claims</a> · <a href="https://www.fda.gov/animal-veterinary/animal-health-literacy/complete-and-balanced-pet-food">FDA: Complete and Balanced Pet Food</a></p><p>최종 검토: 2026년 9월 22일 · 사람 검토 필요: 처방식·질환별 변경 계획</p>`],
};
for (const [slug, [title, description, heading, body]] of Object.entries(guides)) {
  const pageUrl = `${origin}/guides/${slug}`;
  const guidePage = contentTemplate
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${pageUrl}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${pageUrl}">`)
    .replace('<main id="app"></main>', `<main id="app"><article class="policy guide"><a href="/">← PetNyam</a><div class="label">PETNYAM GUIDE</div><h1>${heading}</h1>${body}</article></main>`);
  const file = join(docs, "guides", slug, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, guidePage);
  urls.push(pageUrl);
}
const guideIndexUrl = `${origin}/guides`;
const guideIndex = contentTemplate
  .replace(/<title>.*?<\/title>/, "<title>반려동물 음식 이용 가이드 | PetNyam</title>")
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="반려동물 음식 안전 정보를 읽고 위험 상황에 대비하는 PetNyam 이용 가이드입니다.">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="반려동물 음식 이용 가이드 | PetNyam">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="반려동물 음식 안전 정보를 읽고 위험 상황에 대비하는 PetNyam 이용 가이드입니다.">')
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${guideIndexUrl}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${guideIndexUrl}">`)
  .replace('<main id="app"></main>', `<main id="app"><article class="policy guide"><h1>반려동물 음식 이용 가이드</h1><p>음식 판정을 이해하고, 새 음식과 위험 상황을 더 신중하게 확인하는 데 필요한 안내입니다.</p><ul><li><a href="/guides/food-emergency">위험 음식을 먹었을 때, 먼저 할 일</a></li><li><a href="/guides/read-a-verdict">PetNyam 음식 판정 읽는 법</a></li><li><a href="/guides/new-food-checklist">새 음식을 주기 전 확인 목록</a></li><li><a href="/guides/processed-food-label">가공식품 성분표 확인법</a></li><li><a href="/guides/xylitol-product-check">무설탕 제품과 자일리톨 확인</a></li><li><a href="/guides/main-meal-or-treat">주식과 간식 구분하기</a></li><li><a href="/guides/food-storage-record">사료·간식 보관 기록하기</a></li><li><a href="/guides/changing-foods-safely">새 사료나 간식으로 바꿀 때</a></li></ul></article></main>`);
await mkdir(join(docs, "guides"), { recursive: true });
await writeFile(join(docs, "guides", "index.html"), guideIndex);
urls.push(guideIndexUrl);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc><changefreq>monthly</changefreq></url>`).join("")}</urlset>\n`;
await writeFile(join(docs, "sitemap.xml"), sitemap);
console.log(`Generated ${urls.length - 1} static public URLs and sitemap entries.`);
