import {readFile,writeFile,readdir} from 'node:fs/promises';
import {consolidatedFoods,consolidatedFoodHref,resolveConsolidatedHref} from '../docs/content-consolidation.js';
const docs=new URL('../docs/',import.meta.url),origin='https://petnyam.com';
// GitHub Pages has no per-route HTTP redirect rules. Instant meta refresh is
// universal, works without JavaScript, and includes a visible fallback link.
for(const [pet,foods]of Object.entries(consolidatedFoods))for(const food of foods)for(const lang of ['ko','en']){
 const old=`/${lang}/${pet}/${food}/`,target=consolidatedFoodHref(`${pet}/${food}`,lang==='en'),route=target.split('#')[0];
 let html=await readFile(new URL('.'+route+'index.html',docs),'utf8');
 html=html.replace('</head>',`<meta name="petnyam-consolidated-from" content="${old}"><meta http-equiv="refresh" content="0; url=${origin}${target}"></head>`)
  .replace(/<main id="app">[\s\S]*?<\/main>/,`<main id="app"><article class="policy guide"><h1>${lang==='en'?'This food question is now part of the species guide':'이 음식 질문은 동물별 안내로 통합했습니다'}</h1><p>${lang==='en'?'Repeated individual evidence-gap pages have been combined into one practical source-checking and consultation guide.':'반복되던 개별 근거 부족 페이지를 자료 확인·상담 준비 안내로 모았습니다.'}</p><p><a data-consolidated-target href="${target}">${lang==='en'?'Open the consolidated guide':'통합 안내에서 확인하기'} →</a></p></article></main>`)
  .replace(/<script\b[^>]*\bsrc="[^"]*"[^>]*>[\s\S]*?<\/script>/g,'');
 await writeFile(new URL('.'+old+'index.html',docs),html);
}
for(const file of (await readdir(docs,{recursive:true})).filter(f=>f.endsWith('.html'))){
 const url=new URL(file.replaceAll('\\','/'),docs),html=await readFile(url,'utf8');
 const next=html.replace(/(<a\b[^>]*\bhref=")([^"]+)(")/g,(_,a,href,b)=>a+resolveConsolidatedHref(href)+b);
 if(next!==html)await writeFile(url,next);
}
const sitemap=new URL('sitemap.xml',docs);let xml=await readFile(sitemap,'utf8');
xml=xml.replace(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g,(all,url)=>resolveConsolidatedHref(url)!==url?'':all);
await writeFile(sitemap,xml);
console.log('Consolidated 66 legacy routes into four bilingual guide pages; updated links and sitemap.');
