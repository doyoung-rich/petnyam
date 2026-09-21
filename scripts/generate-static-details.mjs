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
  .replace('<main id="app"></main>', `<main id="app"><article class="policy guide"><h1>반려동물 음식 이용 가이드</h1><p>음식 판정을 이해하고, 새 음식과 위험 상황을 더 신중하게 확인하는 데 필요한 안내입니다.</p><ul><li><a href="/guides/food-emergency">위험 음식을 먹었을 때, 먼저 할 일</a></li><li><a href="/guides/read-a-verdict">PetNyam 음식 판정 읽는 법</a></li><li><a href="/guides/new-food-checklist">새 음식을 주기 전 확인 목록</a></li></ul></article></main>`);
await mkdir(join(docs, "guides"), { recursive: true });
await writeFile(join(docs, "guides", "index.html"), guideIndex);
urls.push(guideIndexUrl);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc><changefreq>monthly</changefreq></url>`).join("")}</urlset>\n`;
await writeFile(join(docs, "sitemap.xml"), sitemap);
console.log(`Generated ${urls.length - 1} static public URLs and sitemap entries.`);
