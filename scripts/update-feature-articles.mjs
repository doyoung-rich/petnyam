import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {featureArticles} from '../docs/feature-articles.js';
import {pageGraph} from '../docs/search-metadata.js';
const docs=fileURLToPath(new URL('../docs/',import.meta.url));
const template=await readFile(docs+'guides/new-food-checklist/index.html','utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const [route,a] of Object.entries(featureArticles)){
 const url='https://petnyam.com'+route,title=a.title+' | PetNyam';
 let html=template.replace(/<html lang="[^"]+"/,`<html lang="${a.lang}"`).replace(/<title>.*?<\/title>/,`<title>${esc(title)}</title>`).replace(/(<meta (?:name="description"|property="og:description") content=")[^"]+/,`$1${esc(a.description)}`).replace(/(<meta property="og:description" content=")[^"]+/,`$1${esc(a.description)}`).replace(/(<meta property="og:title" content=")[^"]+/,`$1${esc(title)}`).replaceAll('https://petnyam.com/guides/new-food-checklist/',url).replace('property="og:type" content="website"','property="og:type" content="article"');
 html=html.replace(/<main[\s\S]*?<\/main>/,`<main id="app"><article class="policy guide"><a href="/guides/">← ${a.lang==='en'?'All guides':'이용 가이드'}</a><div class="label">PETNYAM • SOURCE-BASED GUIDE</div><h1>${esc(a.title)}</h1>${a.body}<hr><p>${a.lang==='en'?'Published and sources checked: October 5, 2026. PetNyam editorial summary, prepared with AI assistance. Not independently reviewed by a veterinarian; not diagnosis or an individualized feeding plan.':'발행·자료 확인: 2026년 10월 5일. PetNyam이 공개 자료를 AI 보조로 정리했습니다. 수의사의 개별 검수를 받은 글이 아니며 진단·개별 급여 처방을 대신하지 않습니다.'}</p></article></main>`);
 if(a.published==='2026-10-06')html=html.replace('발행·자료 확인: 2026년 10월 5일.', '발행: 2026년 10월 6일. 계산 예시는 직접 검산했으며, 외부 자료가 있는 글은 같은 날짜에 확인했습니다.');
 if(a.footer)html=html.replace(/(<hr><p>)[\s\S]*?(<\/p><\/article><\/main>)/,`$1${esc(a.footer)}$2`);
 if(a.alternates){
  const links=Object.entries(a.alternates).map(([lang,path])=>`<link rel="alternate" hreflang="${lang}" href="https://petnyam.com${path}">`).join('');
  html=html.replace('</head>',links+'</head>');
  const other=a.lang==='ko'?'en':'ko';
  html=html.replace('<a href="/en/">EN</a></header>',`<a href="${a.alternates[other]}" lang="${other}" hreflang="${other}">${other==='en'?'English':'한글'}</a></header>`);
 }
 html=html.replace(/(<script type="application\/ld\+json" id="petnyam-search-metadata">)[\s\S]*?<\/script>/,`$1${JSON.stringify(pageGraph(url,title,a.description,a.lang))}</script>`);
 if(a.lang==='en')html=html.replace('>음식 검색<','>Food search<').replace('>인기 음식<','>Popular foods<').replace('>검증 원칙<','>Our method<').replaceAll('>이용 가이드<','>Guides<').replace('href="/#search"','href="/en/#search"').replace('href="/#popular"','href="/en/#popular"').replace('href="/#trust"','href="/en/#trust"');
 if(a.lang==='en'&&a.alternates)html=html.replace('aria-label="주요 메뉴"','aria-label="Main navigation"').replace('aria-label="PetNyam 펫냠 홈"','aria-label="PetNyam home"').replace('<a class="brand" href="/"','<a class="brand" href="/en/"').replace('반려동물 음식 안전 정보를 더 빠르고 분명하게.','Clearer food-safety information for pet caregivers.').replace('>이용약관<','>Terms<').replace('>개인정보처리방침<','>Privacy<').replace('>의학적 면책<','>Medical disclaimer<').replace('>문의<','>Contact<').replace('본 서비스는 수의사의 진료를 대신하지 않습니다.','This service does not replace veterinary care.');
 await mkdir(docs+route.slice(1),{recursive:true});await writeFile(docs+route.slice(1)+'index.html',html);
}
let index=await readFile(docs+'guides/index.html','utf8');
index=index.replace(/<section\b[^>]*data-feature-articles="1"[^>]*>[\s\S]*?<\/section>/g,'').replace('</main>',`<section data-feature-articles="1" class="policy guide"><h2>새로운 출처 기반 읽을거리 / New articles</h2><ul>${Object.entries(featureArticles).map(([r,a])=>`<li><a href="${r}" lang="${a.lang}">${a.title}</a></li>`).join('')}</ul></section></main>`);
await writeFile(docs+'guides/index.html',index);
let sitemap=await readFile(docs+'sitemap.xml','utf8');
for(const [r,a] of Object.entries(featureArticles))if(!sitemap.includes('<loc>https://petnyam.com'+r+'</loc>'))sitemap=sitemap.replace('</urlset>',`<url><loc>https://petnyam.com${r}</loc><lastmod>${a.published || '2026-10-05'}</lastmod></url></urlset>`);
await writeFile(docs+'sitemap.xml',sitemap);
console.log(`Prepared ${Object.keys(featureArticles).length} feature articles and guide links.`);
