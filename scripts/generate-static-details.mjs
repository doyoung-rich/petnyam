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
const template = await readFile(join(docs, "index.html"), "utf8");

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
  terms: ["이용약관 | PetNyam", "PetNyam 이용약관을 확인하세요.", "이용약관", "PetNyam은 반려동물 음식 안전 정보를 제공하는 정보 서비스입니다."],
  privacy: ["개인정보처리방침 | PetNyam", "PetNyam 개인정보처리방침을 확인하세요.", "개인정보처리방침", "V1은 회원가입 없이 이용하며 검색어를 개인 식별 정보와 결합해 저장하지 않습니다."],
  disclaimer: ["의학적 면책 안내 | PetNyam", "PetNyam의 반려동물 음식 안전 정보 면책 안내를 확인하세요.", "의학적 면책 안내", "일반적인 교육 목적이며 수의사의 진단·치료를 대신하지 않습니다. 이상 증상이 있으면 즉시 동물병원에 연락하세요."],
};
for (const [slug, [title, description, heading, body]] of Object.entries(policies)) {
  const pageUrl = `${origin}/policy/${slug}`;
  const policyPage = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${pageUrl}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${pageUrl}">`)
    .replace('<main id="app"></main>', `<main id="app"><article class="policy"><h1>${heading}</h1><p>${body}</p></article></main>`);
  const file = join(docs, "policy", slug, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, policyPage);
  urls.push(pageUrl);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc><changefreq>monthly</changefreq></url>`).join("")}</urlset>\n`;
await writeFile(join(docs, "sitemap.xml"), sitemap);
console.log(`Generated ${urls.length - 1} static public URLs and sitemap entries.`);
